// Adds a small "i" info icon next to quiz questions marked data-info="frame" or
// data-info="groupset", explaining the options in plain language for someone who
// has never heard of Shimano/SRAM or never thought about frame materials. One
// shared file so the wording stays identical across quizzes; each page only
// shows the options it actually offers (e.g. Campagnolo only on the racing quiz).
// Purely presentational: it never touches quiz state or scoring.
(function () {
  var COPY = {
    frame: {
      title: 'Which frame material?',
      intro: 'The frame is the heart of the bike. Its material sets how much the bike weighs, how it feels over bumps, how long it lasts, and a big part of the price.',
      order: ['aluminum', 'carbon', 'steel', 'titanium'],
      items: {
        aluminum: {
          name: 'Aluminum',
          good: 'Light, stiff and affordable — the best value for most riders. It doesn’t rust.',
          watch: 'Can feel a little harsher over rough roads than carbon or steel.'
        },
        carbon: {
          name: 'Carbon',
          good: 'The lightest option. It soaks up road buzz yet stays stiff where you pedal — the choice for racing and speed.',
          watch: 'Costs the most, and a hard knock can crack it. Repairs need a specialist.'
        },
        steel: {
          name: 'Steel',
          good: 'Tough, smooth and springy, and almost any shop or welder can repair it. A favourite for touring and bikepacking.',
          watch: 'Heavier, and it can rust if scratches are left untreated.'
        },
        titanium: {
          name: 'Titanium',
          good: 'Rust-proof and built to last for decades, with a smooth ride and less weight than steel.',
          watch: 'Very expensive — a “buy it once” bike.'
        }
      },
      outro: 'Rule of thumb: aluminum for value, carbon for speed, steel for toughness on long trips. Not sure? Pick “No preference” — material is just one of many things we weigh.'
    },
    groupset: {
      title: 'What’s a groupset?',
      intro: 'The groupset is the bike’s gear system: the shifters, the derailleurs that move the chain between gears, the cranks and the chain. A couple of companies make nearly all of them, and they all work well — it mostly comes down to feel and what’s already on the bike you like.',
      order: ['shimano', 'sram', 'campagnolo', 'low_maintenance'],
      items: {
        shimano: {
          name: 'Shimano',
          good: 'The most common groupset in the world — on everything from commuters to Tour de France bikes. Parts and mechanics who know them are everywhere, so repairs are easy and cheap.',
          watch: 'Ranges from entry level (Tourney, Altus, CUES) up to premium (105, Ultegra, XT, XTR). Its electronic shifting is called Di2.'
        },
        sram: {
          name: 'SRAM',
          good: 'The big American alternative, popular on mountain, gravel and performance road bikes. Known for clean, simple single-chainring (“1x”) setups, like Eagle on mountain bikes.',
          watch: 'Ranges from entry level (SX, Apex) up to premium (GX, Force, XX, Red). Its electronic shifting is called AXS.'
        },
        campagnolo: {
          name: 'Campagnolo',
          good: 'Italian road-racing royalty, loved for its feel and heritage and found on premium road bikes.',
          watch: 'Pricier, and fewer shops stock the parts.'
        },
        low_maintenance: {
          name: 'Low-maintenance (belt / internal hub)',
          good: 'The gears sit sealed inside the rear hub, often with a belt instead of a chain. Almost no tuning, and it shrugs off rain and road salt — great for daily commuting.',
          watch: 'Fewer gears, and usually a higher price.'
        }
      },
      outro: 'At the same level, neither brand is “better”. Within a brand, the higher up the range you go, the lighter, smoother and pricier the parts. No favourite? Pick “No preference”.'
    }
  };

  var uid = 0;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildCard(key, offered) {
    var c = COPY[key];
    var rows = c.order.filter(function (k) { return offered.indexOf(k) !== -1; }).map(function (k) {
      var it = c.items[k];
      return '<div class="info-item"><dt>' + esc(it.name) + '</dt><dd>' +
        '<span class="info-line"><span class="info-tag info-tag-good">Good for</span>' + esc(it.good) + '</span>' +
        '<span class="info-line"><span class="info-tag info-tag-watch">Keep in mind</span>' + esc(it.watch) + '</span>' +
        '</dd></div>';
    }).join('');
    // The close button sits outside the scrolling card so it stays put while the
    // card scrolls; on a phone the card covers most of the screen, so an obvious
    // close control matters more than tapping elsewhere. tabindex lets keyboard
    // users focus the card and scroll it with the arrow keys.
    return '<div class="info-card-wrap">' +
      '<button type="button" class="info-close" aria-label="Close explanation">✕</button>' +
      '<div class="info-card" tabindex="0" role="region" aria-label="' + esc(c.title) + '">' +
      '<p class="info-title">' + esc(c.title) + '</p>' +
      '<p class="info-intro">' + esc(c.intro) + '</p>' +
      '<dl class="info-list">' + rows + '</dl>' +
      '<p class="info-outro">' + esc(c.outro) + '</p>' +
      '</div></div>';
  }

  function optionsOffered(label, key) {
    var group = label.closest('.q-group') || document;
    var btns = group.querySelectorAll('.opt[data-group="' + key + '"]');
    return Array.prototype.map.call(btns, function (b) { return b.dataset.value; });
  }

  function init() {
    var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    var tips = [];

    document.querySelectorAll('.q-label[data-info]').forEach(function (label) {
      var key = label.getAttribute('data-info');
      if (!COPY[key]) return;
      var offered = optionsOffered(label, key);
      var id = 'info-pop-' + (++uid);

      // The icon sits beside the label, not inside it: a <button> inside a
      // <label> would make clicking the label text trigger the button.
      var row = document.createElement('div');
      row.className = 'q-label-row';
      label.parentNode.insertBefore(row, label);
      row.appendChild(label);

      var tip = document.createElement('span');
      tip.className = 'info-tip';
      tip.innerHTML =
        '<button type="button" class="info-btn" aria-expanded="false" aria-controls="' + id + '" aria-label="' +
          esc(COPY[key].title) + ' — show explanation">i</button>' +
        '<span class="info-pop" id="' + id + '" role="note">' + buildCard(key, offered) + '</span>';
      row.appendChild(tip);

      var btn = tip.querySelector('.info-btn');
      var state = { tip: tip, btn: btn, pinned: false };
      tips.push(state);

      var card = tip.querySelector('.info-card');
      // Open downward by default; flip upward (and cap the height) when the
      // question sits near the bottom of the screen, so the card is never
      // pushed off-screen. The sticky nav at the top counts as unavailable space.
      function place() {
        var nav = document.querySelector('nav');
        var navBottom = nav ? Math.max(nav.getBoundingClientRect().bottom, 0) : 0;
        var r = row.getBoundingClientRect();
        var below = window.innerHeight - r.bottom - 24;
        var above = r.top - navBottom - 16;
        var up = below < 320 && above > below;
        tip.classList.toggle('up', up);
        card.style.maxHeight = Math.max(160, Math.min(480, up ? above : below)) + 'px';
      }
      function setOpen(open) {
        if (open) place();
        tip.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      state.close = function () { state.pinned = false; setOpen(false); };

      if (canHover) {
        tip.addEventListener('mouseenter', function () { setOpen(true); });
        tip.addEventListener('mouseleave', function () { if (!state.pinned) setOpen(false); });
      }
      // Focus anywhere inside the tip (icon, card, close button) keeps it open;
      // it closes only when focus leaves the whole tip, so keyboard users can
      // Tab from the icon into the card and scroll it.
      tip.addEventListener('focusin', function () { if (!state.suppressOpen) setOpen(true); });
      tip.addEventListener('focusout', function (e) {
        if (!state.pinned && !tip.contains(e.relatedTarget)) setOpen(false);
      });
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        state.pinned = !state.pinned;
        setOpen(state.pinned);
      });
      tip.querySelector('.info-close').addEventListener('click', function (e) {
        e.preventDefault();
        state.close();
        // Hand focus back to the icon so keyboard users aren't dropped at the
        // top of the page, without that focus re-opening the card.
        state.suppressOpen = true;
        btn.focus({ preventScroll: true });
        state.suppressOpen = false;
      });
    });

    if (!tips.length) return;

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') tips.forEach(function (t) { t.close(); });
    });
    document.addEventListener('click', function (e) {
      tips.forEach(function (t) { if (!t.tip.contains(e.target)) t.close(); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
