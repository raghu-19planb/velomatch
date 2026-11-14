// One-off record of the seller pages found (by search of each brand's own site, or from a Canadian
// shop's public product feed) for catalog bikes that had no link. Each is then checked by
// scripts/verify-catalogs.mjs --write, which records whether the page really shows that bike.
// Only pages that were actually returned by a search or a shop feed are listed here: nothing is built
// by pattern or guessed. Run order: this script, then `node scripts/verify-catalogs.mjs --write`.
import fs from 'node:fs';

const found = [
  // [catalog, exact bike name, url, optional note]
  ['kids', 'Specialized Riprock Coaster 16', 'https://cyclingelements.ca/products/riprock-coaster-16-gloss-purple-haze-lagoon-blue'],
  ['commute', 'Specialized Sirrus X 2.0', 'https://cyclingelements.ca/products/sirrus-x-2-0-sm-satin-cast-lilac-ashen-grey-reflective'],
  ['bikepacking', 'Salsa Fargo', 'https://www.salsacycles.com/collections/fargo'],
  ['bikepacking', 'Surly Karate Monkey', 'https://surlybikes.com/collections/karate-monkey'],
  ['bikepacking', 'Cervélo Aspero-5', 'https://www.cervelo.com/collections/aspero-5'],
  ['bikepacking', 'Devinci Hatchet', 'https://www.devinci.com/en/bikes/gravel-and-road/'],
  ['bikepacking', 'Norco Search', 'https://www.norco.com/bikes/road/gravel/search/'],
  // Giant Canada: pages named in Giant's own public sitemap (static.giant-bicycles.com/sitemaps/sitemap-giant-en-ca.xml), current 2027 range
  ['racing', 'Giant TCR Advanced Pro', 'https://www.giant-bicycles.com/ca/bikes-tcr-advanced-pro-2027'],
  ['racing', 'Giant Propel Advanced', 'https://www.giant-bicycles.com/ca/bikes-propel-advanced-2027'],
  ['racing', 'Giant Contend AR 1', 'https://www.giant-bicycles.com/ca/bikes-contend-ar-2027'],
  ['racing', 'Giant Defy Advanced 2', 'https://www.giant-bicycles.com/ca/bikes-defy-advanced-2027'],
  // Racing, found by searching each brand's own site (Canadian locale pages only; family pages where the brand has no per-trim Canadian page)
  ['racing', 'Specialized Tarmac SL7 Sport', 'https://www.specialized.com/ca/en/tarmac-sl7-sport-shimano-105/p/4221579'],
  ['racing', 'Specialized Tarmac SL8 Comp', 'https://www.specialized.com/ca/en/shop/bikes/road-bikes/performance-road-bikes/tarmac'],
  ['racing', 'Specialized Roubaix Comp', 'https://www.specialized.com/ca/en/shop/bikes/road-bikes/performance-road-bikes/roubaix'],
  ['racing', 'Trek Emonda SLR 6', 'https://www.trekbikes.com/ca/en_CA/bikes/road-bikes/performance-road-bikes/%C3%A9monda/%C3%A9monda-slr/%C3%A9monda-slr-6/p/37314/'],
  ['racing', 'Trek Emonda ALR 5', 'https://www.trekbikes.com/ca/en_CA/bikes/road-bikes/performance-road-bikes/%C3%A9monda/%C3%A9monda-alr/%C3%A9monda-alr-5/p/41426/'],
  ['racing', 'Trek Domane SL 6', 'https://www.trekbikes.com/ca/en_CA/bikes/road-bikes/performance-road-bikes/domane/domane-sl/domane-sl-6-gen-4/p/36746/'],
  ['racing', 'Cannondale CAAD13', 'https://www.cannondale.com/en-ca/bikes/road/race/caad13'],
  ['racing', 'Cannondale Synapse Carbon 2', 'https://www.cannondale.com/en-ca/bikes/road/endurance/synapse-carbon/synapse-carbon-2'],
  ['racing', 'Cervélo Caledonia', 'https://www.cervelo.com/collections/caledonia'],
  ['racing', 'Canyon Aeroad CFR', 'https://www.canyon.com/en-ca/road-bikes/aero-bikes/aeroad/'],
  // Bikepacking + commute, from the same kind of brand-site / Canadian-retailer search (family pages where no per-trim page exists)
  ['bikepacking', 'Specialized Diverge Comp', 'https://www.specialized.com/ca/en/shop/bikes/gravel-bikes/diverge'],
  ['bikepacking', 'Specialized Diverge Expert Carbon', 'https://www.specialized.com/ca/en/shop/bikes/gravel-bikes/diverge'],
  ['bikepacking', 'Trek Checkpoint SL 5', 'https://www.trekbikes.com/ca/en_CA/bikes/adventure-touring-bikes/checkpoint/checkpoint-sl/checkpoint-sl-5-gen-2/p/35169/'],
  ['bikepacking', 'Otso Waheela C', 'https://otsocycles.com/collections/waheela-c'],
  ['commute', 'Trek FX 2 Disc', 'https://www.trekbikes.com/ca/en_CA/bikes/hybrid-bikes/fitness-bikes/fx/fx-2-disc-gen-3/p/35003/'],
  ['commute', 'Trek Verve 2', 'https://www.trekbikes.com/ca/en_CA/verve/'],
  ['commute', 'Cannondale Quick CX 3', 'https://www.cannondale.com/en-ca/bikes/active/fitness/quick-cx/quick-cx-3'],
  ['commute', 'Cannondale Topstone Carbon 4', 'https://www.cannondale.com/en-ca/bikes/road/gravel/topstone-carbon'],
  ['commute', 'Tern Link D8', 'https://store.ternbicycles.com/products/link-d8'],
  ['commute', 'Supercycle Savoy Hybrid', 'https://www.canadiantire.ca/en/pdp/supercycle-savoy-hybrid-bike-700c-mint-0712090p.html'],
];
// The brand's own page says so: Surly files the Long Haul Trucker under "Archive" (discontinued).
const discontinued = [
  ['bikepacking', 'Surly Long Haul Trucker', 'https://surlybikes.com/products/long-haul-trucker', 'Surly lists this model under “Archive”: it is no longer sold new.'],
];

for (const [f, name, url] of found) {
  const p = `data/${f}-bikes.json`;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const b = d.bikes.find(x => x.name === name);
  if (!b) { console.log('NOT FOUND', f, name); continue; }
  if (!b.retailerUrl) b.retailerUrl = url;
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
  console.log('linked', f, name);
}
for (const [f, name, url, note] of discontinued) {
  const p = `data/${f}-bikes.json`;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const b = d.bikes.find(x => x.name === name);
  if (!b) { console.log('NOT FOUND', f, name); continue; }
  b.discontinued = { source: url, note, checkedOn: new Date().toISOString().slice(0, 10) };
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
  console.log('marked discontinued', f, name);
}
