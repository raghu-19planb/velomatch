// Reports which bikes in the five quiz catalogs and the Showcase have gone stale, so the catalog stays current instead of relying on someone noticing.
//
//   node scripts/catalog-freshness.mjs                  report
//   node scripts/catalog-freshness.mjs --strict         also exit 1 if anything needs attention (the weekly GitHub job uses this)
//   node scripts/catalog-freshness.mjs --max-age=60     days after which evidence counts as old (default 90)
//
// A bike needs attention when any of these is true:
//   - old evidence      the newest date on which anyone saw its seller page (a date in its _verified note, or a link check that came back ok) is too old
//   - never verified    no _verified note and no ok link check: nothing records that the specs were ever confirmed against a source
//   - link problem      its last link check was dead or a mismatch (the seller page no longer shows this model)
//   - price drift       the last link check read a price in the same currency that differs from the catalog's by 5% or more
//   - rename watch      its _verified note says the maker was changing the model's name or line ("worth rechecking", "may eventually replace")
// It reads only the files in this repo. Fixing an entry still means reading the seller page, as with the Diverge Comp in November 2026
// (the catalog held the previous generation's spec until the owner, who rides one, said it was wrong): see DATA.md and scripts/README.md.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const MAX_AGE = Number((args.find(a => a.startsWith('--max-age=')) || '').slice(10)) || 90;
const today = new Date(); today.setHours(12, 0, 0, 0);
const daysAgo = iso => Math.round((today - new Date(iso + 'T12:00:00')) / 86400000);
const isoDates = text => [...String(text || '').matchAll(/\b(20\d\d-\d\d-\d\d)\b/g)].map(m => m[1]).filter(d => !isNaN(new Date(d)) && new Date(d) <= today);

const problems = [];
let total = 0;
for (const f of ['kids', 'commute', 'bikepacking', 'mountain', 'racing']) {
  const bikes = JSON.parse(fs.readFileSync(path.join(root, 'data', f + '-bikes.json'), 'utf8')).bikes;
  for (const b of bikes) {
    total++;
    const why = [];
    const dates = isoDates(b._verified);
    const c = b.check || {};
    if (c.checkedOn && c.status === 'ok') dates.push(c.checkedOn);
    const newest = dates.sort().pop();
    if (!b._verified && !(c.status === 'ok')) why.push('never verified');
    else if (!newest) why.push('no dated evidence');
    else if (daysAgo(newest) > MAX_AGE) why.push(`old evidence (${daysAgo(newest)} days, ${newest})`);
    if (c.status === 'dead' || c.status === 'mismatch') why.push('link problem: ' + c.status);
    if (c.price != null && c.currency && b.price && (b.currency || 'USD') === c.currency && Math.abs(c.price - b.price) / b.price >= 0.05) why.push(`price drift: catalog ${b.price}, seller page ${c.price} ${c.currency}`);
    const rn = /worth rechecking|may eventually replace|has since launched|since been renamed|watch for a|launched a redesigned/i.exec(b._verified || '');
    if (rn) why.push('rename watch: “…' + b._verified.slice(Math.max(0, rn.index - 60), rn.index + rn[0].length + 40).replace(/\s+/g, ' ').trim() + '…”');
    if (why.length) problems.push({ file: f, name: b.name, why });
  }
}
let showcase = 0;
try {
  const s = JSON.parse(fs.readFileSync(path.join(root, 'data', 'showcase.json'), 'utf8'));
  const updated = s._meta && s._meta.updated;
  showcase = s.bikes.length;
  if (updated && daysAgo(updated) > MAX_AGE) problems.push({ file: 'showcase', name: `the whole Showcase list (${showcase} bikes)`, why: [`last refreshed ${updated}, ${daysAgo(updated)} days ago (the plan is every quarter: scripts/README.md)`] });
} catch (e) { /* no showcase file: nothing to check */ }

console.log(`Catalog freshness: ${total} quiz-catalog bikes and ${showcase} Showcase bikes, evidence older than ${MAX_AGE} days counts as old.`);
if (!problems.length) console.log('Nothing needs attention.');
else {
  console.log(`${problems.length} need attention:`);
  const by = {}; problems.forEach(p => (by[p.file] = by[p.file] || []).push(p));
  for (const [f, list] of Object.entries(by)) { console.log(`\n${f} (${list.length})`); list.forEach(p => console.log(`  ${p.name}: ${p.why.join('; ')}`)); }
  console.log('\nTo fix one: open its seller page, compare name, price and specs, update the entry and its _verified note (what was confirmed, where, when), then run node scripts/verify-catalogs.mjs --write.');
}
if (STRICT && problems.length) process.exit(1);
