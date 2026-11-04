// Experience preferences and a compact, value-first phone dashboard.
function setPreference(key, value) {
  state[key] = value;
  save();
  render();
}
function preferences() {
  return `<div class="preferences" aria-label="Display preferences"><button onclick="setPreference('language',state.language==='hi'?'en':'hi')" aria-label="Switch language" role="switch" aria-checked="${state.language === "hi"}">${state.language === "hi" ? "English / हिन्दी ✓" : "English ✓ / हिन्दी"}</button><button onclick="setPreference('theme',state.theme==='dark'?'light':'dark')" aria-label="Dark theme" role="switch" aria-checked="${state.theme === "dark"}">${state.theme === "dark" ? "☾ Dark" : "☀ Light"}</button>${state.language === "hi" ? '<p class="hint language-note">हिन्दी प्रीव्यू · अनुवाद की समीक्षा बाकी है। कुछ स्रोत और डेमो विवरण अंग्रेज़ी में हैं।</p>' : ""}</div>`;
}
function personaSettings() {
  return `<details class="demo-settings"><summary>Demo journeys · reviewer controls</summary><p>These names describe sample states, not real account identities. In a live product, actual enrollment and progress would determine the next action.</p><label for="demo-persona">Demo persona · simulated</label><select id="demo-persona" aria-label="Demo persona · simulated" onchange="persona(this.value)">${[
    ["new", "Curious Kavya · new/free"],
    ["returning", "Returning Riya · free"],
    ["enrolled", "Committed Anand · enrolled"],
    ["completed", "Growing Gaurav · completed"],
  ]
    .map(
      ([v, t]) =>
        `<option value="${v}" ${state.persona === v ? "selected" : ""}>${t}</option>`,
    )
    .join("")}</select></details>`;
}
function checkIn() {
  const done = state.checkInDate === today();
  return `<section class="daily-check"><div><span class="eyebrow">YOUR DAILY CHECK-IN</span><h2>How are you arriving today?</h2><p>A small pause to notice. No score, no right answer.</p></div><div class="feeling-row">${[
    ["calm", "🌿", "Calm"],
    ["okay", "☀", "Okay"],
    ["tired", "☾", "Tired"],
  ]
    .map(
      ([id, icon, label]) =>
        `<button aria-label="Check in: ${label}" aria-pressed="${done && state.checkInFeeling === id}" onclick="dailyCheck('${id}')"><span aria-hidden="true">${icon}</span>${label}</button>`,
    )
    .join(
      "",
    )}</div><div class="checkin-feedback ${done ? "checked-in" : ""}" role="status">${done ? '<span class="checkin-sprout" aria-hidden="true">🌱</span> You showed up. One gentle step is enough.' : ""}</div><p class="hint">Optional · saved only on this device for today. A check-in does not count as a completed practice.</p></section>`;
}
function dailyCheck(feeling) {
  state.checkInDate = today();
  state.checkInFeeling = feeling;
  save();
  const y = scrollY;
  render();
  scrollTo(0, y);
  document
    .querySelector(
      `[aria-label="Check in: ${{ calm: "Calm", okay: "Okay", tired: "Tired" }[feeling]}"]`,
    )
    ?.focus({ preventScroll: true });
}
function compactHome() {
  return `<div class="compact-home">${invitationBanner()}${hero()}${checkIn()}${state.meaningfulComplete ? `<article class="card compact-next"><span class="pill">YOUR FIRST STEP, TAKEN</span><h2>What would help you keep going?</h2><p>Keep exploring free content, or consider more structure. The choice is yours.</p><button class="btn" onclick="openModal('nextSteps')">Choose my next step</button></article>` : `<div class="compact-alternative"><span>Prefer food to a breathing pause?</span><button class="text-button" onclick="showRecipe('bowl')">Make a simple fruit bowl · Free</button></div>`}<nav class="compact-shortcuts" aria-label="Quick actions"><button onclick="tab('Recipes')">Free recipes →</button><button onclick="tab('My Learning')">My Learning →</button><button onclick="openModal('score')">Reflect on my day →</button><button onclick="openModal('referral')">Invite a friend →</button></nav><details class="compact-more"><summary>More ways to explore</summary>${onboard()}${practice()}${goals()}${workshop()}${offersSection()}${stories()}</details><button class="text-button" onclick="openModal('changes')">What is new in this concept?</button></div>`;
}
function experienceDialog() {
  if (!state.modal || !["nextSteps", "changes"].includes(state.modal.type))
    return null;
  let title = "",
    body = "";
  if (state.modal.type === "nextSteps") {
    title = "Your next step, your choice";
    body = state.meaningfulComplete
      ? `<p>You have tried a useful free action. More free content remains available; no purchase is required.</p><div class="next-step-options"><article><span class="pill">Free</span><h3>Keep your quiet moment</h3><p>Return to the free breathing practice whenever it suits you.</p><button class="btn ghost" onclick="openModal('practice')">Practice again</button></article><article><span class="pill">Paid · official program</span><h3>Learn with a workshop</h3><p>Check current total price, access and schedule on the official page.</p><button class="btn" onclick="openModal('workshop')">View workshop details</button></article><article><span class="pill">Concept only · not purchasable</span><h3>A focused recipe or meditation starter</h3><p>Explore the proposed ₹50–₹250 structured-learning ideas. These are not live Satvic products.</p><button class="btn secondary" onclick="openModal('offers')">Explore learning concepts</button></article><article><span class="pill">Paid · external development store</span><h3>Books and useful tools</h3><p>Browse the supplied marketplace separately. Confirm availability and terms there.</p><a href="${V2.sources.R10}" target="_blank" rel="noopener noreferrer">Open external store →</a></article></div>`
      : "<p>Begin with a free practice or original recipe guide. Nothing is locked behind payment.</p>";
  } else {
    title = "What is new in this concept?";
    body = `<p>A candidate proposal based on supplied screenshots and individual review research, not an official update or a proven improvement to the live app.</p><table class="change-table"><thead><tr><th>Reference experience</th><th>Proposed experience</th></tr></thead><tbody>${[
      [
        "Workshop-led discovery in supplied captures",
        "One free action first, then voluntary program discovery",
      ],
      [
        "Separate offering destinations",
        "A compact Home plus Recipes, My Learning and Explore",
      ],
      [
        "Access and playback concerns in individual reviews",
        "Sample expiry labels, 0.5× pace and an illustrative data-saver control",
      ],
      [
        "No check-in visible in supplied captures",
        "Optional animated daily check-in, without streak inflation",
      ],
      ["General site navigation", "Source-bound FAQ and transparent unknowns"],
      [
        "Preferences not established from screenshots",
        "Optional Hindi preview and light/dark preferences",
      ],
      [
        "No referral flow established in evidence",
        "Demo friend invitation with no tracking or rewards",
      ],
    ]
      .map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`)
      .join(
        "",
      )}</tbody></table><p class="hint">Hindi is a prototype translation, pending native-language review. Data saver does not save real data here: the player is a simulated timeline. Production accounts, prices, payments, performance fixes and conversion outcomes remain unverified.</p>`;
  }
  return `<div class="modalback" onclick="closeModal()"><section class="modal" role="dialog" aria-modal="true" aria-label="${title}" onclick="event.stopPropagation()"><button class="x" aria-label="Close dialog" onclick="closeModal()">✕</button><h2>${title}</h2>${body}</section></div>`;
}
