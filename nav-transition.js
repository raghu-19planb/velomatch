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
      // .transition-panel carries `transition:width 2.4s` UNCONDITIONALLY,
      // so removing .page-reveal doesn't snap its width back to 0 — it
      // starts its OWN 2.4s transition from 100% down toward 0%. Adding
      // .active right after (even after a forced reflow) just retargets
      // that in-flight transition back to 100%, which is where it already
      // practically still was — so the width never visibly moves and the
      // panel (with the rider pinned to its edge) just appears fully
      // across instantly. A plain reflow only commits the CURRENT
      // (still ~100%) value, not the eventual 0% target, so it doesn't fix
      // this. The panel's own transition has to be turned off, the width
      // forced to a real, committed 0, and the transition turned back on
      // — only then does adding .active have an actual 0→100% change to
      // animate.
      var panel = curtain.querySelector('.transition-panel');
      curtain.classList.remove('page-reveal');
      panel.style.transition = 'none';
      void panel.offsetWidth;
      panel.style.transition = '';
      void panel.offsetWidth;
      curtain.classList.add('active');
      setTimeout(function () { window.location.href = href; }, 900);
    });
  });
});
