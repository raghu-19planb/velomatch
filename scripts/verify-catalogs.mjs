// Checks every bike in the five quiz catalogs against its seller's page, and records what was
// actually seen, so the site can say what is confirmed and what is not instead of guessing.
//
//   node scripts/verify-catalogs.mjs                 report only
//   node scripts/verify-catalogs.mjs --write         also write a `check` object onto each bike
//   node scripts/verify-catalogs.mjs --only=kids     one catalog (kids|commute|racing|mountain|bikepacking)
//
// For each bike with a retailerUrl it loads the page and records:
//   status   ok        the page loaded and shows this bike's name
//            mismatch  the page loaded but does not show the model name (link may be wrong or generic)
//            dead      404 / 410 / server error / DNS failure: the link does not work
//            blocked   the seller refused this network (403 / 429 / timeout): NOT proof of a problem
//   price + currency   only when the page states them in machine-readable form (JSON-LD, og/product meta)
//   canada   'confirmed' only when the page itself is a Canadian listing (a .ca site, a /en-ca/ or /fr-ca/
//            locale, or a CAD price). Otherwise 'unconfirmed'. It is never guessed.
// Bikes with no retailerUrl get status 'no-link'. Nothing here invents a URL or a price.
import fs from 'node:fs';

const UA = 'Mozilla/5.0 (compatible; SelectVeloCatalogCheck/1.0; +https://raghu-19planb.github.io/velomatch/)';
const today = new Date().toISOString().slice(0, 10);
const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const ONLY = (args.find(a => a.startsWith('--only=')) || '').slice(7);
const FILES = ['kids', 'commute', 'racing', 'mountain', 'bikepacking'].filter(f => !ONLY || f === ONLY);

const GENERIC = new Set(['the', 'bike', 'bikes', 'kids', 'new', 'and', 'with', 'gen', 'inch', 'in']);
function tokens(name) {
  return name.toLowerCase().replace(/[^a-z0-9.+ ]/g, ' ').split(/\s+/).filter(w => w && !GENERIC.has(w) && (w.length > 2 || /\d/.test(w)));
}
function textOf(html) {
  return html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').toLowerCase();
}
function metaContent(html, key) {
  const re = new RegExp('<meta[^>]+(?:property|name)=["\']?' + key.replace(/[.:]/g, '\\$&') + '["\']?[^>]*content=["\']([^"\']*)["\']', 'i');
  const re2 = new RegExp('<meta[^>]+content=["\']([^"\']*)["\'][^>]*(?:property|name)=["\']?' + key.replace(/[.:]/g, '\\$&') + '["\']?', 'i');
  return (html.match(re) || html.match(re2) || [])[1] || '';
}
function ldProducts(html) {
  const out = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = x => {
        if (Array.isArray(x)) return x.forEach(walk);
        if (!x || typeof x !== 'object') return;
        const t = [].concat(x['@type'] || []);
        if (t.includes('Product') || t.includes('ProductGroup')) out.push(x);
        if (x['@graph']) walk(x['@graph']);
        if (x.hasVariant) walk(x.hasVariant);
      };
      walk(JSON.parse(m[1]));
    } catch (e) { /* ignore malformed blocks */ }
  }
  return out;
}
function offerOf(prod) {
  const offers = [].concat(prod.offers || []).flatMap(o => o.offers ? [].concat(o.offers) : [o]);
  const nums = offers.map(o => ({ price: Number(o.price ?? o.lowPrice), currency: o.priceCurrency })).filter(o => o.price > 0);
  return nums.sort((a, b) => a.price - b.price)[0] || null;
}
function canadianListing(url, currency) {
  let u; try { u = new URL(url); } catch (e) { return false; }
  // a .ca site, a /en-ca/ or /fr_CA/ locale, a /ca/ section (specialized.com/ca/en/...), or a price in CAD
  return currency === 'CAD' || /\.ca$/i.test(u.hostname) || /(^|[./])(en|fr)[-_]ca([/.]|$)/i.test(u.hostname + u.pathname) || /\/ca\//i.test(u.pathname);
}

async function check(b) {
  const out = { checkedOn: today };
  if (!b.retailerUrl) return { ...out, status: 'no-link', canada: 'unconfirmed' };
  try {
    const r = await fetch(b.retailerUrl, { redirect: 'follow', headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml', 'Accept-Language': 'en-CA,en;q=0.9' }, signal: AbortSignal.timeout(25000) });
    out.http = r.status;
    out.finalUrl = r.url;
    if ([403, 429, 503].includes(r.status)) return { ...out, status: 'blocked', canada: canadianListing(r.url) ? 'confirmed' : 'unconfirmed', note: 'seller refused automated access' };
    if (!r.ok) return { ...out, status: 'dead', canada: 'unconfirmed' };
    const html = (await r.text()).slice(0, 1500000);
    const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || '';
    const prods = ldProducts(html);
    const hay = (title + ' ' + metaContent(html, 'og:title') + ' ' + prods.map(p => p.name).join(' ') + ' ' + textOf(html).slice(0, 12000)).toLowerCase();
    const want = tokens(b.name);
    const hit = want.filter(w => hay.includes(w)).length;
    out.title = title.replace(/\s+/g, ' ').trim().slice(0, 120);
    out.nameMatch = want.length ? Math.round(100 * hit / want.length) : 0;
    let offer = null;
    for (const p of prods) { offer = offerOf(p) || offer; }
    if (!offer) {
      const amt = Number(metaContent(html, 'product:price:amount') || metaContent(html, 'og:price:amount'));
      const cur = metaContent(html, 'product:price:currency') || metaContent(html, 'og:price:currency');
      if (amt > 0) offer = { price: amt, currency: cur || undefined };
    }
    if (offer) { out.price = offer.price; if (offer.currency) out.currency = offer.currency; }
    out.canada = canadianListing(r.url, out.currency) ? 'confirmed' : 'unconfirmed';
    out.status = out.nameMatch >= 70 ? 'ok' : 'mismatch';
    return out;
  } catch (e) {
    const timeout = e.name === 'TimeoutError' || /timeout/i.test(String(e.message));
    return { ...out, status: timeout ? 'blocked' : 'dead', canada: 'unconfirmed', note: String(e.cause?.code || e.message || e).slice(0, 80) };
  }
}

const summary = {};
for (const f of FILES) {
  const path = `data/${f}-bikes.json`;
  const data = JSON.parse(fs.readFileSync(path, 'utf8'));
  const bikes = data.bikes;
  const results = new Array(bikes.length);
  let next = 0;
  await Promise.all(Array.from({ length: 6 }, async () => { while (next < bikes.length) { const k = next++; results[k] = await check(bikes[k]); } }));
  const counts = {};
  bikes.forEach((b, i) => {
    const r = results[i];
    counts[r.status] = (counts[r.status] || 0) + 1;
    console.log(f.padEnd(11) + r.status.padEnd(9) + (r.canada === 'confirmed' ? 'CA ' : '   ') + (b.brand + ' ' + b.name).slice(0, 44).padEnd(45) + (r.price ? (r.currency || '?') + ' ' + r.price : '').padEnd(14) + (r.status === 'mismatch' ? ' name match ' + r.nameMatch + '%' : '') + (r.note ? ' ' + r.note : ''));
    if (WRITE) b.check = r;
  });
  summary[f] = counts;
  if (WRITE) fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}
console.log('\nSUMMARY', JSON.stringify(summary));

// ---- Health Canada recall advisories (advisory only: a prompt to read the notice, not proof the bike is affected)
// Matches a bike's brand and its most distinctive model word against Health Canada's published recall list. It
// often concerns an older model year, so the quizzes word it as "a recall notice mentions this model: read it".
if (WRITE) {
  const GENERIC2 = new Set(['pro', 'comp', 'expert', 'sport', 'evo', 'advanced', 'carbon', 'alloy', 'kids', 'trail', 'the', 'new', 'sl', 'axs', 'xplr', 'works', 'disc', 'gen', 'bike', 'bikes', 'inch', 'base', 'elite', 'race', 'team']);
  // the words that make this bike's model different from its brand's other bikes
  const modelWords = b => {
    const plain = x => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const brandWords = new Set(plain(b.brand).split(/[\s.-]+/));
    return plain(b.name).replace(/[^a-z0-9.+ ]/g, ' ').split(/\s+/).filter(w => w && !brandWords.has(w) && !GENERIC2.has(w) && (w.length > 2 || /\d/.test(w)));
  };
  const HC_URL = 'https://recalls-rappels.canada.ca/sites/default/files/opendata-donneesouvertes/HCRSAMOpenData.json';
  try {
    const hc = await (await fetch(HC_URL, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(120000) })).json();
    let marked = 0;
    for (const f of FILES) {
      const path = `data/${f}-bikes.json`;
      const data = JSON.parse(fs.readFileSync(path, 'utf8'));
      for (const b of data.bikes) {
        const words = modelWords(b), brand = b.brand.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().split(/[\s.-]+/)[0];
        let best = null;
        for (const x of hc) {
          const t = `${x.Title} ${x.Product}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
          if (!(t.includes(brand) && /bicycle|bike|cycle/.test(t)) || !words.length) continue;
          // exact: every distinguishing word of this model is in the notice. family: the model's name is, but not its trim or year.
          if (words.every(w => t.includes(w))) { best = { x, match: 'exact' }; break; }
          const lead = words.find(w => w.length >= 4 && !/^\d/.test(w));
          if (lead && t.includes(lead) && !best) best = { x, match: 'family', lead };
        }
        if (best) { b.recall = { match: best.match, line: best.lead, title: (best.x.Title || '').trim(), url: best.x.URL, updated: best.x['Last updated'], checkedOn: today }; marked++; console.log('recall (' + best.match + ')', f, b.brand, b.name, '|', b.recall.title); }
        else delete b.recall;
      }
      fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
    }
    console.log('recall advisories attached:', marked);
  } catch (e) { console.log('NOTE: could not read the Health Canada recall list (' + String(e.message || e).slice(0, 80) + '); no recall data was changed.'); }
}
