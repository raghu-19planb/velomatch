// Shared "show your work" layer for every bike-matching quiz.
//
// Each category page keeps its own scoring and its own list of reasons. This file does what they all need,
// in one place, so every page tells the same honest story:
//   - what each bike costs, in which currency, and whether that price was seen on the seller's page
//   - whether we have confirmed a seller page and a Canadian listing (and says so when we have not)
//   - bikes that are discontinued or that cannot be bought in Canada are left out, and the shopper is told
//   - the answers behind the result, which can be changed one at a time; matches update as they change
//   - a side-by-side of the top three, and a link that restores the whole result
// Nothing here invents a price, a link or an availability: it only shows what the catalog records.
(function () {
  const SV = window.SV = { quiet: false, rate: null, rateDate: null, hasResults: false, lastItems: [] };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  SV.esc = esc;
  // French (Québec) when the visitor chose it: sentences go through i18n.js, numbers and money use Québec formats
  const FR = () => !!(window.I18N && window.I18N.lang === 'fr');
  const T = (s, v) => (window.I18N ? window.I18N.t(s, v) : (v ? s.replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m)) : s));
  SV.T = T;

  // ---- exchange rate: the Bank of Canada's published daily rate, used only to compare a US price to a CAD budget
  SV.fxReady = fetch('https://www.bankofcanada.ca/valet/observations/FXUSDCAD/json?recent=1')
    .then(r => r.json())
    .then(j => { const o = j.observations && j.observations[0]; if (o) { SV.rate = Number(o.FXUSDCAD.v); SV.rateDate = o.d; } })
    .catch(() => { /* no rate: budgets then compare the listed number as it is, and the page says so */ });

  const fmt = n => Number(n).toLocaleString(FR() ? 'fr-CA' : 'en-CA', { maximumFractionDigits: n % 1 ? 2 : 0 });
  // 899 $ US / 1 299 $ CA in French; US$899 / C$1,299 in English
  SV.money = (amount, cur) => FR()
    ? fmt(amount) + '\u00a0' + (cur === 'CAD' ? '$\u00a0CA' : cur === 'USD' ? '$\u00a0US' : (cur || ''))
    : (cur === 'CAD' ? 'C$' : cur === 'USD' ? 'US$' : (cur || '') + ' ') + fmt(amount);
  SV.cad = n => (FR() ? fmt(n) + '\u00a0$\u00a0CA' : 'C$' + fmt(n));

  // ---- what we know about a bike's price
  SV.catalogPrice = b => ({ amount: b.price, currency: b.currency || 'USD' });
  SV.sellerPrice = b => {
    const c = b.check;
    if (!c || c.status !== 'ok' || !(c.price > 0) || !c.currency) return null;
    const cat = b.price;
    // a seller page can show a "from" price for the whole range; only trust it as THIS bike's price if it is close to ours
    if (cat > 0 && Math.abs(c.price - cat) / cat > 0.35) return { amount: c.price, currency: c.currency, on: c.checkedOn, far: true };
    return { amount: c.price, currency: c.currency, on: c.checkedOn };
  };
  SV.bestPrice = b => { const s = SV.sellerPrice(b); return s && !s.far ? { ...s, source: 'seller' } : { ...SV.catalogPrice(b), source: 'catalog' }; };
  // price in CAD for budget comparison; null when it cannot be converted (then the listed number is used, as before)
  SV.priceCad = b => {
    const p = SV.bestPrice(b);
    if (p.currency === 'CAD') return p.amount;
    if (p.currency === 'USD' && SV.rate) return p.amount * SV.rate;
    return null;
  };
  SV.scoringPrice = b => { const c = SV.priceCad(b); return c == null ? b.price : c; };

  // ---- can this bike be recommended at all?
  SV.excludeReason = b => {
    if (b.discontinued) return 'discontinued';
    if (b.canada && b.canada.sold === false) return 'not-canada';
    if (b.check && b.check.status === 'dead') return 'dead-link';
    return null;
  };
  SV.split = list => {
    const keep = [], out = { discontinued: [], 'not-canada': [], 'dead-link': [] };
    list.forEach(b => { const r = SV.excludeReason(b); if (r) out[r].push(b); else keep.push(b); });
    return { keep, out };
  };

  // A small boost for bikes we can actually confirm: a seller page that shows this model, and a Canadian listing.
  // It breaks ties toward bikes you can really buy; it never outweighs fit, budget or what you asked for.
  SV.confidence = b => {
    const c = b.check || {};
    return (c.status === 'ok' ? 4 : c.status === 'blocked' ? 1 : 0) + (c.canada === 'confirmed' ? 3 : 0);
  };

  // ---- what we can say about trust, bike by bike
  SV.trust = b => {
    const c = b.check || {};
    const t = [];
    if (c.status === 'ok') t.push(['ok', T(c.checkedOn ? (c.price ? 'Seller page confirmed on {d}' : 'Seller page confirmed on {d}, but it shows no price we can read') : (c.price ? 'Seller page confirmed' : 'Seller page confirmed, but it shows no price we can read'), { d: c.checkedOn })]);
    else if (c.status === 'blocked') t.push(['info', T("This seller's site doesn't allow automatic checks, so open the page to confirm the model and price")]);
    else if (c.status === 'mismatch') t.push(['warn', T("The seller page didn't clearly show this model. Check that it is the right bike")]);
    else t.push(['warn', T('No seller page confirmed yet for this bike')]);
    t.push(c.canada === 'confirmed' ? ['ok', T('Canadian listing')] : ['info', T('Canadian availability not confirmed. Check before you buy')]);
    return t;
  };

  SV.priceHtml = b => {
    const p = SV.bestPrice(b);
    const main = SV.money(p.amount, p.currency);
    const conv = p.currency === 'USD' && SV.rate ? ` <span class="result-price-conv">≈ ${SV.cad(Math.round(p.amount * SV.rate))}</span>` : '';
    const src = p.source === 'seller' ? (p.on ? T("seen on the seller's page, {d}", { d: p.on }) : T("seen on the seller's page")) : T('catalog price, not re-checked');
    const s = SV.sellerPrice(b);
    const diff = s && s.far ? `<span class="result-price-note">${esc(T("The seller's page shows {p}, which may be a different trim. Confirm with the seller.", { p: SV.money(s.amount, s.currency) }))}</span>` : '';
    return `<span class="result-price">${main}${conv}</span><span class="result-price-src">${esc(src)}</span>${diff}`;
  };

  // ---- seller link with the site's affiliate handling (affiliate.js)
  SV.link = (b, kind) => {
    if (b.retailerUrl) {
      let url = b.retailerUrl, aff = false;
      if (typeof applyAffiliateTracking === 'function') { const r = applyAffiliateTracking(b.retailerUrl); url = r[0]; aff = r[1]; }
      let host = ''; try { host = new URL(b.retailerUrl).hostname.replace(/^www\./, ''); } catch (e) { /* ignore */ }
      const label = kind === 'photo' ? (host ? T('See photos at {h}', { h: host }) : T('See photos')) : (host ? T('Open seller page at {h}', { h: host }) : T('Open seller page'));
      return { href: url, label, rel: 'noopener' + (aff ? ' sponsored' : '') };
    }
    const name = b.name.toLowerCase().includes(b.brand.toLowerCase()) ? b.name : `${b.brand} ${b.name}`;
    const q = encodeURIComponent(name + ' bike buy Canada');
    return { href: 'https://www.google.ca/search?q=' + q, label: kind === 'photo' ? T('Search for photos of the {b}', { b: b.brand }) : T('No seller page confirmed. Search for sellers'), rel: 'noopener' };
  };
  SV.photo = b => {
    const l = SV.link(b, 'photo');
    return `<div class="result-placeholder-wrap"><svg class="sketch-icon result-placeholder" viewBox="0 0 64 64" aria-hidden="true"><circle cx="16" cy="42" r="12"/><circle cx="48" cy="42" r="12"/><path d="M16 42 L30 20 L40 20 M30 20 L22 42 M40 20 L48 42 M30 20 L34 14 L40 14"/></svg><a href="${esc(l.href)}" target="_blank" rel="${l.rel}" class="result-photo-link">${esc(l.label)} →</a></div>`;
  };

  // ---- answers: read from / written to the quiz itself, so a link can restore a whole result
  SV.serialize = rootSel => {
    const root = document.querySelector(rootSel);
    const opts = [...root.querySelectorAll('.opt.active')].map(o => [o.dataset.group, o.dataset.value]);
    const ranges = {};
    root.querySelectorAll('input[type=range]').forEach(r => { ranges[r.id] = r.value; });
    return { o: opts, r: ranges };
  };
  SV.shareUrl = rootSel => location.origin + location.pathname + '#m=' + encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(SV.serialize(rootSel))))));
  SV.restore = (rootSel, submitId) => {
    const m = location.hash.match(/^#m=(.+)$/);
    if (!m) return false;
    let data; try { data = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(m[1]))))); } catch (e) { return false; }
    const root = document.querySelector(rootSel);
    (data.o || []).forEach(([g, v]) => { const b = root.querySelector('.opt[data-group="' + g + '"][data-value="' + v + '"]'); if (b) b.click(); });
    Object.entries(data.r || {}).forEach(([id, v]) => { const r = document.getElementById(id); if (r) { r.value = v; r.dispatchEvent(new Event('input')); } });
    SV.quiet = true;
    setTimeout(() => { document.getElementById(submitId || 'submit').click(); SV.quiet = false; }, 50);
    return true;
  };

  // ---- the results block
  SV.render = function (o) {
    const results = o.results;
    const items = o.items;
    SV.lastItems = items;
    const desc = items.map(b => o.describe(b));
    const chips = (o.summary || []).filter(c => c && c.value).map(c => `<button type="button" class="ans-chip" data-goto="${esc(c.group)}" title="${esc(T('Change this answer'))}"><span class="ans-k">${esc(c.label)}</span> ${esc(c.value)}</button>`).join('');
    const ex = o.excluded || { discontinued: [], 'not-canada': [], 'dead-link': [] };
    const exLines = [];
    if (ex.discontinued.length) exLines.push(esc(T(ex.discontinued.length === 1 ? '1 no longer sold new ({names})' : '{n} no longer sold new ({names})', { n: ex.discontinued.length, names: ex.discontinued.map(b => b.name).join(', ') })));
    if (ex['not-canada'].length) exLines.push(esc(T(ex['not-canada'].length === 1 ? '1 that the seller says it cannot ship to Canada ({names})' : '{n} that the seller says it cannot ship to Canada ({names})', { n: ex['not-canada'].length, names: ex['not-canada'].map(b => b.name).join(', ') })));
    if (ex['dead-link'].length) exLines.push(esc(T(ex['dead-link'].length === 1 ? '1 whose seller page no longer loads' : '{n} whose seller page no longer loads', { n: ex['dead-link'].length })));
    const head = `
      <div class="result-head">
        <h3>${esc(T('Your top {n} matches', { n: items.length }))}</h3>
        ${chips ? `<div class="ans-chips" aria-label="${esc(T('Your answers. Select one to change it'))}"><span class="ans-lead">${esc(T('Based on:'))}</span> ${chips}</div>` : ''}
        <p class="result-live">${T('Change any answer and the matches update. The order is by how well each bike fits <em>your</em> answers.')}</p>
        <div class="result-actions">
          <button type="button" class="result-act" id="svCopy">${esc(T('Copy link to these results'))}</button>
          <a class="result-act" id="svMail" href="#">${esc(T('Email these matches'))}</a>
        </div>
        ${exLines.length ? `<p class="result-left-out"><b>${esc(T('Left out:'))}</b> ${exLines.join('; ')}.</p>` : ''}
      </div>`;
    const cards = items.map((b, i) => {
      const d = desc[i];
      const l = SV.link(b);
      const why = d.why && d.why.length ? `<ul class="result-why">${d.why.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '';
      const watch = d.watch && d.watch.length ? `<ul class="result-watch">${d.watch.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : '';
      const rc = b.recall;
      const recall = rc && rc.url ? `<p class="result-recall"><b>${esc(T('Recall notice:'))}</b> ${rc.match === 'exact'
        ? esc(T('Health Canada lists a recall that names this model ({t}). Check which model years and parts it covers before you buy.', { t: rc.title }))
        : esc(rc.line ? T('Health Canada lists a recall for other bikes in the {l} line ({t}). Check whether this one is included.', { l: rc.line.charAt(0).toUpperCase() + rc.line.slice(1), t: rc.title }) : T('Health Canada lists a recall for other bikes in the same line ({t}). Check whether this one is included.', { t: rc.title }))}
        <a href="${esc(rc.url)}" target="_blank" rel="noopener">${esc(T('Read the notice'))}</a></p>` : '';
      const trust = `<ul class="result-trust">${SV.trust(b).map(([k, t]) => `<li class="t-${k}">${esc(t)}</li>`).join('')}</ul>`;
      return `
        <div class="result-card ${i === 0 ? 'top' : ''}">
          ${i === 0 ? '<span class="badge">' + esc(T('Top pick')) + '</span>' : ''}
          <div class="result-media">${b.image ? `<img src="${esc(b.image)}" alt="${esc(b.name)}" loading="lazy">` : SV.photo(b)}</div>
          <div class="result-top"><span class="result-name">${esc(b.name)}</span><span class="result-pricebox">${SV.priceHtml(b)}</span></div>
          <p class="result-meta">${d.meta || ''}</p>
          ${why}${watch}
          ${d.budgetNote || ''}
          ${recall}
          ${trust}
          <a href="${esc(l.href)}" target="_blank" rel="${l.rel}" class="result-link">${esc(l.label)} →</a>
        </div>`;
    }).join('');
    // side by side: the top three
    let compare = '';
    const top = items.slice(0, 3);
    if (top.length >= 2 && o.compareRows) {
      const rows = o.compareRows;
      compare = `
        <div class="compare-wrap">
          <h3>${esc(T('Side by side: your top {n}', { n: top.length }))}</h3>
          <div class="compare-scroll"><table class="compare-table">
            <thead><tr><th scope="col"></th>${top.map(b => `<th scope="col">${esc(b.name)}</th>`).join('')}</tr></thead>
            <tbody>
              <tr><th scope="row">${esc(T('Price'))}</th>${top.map(b => `<td>${(() => { const p = SV.bestPrice(b); return esc(SV.money(p.amount, p.currency)) + (p.source === 'seller' ? '' : ' <span class="cmp-sub">' + esc(T('catalog')) + '</span>'); })()}</td>`).join('')}</tr>
              ${rows.map(([label, fn]) => `<tr><th scope="row">${esc(label)}</th>${top.map(b => `<td>${esc(fn(b) == null || fn(b) === '' ? T('not listed') : fn(b))}</td>`).join('')}</tr>`).join('')}
            </tbody></table></div>
        </div>`;
    }
    const fxNote = SV.rate ? ' ' + esc(T("US prices are converted at the Bank of Canada's rate for {d} (1 US$ = C${r}) only to compare against your budget.", { d: SV.rateDate, r: FR() ? SV.rate.toFixed(4).replace('.', ',') : SV.rate.toFixed(4) })) : ' ' + esc(T('The exchange rate could not be loaded, so your budget was compared to each listed number as it is.'));
    const foot = `<p class="result-footnote">${esc(T('Prices are in the currency the brand or retailer lists, before tax.'))}${fxNote} ${esc(T("Bikes whose seller page we have confirmed get a small ranking boost, because we know you can really buy them. “Catalog price” means we have not re-checked it on the seller's page."))}${o.note ? ' ' + esc(o.note) : ''} ${esc(T('Specifications come from our catalog and can be out of date. Always confirm size, price, specifications and stock with the seller before you buy.'))}</p>`;
    results.innerHTML = head + cards + compare + foot;

    results.querySelectorAll('.result-media').forEach((el, i) => {
      const img = el.querySelector('img');
      if (!img) return;
      img.addEventListener('error', () => { el.innerHTML = SV.photo(items[i]); }, { once: true });
    });
    // actions
    const url = SV.shareUrl(o.root);
    const copy = results.querySelector('#svCopy');
    if (copy) copy.addEventListener('click', () => { (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => { copy.textContent = T('Link copied'); }, () => { prompt(T('Copy this link'), url); }); });
    const mail = results.querySelector('#svMail');
    if (mail) {
      const body = items.map((b, i) => (i + 1) + '. ' + b.name + ' (' + SV.money(SV.bestPrice(b).amount, SV.bestPrice(b).currency) + ')' + (b.retailerUrl ? '\n   ' + b.retailerUrl : '')).join('\n') + '\n\n' + T('See the full result and why each was picked:') + '\n' + url;
      mail.href = 'mailto:?subject=' + encodeURIComponent(T('My bike matches from SelectVelo')) + '&body=' + encodeURIComponent(body);
    }
    // change an answer from its chip
    results.querySelectorAll('.ans-chip').forEach(ch => ch.addEventListener('click', () => { if (window.svQuizGoTo) window.svQuizGoTo(ch.dataset.goto); }));

    document.getElementById('placeholder').style.display = 'none';
    results.style.display = 'grid';
    SV.hasResults = true;
    if (!SV.quiet) { results.scrollIntoView({ behavior: 'smooth', block: 'start' }); results.focus(); }
  };

  // ---- once there is a result, a changed answer refreshes it (debounced) without jumping the page
  SV.watch = (rootSel, submitId) => {
    const root = document.querySelector(rootSel);
    let timer = null;
    const refresh = () => {
      if (!SV.hasResults) return;
      clearTimeout(timer);
      timer = setTimeout(() => { SV.quiet = true; document.getElementById(submitId || 'submit').click(); SV.quiet = false; }, 350);
    };
    root.addEventListener('click', e => { if (e.target.classList && e.target.classList.contains('opt')) refresh(); });
    root.addEventListener('input', e => { if (e.target.type === 'range') refresh(); });
  };
})();
