// Re-checks every bike on the "New bikes" showcase and reports what broke.
// No dependencies; needs Node 18+.
//
//   node scripts/verify-showcase.mjs            check only, exit 1 if anything is wrong
//   node scripts/verify-showcase.mjs --stamp    also write today's date into verifiedOn
//                                               for entries that pass
//   node scripts/verify-showcase.mjs --json     machine-readable report on stdout
//
// What "wrong" means (each one is something a visitor would notice):
//   - the product page no longer loads (404, 5xx, timeout)
//   - the page now carries recall wording right next to the bike's own model name
//   - the photo no longer loads, or is now under 1000px wide
// This script can confirm a link still works and a photo is still sharp. It cannot
// decide whether a bike is *new* or find new bikes: that needs a person or an agent
// reading the brand's site (see scripts/README.md).
import fs from 'node:fs';
import { imageInfo, localImageInfo } from './lib/imginfo.mjs';

const FILE = process.env.SHOWCASE_FILE || 'data/showcase.json';
const MIN_WIDTH = 1000;
const args = new Set(process.argv.slice(2));
const UA = 'Mozilla/5.0 (compatible; SelectVeloShowcaseCheck/1.0; +https://raghu-19planb.github.io/velomatch/)';
const today = new Date().toISOString().slice(0, 10);

// Recall wording only counts when it appears close to the bike's own model name.
// Most brand sites carry a site-wide "Safety Recall Notices" link in the footer, so
// a plain keyword search flags every page (we found this the hard way).
const RECALL = /(safety|product|voluntary)\s+recall|stop[- ]ride|do not ride/i;
const GENERIC = new Set(['pro', 'comp', 'expert', 'sport', 'evo', 'advanced', 'carbon', 'alloy', 'kids', 'trail', 'the', 'new', 'sl', 'axs', 'xplr', 'works', 's-works']);
function modelToken(b) {
  // the most distinctive word of the model name, e.g. "Tarmac" for "Tarmac SL9 Comp – SRAM Rival AXS"
  const words = b.name.split(/[\s–—-]+/).filter(w => /^[A-Za-z]{4,}$/.test(w) && !GENERIC.has(w.toLowerCase()));
  return words[0] || b.name.split(/\s+/)[0];
}
function recallNearModel(html, b) {
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const token = modelToken(b).toLowerCase();
  const re = new RegExp(RECALL.source, 'gi');
  let m;
  while ((m = re.exec(text))) {
    const around = text.slice(Math.max(0, m.index - 300), m.index + 300).toLowerCase();
    if (around.includes(token)) return text.slice(Math.max(0, m.index - 80), m.index + 120);
  }
  return null;
}

async function checkPage(b) {
  try {
    const r = await fetch(b.productUrl, { redirect: 'follow', headers: { 'User-Agent': UA, Accept: 'text/html' }, signal: AbortSignal.timeout(30000) });
    if (r.status === 403 || r.status === 429) return { ok: true, unverified: `product page blocked this network (HTTP ${r.status})` };
    if (!r.ok) return { ok: false, why: `product page HTTP ${r.status}` };
    const html = (await r.text()).slice(0, 900000);
    const hit = recallNearModel(html, b);
    if (hit) return { ok: false, why: `recall wording next to "${modelToken(b)}": “…${hit.trim()}…” — confirm before keeping this bike` };
    return { ok: true };
  } catch (e) {
    return { ok: false, why: 'product page: ' + (e.name === 'TimeoutError' ? 'timed out' : String(e.message || e)) };
  }
}

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const results = [];
// Photos are normally linked from the brand's site; a few are files already hosted in this repo.
const photoInfo = b => /^https?:/.test(b.image.url) ? imageInfo(b.image.url) : Promise.resolve(localImageInfo(b.image.url));
// Check several bikes at once (about 130 bikes), but print and record in list order.
async function checkOne(b) {
  const [p, im] = await Promise.all([checkPage(b), photoInfo(b)]);
  const problems = [];
  const unverified = []; // blocked from this network: not proof that anything is broken
  if (p.unverified) unverified.push(p.unverified);
  if (!p.ok) problems.push(p.why);
  if (!im.ok && /^HTTP (403|429)/.test(im.error || '')) unverified.push('photo blocked this network (' + im.error + ')');
  else if (!im.ok) problems.push('photo: ' + im.error);
  else if (im.width < MIN_WIDTH) problems.push(`photo is now only ${im.width}px wide`);
  return { id: b.id, label: `${b.brand} ${b.name}`, ok: problems.length === 0, problems, unverified, width: im.width };
}
{
  const out = new Array(data.bikes.length); let next = 0;
  await Promise.all(Array.from({ length: 6 }, async () => { while (next < data.bikes.length) { const k = next++; out[k] = await checkOne(data.bikes[k]); } }));
  for (const r of out) {
    results.push(r);
    if (!args.has('--json')) console.log((r.problems.length ? 'FAIL ' : r.unverified.length ? '??   ' : 'ok   ') + r.label.padEnd(52) + (r.problems.length ? ' ' + r.problems.join('; ') : r.unverified.length ? ' ' + r.unverified.join('; ') : ` ${r.width}px`));
  }
}

if (args.has('--stamp')) {
  const passed = new Set(results.filter(r => r.ok && !r.unverified.length).map(r => r.id)); // only stamp what was truly checked
  for (const b of data.bikes) if (passed.has(b.id)) b.verifiedOn = today;
  data._meta.updated = today;
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');
}

// Advisory only: Health Canada's published recall list (open data). A match is a prompt for a
// person to read the recall and decide, NOT an automatic failure, because it often concerns an
// older generation (e.g. a 2021 Tarmac SL7 recall says nothing about the SL9). It also lags: the
// 2027 Norco Fluid recall was on Norco's site but not in this list when we checked.
const HC_URL = 'https://recalls-rappels.canada.ca/sites/default/files/opendata-donneesouvertes/HCRSAMOpenData.json';
const advisories = [];
let hcNote = '';
try {
  const hc = await (await fetch(HC_URL, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(120000) })).json();
  for (const b of data.bikes) {
    const tok = modelToken(b).toLowerCase();
    const brand = b.brand.toLowerCase().split(' ')[0];
    for (const x of hc) {
      const t = `${x.Title} ${x.Product}`.toLowerCase();
      if (t.includes(brand) && t.includes(tok) && /bicycle|bike|cycle/.test(t)) {
        advisories.push({ id: b.id, label: `${b.brand} ${b.name}`, recall: (x.Title || '').trim(), updated: x['Last updated'], url: x.URL });
      }
    }
  }
} catch (e) { hcNote = 'Could not reach the Health Canada recall list (' + String(e.message || e) + '); recall check relied on product pages only.'; }

const bad = results.filter(r => !r.ok);
if (args.has('--json')) console.log(JSON.stringify({ checkedOn: today, total: results.length, failing: bad, recallAdvisories: advisories, note: hcNote || undefined }, null, 2));
else {
  const unv = results.filter(r => r.ok && r.unverified.length);
  console.log(`\n${results.length - bad.length - unv.length}/${results.length} bikes verified${bad.length ? `, ${bad.length} need attention` : ''}${unv.length ? `, ${unv.length} could not be checked from this network (blocked, not necessarily broken)` : ''}`);
  if (hcNote) console.log('NOTE ' + hcNote);
  if (advisories.length) {
    console.log(`\nHealth Canada recalls that mention a featured model (read each; they may be about an older generation):`);
    for (const a of advisories) console.log(`  ? ${a.label}\n    ${a.updated}  ${a.recall}\n    ${a.url}`);
  }
}
process.exitCode = bad.length ? 1 : 0;
