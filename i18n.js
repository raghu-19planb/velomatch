// Language switch (English / French) for pages that have a French version.
//
// A page opts in by loading this file and i18n-fr.js and setting window.SV_HAS_FRENCH = true. English is
// the default; French is only shown after a visitor picks it (it is remembered in localStorage).
//
// How it works: the page is written in English. In French mode every piece of text, whether it is in the
// HTML or built later by the quiz and results, is looked up in the French dictionary (i18n-fr.js) and
// swapped. Exact strings first, then patterns for sentences with numbers and names in them. A string with
// no entry stays in English, which is the honest fallback. Run the page with ?i18n-debug in the address to
// see, in the console, any text that still has no French entry.
(function () {
  const KEY = 'sv-lang';
  let lang = 'en';
  try { lang = localStorage.getItem(KEY) === 'fr' ? 'fr' : 'en'; } catch (e) { /* storage blocked: stay English */ }
  const I18N = window.I18N = { lang, exact: {}, patterns: [], missing: new Set() };
  const debug = /[?&]i18n-debug/.test(location.search);

  function translate(str) {
    if (I18N.lang !== 'fr') return str;
    const lead = str.match(/^\s*/)[0], trail = str.match(/\s*$/)[0];
    const core = str.trim().replace(/\s+/g, ' ');
    if (!core) return str;
    if (I18N.exact[core] != null) return lead + I18N.exact[core] + trail;
    let out = core, hit = false;
    for (const [re, rep] of I18N.patterns) {
      if (re.test(out)) { out = out.replace(re, rep); hit = true; re.lastIndex = 0; }
      re.lastIndex = 0;
    }
    if (hit) return lead + out + trail;
    if (debug && /[A-Za-z]{3}/.test(core)) I18N.missing.add(core);
    return str;
  }
  I18N.t = function (s, vars) {
    let out = I18N.lang === 'fr' && I18N.exact[s] != null ? I18N.exact[s] : s;
    if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return out;
  };

  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'TEXTAREA']);
  const ATTRS = ['aria-label', 'alt', 'title', 'placeholder'];
  function walk(root) {
    if (I18N.lang !== 'fr') return;
    if (root.nodeType === 3) { if (root.parentNode && !SKIP.has(root.parentNode.nodeName)) { const v = translate(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; } return; }
    if (root.nodeType !== 1 || SKIP.has(root.nodeName)) return;
    if (root.hasAttribute) ATTRS.forEach(a => { if (root.hasAttribute(a)) { const v = root.getAttribute(a), t = translate(v); if (t !== v) root.setAttribute(a, t); } });
    root.childNodes.forEach(walk);
  }

  function setLang(l) { try { localStorage.setItem(KEY, l); } catch (e) { /* ignore */ } location.reload(); }
  I18N.setLang = setLang;

  function addSwitch() {
    const links = document.querySelector('nav .nav-links');
    if (!links || document.getElementById('langSwitch')) return;
    const w = document.createElement('span');
    w.id = 'langSwitch';
    w.className = 'lang-switch';
    w.innerHTML = '<button type="button" data-l="en" aria-label="English">EN</button><span aria-hidden="true">|</span><button type="button" data-l="fr" aria-label="Français">FR</button>';
    w.querySelectorAll('button').forEach(b => { if (b.dataset.l === I18N.lang) b.classList.add('on'); b.addEventListener('click', () => { if (b.dataset.l !== I18N.lang) setLang(b.dataset.l); }); });
    links.appendChild(w);
  }

  function start() {
    if (window.SV_HAS_FRENCH) addSwitch();
    if (I18N.lang !== 'fr') return;
    document.documentElement.lang = 'fr-CA';
    walk(document.body);
    if (I18N.exact[document.title]) document.title = I18N.exact[document.title];
    const obs = new MutationObserver(muts => muts.forEach(m => {
      m.addedNodes.forEach(n => walk(n));
      if (m.type === 'characterData') walk(m.target);
    }));
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    if (debug) setTimeout(() => console.log('i18n: no French yet for:\n' + [...I18N.missing].join('\n')), 3000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
