// Gives Showcase bikes a recorded height range ("fit") when, and only when, the same model is already in one of the five quiz catalogs,
// so the Showcase page's "fits my height" filter rests on recorded data instead of a guess.
//
//   node scripts/add-showcase-fit.mjs            report only: what would be matched, and what was left alone
//   node scripts/add-showcase-fit.mjs --write    write `fit: { minH, maxH, from }` onto the matched bikes in data/showcase.json
//
// Matching is deliberately strict. A Showcase bike is matched when its brand and model name equal a catalog bike's after ignoring case,
// accents and punctuation, with ONE allowance: a trailing " – <drivetrain>" on the Showcase name ("Tarmac SL9 Comp – SRAM Rival AXS")
// is ignored, because the same frame and trim come in several builds and the frame sizes are what set the fit. Anything looser
// (a similar name, the same family, a different trim number) is listed under "not matched" and left without a fit range.
// The ranges themselves are the catalogs' own: the maker's recommended range where the catalog's note says it was published, otherwise the
// catalog's class-typical estimate. Run again whenever Showcase bikes or catalog ranges change; bikes whose catalog range changed are updated.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const WRITE = process.argv.includes('--write');
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9.]+/g, ' ').replace(/\s+/g, ' ').trim();
const key = (brand, name) => { const b = norm(brand); let n = norm(name); if (n.startsWith(b + ' ')) n = n.slice(b.length + 1); return b + '|' + n; };

const catalog = new Map();
for (const f of ['kids', 'commute', 'bikepacking', 'mountain', 'racing']) {
  const d = JSON.parse(fs.readFileSync(path.join(root, 'data', f + '-bikes.json'), 'utf8'));
  for (const b of d.bikes) if (b.minH != null && b.maxH != null && b.brand) { const k = key(b.brand, b.name); if (!catalog.has(k)) catalog.set(k, { ...b, file: f }); }
}

const file = path.join(root, 'data', 'showcase.json');
const raw = fs.readFileSync(file, 'utf8');
const data = JSON.parse(raw);
let matched = 0, exact = 0, stripped = 0, changed = 0; const left = [];
for (const b of data.bikes) {
  let hit = catalog.get(key(b.brand, b.name)), how = 'exact';
  if (!hit) { const base = b.name.split(/\s+[–-]\s+/)[0]; if (base !== b.name) { hit = catalog.get(key(b.brand, base)); how = 'same trim, other drivetrain'; } }
  if (hit) {
    matched++; how === 'exact' ? exact++ : stripped++;
    const fit = { minH: hit.minH, maxH: hit.maxH, from: hit.file + ' catalog: ' + hit.name + (how === 'exact' ? '' : ' (' + how + ')') };
    if (JSON.stringify(b.fit) !== JSON.stringify(fit)) { changed++; if (WRITE) b.fit = fit; }
  } else {
    if (b.fit && WRITE) delete b.fit;
    left.push(b.brand + ' ' + b.name);
  }
}
console.log(`Showcase bikes: ${data.bikes.length}. With a recorded fit range: ${matched} (${exact} exact, ${stripped} same trim with another drivetrain). Without: ${left.length}.`);
console.log(`${changed} bikes ${WRITE ? 'updated' : 'would be updated'}.`);
if (process.argv.includes('--list')) console.log('Not matched:\n  ' + left.join('\n  '));
if (WRITE && changed) {
  const crlf = raw.includes('\r\n');
  let out = JSON.stringify(data, null, 2) + '\n';
  if (crlf) out = out.replace(/\n/g, '\r\n');
  fs.writeFileSync(file, out);
}
