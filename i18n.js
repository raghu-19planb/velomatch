// Language switch (English / French (Québec)) for every page.
//
// Every page loads this file, then i18n-fr-core.js (words shared by all pages) and its own
// i18n-fr-<page>.js. English is the default; French is only shown after a visitor picks it, and the choice
// is remembered in localStorage.
//
// How it works: the page is written in English. In French mode every piece of text, whether it is in the
// HTML or built later by the quiz and the results, is looked up in the French dictionaries and swapped:
//   1. a whole paragraph that mixes text and links/bold (looked up by its HTML), so that the French can
//      have its own word order,
//   2. a single text string, looked up exactly,
//   3. patterns, for sentences that carry numbers, names and dates.
// A string with no entry stays in English. That is deliberate: nothing is machine-translated on the fly,
// and an English fallback is more honest than a wrong guess. Add ?i18n-debug to a page's address while in
// French to list, in the console, every string that still has no French. See i18n-glossary.md.
(function () {
  const KEY = 'sv-lang';
  let lang = 'en';
  try { lang = localStorage.getItem(KEY) === 'fr' ? 'fr' : 'en'; } catch (e) { /* storage blocked: stay English */ }
  const I18N = window.I18N = { lang, exact: {}, patterns: [], missing: new Set(), keep: [], produced: new Set() };
  const debug = /[?&]i18n-debug/.test(location.search);
  const fr = () => I18N.lang === 'fr';

  const norm = s => s.replace(/\s+/g, ' ').trim();

  // text that is already one of our French strings (set by an earlier pass): not "missing"
  let frVals = null, frCount = -1;
  function isFrench(core) {
    const n = Object.keys(I18N.exact).length;
    if (!frVals || n !== frCount) { frVals = new Set(Object.values(I18N.exact).map(norm)); frCount = n; }
    if (frVals.has(core)) return true;
    // debug listing only: text that carries French accents or common French words is already French
    return /[éèêëàâçùûôîï’«»]/.test(core) || /\b(de|du|des|la|le|les|une|un|pour|votre|vos|que|qui|sur|avec|chercher|ouvrir|aucune|et|garde-boue|pneus|freins|cadre|roues|sans|vitesses|voir|vendu|chez|gamme|dès|par)\b/.test(core);
  }

  // The OQLF's rules for French punctuation in Québec (vitrinelinguistique.oqlf.gouv.qc.ca, "Espacement avant et
  // après les signes de ponctuation"): no space before ? ! ; but a non-breaking space before a colon and inside
  // « guillemets ». The dictionaries are written with plain spaces and fixed here, in one place.
  const NB = ' ';
  const fix = s => s.replace(/[ \t]+([?!;])/g, '$1').replace(/[ \t]+:/g, NB + ':').replace(/«[ \t]*/g, '«' + NB).replace(/[ \t]*»/g, NB + '»');
  I18N.fix = fix;

  function translate(str) {
    if (!fr()) return str;
    const lead = str.match(/^\s*/)[0], trail = str.match(/\s*$/)[0];
    const core = norm(str);
    if (!core) return str;
    if (I18N.exact[core] != null) return lead + fix(I18N.exact[core]) + trail;
    let out = core, hit = false;
    for (const [re, rep] of I18N.patterns) {
      re.lastIndex = 0;
      if (re.test(out)) { re.lastIndex = 0; out = out.replace(re, rep); hit = true; }
      re.lastIndex = 0;
    }
    if (hit) return lead + fix(out) + trail;
    if (debug && /[A-Za-z]{3}/.test(core) && !I18N.produced.has(core) && !isFrench(core) && !I18N.keep.some(k => k.test(core))) I18N.missing.add(core);
    return str;
  }
  I18N.translate = translate;
  // for strings built in script: I18N.t('Text with {n} things', {n: 3})
  I18N.t = function (s, vars) {
    let out = fr() && I18N.exact[s] != null ? fix(I18N.exact[s]) : s;
    if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    if (fr() && debug) I18N.produced.add(norm(out));
    return out;
  };
  // numbers and money the way a Québec reader writes them: 1 299,50 $
  I18N.num = (n, d) => new Intl.NumberFormat(fr() ? 'fr-CA' : 'en-CA', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: d == null ? 0 : d }).format(n);

  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TEXTAREA', 'CODE']);
  const INLINE = new Set(['A', 'B', 'STRONG', 'EM', 'I', 'SPAN', 'BR', 'ABBR', 'SUP', 'SUB', 'SMALL', 'KBD', 'MARK', 'U', 'CITE', 'Q', 'TIME']);
  const ATTRS = ['aria-label', 'alt', 'title', 'placeholder', 'content'];
  const done = new WeakSet();

  // a paragraph whose HTML has its own French entry: swap the whole thing (its links keep working because
  // the French entry carries the same <a href>; it is never used on elements that contain ids or handlers)
  function unit(el) {
    if (!el.children.length || el.querySelector('[id]')) return false;
    for (const c of el.children) if (!INLINE.has(c.nodeName)) return false;
    const key = norm(el.innerHTML);
    const t = I18N.exact[key];
    if (t == null) return false;
    el.innerHTML = fix(t);
    done.add(el);
    return true;
  }

  function walk(root) {
    if (!fr()) return;
    if (root.nodeType === 3) {
      const p = root.parentNode;
      if (p && !SKIP.has(p.nodeName) && !(p.closest && p.closest('[data-no-i18n]'))) { const v = translate(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; }
      return;
    }
    if (root.nodeType !== 1 || SKIP.has(root.nodeName) || done.has(root) || (root.hasAttribute && root.hasAttribute('data-no-i18n'))) return;
    if (root.nodeName === 'META') return;
    if (root.hasAttribute) ATTRS.forEach(a => { if (a !== 'content' && root.hasAttribute(a)) { const v = root.getAttribute(a), t = translate(v); if (t !== v) root.setAttribute(a, t); } });
    if (unit(root)) return;
    root.childNodes.forEach(walk);
  }
  I18N.walk = walk;

  function setLang(l) { try { localStorage.setItem(KEY, l); } catch (e) { /* ignore */ } location.reload(); }
  I18N.setLang = setLang;

  function addSwitch() {
    const links = document.querySelector('nav .nav-links');
    if (!links || document.getElementById('langSwitch')) return;
    const w = document.createElement('span');
    w.id = 'langSwitch';
    w.className = 'lang-switch';
    w.setAttribute('role', 'group');
    w.setAttribute('aria-label', fr() ? 'Langue' : 'Language');
    w.innerHTML = '<button type="button" data-l="en" lang="en" aria-label="English">EN</button><span aria-hidden="true">|</span><button type="button" data-l="fr" lang="fr" aria-label="Français">FR</button>';
    w.querySelectorAll('button').forEach(b => {
      const on = b.dataset.l === I18N.lang;
      if (on) { b.classList.add('on'); b.setAttribute('aria-pressed', 'true'); } else b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => { if (b.dataset.l !== I18N.lang) setLang(b.dataset.l); });
    });
    links.appendChild(w);
  }

  function metaFr() {
    ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]'].forEach(sel => {
      const m = document.querySelector(sel);
      if (!m) return;
      const v = m.getAttribute('content'), t = translate(v);
      if (t !== v) m.setAttribute('content', t);
    });
  }

  function start() {
    addSwitch();
    if (!fr()) return;
    document.documentElement.lang = 'fr-CA';
    walk(document.body);
    const dt = norm(document.title);
    if (I18N.exact[dt]) document.title = I18N.exact[dt]; else if (debug) I18N.missing.add('<title> ' + dt);
    metaFr();
    const obs = new MutationObserver(muts => muts.forEach(m => {
      m.addedNodes.forEach(n => walk(n));
      if (m.type === 'characterData') walk(m.target);
      if (m.type === 'attributes') walk(m.target);
    }));
    obs.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'title', 'alt', 'placeholder'] });
    if (debug) setTimeout(() => console.log('i18n: no French yet for:\n' + [...I18N.missing].join('\n')), 3000);
  }
  // the dictionary files are deferred scripts that run after this one but before DOMContentLoaded
  if (document.readyState === 'complete') start(); else document.addEventListener('DOMContentLoaded', start);
})();
