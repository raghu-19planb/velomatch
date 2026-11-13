// One-off seed for data/showcase.json, researched 2026-11-12 (Q4 2026) from the
// brands' own Canadian sites. It records WHERE each fact came from and then
// re-checks every link and photo before writing anything, so a bad entry fails
// loudly here instead of reaching the live page.
//
// Later quarters do not re-run this file: they edit data/showcase.json directly
// (see scripts/README.md) and run scripts/verify-showcase.mjs.
//
// Run from the repo root:  node scripts/seed-showcase-2026q4.mjs
import fs from 'node:fs';
import { imageInfo } from './lib/imginfo.mjs';

const TODAY = '2026-11-12';
const MIN_WIDTH = 1000; // below this a photo is not "HQ" for this page

// image URL builders: each CDN serves a larger rendition when asked.
const widen = id => `https://embed.widencdn.net/img/dorelrl/${id}/1600px@1x/?color=ffffff&q=90`;
const giant = (id, file) => `https://images2.giant-bicycles.com/b_white%2Cc_pad%2Ch_1067%2Cq_80%2Cw_1600/${id}/${file}`;
const spec = file => `https://resources.specialized.com/image/${file}?bg=ffffff&w=1600&h=1600&q=75`;

const CANNONDALE_NEW = 'Labelled “New” on Cannondale.com (Canada)';
const GIANT_2027 = '2027 model-year page on Giant Canada';

const LIST = [
  // ---------------- Racing ----------------
  { brand: 'Specialized', name: 'Tarmac SL9 Comp – SRAM Rival AXS', category: 'racing', type: 'Race road bike', modelYear: null,
    price: 5999.99, newReason: 'Part of the all-new Tarmac SL9 range, per Specialized.com',
    url: 'https://www.specialized.com/ca/en/tarmac-sl9-comp-sram-rival-axs/p/4293529?color=5470202-4293529',
    img: spec('94927-51_TARMAC-SL9-COMP-AXS-CHAR-LQDMET-DLMMET_HERO-SQUARE'),
    src: 'https://www.specialized.com/ca/en/shop/bikes/road-bikes/performance-road-bikes/tarmac' },
  { brand: 'Specialized', name: 'S-Works Tarmac SL9 – SRAM RED AXS', category: 'racing', type: 'Race road bike', modelYear: null,
    price: 18999.99, newReason: 'Part of the all-new Tarmac SL9 range, per Specialized.com',
    url: 'https://www.specialized.com/ca/en/s-works-tarmac-sl9-sram-red-axs/p/4293533?color=5470183-4293533',
    img: spec('94927-00_TARMAC-SL9-SW-AXS-SILDST-SPCTFLR-CHRM_HERO-SQUARE'),
    src: 'https://www.specialized.com/ca/en/shop/bikes/road-bikes/performance-road-bikes/tarmac' },
  { brand: 'Giant', name: 'Propel Advanced 1', category: 'racing', type: 'Aero road bike', modelYear: 2027,
    price: 5999, newReason: GIANT_2027,
    url: 'https://www.giant-bicycles.com/ca/propel-advanced-1-2027',
    img: giant('gnfkbuoldekzx6mzwsvw', 'MY27PropelAdvanced1_ColorACarbon.jpg'),
    src: 'https://www.giant-bicycles.com/ca/propel-advanced-1-2027' },
  { brand: 'Cannondale', name: 'SuperSix EVO 4', category: 'racing', type: 'Race road bike', modelYear: null,
    price: 7599, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/road/race/supersix-evo/supersix-evo-4',
    img: widen('snhstecogu'), src: 'https://www.cannondale.com/en-ca/bikes' },
  { brand: 'Cannondale', name: 'SuperSix EVO 6', category: 'racing', type: 'Race road bike', modelYear: null,
    price: 3999, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/road/race/supersix-evo/supersix-evo-6',
    img: widen('idlzpkc4xx'), src: 'https://www.cannondale.com/en-ca/bikes' },
  { brand: 'Cannondale', name: 'CAAD14 2', category: 'racing', type: 'Aluminum race bike', modelYear: null,
    price: 4999, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/road/race/caad14/caad14-2',
    img: widen('8vkvbzblht'), src: 'https://www.cannondale.com/en-ca/bikes' },

  // ---------------- Bikepacking & gravel ----------------
  { brand: 'Giant', name: 'Revolt Advanced SL 0', category: 'bikepacking', type: 'Gravel race bike', modelYear: 2027,
    price: 15999, newReason: GIANT_2027,
    url: 'https://www.giant-bicycles.com/ca/revolt-advanced-sl-0-2027',
    img: giant('xtncwu04bza2x4zgnfc5', 'MY27RevoltAdvancedSL0_ColorARawCarbon1.jpg'),
    src: 'https://www.giant-bicycles.com/ca/revolt-advanced-sl-0-2027' },
  { brand: 'Specialized', name: 'S-Works Diverge 4 – SRAM RED XPLR', category: 'bikepacking', type: 'Gravel race bike', modelYear: null,
    price: 17499.99, newReason: 'Labelled “New” on Specialized.com (Canada)',
    url: 'https://www.specialized.com/ca/en/s-works-diverge-4-sram-red-xplr/p/4298775?color=5479311-4298775',
    img: spec('95427-00_DIVERGE-SW-WRMSMKMET-CARB-SILDST_HERO-SQUARE'),
    src: 'https://www.specialized.com/ca/en/shop/bikes/gravel-bikes/diverge' },
  { brand: 'Cannondale', name: 'SuperX 4 AXS', category: 'bikepacking', type: 'Gravel race bike', modelYear: null,
    price: 5499, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/road/gravel/superx/superx-4-axs',
    img: widen('w3wrth97fo'), src: 'https://www.cannondale.com/en-ca/bikes/road/gravel/superx' },
  { brand: 'Cannondale', name: 'SuperX 3', category: 'bikepacking', type: 'Gravel race bike', modelYear: null,
    price: 6999, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/road/gravel/superx/superx-3',
    img: widen('7ovmf5yitb'), src: 'https://www.cannondale.com/en-ca/bikes/road/gravel/superx' },

  // ---------------- Mountain ----------------
  { brand: 'Giant', name: 'Trance Advanced E+ 0', category: 'mountain', type: 'Electric trail bike', modelYear: 2027,
    price: 13999, newReason: GIANT_2027,
    url: 'https://www.giant-bicycles.com/ca/trance-advanced-eplus-0-2027',
    img: giant('dxbf9j1n7mwjqwwd2rqh', 'MY27TranceAdvancedE0_ColorA1.jpg'),
    src: 'https://www.giant-bicycles.com/ca/trance-advanced-eplus-0-2027' },
  { brand: 'Cannondale', name: 'Bad Habit 2', category: 'mountain', type: 'Trail / enduro bike', modelYear: null,
    price: 7599, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/mountain/enduro/bad-habit/bad-habit-2',
    img: widen('b4ps0vadac'), src: 'https://www.cannondale.com/en-ca/bikes' },
  { brand: 'Cannondale', name: 'Moterra 4+', category: 'mountain', type: 'Electric mountain bike', modelYear: null,
    price: 6199, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/electric/e-mountain/moterra-neo/moterra-4-plus-smu',
    img: widen('uomgtm73rz'), src: 'https://www.cannondale.com/en-ca/bikes' },

  // ---------------- Commuting ----------------
  { brand: 'Cannondale', name: 'Quick 1', category: 'commute', type: 'Fitness / commuter bike', modelYear: null,
    price: 1399, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/active/fitness/quick/quick-1',
    img: widen('mtgshtyyzj'), src: 'https://www.cannondale.com/en-ca/bikes' },
  { brand: 'Cannondale', name: 'Quick 3', category: 'commute', type: 'Fitness / commuter bike', modelYear: null,
    price: 849, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/active/fitness/quick/quick-3',
    img: widen('nslgew9vi9'), src: 'https://www.cannondale.com/en-ca/bikes' },
  { brand: 'Cannondale', name: 'Quick 4 StepThru', category: 'commute', type: 'Step-through commuter', modelYear: null,
    price: 749, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/active/fitness/quick/quick-4-stepthru',
    img: widen('polymiaa8l'), src: 'https://www.cannondale.com/en-ca/bikes' },

  // ---------------- Kids ----------------
  { brand: 'Norco', name: 'Storm 26', noBlend: true, category: 'kids', type: 'Youth mountain bike', modelYear: 2027,
    price: 619, newReason: '2027 model-year page on Norco.com',
    url: 'https://www.norco.com/bikes/youth/youth-trail/storm-youth-kids/2027-storm-26/',
    img: 'https://www.norco.com/cmsb/uploads/bikes/bikes/my27-storm-youth-26-berry-magenta-tp-shadow-main.jpg',
    src: 'https://www.norco.com/bikes/youth/youth-trail/storm-youth-kids/2027-storm-26/' },
  { brand: 'Cannondale', name: 'Kids Trail 16 Single-Speed', category: 'kids', type: 'Kids’ bike, 16"', modelYear: null,
    price: 449, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/kids/4-to-6/kids-trail-4-to-6/kids-trail-16-single-speed-smu',
    img: widen('nmzzfrhozt'), src: 'https://www.cannondale.com/en-ca/bikes' },
  { brand: 'Cannondale', name: 'Kids Trail 20', category: 'kids', type: 'Kids’ bike, 20"', modelYear: null,
    price: 549, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/kids/5-to-8/kids-trail-5-to-8/kids-trail-20-c5217gu',
    img: widen('amyc66zfg1'), src: 'https://www.cannondale.com/en-ca/bikes' },
  { brand: 'Cannondale', name: 'Kids Quick 24', category: 'kids', type: 'Kids’ bike, 24"', modelYear: null,
    price: 649, newReason: CANNONDALE_NEW,
    url: 'https://www.cannondale.com/en-ca/bikes/kids/7-to-12/kids-quick-7-to-12/kids-quick-24-smu',
    img: widen('8d7u6ygnlq'), src: 'https://www.cannondale.com/en-ca/bikes' },
];

const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const UA = 'Mozilla/5.0 (compatible; SelectVeloShowcaseCheck/1.0; +https://raghu-19planb.github.io/velomatch/)';

async function pageOk(url) {
  try {
    const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(25000) });
    return { ok: r.ok, status: r.status, finalUrl: r.url };
  } catch (e) { return { ok: false, status: 0, error: String(e.message || e) }; }
}

const bikes = [];
let failed = 0;
for (const b of LIST) {
  const [p, im] = await Promise.all([pageOk(b.url), imageInfo(b.img)]);
  const problems = [];
  if (!p.ok) problems.push(`product page HTTP ${p.status}${p.error ? ' ' + p.error : ''}`);
  if (!im.ok) problems.push('image: ' + im.error);
  else if (im.width < MIN_WIDTH) problems.push(`image only ${im.width}px wide`);
  if (problems.length) { failed++; console.log('REJECT', b.brand, b.name, '->', problems.join('; ')); continue; }
  console.log('ok    ', (b.brand + ' ' + b.name).padEnd(46), `${im.width}x${im.height} ${im.type}`);
  bikes.push({
    id: slug(b.brand + '-' + b.name),
    brand: b.brand,
    name: b.name,
    category: b.category,
    type: b.type,
    modelYear: b.modelYear,
    price: { amount: b.price, currency: 'CAD' },
    newReason: b.newReason,
    productUrl: b.url,
    image: { url: b.img, width: im.width, height: im.height, credit: b.brand, ...(b.noBlend ? { blend: false } : {}) },
    source: b.src,
    verifiedOn: TODAY,
    firstListed: TODAY,
  });
}

const out = {
  _meta: {
    purpose: 'Bikes on the “New bikes” showcase page (new-bikes.html). Every entry is a model the brand itself calls new (a “New” label, an “all-new” range, or a 2027 model-year page), with a live Canadian product page and a photo of at least ' + MIN_WIDTH + 'px.',
    currency: 'CAD',
    updated: TODAY,
    rules: [
      'Never add a bike without opening its product page and confirming the brand calls it new.',
      'Photos are linked from the brand’s own site (never copied). Verify with scripts/verify-showcase.mjs.',
      'Skip any model with a recall notice, a 404, or only a placeholder/banner image.',
      'Prices are the brand’s “from” price in CAD on the day it was checked, shown only if verified.'
    ],
    skipped: [
      { what: 'Norco Fluid Gen 3 (2027)', why: 'Norco issued a voluntary safety recall on all 2027 Fluid Gen 3 models; not featured.' },
      { what: 'Canyon Spectral:ON CF 9 and other Canyon launches', why: 'Only a “coming soon” page with no product page to link to as of 2026-11-12.' },
      { what: 'Trek 2027 range', why: 'Trek’s new-bikes pages are script-rendered and returned only banner images; add by hand once product pages and photos can be verified.' },
      { what: 'Giant Defy Advanced 4 (2027)', why: 'Product page returns 404 on Giant Canada.' }
    ]
  },
  bikes
};
fs.writeFileSync('data/showcase.json', JSON.stringify(out, null, 2) + '\n');
console.log(`\nwrote data/showcase.json: ${bikes.length} bikes, ${failed} rejected`);
if (failed) process.exitCode = 1;
