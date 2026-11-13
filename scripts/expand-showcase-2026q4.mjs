// Q4 2026 expansion of data/showcase.json beyond the first 20 "new" bikes: adds bikes that
// are AVAILABLE NOW in Canada, from more brands, with the same rules as before. Kept as a
// record of how they were found and checked; later quarters edit the JSON directly.
//
// Sources (all read directly, no scraping service needed):
//   1. The site's own catalogs (data/*-bikes.json): bikes that already have a verified
//      product link and photo, kept only if sold in Canada.
//   2. Kona Canada (en-ca.konaworld.com), Rad Power Bikes Canada, Panorama Cycles and
//      Cycling Elements: Canadian stores that publish their catalog as public JSON
//      (Shopify's /products.json), with CAD prices and real product photos.
//
// Every candidate must: have a live product page (HTTP 200, not blocked), have a photo at
// least 1000px wide, and be sold in Canada. A price is shown only when it is in CAD.
//
//   node scripts/expand-showcase-2026q4.mjs --dry     show what would be added, write nothing
//   node scripts/expand-showcase-2026q4.mjs           write data/showcase.json
// Optional: SHARP_DIR=<folder with node_modules/sharp> lets it detect photo backgrounds
// (white photos blend into the page grid; photos with their own background sit as tiles).
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { dimsFromBytes } from './lib/imginfo.mjs';

const DRY = process.argv.includes('--dry');
const TODAY = '2026-11-12';
const MIN_WIDTH = 1000;
const UA = 'Mozilla/5.0 (compatible; SelectVeloShowcaseCheck/1.0; +https://raghu-19planb.github.io/velomatch/)';

let sharp = null;
try { sharp = createRequire((process.env.SHARP_DIR || '.') + '/')('sharp'); } catch { /* optional */ }

const slug = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '');
const SOLD_BY = {
  'www.specialized.com': 'Specialized', 'en-ca.konaworld.com': 'Kona', 'konaworld.com': 'Kona', 'www.norco.com': 'Norco',
  'www.giant-bicycles.com': 'Giant', 'cyclingelements.ca': 'Cycling Elements', 'www.decathlon.ca': 'Decathlon',
  'www.cannondale.com': 'Cannondale', 'bikes.com': 'Rocky Mountain', 'panoramacycles.com': 'Panorama Cycles',
  'radpowerbikes.ca': 'Rad Power Bikes', 'www.walmart.ca': 'Walmart Canada', 'www.mec.ca': 'MEC', 'www.devinci.com': 'Devinci', 'envodrive.com': 'ENVO',
};
const NEED_CA_PATH = new Set(['www.specialized.com', 'www.giant-bicycles.com', 'www.cannondale.com']);
function soldByOf(url) { return SOLD_BY[new URL(url).host] || new URL(url).host.replace(/^www\./, ''); }
// Brands sold in Canada (own Canadian site, shipping to Canada, or Canadian dealers). For these we link
// the brand's own page and show NO price unless it is in CAD. Brands that only sell in the US
// (Priority, Guardian, Aventon, Ride1Up, Tumbleweed, Quintana Roo) are left out.
const CANADA_BRANDS = new Set(['Woom', 'Brompton', 'Marin', 'Cannondale', 'Salsa', 'Surly', 'All-City', 'Canyon']);
function canadaOk(url, currency, brand) {
  const u = new URL(url);
  if (currency === 'CAD') return true;
  if (CANADA_BRANDS.has(brand)) return true;
  if (!(u.host in SOLD_BY)) return false;
  return !NEED_CA_PATH.has(u.host) || /\/(ca|en-ca|en_CA)\//i.test(u.pathname);
}
// Prefer the brand's Canadian page when the URL has a locale segment (it must still load, see checkPage).
function canadianUrl(url) { return url.replace('/en-us/', '/en-ca/').replace('/us/en_US/', '/ca/en_CA/'); }

// ---------- type descriptions, in our own words ----------
const TYPE = {
  commute: { city_streets: 'City commuter', mixed_paths: 'Commuter for mixed paths', hilly_assist: 'Hill-friendly commuter', long_flat: 'Long-distance commuter' },
  bikepacking: { adventure: 'Adventure / gravel bike', touring: 'Touring bike', ultra_race: 'Ultra-distance race bike' },
  mountain: { xc: 'Cross-country', trail: 'Trail', enduro: 'Enduro', dirt_jump: 'Dirt-jump', downhill: 'Downhill' },
};
function catalogType(cat, b) {
  if (cat === 'kids') return `Kids’ bike, ${b.wheel}"` + (b.trainWheel ? ' with training wheels' : '');
  if (cat === 'commute') return (b.powerType === 'ebike' ? 'Electric ' : '') + (b.foldable ? 'folding commuter' : (TYPE.commute[b.type] || 'Commuter').replace(/^./, c => b.powerType === 'ebike' ? c.toLowerCase() : c));
  if (cat === 'bikepacking') return TYPE.bikepacking[b.purpose] || 'Gravel / adventure bike';
  if (cat === 'mountain') return `${TYPE.mountain[b.discipline] || 'Mountain'} ${b.suspensionType === 'hardtail' ? 'hardtail' : 'full-suspension'} bike`;
  if (cat === 'racing') {
    if (b.discipline === 'triathlon') return 'Triathlon bike';
    if (b.discipline === 'audax') return 'Audax / long-distance road bike';
    return ({ aero: 'Aero road bike', climbing: 'Climbing road bike', endurance: 'Endurance road bike', all_rounder: 'All-round road bike' })[b.character] || 'Road bike';
  }
  return 'Bike';
}

// ---------- candidate collection ----------
const existing = JSON.parse(fs.readFileSync('data/showcase.json', 'utf8'));
for (const b of existing.bikes) { // first 20 are the "new" set
  b.isNew = b.isNew ?? true;
  b.soldBy = b.soldBy || b.brand;
}
const seen = new Set(existing.bikes.map(b => norm(b.brand) + '|' + norm(b.name)));
const candidates = [];
const dropped = [];
function add(c) {
  const name = c.name.replace(new RegExp('^' + c.brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+', 'i'), '').trim();
  const key = norm(c.brand) + '|' + norm(name);
  if (seen.has(key)) { dropped.push(`${c.brand} ${name}: already listed`); return; }
  seen.add(key);
  candidates.push({ ...c, name });
}

// 1) catalogs
for (const cat of ['kids', 'commute', 'bikepacking', 'mountain', 'racing']) {
  const j = JSON.parse(fs.readFileSync(`data/${cat}-bikes.json`, 'utf8')); const arr = j.bikes || j;
  for (const b of arr) {
    if (!b.image || !b.retailerUrl) continue;
    if (!canadaOk(b.retailerUrl, b.currency, b.brand)) { dropped.push(`${b.brand} ${b.name}: not clearly sold in Canada (${new URL(b.retailerUrl).host}, currency ${b.currency || 'unlabelled=USD'})`); continue; }
    const soldBy = soldByOf(b.retailerUrl, b.brand);
    add({ brand: b.brand, name: b.name, category: cat, type: catalogType(cat, b), isNew: false, modelYear: null,
      price: b.currency === 'CAD' ? { amount: b.price, currency: 'CAD' } : null,
      note: CANADA_BRANDS.has(b.brand) && b.currency !== 'CAD' ? `Sold in Canada. See ${b.brand}’s page for stores and price` : `Sold by ${soldBy} in Canada`, soldBy,
      url: CANADA_BRANDS.has(b.brand) ? canadianUrl(b.retailerUrl) : b.retailerUrl, img: b.image, source: `data/${cat}-bikes.json` });
  }
}

// 2) Canadian Shopify stores
async function shop(host) {
  const out = [];
  for (let p = 1; p <= 20; p++) {
    const r = await fetch(`https://${host}/products.json?limit=250&page=${p}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(60000) });
    if (!r.ok) break; const j = await r.json(); out.push(...j.products); if (j.products.length < 250) break;
  }
  return out;
}
const firstImage = p => (p.images || []).find(i => i.width >= MIN_WIDTH) || null;
const minPrice = p => Math.min(...p.variants.filter(v => v.available).map(v => parseFloat(v.price)));

// Kona Canada
{
  const host = 'en-ca.konaworld.com';
  const seenTitle = new Set();
  const konaMap = tags => {
    const t = new Set(tags);
    if (t.has('Kids')) return ['kids', 'Kids’ bike'];
    if (t.has('Electric MTB')) return ['mountain', 'Electric mountain bike'];
    if (t.has('Electric Gravel / Commuter') || t.has('Electric Commuter')) return ['commute', 'Electric commuter / gravel bike'];
    if (t.has('Bike Packing')) return ['bikepacking', 'Bikepacking bike'];
    if (t.has('Drop Bar / Gravel')) return ['bikepacking', 'Gravel bike'];
    if (t.has('Urban')) return ['commute', 'City / commuter bike'];
    if (t.has('Fatbike')) return ['mountain', 'Fat bike'];
    if (t.has('Dirt Jump')) return ['mountain', 'Dirt-jump bike'];
    if (t.has('Mountain Full Suspension')) return ['mountain', 'Full-suspension mountain bike'];
    if (t.has('Mountain Hardtail') || t.has('MTB Hardtail') || t.has('Mountain')) return ['mountain', 'Hardtail mountain bike'];
    if (t.has('Electric')) return ['commute', 'Electric bike'];
    return null;
  };
  for (const p of await shop(host)) {
    if (p.product_type !== 'Bike') continue;
    const tags = p.tags || [];
    if (tags.includes('Archive') || tags.includes('Preview') || tags.includes('PRE-ERP-DRAFT')) continue;
    if (!p.variants.some(v => v.available)) { dropped.push(`Kona ${p.title}: not currently available`); continue; }
    const m = konaMap(tags); const img = firstImage(p);
    if (!m || !img) { dropped.push(`Kona ${p.title}: ${!m ? 'unclear category' : 'no photo >= ' + MIN_WIDTH + 'px'}`); continue; }
    if (seenTitle.has(p.title)) continue; seenTitle.add(p.title);
    const isNew = tags.includes('2027a');
    add({ brand: 'Kona', name: p.title, category: m[0], type: m[1], isNew, modelYear: isNew ? 2027 : null,
      price: { amount: minPrice(p), currency: 'CAD' },
      newReason: isNew ? '2027 model on Kona.com (Canada)' : undefined, note: 'Sold by Kona in Canada', soldBy: 'Kona',
      url: `https://${host}/products/${p.handle}`, img: img.src, source: `https://${host}/products.json` });
  }
}

// Giant Canada: the 2027 model-year pages listed in Giant's own sitemap
{
  const sm = await (await fetch('https://static.giant-bicycles.com/sitemaps/sitemap-giant-en-ca.xml', { headers: { 'User-Agent': UA } })).text();
  const urls = (sm.match(/<loc>[^<]+<\/loc>/g) || []).map(x => x.replace(/<\/?loc>/g, ''))
    .filter(u => /-2027$/.test(u) && !/\/ca\/bikes-/.test(u) && !/frameset|-ff-|-team-/.test(u));
  const catOf = u => /propel|tcr|defy|contend|trinity/.test(u) ? 'racing' : /revolt|toughroad/.test(u) ? 'bikepacking'
    : /talon|trance|anthem|stance|reign|fathom/.test(u) ? 'mountain' : /anytour|newtour|escape|roam|fastroad|explore|cypress|dailytour/.test(u) ? 'commute'
    : /arx|xtc-jr|pre-|enchant/.test(u) ? 'kids' : null;
  // Giant serves minified HTML with unquoted attributes (<meta property=og:title content="...">),
  // so read each tag's attributes properly instead of matching a fixed quoting style.
  const metaOf = (h, k) => {
    for (const tag of h.match(/<meta\b[^>]*>/gi) || []) {
      const attrs = {};
      for (const m of tag.matchAll(/([a-zA-Z:_-]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/g)) attrs[m[1].toLowerCase()] = m[3] ?? m[4] ?? m[5];
      if ((attrs.property === k || attrs.name === k) && attrs.content !== undefined) return attrs.content.trim();
    }
    return undefined;
  };
  await pool(urls, 6, async u => {
    const slugName = u.split('/').pop();
    const category = catOf(u);
    if (!category) { dropped.push('Giant ' + slugName + ': unclear category'); return; }
    try {
      const r = await fetch(u, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
      if (!r.ok) { dropped.push('Giant ' + slugName + ': page HTTP ' + r.status); return; }
      const h = await r.text();
      const title = (metaOf(h, 'og:title') || '').replace(/&amp;/g, '&');
      const og = metaOf(h, 'og:image') || '';
      const price = parseFloat(metaOf(h, 'product:price:amount'));
      const cur = metaOf(h, 'product:price:currency');
      if (!/\(2027\)/.test(title) || /placeholder|share-image/.test(og) || !(price > 0) || cur !== 'CAD') {
        dropped.push('Giant ' + slugName + ': page is missing a 2027 title, a real photo or a CAD price'); return;
      }
      const parts = title.split(/\s*\|\s*/);
      const name = parts[0].replace(/\s*\(2027\)/, '').trim();
      const type = (parts[1] && !/Giant Bicycles/i.test(parts[1]) ? parts[1] : 'Bike').replace(/^./, c => c.toUpperCase());
      const big = og.replace(/h_\d+%2Cq_80%2Cw_\d+/, 'h_1067%2Cq_80%2Cw_1600');
      add({ brand: 'Giant', name, category, type, isNew: true, modelYear: 2027, price: { amount: price, currency: 'CAD' },
        newReason: '2027 model-year page on Giant Canada', soldBy: 'Giant', url: u, img: big,
        source: 'https://static.giant-bicycles.com/sitemaps/sitemap-giant-en-ca.xml' });
    } catch (e) { dropped.push('Giant ' + slugName + ': ' + String(e.message || e)); }
  });
}

// Rad Power Bikes Canada
{
  const host = 'radpowerbikes.ca';
  for (const p of await shop(host)) {
    if (p.product_type !== 'Electric Bike') continue;
    if (!p.variants.some(v => v.available)) { dropped.push(`Rad ${p.title}: not currently available`); continue; }
    const img = firstImage(p); if (!img) { dropped.push(`Rad ${p.title}: no photo >= ${MIN_WIDTH}px`); continue; }
    const t = (p.tags || []).join('|');
    const type = /Cargo/.test(t) ? 'Electric cargo bike' : /Folding/.test(t) ? 'Electric folding bike' : /Off-Road/.test(t) && !/City/.test(t) ? 'Electric off-road bike' : /City/.test(t) ? 'Electric city bike' : 'Electric bike';
    add({ brand: 'Rad Power Bikes', name: p.title.replace(/™|®/g, '').replace(/\s+(Electric|Lightweight|Bike).*$/i, m => m).replace(/\s+(Electric .*)$/i, '').trim(),
      category: 'commute', type, isNew: false, modelYear: null, price: { amount: minPrice(p), currency: 'CAD' },
      note: 'Sold by Rad Power Bikes in Canada', soldBy: 'Rad Power Bikes', url: `https://${host}/products/${p.handle}`, img: img.src, source: `https://${host}/products.json` });
  }
}

// Panorama Cycles (Canadian maker)
{
  const host = 'panoramacycles.com';
  for (const p of await shop(host)) {
    const price = Math.max(...p.variants.map(v => parseFloat(v.price)));
    const isBike = price >= 1000 && !/part|kit|rack|dropout|wheel|fork|fit/i.test(p.title) && (/bike/i.test(p.product_type || '') || /MY\d\d/.test(p.title));
    if (!isBike) continue;
    if (!p.variants.some(v => v.available)) { dropped.push(`Panorama ${p.title}: not currently available`); continue; }
    const img = firstImage(p); if (!img) { dropped.push(`Panorama ${p.title}: no photo >= ${MIN_WIDTH}px`); continue; }
    const my = (p.title.match(/MY(\d\d)/) || [])[1];
    add({ brand: 'Panorama Cycles', name: p.title.replace(/\s*MY\d\d/, '').replace(/\s*-\s*Demo$/i, ''), category: 'bikepacking',
      type: (p.product_type || 'Bikepacking bike').replace(/\s*-\s*Demo$/i, '').replace(/ \|.*/, ''), isNew: !!my, modelYear: my ? 2000 + +my : null,
      price: { amount: minPrice(p), currency: 'CAD' }, newReason: my ? `20${my} model on panoramacycles.com` : undefined,
      note: 'Sold by Panorama Cycles in Canada', soldBy: 'Panorama Cycles', url: `https://${host}/products/${p.handle}`, img: img.src, source: `https://${host}/products.json` });
  }
}

// Cycling Elements (Canadian multi-brand online shop)
{
  const host = 'cyclingelements.ca';
  for (const p of await shop(host)) {
    const pt = p.product_type || '';
    if (!/bike/i.test(pt) || /parts|accessor|baby|seat|helmet/i.test(pt)) continue;
    if (!p.variants.some(v => v.available)) { dropped.push(`Cycling Elements ${p.title}: not currently available`); continue; }
    const img = (p.images || []).find(i => i.width >= MIN_WIDTH); if (!img) { dropped.push(`Cycling Elements ${p.title}: no photo >= ${MIN_WIDTH}px`); continue; }
    const category = /kid/i.test(pt) ? 'kids' : /mountain|fat/i.test(pt) ? 'mountain' : /road/i.test(pt) ? 'racing' : /city|active|e-bike|electric/i.test(pt) ? 'commute' : null;
    if (!category) { dropped.push(`Cycling Elements ${p.title}: unclear category (${pt})`); continue; }
    const brand = p.vendor.replace(/^OPUS$/, 'Opus');
    add({ brand, name: p.title, category, type: pt.replace(/^Bikes - /, '').replace(/^Kid's Bikes$/, 'Kids’ bike').replace(/ Bikes?$/, ' bike'),
      isNew: false, modelYear: null, price: { amount: minPrice(p), currency: 'CAD' },
      note: 'Sold by Cycling Elements (Canadian online shop)', soldBy: 'Cycling Elements', url: `https://${host}/products/${p.handle}`, img: img.src, source: `https://${host}/products.json` });
  }
}

// ---------- validation ----------
async function loadImage(src) {
  try {
    if (!/^https?:/.test(src)) {
      const buf = fs.readFileSync(src);
      return { ok: true, buf, local: true };
    }
    const r = await fetch(src, { headers: { 'User-Agent': UA, Accept: 'image/*' }, redirect: 'follow', signal: AbortSignal.timeout(40000) });
    if (!r.ok) return { ok: false, error: 'photo HTTP ' + r.status };
    if (!/^image\//.test(r.headers.get('content-type') || '')) return { ok: false, error: 'photo is not an image' };
    return { ok: true, buf: Buffer.from(await r.arrayBuffer()) };
  } catch (e) { return { ok: false, error: 'photo: ' + String(e.message || e) }; }
}
async function sizeAndBackground(buf) {
  let width, height, white = null;
  if (sharp) {
    try {
      const meta = await sharp(buf).metadata(); width = meta.width; height = meta.height;
      const { data, info } = await sharp(buf).flatten({ background: '#ffffff' }).resize(64, 64, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
      const patch = (x0, y0) => { let s = 0, n = 0; for (let y = y0; y < y0 + 6; y++) for (let x = x0; x < x0 + 6; x++) for (let c = 0; c < 3; c++) { s += data[(y * info.width + x) * info.channels + c]; n++; } return s / n; };
      const corners = [patch(0, 0), patch(58, 0), patch(0, 58), patch(58, 58)];
      white = Math.min(...corners) >= 240;
    } catch { /* fall through to header */ }
  }
  if (!width) { const d = dimsFromBytes(buf.subarray(0, 400000)); if (d) { width = d.width; height = d.height; } }
  return { width, height, white };
}
async function checkPage(url) {
  try {
    const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': UA, Accept: 'text/html' }, signal: AbortSignal.timeout(30000) });
    if (r.status === 403 || r.status === 429) return { ok: false, why: `page blocks automated checks (HTTP ${r.status}), so it could not be verified` };
    return r.ok ? { ok: true } : { ok: false, why: `page HTTP ${r.status}` };
  } catch (e) { return { ok: false, why: 'page: ' + String(e.message || e) }; }
}

async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }));
  return out;
}

const accepted = [];
const rejected = [];
await pool(candidates, 6, async c => {
  const [page, im] = await Promise.all([checkPage(c.url), loadImage(c.img)]);
  const why = [];
  if (!page.ok) why.push(page.why);
  let dims = {};
  if (!im.ok) why.push(im.error);
  else {
    dims = await sizeAndBackground(im.buf);
    if (!dims.width) why.push('could not read photo size');
    else if (dims.width < MIN_WIDTH) why.push(`photo only ${dims.width}px wide`);
    if (im.local && im.buf.length > 2400000) why.push(`local photo too heavy (${Math.round(im.buf.length / 1024)}KB)`);
  }
  if (why.length) { rejected.push(`${c.brand} ${c.name}: ${why.join('; ')}`); return; }
  accepted.push({
    id: slug(c.brand + '-' + c.name + (c.source.includes('products.json') ? '-' + new URL(c.url).pathname.split('/').pop() : '')),
    brand: c.brand, name: c.name, category: c.category, type: c.type, modelYear: c.modelYear ?? null,
    isNew: !!c.isNew, ...(c.price ? { price: c.price } : {}),
    ...(c.isNew && c.newReason ? { newReason: c.newReason } : {}), ...(!c.isNew ? { note: c.note } : {}), soldBy: c.soldBy,
    productUrl: c.url,
    image: { url: c.img, width: dims.width, height: dims.height, credit: c.soldBy, ...(dims.white === false ? { blend: false } : {}) },
    source: c.source, verifiedOn: TODAY, firstListed: TODAY,
  });
});

// cap brands that have a very large range: new bikes first, then spread across categories
function capBrand(brand, n) {
  const mine = accepted.filter(b => b.brand === brand);
  if (mine.length <= n) return;
  const spread = list => { const g = {}; list.forEach(b => (g[b.category] = g[b.category] || []).push(b)); const o = Object.values(g); const out = []; while (out.length < n && o.some(a => a.length)) for (const a of o) if (a.length && out.length < n) out.push(a.shift()); return out; };
  const fresh = mine.filter(b => b.isNew);
  const keep = new Set(fresh.length >= n ? spread(fresh) : [...fresh, ...spread(mine.filter(b => !b.isNew)).slice(0, n - fresh.length)]);
  for (let i = accepted.length - 1; i >= 0; i--) if (accepted[i].brand === brand && !keep.has(accepted[i])) accepted.splice(i, 1);
}
capBrand('Kona', 24); capBrand('Giant', 28);

// make ids unique
const ids = new Set(existing.bikes.map(b => b.id));
for (const b of accepted) { let id = b.id, n = 2; while (ids.has(id)) id = `${b.id}-${n++}`; b.id = id; ids.add(id); }

// ---------- report ----------
const byBrand = {}; for (const b of accepted) byBrand[b.brand] = (byBrand[b.brand] || 0) + 1;
const byCat = {}; for (const b of accepted) byCat[b.category] = (byCat[b.category] || 0) + 1;
console.log(`candidates ${candidates.length} -> accepted ${accepted.length}, rejected ${rejected.length}, skipped earlier ${dropped.length}`);
console.log('by category:', JSON.stringify(byCat));
console.log('by brand   :', Object.entries(byBrand).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}(${n})`).join(', '));
console.log('new among accepted:', accepted.filter(b => b.isNew).map(b => `${b.brand} ${b.name}`).join(' | ') || '(none)');
console.log('photos on a coloured background (shown as tiles):', accepted.filter(b => b.image.blend === false).length, sharp ? '' : '(background detection off: sharp not available)');
console.log('\nREJECTED:'); rejected.sort().forEach(r => console.log('  - ' + r));
console.log('\nSKIPPED BEFORE CHECKING (sample):'); dropped.filter(d => !d.includes('already listed')).slice(0, 40).forEach(d => console.log('  - ' + d));

if (!DRY) {
  existing.bikes.push(...accepted);
  existing._meta.updated = TODAY;
  existing._meta.purpose = 'Bikes on the “Showcase” page (showcase.html): bikes the brands call new (tagged “New”) plus bikes available now from Canadian sellers. Every entry has a live Canadian product page and a photo of at least ' + MIN_WIDTH + 'px.';
  fs.writeFileSync('data/showcase.json', JSON.stringify(existing, null, 2) + '\n');
  console.log(`\nwrote data/showcase.json: ${existing.bikes.length} bikes`);
}
