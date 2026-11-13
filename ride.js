// Home-page intro ("the wheel becomes the o").
//
// A painted valley, in three depth layers, that you ride through by scrolling. Five painted stops
// along the way are the five ways into the site (kids, commuting, mountain, bikepacking, racing); at
// the end the big wheel flies up to the nav and lands as the "o" of the logo, then the page carries on
// to the chooser. The ride only runs for a first visit in a session, and never with reduced motion:
// otherwise the page shows a calm still painting and the chooser straight away (see art/ride.css).
(function () {
  var ride = document.getElementById('ride');
  if (!ride) return;
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var seen = false;
  try { seen = sessionStorage.getItem('sv-ride') === '1'; } catch (e) {}
  if (reduce || seen) return;                       // the still painting is already what the CSS shows

  root.classList.add('ride-live');
  var stage = document.getElementById('rideStage');
  var world = document.getElementById('rideWorld');
  var hero = document.getElementById('rideHero');
  var grade = document.getElementById('rideGrade');
  var wheel = document.getElementById('rideWheel');
  var skip = document.getElementById('rideSkip');
  var layers = [].slice.call(ride.querySelectorAll('.ride-layer'));
  var cards = [].slice.call(ride.querySelectorAll('.ride-card'));
  var wheelSvg = wheel.querySelector('svg');
  var START = 0.10, END = 0.80;                      // the five stops live between these scroll positions
  var imgW = 0, landed = false, ticking = false;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function navEl() { return document.querySelector('nav'); }
  function navWheel() { return document.querySelector('nav .wordmark .wheel-o'); }

  // dawn -> golden hour -> dusk, as a tint over the painting
  var STOPS = [[0, 255, 176, 150, 0.20], [0.4, 255, 170, 70, 0.18], [0.8, 92, 84, 150, 0.30], [1, 92, 84, 150, 0.30]];
  function tint(p) {
    for (var i = 1; i < STOPS.length; i++) {
      if (p <= STOPS[i][0]) {
        var a = STOPS[i - 1], b = STOPS[i], t = (p - a[0]) / (b[0] - a[0]);
        return 'rgba(' + Math.round(lerp(a[1], b[1], t)) + ',' + Math.round(lerp(a[2], b[2], t)) + ',' + Math.round(lerp(a[3], b[3], t)) + ',' + lerp(a[4], b[4], t).toFixed(3) + ')';
      }
    }
    return 'rgba(92,84,150,0.30)';
  }

  function measure() {
    var im = layers[0].querySelector('img');
    imgW = im.offsetWidth || (stage.clientHeight * 3);
  }

  function frame() {
    ticking = false;
    var nav = navEl();
    var nh = nav ? nav.offsetHeight : 64;
    root.style.setProperty('--nav-h', nh + 'px');
    var r = ride.getBoundingClientRect();
    var total = ride.offsetHeight - stage.offsetHeight;
    var p = clamp((nh - r.top) / total, 0, 1);

    // parallax: nearer layers travel further, so the bike slides past and the mountains barely move
    var travel = Math.max(0, imgW - stage.clientWidth);
    var tp = clamp(p / END, 0, 1);
    layers.forEach(function (l) { l.style.transform = 'translate3d(' + (-travel * parseFloat(l.dataset.depth) * tp).toFixed(1) + 'px,0,0)'; });

    // the title steps aside
    var ho = 1 - clamp((p - 0.02) / 0.07, 0, 1);
    hero.style.opacity = ho.toFixed(3);
    hero.style.transform = 'translateY(' + (-26 * (1 - ho)).toFixed(1) + 'px)';

    // five stops, one at a time
    var span = (END - START) / cards.length, fade = span * 0.30;
    cards.forEach(function (c, i) {
      // each stop fades in as the last one fades out, so the two cross-dissolve instead of leaving a gap
      var a = START + i * span - fade / 2, b = START + (i + 1) * span + fade / 2;
      var o = clamp((p - a) / fade, 0, 1) * clamp((b - p) / fade, 0, 1);
      c.style.opacity = o.toFixed(3);
      c.style.transform = 'translate(-50%,' + (30 * (1 - o)).toFixed(1) + 'px)';
      c.classList.toggle('is-on', o > 0.5);
    });

    grade.style.backgroundColor = tint(p);
    world.style.opacity = (1 - clamp((p - 0.80) / 0.12, 0, 1)).toFixed(3);

    // the wheel: appears at the centre, flies up to the logo, and lands as its "o"
    var t = ease(clamp((p - 0.82) / 0.165, 0, 1));
    var tw = navWheel();
    if (t > 0 && t < 1 && tw) {
      var sr = stage.getBoundingClientRect(), tr = tw.getBoundingClientRect();
      var S0 = Math.min(sr.height * 0.55, 340);
      var cx = lerp(sr.left + sr.width / 2, tr.left + tr.width / 2, t);
      var cy = lerp(sr.top + sr.height / 2, tr.top + tr.height / 2, t);
      var s = lerp(S0, tr.width, t);
      wheel.style.width = S0 + 'px';
      wheel.style.height = S0 + 'px';
      wheel.style.transform = 'translate(' + (cx - s / 2).toFixed(1) + 'px,' + (cy - s / 2).toFixed(1) + 'px) scale(' + (s / S0).toFixed(4) + ')';
      wheel.style.opacity = clamp(t * 6, 0, 1).toFixed(3);
      wheelSvg.style.transform = 'rotate(' + (p * 1440).toFixed(1) + 'deg)';
    } else {
      wheel.style.opacity = '0';
    }
    if (t >= 1 && !landed && tw) {
      landed = true;
      tw.classList.add('is-landed');
      try { sessionStorage.setItem('sv-ride', '1'); } catch (e) {}
      setTimeout(function () { tw.classList.remove('is-landed'); }, 900);
    }
    if (p < 0.9) landed = false;
  }

  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }

  skip.addEventListener('click', function () {
    try { sessionStorage.setItem('sv-ride', '1'); } catch (e) {}
    var nav = navEl();
    var target = document.getElementById('chooser');
    var top = target.getBoundingClientRect().top + (window.scrollY || document.documentElement.scrollTop) - (nav ? nav.offsetHeight : 64);
    window.scrollTo({ top: top, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); onScroll(); });
  layers.forEach(function (l) { var im = l.querySelector('img'); if (im.complete) measure(); else im.addEventListener('load', function () { measure(); onScroll(); }); });
  measure();
  frame();
})();
