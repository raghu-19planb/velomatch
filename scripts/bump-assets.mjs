// Stamps every local script and stylesheet address in the pages with a short code taken from that file's contents:
//   <script src="match-ui.js?v=3fa91c07">
// The code changes only when the file changes, so a browser that cached an old copy fetches the new one the next time it
// loads the page, and a page can never be paired with a stale script (that pairing is what once froze the racing quiz and
// showed a giant black flag). Run it before committing whenever a .js or .css file changes:
//
//   node scripts/bump-assets.mjs           rewrite the pages
//   node scripts/bump-assets.mjs --check   only report (exit 1 if any address is out of date)
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const CHECK = process.argv.includes('--check');
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const hashOf = file => crypto.createHash('sha1').update(fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n')).digest('hex').slice(0, 8);

let stale = 0, changed = 0;
for (const page of pages) {
  const raw = fs.readFileSync(path.join(root, page), 'utf8');
  const crlf = raw.includes('\r\n');
  let html = raw.replace(/\r\n/g, '\n');
  html = html.replace(/(<script\b[^>]*?\bsrc=")([^"?#:]+\.js)(\?v=[A-Za-z0-9]+)?(")|(<link\b[^>]*?\bhref=")([^"?#:]+\.css)(\?v=[A-Za-z0-9]+)?(")/g,
    (m, a1, f1, q1, z1, a2, f2, q2, z2) => {
      const file = f1 || f2;
      if (!fs.existsSync(path.join(root, file))) return m;           // not a local file: leave it alone
      const want = '?v=' + hashOf(file);
      if ((q1 || q2) !== want) stale++;
      return f1 ? a1 + f1 + want + z1 : a2 + f2 + want + z2;
    });
  if (html !== raw.replace(/\r\n/g, '\n')) {
    changed++;
    if (!CHECK) fs.writeFileSync(path.join(root, page), crlf ? html.replace(/\n/g, '\r\n') : html);
  }
}
console.log(CHECK ? `${stale} out-of-date asset address(es) in ${changed} page(s)` : `updated ${changed} page(s)`);
if (CHECK && stale) process.exit(1);
