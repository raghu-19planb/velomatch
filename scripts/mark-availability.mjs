// Records, with its source, which catalog bikes are known NOT to be sold in Canada, so the quizzes can
// leave them out of a Canadian shopper's results instead of recommending something they cannot buy.
//
//   node scripts/mark-availability.mjs
//
// Only two kinds of evidence are accepted, and each is written onto the bike as `canada.source`:
//   1. The seller's own policy page: REI states it cannot ship bikes outside the U.S.
//   2. The project's earlier Canadian-availability review (scripts/README.md): brands that sell in the U.S.
//      only (Priority, Guardian, Aventon, Ride1Up, Tumbleweed, Quintana Roo).
// Everything else stays "not confirmed": a missing mark means we do not know, not that it is for sale.
import fs from 'node:fs';

const today = new Date().toISOString().slice(0, 10);
const REI = 'https://www.rei.com/help?a=Restricted-Brands-and-CountriesTerritories---id--TuLsvueORT-kPXXb9esVgA';
const rules = [
  { test: b => /^(co-op cycles|rei co-op)/i.test(b.brand) || /rei\.com/i.test(b.retailerUrl || ''), why: 'REI says it cannot ship bikes outside the U.S.', source: REI },
  { test: b => /^(priority|guardian|aventon|ride1up|tumbleweed|quintana roo)/i.test(b.brand) || /(prioritybicycles|guardianbikes|aventon|ride1up|tumbleweed\.cc|quintanarootri)\./i.test(b.retailerUrl || ''),
    why: 'Brand sells in the U.S. only (our earlier Canadian-availability review)', source: 'scripts/README.md' },
];
let total = 0;
for (const f of ['kids', 'commute', 'racing', 'mountain', 'bikepacking']) {
  const p = `data/${f}-bikes.json`;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  for (const b of d.bikes) {
    const r = rules.find(x => x.test(b));
    if (r) { b.canada = { sold: false, note: r.why, source: r.source, checkedOn: today }; total++; console.log('not sold in Canada:', f.padEnd(11), b.brand, '|', b.name); }
  }
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
}
console.log(total, 'bikes marked');
