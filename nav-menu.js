// On narrow screens (phones, tablets and small laptop windows) the nav's nine links plus the button and the language switch used to wrap onto
// three rows and take about a fifth of the screen, and they stayed there while the page scrolled. Here the links fold behind a
// "Menu" button and only the logo, the language switch and the button stay in the bar (about 56px). The menu opens as a panel over the page
// (it does not push content down), closes on a link, on Escape, on a tap outside, and when the screen grows again.
// One shared file so every page gets the same menu without pasting markup into each page.
(function () {
  'use strict';
  var mq = window.matchMedia ? window.matchMedia('(max-width: 1100px)') : { matches: false, addEventListener: function () {} };
  var T = function (s) { return window.I18N ? window.I18N.t(s) : s; };

  function init() {
    var nav = document.querySelector('nav');
    var wrap = nav && nav.querySelector('.wrap');
    var links = nav && nav.querySelector('.nav-links');
    if (!nav || !wrap || !links || nav.querySelector('.nav-toggle')) return;
    if (!links.id) links.id = 'navLinks';

    var tools = document.createElement('div');
    tools.className = 'nav-tools';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'nav-toggle';
    btn.setAttribute('aria-controls', links.id);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', T('Open menu'));
    btn.setAttribute('data-no-i18n', '');
    btn.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 5.5h14M3 10h14M3 14.5h14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg><span></span>';
    btn.lastChild.textContent = 'Menu';
    tools.appendChild(btn);
    wrap.insertBefore(tools, links);

    function setOpen(open) {
      nav.classList.toggle('nav-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', T(open ? 'Close menu' : 'Open menu'));
    }
    btn.addEventListener('click', function () { setOpen(!nav.classList.contains('nav-open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('nav-open')) { setOpen(false); btn.focus(); } });
    document.addEventListener('click', function (e) { if (nav.classList.contains('nav-open') && !nav.contains(e.target)) setOpen(false); });
    links.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a')) setOpen(false); });

    // the language switch lives in the bar when the menu is folded, and with the links on wide screens
    function place() {
      var sw = document.getElementById('langSwitch');
      if (sw) {
        if (mq.matches) { if (sw.parentNode !== tools) tools.insertBefore(sw, btn); }
        else if (sw.parentNode !== links) links.appendChild(sw);
      }
      if (!mq.matches) setOpen(false);
    }
    if (mq.addEventListener) mq.addEventListener('change', place); else if (mq.addListener) mq.addListener(place);
    place();
    // the switch is added by i18n.js, which may run after this file
    if (window.MutationObserver) new MutationObserver(place).observe(links, { childList: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
