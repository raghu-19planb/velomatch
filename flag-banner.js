// A small flag that hangs from the "Showcase" tab in the nav and ripples in the wind:
// "Check out new bikes", linking to the Showcase's New-only view. One script so every page
// gets the same flag without pasting markup into each file.
//
// Behaviour: it follows the tab (re-positioned on resize), eases away once the reader
// scrolls down so it never covers what they are reading, doesn't appear on the Showcase
// page itself, and stays still (no ripple, no sway) for anyone who prefers reduced motion.
(function () {
  if (/showcase\.html$/i.test(location.pathname)) return;

  function init() {
    var link = document.querySelector('nav .nav-link[href="showcase.html"]');
    var nav = link && link.closest('nav');
    if (!link || !nav || document.querySelector('.flag-banner')) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ripple = reduce ? '' :
      '<animate attributeName="baseFrequency" dur="5s" repeatCount="indefinite" ' +
      'values="0.018 0.05;0.03 0.034;0.018 0.05"/>';

    var rope = document.createElement('span');
    rope.className = 'flag-rope';
    rope.setAttribute('aria-hidden', 'true');

    var a = document.createElement('a');
    a.className = 'flag-banner' + (reduce ? ' is-still' : '');
    a.href = 'showcase.html#new';
    a.setAttribute('aria-label', 'Check out new bikes, in the Showcase');
    a.innerHTML =
      '<svg viewBox="-6 -4 162 76" aria-hidden="true" focusable="false">' +
        '<defs>' +
          '<filter id="flagRipple" x="-8%" y="-8%" width="116%" height="116%">' +
            '<feTurbulence type="fractalNoise" baseFrequency="0.018 0.05" numOctaves="1" seed="4" result="n">' + ripple + '</feTurbulence>' +
            '<feDisplacementMap in="SourceGraphic" in2="n" scale="' + (reduce ? 0 : 7) + '" xChannelSelector="R" yChannelSelector="G"/>' +
          '</filter>' +
          '<linearGradient id="flagFolds" x1="0" x2="1" y1="0" y2="0">' +
            '<stop offset="0" stop-color="#fff" stop-opacity="0.14"/><stop offset="0.18" stop-color="#000" stop-opacity="0.10"/>' +
            '<stop offset="0.38" stop-color="#fff" stop-opacity="0.12"/><stop offset="0.58" stop-color="#000" stop-opacity="0.10"/>' +
            '<stop offset="0.80" stop-color="#fff" stop-opacity="0.12"/><stop offset="1" stop-color="#000" stop-opacity="0.12"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<g filter="url(#flagRipple)">' +
          '<path class="flag-cloth" d="M8 4H142V64L75 53L8 64Z"/>' +
          '<path d="M8 4H142V64L75 53L8 64Z" fill="url(#flagFolds)"/>' +
          '<text x="75" y="27" text-anchor="middle" class="flag-text">Check out</text>' +
          '<text x="75" y="45" text-anchor="middle" class="flag-text">new bikes</text>' +
        '</g>' +
        '<rect class="flag-rod" x="2" y="-1" width="146" height="5" rx="2.5"/>' +
        '<circle class="flag-rod" cx="2.5" cy="1.5" r="4"/><circle class="flag-rod" cx="147.5" cy="1.5" r="4"/>' +
      '</svg>';

    nav.appendChild(rope);
    nav.appendChild(a);

    // Clicking the flag does exactly what clicking the Showcase tab does, so it gets the same
    // pedalling-rider page transition as every other nav link, but it opens the New-only view.
    // Clicks that mean "open in a new tab" (ctrl/cmd/shift, middle button) are left to the browser.
    function goToShowcase(e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      link.setAttribute('href', 'showcase.html#new');
      link.click(); // nav-transition.js plays the curtain, then navigates; without it, the browser just follows the link
    }
    a.addEventListener('click', goToShowcase);
    rope.addEventListener('click', goToShowcase);

    // Hang the flag under the tab, and run a cord from the tab down to the flag's rod.
    function place() {
      var l = link.getBoundingClientRect(), n = nav.getBoundingClientRect();
      var w = a.offsetWidth;
      var center = l.left + l.width / 2 - n.left;
      var left = Math.max(8, Math.min(center - w / 2, n.width - w - 8));
      a.style.left = left + 'px';
      var ropeTop = l.bottom - n.top - 2;
      rope.style.left = center + 'px';
      rope.style.top = ropeTop + 'px';
      rope.style.height = Math.max(0, n.height - ropeTop) + 'px';
    }
    place();
    window.addEventListener('resize', place);
    window.addEventListener('load', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);

    // ease away once the reader has scrolled; come back at the top
    function onScroll() {
      var away = (window.scrollY || document.documentElement.scrollTop) > 140;
      a.classList.toggle('is-away', away);
      rope.classList.toggle('is-away', away);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
