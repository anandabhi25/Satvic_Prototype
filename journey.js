// Ephemeral reflection answers never leave the browser or persist to storage.
let breath = null,
  breathTimer = null,
  reflection = "",
  scoreIndex = 0,
  scoreAnswers = [];
const wellbeingQuestions = [
  "Did you make time for rest?",
  "Did you move in a way that suited you?",
  "Did you enjoy a nourishing meal?",
  "Did you drink water when thirsty?",
  "Did you take a quiet pause?",
  "Did you connect with someone?",
  "Did you spend time outdoors, if suitable?",
  "Did you make room for something you enjoy?",
];
function startJourney(type) {
  clearInterval(breathTimer);
  if (type === "practice") {
    breath = { elapsed: 0, running: false, stage: "ready", completed: false };
    reflection = "";
  }
  if (type === "score") {
    scoreIndex = 0;
    scoreAnswers = [];
  }
}
function runBreath() {
  breath.running = true;
  breath.stage = "running";
  breath.started = performance.now();
  render();
  document.getElementById("breath-toggle")?.focus();
  breathTimer = setInterval(() => {
    const elapsed =
      breath.elapsed + (performance.now() - breath.started) / 1000;
    if (elapsed >= 120) {
      breath.elapsed = 120;
      breath.running = false;
      breath.completed = true;
      breath.stage = "reflect";
      clearInterval(breathTimer);
      render();
      document.querySelector(".modal .x")?.focus();
      return;
    }
    const phase =
      Math.floor(elapsed / 4) % 2 === 0
        ? "Breathe in gently"
        : "Breathe out gently";
    document.getElementById("breath-phase").textContent = phase;
    document.getElementById("breath-time").textContent =
      `${Math.ceil(120 - elapsed)} seconds remaining`;
  }, 250);
}
function pauseBreath() {
  breath.elapsed += (performance.now() - breath.started) / 1000;
  breath.running = false;
  clearInterval(breathTimer);
  render();
  document.getElementById("breath-toggle")?.focus();
}
function skipBreath() {
  clearInterval(breathTimer);
  breath.running = false;
  breath.stage = "reflect";
  render();
  document.querySelector(".modal .x")?.focus();
}
function finishBreath() {
  if (breath.completed) completedFree("breathing");
  if (breath.completed && !checked().includes(1)) {
    state.history[today()] = [...checked(), 1];
    save();
  }
  breath.stage = "done";
  render();
  document.querySelector(".modal .x")?.focus();
}
function scoreAnswer(value) {
  scoreAnswers[scoreIndex] = value;
  scoreIndex++;
  render();
  document.querySelector(".modal .x")?.focus();
}
function scoreResult() {
  const answers = scoreAnswers.filter((x) => x !== null);
  return {
    answered: answers.length,
    points: answers.reduce((a, b) => a + b, 0),
  };
}
function specialModal() {
  if (!state.modal || !["practice", "score"].includes(state.modal.type))
    return null;
  let body = "",
    title =
      state.modal.type === "practice"
        ? "Your two-minute pause"
        : "Your daily wellbeing reflection";
  if (state.modal.type === "practice") {
    if (breath.stage === "ready" || breath.stage === "running")
      body = `<p>Settle into a comfortable position. Follow the gentle rhythm, or breathe naturally at your own pace. No breath holding. Stop whenever you wish.</p><div class="breathing-orbit ${breath.running ? "moving" : ""}" aria-hidden="true">✺</div><p id="breath-phase" class="breath-label">${breath.running ? "Breathe in gently" : breath.elapsed ? "Paused · take your time" : "A little space for yourself"}</p><p id="breath-time">${Math.ceil(120 - breath.elapsed)} seconds remaining</p><div class="actions"><button id="breath-toggle" class="btn" onclick="${breath.running ? "pauseBreath()" : "runBreath()"}">${breath.running ? "Pause" : breath.elapsed ? "Resume" : "Begin breathing"}</button><button class="btn ghost" onclick="skipBreath()">Skip practice</button></div>`;
    if (breath.stage === "reflect")
      body = `<span class="pill">${breath.completed ? "PRACTICE COMPLETE" : "PRACTICE SKIPPED"}</span><h3>How do you feel?</h3><p>There is no right answer. This optional check-in stays only for this visit.</p><div class="actions">${["More settled", "About the same", "Restless"].map((x) => `<button class="btn ${reflection === x ? "" : "ghost"}" aria-pressed="${reflection === x}" onclick="reflection='${x}';render();document.querySelector('.modal .x').focus()">${x}</button>`).join("")}</div><div class="actions"><button class="btn" onclick="finishBreath()">${breath.completed ? "Save practice and continue" : "Continue without logging"}</button><button class="btn ghost" onclick="reflection='';finishBreath()">Skip check-in</button></div>`;
    if (breath.stage === "done")
      body = `<span class="pill">${breath.completed ? "A SMALL STEP, MADE YOUR OWN" : "YOUR PACE, YOUR CHOICE"}</span><h3>${breath.completed ? "You made room for yourself." : "You can come back whenever you like."}</h3><p>${breath.completed ? (storageAvailable ? "Your breathing break is logged on this device." : "Your breathing break is logged for this visit.") : "No practice was logged."} ${reflection ? "Thank you for checking in. Every feeling is welcome." : ""}</p><p>Keep this moment simple, or discover another way to bring it into your day.</p><div class="actions"><button class="btn" onclick="closeModal();tab('Recipes')">Try a nourishing recipe</button><button class="btn secondary" onclick="closeModal();tab('Explore')">Explore the platform</button>${breath.completed ? '<button class="btn ghost" onclick="openModal(\'nextSteps\')">Choose my next step</button>' : ""}<button class="btn ghost" onclick="closeModal()">Back to my day</button></div>`;
  } else if (scoreIndex < 8) {
    body = `<span class="pill">OPTIONAL · ${scoreIndex + 1} OF 8</span><p>A reflection on daily habits, not a medical assessment or a measure of your health. No account or medical information needed.</p><h3>${wellbeingQuestions[scoreIndex]}</h3><div class="actions">${[
      ["Yes", 1],
      ["A little", 0.5],
      ["Not today", 0],
      ["Skip", null],
    ]
      .map(
        ([label, v]) =>
          `<button class="btn ${v === null ? "ghost" : ""}" onclick="scoreAnswer(${v})">${label}</button>`,
      )
      .join(
        "",
      )}</div>${scoreIndex ? '<button class="text-button" onclick="scoreIndex--;render();document.querySelector(\'.modal .x\').focus()">Previous question</button>' : ""}`;
  } else {
    const r = scoreResult();
    body = `<span class="pill">YOUR REFLECTION · ${h(today())}</span><div class="score-number">${r.answered ? `${r.points} / ${r.answered}` : "No score"}</div><p>${r.answered ? `${r.answered} of 8 questions answered. Yes = 1, a little = ½, not today = 0. Skipped questions are excluded.` : "You skipped all questions. That is completely okay."}</p><h3>A little awareness is a useful beginning.</h3><p>This is a self-reported habits tally, not a validated health score. It cannot diagnose or determine your health. Answers are not saved or sent anywhere.</p><div class="actions"><button class="btn" onclick="openModal('practice')">Make time for a pause</button><button class="btn ghost" onclick="closeModal()">Back to my day</button></div>`;
  }
  return `<div class="modalback" onclick="closeModal()"><section class="modal" role="dialog" aria-modal="true" aria-label="${title}" onclick="event.stopPropagation()"><button class="x" aria-label="Close dialog" onclick="closeModal()">✕</button><div class="eyebrow">A moment for you</div><h2>${title}</h2>${body}</section></div>`;
}
function wellbeing() {
  return `<section class="section"><div class="card reflection-card"><span class="pill">CHECK IN, WITHOUT JUDGEMENT</span><h2>Your daily wellbeing habits</h2><p>Eight optional questions. Notice what supported you today, then choose one small thing for tomorrow.</p><button class="btn" onclick="openModal('score')">Reflect on my day →</button><p class="hint">A personal reflection tool, not a medical assessment. No answers are saved.</p></div></section>`;
}
function stories() {
  return `<section class="section stories"><span class="pill">FROM THE SATVIC COMMUNITY</span><h2>Stories of Success</h2><p>Explore personal experiences shared by Satvic Movement. Everyone’s experience is different.</p><div class="card practice"><h3>Meet the people behind the stories</h3><p>Visit the official homepage’s “Stories of Success” section for the original stories, photographs and context.</p><a class="btn story-link" href="https://satvicmovement.org/" target="_blank" rel="noopener noreferrer">Read official stories ↗</a><p class="hint">Opens Satvic Movement. Personal stories are not promises of health outcomes.</p></div></section>`;
}
