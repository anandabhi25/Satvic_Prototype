// Additive v2 experience: local sample rights, FAQ records and concept experiments.
const demoEvents = [];
function track(name, detail = {}) {
  demoEvents.push({ name, detail, at: new Date().toISOString() });
  if (demoEvents.length > 100) demoEvents.shift();
}
function completedFree(kind) {
  state.meaningfulComplete = true;
  save();
  track("meaningful_action_completed", { kind });
}
let recipeFilter = "All",
  recipeSearch = "",
  recipeScroll = 0;
const catalog = [
  {
    id: "bowl",
    title: "Simple fruit bowl",
    category: "Quick & Easy",
    access: "Free",
    image: "assets/meal-plan.jpg",
    original: true,
  },
  {
    id: "chocolate",
    title: "Chocolate Milkshake",
    category: "Quick & Easy",
    access: "Preview",
    image: "assets/chocolate.jpg",
    source: "https://dashboard.satvicmovement.org/",
  },
  {
    id: "juice",
    title: "Glowing Green Juice",
    category: "Juices",
    access: "Preview",
    image: "assets/green-juice.jpg",
    source: "https://dashboard.satvicmovement.org/",
  },
  {
    id: "meals",
    title: "Satvic meal collection",
    category: "Meals",
    access: "Free",
    image: "assets/meal-plan.jpg",
    source: V2.sources.R8,
  },
];
function savedRecipes() {
  return Array.isArray(state.savedRecipes) ? state.savedRecipes : [];
}
function toggleRecipe(id) {
  state.savedRecipes = savedRecipes().includes(id)
    ? savedRecipes().filter((x) => x !== id)
    : [...savedRecipes(), id];
  save();
  const y = scrollY;
  render();
  window.scrollTo(0, y);
}
function filterRecipes(value) {
  recipeFilter = value;
  render();
}
function searchRecipes(value) {
  recipeSearch = value;
  const input = document.getElementById("recipe-search");
  const pos = input?.selectionStart;
  render();
  const fresh = document.getElementById("recipe-search");
  fresh?.focus({ preventScroll: true });
  fresh?.setSelectionRange(pos, pos);
}
function showRecipe(id) {
  recipeScroll = scrollY;
  track(
    catalog.find((r) => r.id === id)?.access === "Free"
      ? "free_content_opened"
      : "preview_opened",
    { id },
  );
  openModal("recipeV2", id);
}
function recipeBack() {
  closeModal();
  window.scrollTo(0, recipeScroll);
}
function recipeList() {
  const items = catalog.filter(
    (r) =>
      (recipeFilter === "All" ||
        (recipeFilter === "Saved" && savedRecipes().includes(r.id)) ||
        r.category === recipeFilter) &&
      r.title.toLowerCase().includes(recipeSearch.toLowerCase()),
  );
  return `<section class="section recipe-library"><div class="section-title"><h2>Find something nourishing</h2></div><p class="muted">An original free guide, plus clearly labeled previews and official recipe links.</p><label for="recipe-search">Search recipes</label><input id="recipe-search" class="referral-input" value="${h(recipeSearch)}" oninput="searchRecipes(this.value)" placeholder="Search by name"><div class="filter-row">${["All", "Quick & Easy", "Juices", "Meals", "Saved"].map((f) => `<button class="btn ${recipeFilter === f ? "secondary" : "ghost"}" aria-pressed="${recipeFilter === f}" onclick="filterRecipes('${f}')">${f}</button>`).join("")}</div><div class="recipe-grid">${items.map((r) => `<article class="card recipe-tile"><img src="${r.image}" alt="${r.original ? "Illustrative meal-planning image" : h(r.title)}"><div class="details"><span class="pill">${r.access}</span><h3>${r.title}</h3><p class="hint">${r.original ? "Original prototype recipe · not an official Satvic recipe" : r.access === "Preview" ? "Screenshot-derived preview · recipe on official source" : "Official collection · external link"}</p><div class="actions"><button class="btn" onclick="showRecipe('${r.id}')">Open recipe</button><button class="btn ghost" aria-label="${savedRecipes().includes(r.id) ? "Unsave" : "Save"} ${r.title}" onclick="toggleRecipe('${r.id}')">${savedRecipes().includes(r.id) ? "Saved ✓" : "Save"}</button></div></div></article>`).join("") || '<p class="empty">No matching recipes. Try All or clear your search.</p>'}</div></section>`;
}
function sampleEnrollments() {
  if (state.persona !== "enrolled" || state.enrollmentScenario === "empty")
    return [];
  const base = {
    id: "yoga",
    title: "Daily Yoga · sample lesson",
    eligible: true,
    expired: state.enrollmentScenario === "expired",
    live: state.enrollmentScenario === "live",
    order: 1,
  };
  return state.enrollmentScenario === "duplicate"
    ? [base, { ...base }]
    : [base];
}
let player = { time: 0, speed: 1, running: false },
  playerTimer = null;
function startPlayer() {
  clearInterval(playerTimer);
  player.running = true;
  let last = performance.now();
  playerTimer = setInterval(() => {
    const now = performance.now();
    player.time = Math.min(
      90,
      player.time + ((now - last) / 1000) * player.speed,
    );
    last = now;
    if (player.time >= 90) {
      player.running = false;
      clearInterval(playerTimer);
    }
    paintPlayer();
  }, 200);
  paintPlayer();
}
function paintPlayer() {
  const pos = document.getElementById("player-position");
  if (!pos) return;
  pos.textContent = `${Math.floor(player.time)} / 90 seconds`;
  document.getElementById("player-seek").value = player.time;
  document.getElementById("player-toggle").textContent = player.running
    ? "Pause lesson"
    : "Play lesson";
}
function pausePlayer() {
  clearInterval(playerTimer);
  player.running = false;
  paintPlayer();
}
function playerMarkup() {
  return `<div class="sample-player"><span class="pill">Preview · simulated media timeline</span><div class="player-scene" aria-hidden="true">☀</div><p>No video or audio is streamed. This original 90-second timeline demonstrates beginner playback controls.</p><p id="player-position">${Math.floor(player.time)} / 90 seconds</p><label for="player-seek">Lesson position</label><input id="player-seek" type="range" min="0" max="90" value="${player.time}" oninput="player.time=Number(this.value);paintPlayer()"><div class="actions"><button class="btn" id="player-toggle" onclick="player.running?pausePlayer():startPlayer()">${player.running ? "Pause lesson" : "Play lesson"}</button><button class="btn ghost" onclick="player.time=Math.max(0,player.time-10);paintPlayer()">Rewind 10 seconds</button><button class="btn ghost" onclick="pausePlayer();player.time=0;paintPlayer()">Replay lesson</button></div><label for="player-speed">Playback speed</label><select id="player-speed" onchange="player.speed=Number(this.value)"><option value="0.5" ${player.speed === 0.5 ? "selected" : ""}>0.5x · very gentle pace</option><option value="0.75" ${player.speed === 0.75 ? "selected" : ""}>0.75× · gentle pace</option><option value="1" ${player.speed === 1 ? "selected" : ""}>1× · regular pace</option></select><label for="player-quality">Video quality</label><select id="player-quality" onchange="player.quality=this.value;track('data_saver_changed',{quality:this.value})"><option value="auto" ${player.quality !== "saver" ? "selected" : ""}>Auto</option><option value="saver" ${player.quality === "saver" ? "selected" : ""}>Data saver · lower quality, less mobile data</option></select><p class="muted">Illustrative control: this prototype streams no video, so no real data is saved. Added after Play reviews asked for a way to reduce video quality.</p></div>`;
}
function learning() {
  const enrollments = sampleEnrollments(),
    eligible = enrollments.filter((e) => !e.expired);
  return `<section class="section"><h2>My Learning</h2><span class="pill">${state.persona === "enrolled" ? "Sample member · illustrative rights" : "No connected enrollment"}</span><p class="muted">Sample reference day: 3 November 2026. These dates and rights describe fictional demo access, never your real account.</p><label for="enrollment-case">Demo enrollment scenario</label><select id="enrollment-case" onchange="update({enrollmentScenario:this.value})">${[
    ["recording", "Recording available"],
    ["live", "Current sample class"],
    ["expired", "Expired access"],
    ["empty", "No enrollment"],
    ["duplicate", "Duplicate records"],
  ]
    .map(
      ([v, t]) =>
        `<option value="${v}" ${(state.enrollmentScenario || "recording") === v ? "selected" : ""}>${t}</option>`,
    )
    .join(
      "",
    )}</select>${eligible.length ? `<div class="card practice"><span class="pill">Paid · sample entitlement</span><h3>Daily Yoga · lesson 3 of 8</h3><p>Illustrative recording access: until 10 November 2026, 23:59 IST. Sample progress: 25%.</p><button class="btn" onclick="openModal('lesson')">Continue sample lesson</button><div class="actions"><button class="btn secondary" onclick="openModal('notes')">Open sample notes</button></div><p class="hint">Notes: view-only in this demo, through 10 November 2026. No download rights are implied. Real terms require verification.</p></div>` : `<div class="card practice"><h3>${enrollments.length ? "Sample access has expired" : "No sample course available"}</h3><p>${enrollments.length ? "Illustrative expiry: 2 November 2026. Recordings and notes are unavailable under this sample entitlement." : "You can still explore the free practice and recipe guide."}</p><button class="btn secondary" onclick="openModal('chat')">Ask about access</button></div>`}<div class="actions"><button class="btn ghost" onclick="openModal('lessonPreview')">Try beginner timeline preview · Preview</button></div></section>${workshop()}`;
}
function offersSection() {
  return `<section class="section"><div class="card practice"><span class="pill">Proposal · optional research concepts</span><h2>Would a smaller next step help?</h2><p>These are hypotheses, not current Satvic products. Keep using free content with no purchase required.</p>${state.meaningfulComplete ? `<button class="btn secondary" onclick="openModal('offers')">Explore optional concepts</button>` : '<p class="hint">Complete a free breathing practice or use the original fruit-bowl guide to explore these optional ideas.</p>'}</div></section>`;
}
function faqReply(text) {
  return V2.faq(text);
}
function askGuide(message) {
  const text = String(message).trim().slice(0, 300);
  if (!text) return;
  const record = faqReply(text);
  track("faq_question", { id: record.id });
  chatMessages.push(
    { who: "you", text },
    {
      who: "guide",
      text: record.answer,
      faqId: record.id,
      source: record.source,
    },
  );
  chatMessages = chatMessages.slice(-12);
  render();
  document.getElementById("chat-input")?.focus();
}
function faqModal() {
  return `<p class="hint">Satvic Saathi · illustrative FAQ records v2. Source-bound navigation, not AI or a human adviser. No account access. Please do not enter personal or medical information.</p><div class="chat-log" role="log" aria-live="polite" aria-label="Conversation">${chatMessages.map((m, i) => `<div class="chat-message ${m.who}"><span>${m.who === "you" ? "You" : "Satvic Saathi"}</span><p>${h(m.text)}</p>${m.source ? `<a href="${V2.sources[m.source]}" target="_blank" rel="noopener noreferrer">Official source [${m.source}] ↗</a><div class="actions"><button class="btn ghost" onclick="track('faq_helpful',{id:'${m.faqId}',helpful:true});this.parentElement.innerHTML='Thank you for your feedback.'">Helpful</button><button class="btn ghost" onclick="track('faq_helpful',{id:'${m.faqId}',helpful:false});this.parentElement.innerHTML='Thank you. The official team can help with unresolved questions.'">Not helpful</button></div>` : ""}</div>`).join("")}</div><div class="chat-suggestions">${["Which recipes are free?", "How long can I access notes?", "How do I replay video?"].map((q) => `<button onclick="askGuide('${q}')">${q}</button>`).join("")}</div><form onsubmit="event.preventDefault();askGuide(document.getElementById('chat-input').value)"><label for="chat-input">Ask about content or access</label><div class="chat-compose"><input id="chat-input" required maxlength="300" autocomplete="off"><button class="btn" type="submit">Send</button></div></form><p><a href="${V2.sources.S3}" target="_blank" rel="noopener noreferrer">Contact the Satvic team on the official site ↗</a></p>`;
}
function v2Dialog() {
  const m = state.modal;
  if (!m) return null;
  let title = "",
    body = "";
  if (m.type === "chat") {
    title = "Ask Satvic Saathi 🌱";
    body = faqModal();
  } else if (m.type === "recipeV2") {
    const r = catalog.find((r) => r.id === m.id);
    title = r.title;
    body = `<span class="pill">${r.access}</span>${r.original ? `<p>Original prototype guide · one serving. Image is illustrative.</p><h3>What you need</h3><p>One banana, one apple, and optionally a squeeze of lemon. Use ingredients that suit your dietary needs.</p><h3>Make it your own</h3><ol><li>Wash the apple and clean your preparation surface.</li><li>Peel the banana. Chop both fruits into bite-size pieces, removing the apple core.</li><li>Combine in a bowl, add lemon if you like, and enjoy freshly prepared.</li></ol><button class="btn" onclick="completedFree('recipe');this.textContent='Your practical action is recorded ✓';this.disabled=true">I prepared this recipe</button>` : `<p>${r.access === "Preview" ? "Screenshot-derived preview only. Full instructions and actual access conditions are on the official source." : "Find free recipe guidance through the official Satvic Food channel."}</p><a class="btn story-link" href="${r.source}" target="_blank" rel="noopener noreferrer">Open official recipe source ↗</a>`}<div class="actions"><button class="btn ghost" onclick="recipeBack()">Back to recipes</button>${r.original ? '<button class="btn secondary" onclick="if(state.meaningfulComplete)openModal(\'offers\')">Optional next-step concepts</button>' : ""}</div>`;
  } else if (["class", "lesson", "lessonPreview"].includes(m.type)) {
    const allowed =
      m.type === "lessonPreview" || sampleEnrollments().some((e) => !e.expired);
    title =
      m.type === "lessonPreview"
        ? "Beginner lesson preview"
        : "Daily Yoga · sample lesson";
    body = allowed
      ? playerMarkup()
      : "<p>Sample access is not available. No lesson is unlocked. Ask Satvic Saathi or explore free content.</p>";
  } else if (m.type === "notes") {
    title = "Sample workshop notes";
    body = sampleEnrollments().some((e) => !e.expired)
      ? '<span class="pill">Paid · sample member</span><p>View-only sample. Illustrative access ends 10 November 2026, 23:59 IST.</p><h3>Settle into your practice</h3><p>Make a comfortable space, move within your comfort and take breaks whenever needed. These are original demo notes, not official course materials.</p>'
      : "<p>Notes unavailable: sample entitlement is absent or expired. Contact the official team about your actual access.</p>";
  } else if (m.type === "offers") {
    title = "Small next steps · research concepts";
    body = state.meaningfulComplete
      ? V2.offers
          .map(
            (o) =>
              `<article class="card concept-card"><span class="pill">Concept only — not available to purchase</span><h3>₹${o.price} · ${o.title}</h3><p>${o.benefit}</p><p class="hint">${o.term}. Proposed one-off total ₹${o.price}; no renewal. These are unvalidated proposed terms, not a live offer.</p><button class="btn secondary" onclick="track('offer_interest',{price:${o.price}});this.textContent='Interest noted for this demo only';this.disabled=true">I'm interested</button></article>`,
          )
          .join("") +
        '<p>No payment or contact details collected. This does not reserve, enroll or purchase anything.</p><a href="' +
        V2.sources.R9 +
        '" target="_blank" rel="noopener noreferrer">Explore the separate official signature workshop ↗</a>'
      : "<p>Try a free activity first. These optional concepts never block free learning.</p>";
  } else return null;
  return `<div class="modalback" onclick="closeModal()"><section class="modal" role="dialog" aria-modal="true" aria-label="${h(title)}" onclick="event.stopPropagation()"><button class="x" aria-label="Close dialog" onclick="closeModal()">✕</button><div class="eyebrow">Candidate v2 · local demonstration</div><h2>${h(title)}</h2>${body}</section></div>`;
}
