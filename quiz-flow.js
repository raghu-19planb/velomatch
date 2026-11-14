// Turns a wall of questions into a one-question-at-a-time conversation, purely as a presentation layer: it
// only shows/hides the existing .q-group elements and adds Back/Next. It never touches a page's scoring,
// state or validation, so those keep working exactly as before, including conditional reveals nested
// inside a .q-group (e.g. the frame-size-or-height toggle).
//
// Options (all optional):
//   order       [{key, tag}] the questions to ask first, in this order. `key` is the data-group of the
//               question's buttons (or the id of its slider). `tag` is a short heading for the stage
//               ("Your trip", "Your fit"). Questions not listed follow, tagged as optional.
//   essentials  how many of the listed questions are enough for a good first answer. From then on a
//               "See my matches now" button is offered, and the rest are labelled optional.
//   optionalTag heading for the questions after the essentials (default "Optional: fine-tune your match")
function initQuizFlow(containerSelector, options){
  options = options || {};
  const container = document.querySelector(containerSelector);
  if (!container) return;

  let groups = Array.from(container.querySelectorAll(':scope > .q-group'));
  const submitBtn = container.querySelector('.submit-btn');
  if (!groups.length || !submitBtn) return;

  const keyOf = g => {
    const o = g.querySelector('.opt');
    if (o) return o.dataset.group;
    const r = g.querySelector('input[type=range]');
    return r ? r.id : '';
  };

  const errEl = container.querySelector('.err');
  const reviewStep = document.createElement('div');
  reviewStep.className = 'q-step q-step-review';
  const reviewHeading = document.createElement('p');
  reviewHeading.className = 'q-step-heading';
  reviewHeading.textContent = "That's everything. Ready to see your matches?";
  reviewStep.appendChild(reviewHeading);
  submitBtn.parentNode.insertBefore(reviewStep, submitBtn);
  reviewStep.appendChild(submitBtn);
  if (errEl) reviewStep.appendChild(errEl);

  // put the questions that matter most first, and say which stage each one belongs to
  const tags = new Map();
  if (options.order && options.order.length) {
    const byKey = new Map(groups.map(g => [keyOf(g), g]));
    const ordered = [];
    options.order.forEach(item => { const g = byKey.get(item.key); if (g) { ordered.push(g); if (item.tag) tags.set(g, item.tag); byKey.delete(item.key); } });
    const rest = groups.filter(g => !ordered.includes(g));
    rest.forEach(g => tags.set(g, options.optionalTag || 'Optional: fine-tune your match'));
    groups = ordered.concat(rest);
    groups.forEach(g => container.insertBefore(g, reviewStep));
  }
  const essentials = options.essentials || 0;

  groups.forEach((g, i) => {
    g.classList.add('q-step');
    const tag = tags.get(g) || (essentials && i >= essentials ? (options.optionalTag || 'Optional: fine-tune your match') : '');
    if (tag && !g.querySelector('.q-step-tag')) {
      const t = document.createElement('span');
      t.className = 'q-step-tag' + (essentials && i >= essentials ? ' optional' : '');
      t.textContent = tag;
      g.insertBefore(t, g.firstChild);
    }
  });
  const steps = [...groups, reviewStep];

  container.querySelectorAll(':scope > .q-section-label, :scope > .q-section-hint').forEach(el => { el.style.display = 'none'; });

  // A step counts as "answered" if it contains at least one selected .opt; a slider-only question is always
  // answered, since its default is already a real, scoreable value.
  function stepIsAnswered(step){
    const opts = step.querySelectorAll('.opt');
    if (!opts.length) return true;
    return !!step.querySelector('.opt.active');
  }

  const nav = document.createElement('div');
  nav.className = 'q-flow-nav';
  nav.innerHTML =
    '<div class="q-flow-progress"><div class="q-flow-progress-bar" id="qFlowBar"></div></div>' +
    '<p class="q-flow-count" id="qFlowCount"></p>' +
    '<p class="q-flow-hint" id="qFlowHint">Skipped questions do not change your results. ' +
      '<button type="button" class="q-flow-skip" id="qFlowSkip">Skip for now</button></p>' +
    '<div class="q-flow-buttons">' +
      '<button type="button" class="q-flow-back" id="qFlowBack">Back</button>' +
      '<button type="button" class="q-flow-next" id="qFlowNext">Next</button>' +
      '<button type="button" class="q-flow-quick" id="qFlowQuick">See my matches now</button>' +
    '</div>' +
    '<p class="q-flow-quick-note" id="qFlowQuickNote"></p>';
  groups[0].insertAdjacentElement('afterend', nav);

  const backBtn = nav.querySelector('#qFlowBack');
  const nextBtn = nav.querySelector('#qFlowNext');
  const skipBtn = nav.querySelector('#qFlowSkip');
  const quickBtn = nav.querySelector('#qFlowQuick');
  const quickNote = nav.querySelector('#qFlowQuickNote');
  const hintEl = nav.querySelector('#qFlowHint');
  const countEl = nav.querySelector('#qFlowCount');
  const barEl = nav.querySelector('#qFlowBar');
  let current = 0;

  function advance(){
    if (current < steps.length - 1) { current++; render(); }
  }

  function render(){
    steps.forEach((s, i) => { s.style.display = i === current ? '' : 'none'; });
    const isLast = current === steps.length - 1;

    if (isLast) {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'flex';
      steps[current].insertAdjacentElement('afterend', nav);

      const answered = stepIsAnswered(steps[current]);
      nextBtn.style.display = answered ? '' : 'none';
      hintEl.style.display = answered ? 'none' : 'block';
      backBtn.style.display = current === 0 ? 'none' : '';

      // from the last essential question on, a good first answer is one click away
      const quickReady = essentials && current >= essentials - 1 && (current >= essentials || answered);
      quickBtn.style.display = quickReady ? '' : 'none';
      quickNote.style.display = quickReady ? '' : 'none';
      quickNote.textContent = current >= essentials - 1
        ? 'The remaining ' + (steps.length - 1 - essentials) + ' questions are optional. Answer any that matter to you.'
        : '';
      countEl.textContent = essentials && current < essentials
        ? 'Question ' + (current + 1) + ' of ' + essentials + ' (the essentials)'
        : 'Question ' + (current + 1) + ' of ' + (steps.length - 1);
      barEl.style.width = (100 * current / (steps.length - 1)) + '%';
    }

    if (current > 0) steps[current].scrollIntoView({behavior: 'smooth', block: 'center'});
  }

  nextBtn.addEventListener('click', advance);
  skipBtn.addEventListener('click', advance);
  backBtn.addEventListener('click', () => { if (current > 0) { current--; render(); } });
  quickBtn.addEventListener('click', () => { submitBtn.click(); });

  container.addEventListener('click', e => {
    if (e.target.classList && e.target.classList.contains('opt') && steps[current].contains(e.target)) render();
  });

  // If the final submit fails validation (a required question wasn't answered), jump back to the review step
  // so the error is visible rather than leaving the user stuck on whatever step they'd wandered to.
  submitBtn.addEventListener('click', () => {
    setTimeout(() => {
      if (errEl && errEl.style.display === 'block' && current !== steps.length - 1) {
        current = steps.length - 1;
        render();
      }
    }, 0);
  });

  // lets a result chip take the shopper straight back to that question
  window.svQuizGoTo = function(key){
    const i = groups.findIndex(g => keyOf(g) === key);
    if (i >= 0) { current = i; render(); }
  };

  render();
}
