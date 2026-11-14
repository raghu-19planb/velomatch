// Feet-and-inches boxes next to every height slider (the quizzes, the Showcase and the home page's size picture).
// The slider stays in centimetres and is the single source of truth: typing 5 ft 8 in moves the slider to 173 cm (and fires the same
// "input" event the pages already listen to), and moving the slider rewrites the two boxes. Nothing is stored or sent.
(function () {
  'use strict';
  const FR = () => !!(window.I18N && window.I18N.lang === 'fr');
  const cmToFtIn = cm => { const total = Math.round(cm / 2.54); return { ft: Math.floor(total / 12), inch: total % 12 }; };
  const ftInToCm = (ft, inch) => Math.round((ft * 12 + inch) * 2.54);

  function build(slider) {
    if (slider.dataset.ftin) return;
    slider.dataset.ftin = '1';
    const L = FR()
      ? { or: 'ou en pieds et pouces :', ft: 'pi', inch: 'po', ftAria: 'Taille : pieds', inAria: 'Taille : pouces' }
      : { or: 'or in feet and inches:', ft: 'ft', inch: 'in', ftAria: 'Height: feet', inAria: 'Height: inches' };
    const min = Number(slider.min), max = Number(slider.max);
    const lo = cmToFtIn(min), hi = cmToFtIn(max);
    const row = document.createElement('div');
    row.className = 'ftin-row';
    row.setAttribute('data-no-i18n', '');
    row.innerHTML =
      '<span class="ftin-lead">' + L.or + '</span>' +
      '<label class="ftin-f"><input type="number" class="ftin-ft" inputmode="numeric" min="' + lo.ft + '" max="' + hi.ft + '" step="1" aria-label="' + L.ftAria + '"> <span>' + L.ft + '</span></label>' +
      '<label class="ftin-f"><input type="number" class="ftin-in" inputmode="numeric" min="0" max="11" step="1" aria-label="' + L.inAria + '"> <span>' + L.inch + '</span></label>';
    const anchor = slider.closest('.range-row') || slider.parentNode;
    anchor.insertAdjacentElement('afterend', row);
    const ftEl = row.querySelector('.ftin-ft'), inEl = row.querySelector('.ftin-in');
    let typing = false;

    const fromSlider = () => { const v = cmToFtIn(Number(slider.value)); ftEl.value = v.ft; inEl.value = v.inch; };
    const toSlider = () => {
      if (ftEl.value === '' && inEl.value === '') return;
      const cm = Math.min(max, Math.max(min, ftInToCm(Number(ftEl.value) || 0, Number(inEl.value) || 0)));
      if (String(cm) === slider.value) return;
      slider.value = cm;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    };
    [ftEl, inEl].forEach(el => {
      el.addEventListener('input', () => { typing = true; toSlider(); typing = false; });
      el.addEventListener('change', fromSlider);        // tidy up after typing, e.g. 5 ft 14 in becomes 6 ft 2 in, or a value outside the slider is clamped
    });
    slider.addEventListener('input', () => { if (!typing) fromSlider(); });
    fromSlider();
  }

  function init() { document.querySelectorAll('input[type=range]').forEach(s => { if (/height/i.test(s.id)) build(s); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
