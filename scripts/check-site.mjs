// Static safety checks for the whole site, run by the git pre-commit hook and by GitHub on every push:
//   1. every local script/stylesheet address carries the right ?v= code (so no page can pair with a stale cached file)
//   2. every referenced local file exists
//   3. every .js file and every inline <script> in the pages is valid JavaScript
//   4. every page has the language switch scripts in the right order (i18n.js before its dictionaries)
// Exit code 1 and a list of problems if anything fails. Needs only Node, no packages.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const problems = [];
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const hashOf = file => crypto.createHash('sha1').update(fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n')).digest('hex').slice(0, 8);

for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const refs = [...html.matchAll(/<script\b[^>]*?\bsrc="([^"]+)"|<link\b[^>]*?\bhref="([^"]+\.css[^"]*)"/g)].map(m => m[1] || m[2]);
  const order = [];
  for (const ref of refs) {
    if (/^(https?:)?\/\//.test(ref)) continue;
    const [file, query] = ref.split('?');
    if (!fs.existsSync(path.join(root, file))) { problems.push(`${page}: ${file} does not exist`); continue; }
    if (query !== 'v=' + hashOf(file)) problems.push(`${page}: ${file} has a stale or missing version code (run: node scripts/bump-assets.mjs)`);
    order.push(file);
  }
  // the language engine must load before any of its dictionaries
  const iEngine = order.indexOf('i18n.js');
  if (iEngine < 0) problems.push(`${page}: i18n.js is not loaded`);
  order.forEach((f, i) => { if (/^i18n-fr-/.test(f) && iEngine > i) problems.push(`${page}: ${f} loads before i18n.js`); });
  // inline scripts must parse
  [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach((m, i) => {
    try { new Function(m[1]); } catch (e) { problems.push(`${page}: inline script #${i + 1} does not parse: ${e.message}`); }
  });
}
for (const f of fs.readdirSync(root).filter(f => f.endsWith('.js'))) {
  try { execFileSync(process.execPath, ['--check', path.join(root, f)], { stdio: 'pipe' }); }
  catch (e) { problems.push(`${f}: does not parse: ${String(e.stderr || e.message).split('\n').find(l => l.trim()) || ''}`); }
}

// criteria.js knows every brand in the catalogs
try {
  const { createRequire } = await import('node:module');
  const C = createRequire(import.meta.url)(path.join(root, 'criteria.js'));
  for (const f of ['kids', 'commute', 'racing', 'mountain', 'bikepacking']) {
    const d = JSON.parse(fs.readFileSync(path.join(root, 'data', f + '-bikes.json'), 'utf8'));
    d.bikes.forEach(b => { if (!C.BRANDS.includes(b.brand)) problems.push('criteria.js does not know the brand "' + b.brand + '" (data/' + f + '-bikes.json): add it to BRANDS'); });
  }
} catch (e) { problems.push('criteria.js check failed: ' + e.message); }

if (problems.length) { console.error('Site check FAILED:\n  ' + problems.join('\n  ')); process.exit(1); }
console.log(`Site check passed: ${pages.length} pages, asset addresses current, all scripts parse.`);
