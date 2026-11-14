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
  ['bikepacking', 'Specialized Diverge Expert Carbon', 'https://www.specialized.com/ca/en/shop/bikes/gravel-bikes/diverge'],
  ['bikepacking', 'Trek Checkpoint SL 5', 'https://www.trekbikes.com/ca/en_CA/bikes/adventure-touring-bikes/checkpoint/checkpoint-sl/checkpoint-sl-5-gen-2/p/35169/'],
  ['bikepacking', 'Otso Waheela C', 'https://otsocycles.com/collections/waheela-c'],
  ['commute', 'Trek FX 2 Disc', 'https://www.trekbikes.com/ca/en_CA/bikes/hybrid-bikes/fitness-bikes/fx/fx-2-disc-gen-3/p/35003/'],
  ['commute', 'Trek Verve 2', 'https://www.trekbikes.com/ca/en_CA/verve/'],
  ['commute', 'Cannondale Quick CX 3', 'https://www.cannondale.com/en-ca/bikes/active/fitness/quick-cx/quick-cx-3'],
  ['commute', 'Cannondale Topstone Carbon 4', 'https://www.cannondale.com/en-ca/bikes/road/gravel/topstone-carbon'],
  ['commute', 'Tern Link D8', 'https://store.ternbicycles.com/products/link-d8'],
  ['commute', 'Supercycle Savoy Hybrid', 'https://www.canadiantire.ca/en/pdp/supercycle-savoy-hybrid-bike-700c-mint-0712090p.html'],
  // 2026-11-14, kids: exact-model pages on Canadian retailers and the brands' own Canadian pages
  ['kids', "Supercycle Valley 16-in", "https://www.canadiantire.ca/en/pdp/supercycle-valley-kids-bike-16-in-wheel-blue-0711161p.html"],
  ['kids', "Trek Precaliber 16", "https://www.trekbikes.com/ca/en_CA/bikes/kids-bikes/kids-hybrid-bikes/precaliber/f/F427-1/"],
  ['kids', "Trek Precaliber 20", "https://www.trekbikes.com/ca/en_CA/bikes/kids-bikes/kids-hybrid-bikes/precaliber/c/B427/"],
  ['kids', "Huffy Sea Star 12-inch", "https://www.walmart.ca/en/ip/Huffy-12-Sea-Star-Kids-Bike-Fits-Riders-37-42-Pink-Youth-Girls/6000208038393"],
  ['kids', "Huffy Sea Star 14-inch", "https://www.walmart.ca/en/ip/Huffy-Sea-Star-14-inch-Girls-Bike-with-Training-Wheels-Blue-Pink/6000208040286"],
  ['kids', "Huffy Sea Star 16-inch", "https://www.walmart.ca/en/ip/Huffy-16-Sea-Star-Kids-Bike-Fits-Riders-42-48-Purple-Youth-Girls/6000208038932"],
  ['kids', "Huffy Sea Star 18-inch", "https://www.walmart.ca/en/ip/Huffy-Sea-Star-18-inch-Girls-Bike-with-Training-Wheels-Purple/6000208022505"],
  ['kids', "Huffy Rock It 12-inch", "https://www.walmart.ca/en/ip/Huffy-12-Rock-It-Kids-Bike-Fits-Riders-37-42-Gray-Green-Youth-Boys/6000208023007"],
  ['kids', "Huffy Rock It 14-inch", "https://www.walmart.ca/en/ip/Huffy-Rock-It-14-inch-Boys-Bike-with-Training-Wheels-Red/6000208022101"],
  ['kids', "Huffy 16\" Rock It", "https://www.walmart.ca/en/ip/Huffy-Rock-It-16-inch-Boys-Bike-with-Training-Wheels-Black/6000208021539"],
  ['kids', "Huffy Rock It 20\"", "https://www.walmart.ca/en/ip/Huffy-20-Rock-It-Kids-Bike-Fits-Riders-44-56-Blue-Youth-Boys/0XPWB2Z3YS1M"],
  ['kids', "Huffy Rock Creek 20\" Mountain Bike", "https://www.walmart.ca/en/ip/Huffy-Rock-Creek-20-inch-Boys-6-speed-Mountain-Bike-Grey/6000208152991"],
  ['kids', "Hyper Bicycles 16\" Motobike", "https://www.walmart.ca/en/ip/16-Motobike-Neon-Gr/6000205268545"],
  ['kids', "Hyper Bicycles 20\" Jet Fuel BMX", "https://www.walmart.ca/en/ip/Hyper-Bicycles-20-Jet-Fuel-BMX-Bike-Kids-Ages-8-13-Years/6000208205725"],
  ['kids', "Hyper Bicycles 24\" Swift Mountain Bike", "https://www.walmart.ca/en/ip/Hyper-Bicycles-24-Girl-s-Swift-Mountain-Bike-for-Kids-Blue/6000208212344"],
  ['kids', "Hyper Bicycles 24\" Boundary Mountain Bike", "https://www.walmart.ca/en/ip/Hyper-Bicycles-24-Girl-s-Boundary-Mountain-Bike-White-and-Pink/6000208212773"],
  ['kids', "Madd Gear 18\" Boys BMX", "https://www.walmart.ca/en/ip/Madd-Gear-18-Boys-BMX-Bike-Blue-Ages-4-8/6000208119273"],
  ['kids', "JOYSTAR Angel 16\"", "https://www.walmart.ca/en/ip/JOYSTAR-Angel-Girls-Bike-16-Inch-Kids-Bike-with-Training-Wheels-for-4-7-Years-Old-Girls-Toddler-Bicycle-Angel-pink/1K74ZKNC86LW"],
  ['kids', "Mongoose Kipawa 24\" Mountain Bike", "https://www.walmart.ca/en/ip/Mongoose-Kipawa-Girls-Mountain-Bike-24-Wheel-Size-Blue-Black-Size-Age-8-Blue/66GMPLGSAI0X"],
  ['kids', "Costway 12\" Kids Bike (Hand & Coaster Brake)", "https://www.costway.ca/12-inch-kids-bike-children-bicycle-with-training-wheels-for-boys-and-girls.html"],
  ['kids', "Costway 18\" Kids Bike (Basket)", "https://www.costway.ca/18-inch-kids-bike-with-training-wheels-and-adjustable-handlebar-seat.html"],
  ['kids', "Costway 20\" Kids Mountain Bike (Suspension Fork)", "https://www.costway.ca/20-24-inch-kids-mountain-bike-with-adjustable-seat.html"],
  ['kids', "Costway 24\" Kids Mountain Bike (Suspension Fork)", "https://www.costway.ca/24-inch-kids-mountain-bike-adjustable-with-7-speed-and-suspension-fork.html"],
  ['kids', "VEVOR 26\" Cruiser Bike (7-Speed)", "https://www.vevor.ca/cruiser-bikes-c_12585/vevor-26-inch-cruiser-bike-7-speed-light-blue-beach-cruiser-bike-with-basket-p_010733523695"],
  ['kids', "Frog 48", "https://curbsidecycle.com/collections/frog-bikes"],
  // 2026-11-14, racing: Canadian-locale pages (specialized.com/ca, trekbikes.com/ca, canyon.com/en-ca, scott-sports.com/ca) or the brand's own collection page, as for the Caledonia and Aspero-5
  ['racing', "Specialized Allez Sprint Comp", "https://www.specialized.com/ca/en/allez-sprint-comp-shimano-105/p/4221550"],
  ['racing', "Trek Madone SL 6", "https://www.trekbikes.com/ca/en_CA/bikes/road-bikes/performance-road-bikes/madone/madone-sl/madone-sl-6-axs-gen-8/p/5320024/"],
  ['racing', "Trek Speed Concept SLR", "https://www.trekbikes.com/ca/en_CA/speed-concept/"],
  ['racing', "Cervélo S5", "https://www.cervelo.com/collections/s5"],
  ['racing', "Cervélo R5", "https://www.cervelo.com/collections/r5"],
  ['racing', "Cervélo P-Series (P5)", "https://www.cervelo.com/collections/p-series"],
  ['racing', "Canyon Ultimate CF SLX", "https://www.canyon.com/en-ca/road-bikes/race-bikes/ultimate/"],
  ['racing', "Canyon Speedmax CF", "https://www.canyon.com/en-ca/road-bikes/triathlon-bikes/"],
  ['racing', "Scott Foil RC", "https://www.scott-sports.com/ca/en/product/scott-foil-rc-10-bike?article=4275903020002"],
];
// The brand's own page says so: Surly files the Long Haul Trucker under "Archive" (discontinued).
const discontinued = [
  ['bikepacking', 'Surly Long Haul Trucker', 'https://surlybikes.com/products/long-haul-trucker', 'Surly lists this model under “Archive”: it is no longer sold new.'],
  ['kids', 'Norco Roller 16', 'https://www.norco.com/bike-archives/2022/2022-roller-16/', 'Norco lists the Roller 16 only under “Bike Archives” (the newest year shown is 2022); its current youth range has the Storm 16 instead.'],
];

for (const [f, name, url] of found) {
  const p = `data/${f}-bikes.json`;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const b = d.bikes.find(x => x.name === name);
  if (!b) { console.log('NOT FOUND', f, name); continue; }
  if (b.retailerUrl) { console.log('already linked', f, name); continue; }
  b.retailerUrl = url;
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
  console.log('linked', f, name);
}
for (const [f, name, url, note] of discontinued) {
  const p = `data/${f}-bikes.json`;
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  const b = d.bikes.find(x => x.name === name);
  if (!b) { console.log('NOT FOUND', f, name); continue; }
  if (b.discontinued) { console.log('already marked', f, name); continue; }
  b.discontinued = { source: url, note, checkedOn: new Date().toISOString().slice(0, 10) };
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
  console.log('marked discontinued', f, name);
}
