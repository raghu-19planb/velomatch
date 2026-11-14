// A small "New" bubble on the "Showcase" word in the nav, so visitors notice the new-bikes page. The bubble is drawn by
// CSS as part of the nav link's own line (see .has-new-flag in style.css), so it is inside the header at every screen width
// and can never cover the page or another nav item: no cord, no flag hanging below the nav. This script only marks the
// link and chooses the word ("New" or "Nouveau"), so every page gets the same bubble without pasting markup into each file.
// It does not appear on the Showcase page itself.
(function () {
  if (/showcase\.html$/i.test(location.pathname)) return;

  function init() {
    var link = document.querySelector('nav .nav-link[href="showcase.html"]');
    if (!link || link.classList.contains('has-new-flag')) return;
    var fr = !!(window.I18N && window.I18N.lang === 'fr');
    link.classList.add('has-new-flag');
    link.setAttribute('data-new', fr ? 'Nouveau' : 'New');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
