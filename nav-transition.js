// Plays the pedaling-rider curtain (.page-transition) before following any
// nav link, so every page-to-page hop in the top nav gets the same crossing
// animation, not just the homepage's quiz-start cards. Duplicated nowhere —
// one shared file, included on every page.
document.addEventListener('DOMContentLoaded', function () {
  var curtain = document.querySelector('.page-transition');
  if (!curtain) return;

  document.querySelectorAll('nav a.nav-link, nav a.nav-cta, nav a.logo').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (link.classList.contains('current')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#') return; // same-page anchor (e.g. "#quiz") — no page change, no curtain
      e.preventDefault();
      // The arrival fade (.page-reveal) holds its end state via animation
      // fill-mode, which otherwise outranks the plain .active rule below
      // and leaves the curtain stuck invisible. Drop it first so .active
      // takes effect cleanly, exactly like the homepage's original
      // quiz-start transition (which never had .page-reveal to begin with).
      curtain.classList.remove('page-reveal');
      curtain.classList.add('active');
      setTimeout(function () { window.location.href = href; }, 2400);
    });
  });
});
