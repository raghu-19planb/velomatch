// Converts a wall-of-questions quiz into a one-question-at-a-time conversational
// flow, purely as a presentation layer: it only shows/hides existing .q-group
// elements and adds Back/Next navigation. It never touches the scoring logic,
// state object, or validation already wired up by each page's own <script> —
// those keep working exactly as before, including conditional reveals nested
// inside a .q-group (e.g. bikepacking/racing's frame-size-or-height toggle).
function initQuizFlow(containerSelector){
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const groups = Array.from(container.querySelectorAll(':scope > .q-group'));
  const submitBtn = container.querySelector('.submit-btn');
  if (!groups.length || !submitBtn) return;

  const errEl = container.querySelector('.err');
  const reviewStep = document.createElement('div');
  reviewStep.className = 'q-step q-step-review';
  const reviewHeading = document.createElement('p');
  reviewHeading.className = 'q-step-heading';
  reviewHeading.textContent = "That's everything — ready to see your matches?";
  reviewStep.appendChild(reviewHeading);
  submitBtn.parentNode.insertBefore(reviewStep, submitBtn);
  reviewStep.appendChild(submitBtn);
  if (errEl) reviewStep.appendChild(errEl);

  groups.forEach(g => g.classList.add('q-step'));
  const steps = [...groups, reviewStep];

  container.querySelectorAll(':scope > .q-section-label, :scope > .q-section-hint').forEach(el => {
    el.style.display = 'none';
  });

  // A step counts as "answered" if it contains at least one selected .opt —
  // a plain slider-only question (no .opt buttons) is always considered
  // answered, since its default value is already a real, scoreable value.
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
    '<p class="q-flow-hint" id="qFlowHint">Every question you answer helps us recommend more accurately. ' +
      '<button type="button" class="q-flow-skip" id="qFlowSkip">Skip for now</button></p>' +
    '<div class="q-flow-buttons">' +
      '<button type="button" class="q-flow-back" id="qFlowBack">Back</button>' +
      '<button type="button" class="q-flow-next" id="qFlowNext">Next</button>' +
    '</div>';
  // Placed after the first step for now; render() relocates it after
  // whichever step is current, so it always sits below the visible question.
  groups[0].insertAdjacentElement('afterend', nav);

  const backBtn = nav.querySelector('#qFlowBack');
  const nextBtn = nav.querySelector('#qFlowNext');
  const skipBtn = nav.querySelector('#qFlowSkip');
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

      countEl.textContent = 'Question ' + (current + 1) + ' of ' + (steps.length - 1);
      barEl.style.width = (100 * current / (steps.length - 1)) + '%';
    }

    if (current > 0) steps[current].scrollIntoView({behavior: 'smooth', block: 'center'});
  }

  nextBtn.addEventListener('click', advance);
  skipBtn.addEventListener('click', advance);
  backBtn.addEventListener('click', () => {
    if (current > 0) { current--; render(); }
  });

  // Re-check answered/unanswered the moment the user picks an option on the
  // current step, so Next appears immediately without waiting for anything
  // else to trigger a re-render.
  container.addEventListener('click', e => {
    if (e.target.classList && e.target.classList.contains('opt') && steps[current].contains(e.target)) {
      render();
    }
  });

  // If the final submit fails validation (a required question wasn't
  // answered), jump back to the review step so the error message is visible
  // rather than leaving the user stuck on whatever step they'd wandered to.
  submitBtn.addEventListener('click', () => {
    setTimeout(() => {
      if (errEl && errEl.style.display === 'block' && current !== steps.length - 1) {
        current = steps.length - 1;
        render();
      }
    }, 0);
  });

  render();
}
