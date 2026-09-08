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

  container.querySelectorAll(':scope > .q-section-label').forEach(el => {
    el.style.display = 'none';
  });

  const nav = document.createElement('div');
  nav.className = 'q-flow-nav';
  nav.innerHTML =
    '<div class="q-flow-progress"><div class="q-flow-progress-bar" id="qFlowBar"></div></div>' +
    '<p class="q-flow-count" id="qFlowCount"></p>' +
    '<div class="q-flow-buttons">' +
      '<button type="button" class="q-flow-back" id="qFlowBack">Back</button>' +
      '<button type="button" class="q-flow-next" id="qFlowNext">Next</button>' +
    '</div>';
  container.insertBefore(nav, groups[0]);

  const backBtn = nav.querySelector('#qFlowBack');
  const nextBtn = nav.querySelector('#qFlowNext');
  const countEl = nav.querySelector('#qFlowCount');
  const barEl = nav.querySelector('#qFlowBar');
  let current = 0;

  function render(){
    steps.forEach((s, i) => { s.style.display = i === current ? '' : 'none'; });
    const isLast = current === steps.length - 1;
    backBtn.style.visibility = current === 0 ? 'hidden' : 'visible';
    nav.style.display = isLast ? 'none' : 'flex';
    countEl.textContent = isLast ? '' : ('Question ' + (current + 1) + ' of ' + (steps.length - 1));
    barEl.style.width = (100 * current / (steps.length - 1)) + '%';
    if (current > 0) steps[current].scrollIntoView({behavior: 'smooth', block: 'center'});
  }

  nextBtn.addEventListener('click', () => {
    if (current < steps.length - 1) { current++; render(); }
  });
  backBtn.addEventListener('click', () => {
    if (current > 0) { current--; render(); }
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
