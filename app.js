function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
let storageAvailable = true;

const KEY = "satvic-prototype-v3";
const today = () => dateKey(new Date());
const defaults = {
  persona: "new",
  tab: "Home",
  history: {},
  goal: "",
  onboard: 0,
  workshop: true,
  session: false,
  reminder: false,
  modal: null,
};
let state;
try {
  state = {
    ...defaults,
    history: {},
    ...JSON.parse(localStorage.getItem(KEY) || "{}"),
  };
} catch {
  storageAvailable = false;
  state = { ...defaults, history: {} };
}
const save = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...state, modal: null }));
  } catch {
    storageAvailable = false;
  }
};
const h = (x) =>
  String(x).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const habits = [
  "Move or stretch for a few minutes",
  "Take a quiet breathing break",
  "Prepare or enjoy a plant-based meal",
  "Spend a little time outdoors (if suitable)",
];
const recipes = [
  {
    title: "Chocolate Milkshake",
    src: "assets/chocolate.jpg",
    desc: "From the candidate dashboard",
    url: "https://dashboard.satvicmovement.org/",
  },
  {
    title: "Glowing Green Juice",
    src: "assets/green-juice.jpg",
    desc: "From the candidate dashboard",
    url: "https://dashboard.satvicmovement.org/",
  },
  {
    title: "Sesame Apple Smoothie",
    src: "assets/meal-plan.jpg",
    desc: "Official recipe collection · illustrative meal-plan image",
    url: "https://blog.satvicmovement.org/recipes",
  },
];
// Treat persisted browser data as untrusted; recover to useful defaults.
if (!["new", "returning", "enrolled", "completed"].includes(state.persona))
  state.persona = "new";
if (
  !["Home", "Recipes", "My Learning", "Explore", "Profile"].includes(state.tab)
)
  state.tab = "Home";
if (!Number.isInteger(state.onboard) || state.onboard < 0 || state.onboard > 3)
  state.onboard = 0;
if (
  !state.history ||
  typeof state.history !== "object" ||
  Array.isArray(state.history)
)
  state.history = {};
for (const [key, value] of Object.entries(state.history))
  state.history[key] = Array.isArray(value)
    ? [...new Set(value.filter((n) => Number.isInteger(n) && n >= 0 && n < 4))]
    : [];
state.modal = null;
if (
  /^demo-[a-f0-9]{12}$/.test(
    new URLSearchParams(location.search).get("ref") || "",
  )
)
  state.tab = "Home";
const checked = () => state.history[today()] || [];
function streak(){return V2.dayStreak(state.history,today());}
function update(o) {
  Object.assign(state, o);
  save();
  render();
}
function mark(i) {
  let cur = [...checked()];
  cur = cur.includes(i) ? cur.filter((n) => n !== i) : [...cur, i];
  state.history[today()] = cur;
  save();
  render();
}
function begin() {
  update({ onboard: Math.max(1, state.onboard) });
}
let modalTrigger = null;
function openModal(type, id) {
  if (!state.modal) modalTrigger = document.activeElement;
  startJourney(type);
  startCommunity(type);
  if (["class", "lesson", "lessonPreview"].includes(type)) {
    pausePlayer();
    player = { time: 0, speed: 1, running: false };
    track(
      type === "lessonPreview" ? "free_content_opened" : "workshop_resume",
      { sample: true },
    );
  }
  if (type === "notes" && sampleEnrollments().some((e) => !e.expired))
    track("resource_opened", { sample: true });
  if (type === "offers" || type === "workshop")
    track("price_details_opened", { type });
  if (type === "practice") track("free_content_opened", { kind: "practice" });
  state.modal = { type, id };
  render();
  document.querySelector(".modal .x").focus();
}
function closeModal() {
  clearInterval(breathTimer);
  pausePlayer();
  state.modal = null;
  render();
  if (modalTrigger) {
    const candidate = [...document.querySelectorAll("button")].find(
      (b) => b.outerHTML === modalTrigger.outerHTML,
    );
    candidate?.focus();
  }
}
function link(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}
function siteHeader() {
  return `<div class="site-header"><div class="site-header-inner"><a class="site-logo" href="./" aria-label="Satvic Movement home"><img src="assets/satvic-logo.svg" alt="Satvic Movement" width="156" height="52"></a><details class="site-menu" ${window.innerWidth > 1000 ? "open" : ""}><summary>Menu <span aria-hidden="true">☰</span></summary><nav class="site-links" aria-label="Website navigation"><a href="https://satvicmovement.org/about.html" target="_blank" rel="noopener noreferrer">About Us</a><details class="site-dropdown"><summary>Workshops</summary><div class="dropdown-panel"><button onclick="tab('Workshops');closeSiteMenus()">Discover workshops</button><a href="https://satvicmovement.org/workshops/yoga-sadhana-beginner/subscription/" target="_blank" rel="noopener noreferrer">Daily Yoga · official site ↗</a></div></details><details class="site-dropdown"><summary>Books</summary><div class="dropdown-panel"><a href="https://dev.marketplace.satvicmovement.org/collections/all-products" target="_blank" rel="noopener noreferrer">Books & guides · external development store ↗</a></div></details><details class="site-dropdown"><summary>Shop</summary><div class="dropdown-panel"><a href="https://dev.marketplace.satvicmovement.org/collections/all-products" target="_blank" rel="noopener noreferrer">Browse external development store ↗</a></div></details><details class="site-dropdown"><summary>Verticals</summary><div class="dropdown-panel"><button onclick="tab('Recipes');closeSiteMenus()">Food & recipes</button><button onclick="tab('Workshops');closeSiteMenus()">Yoga & learning</button><button onclick="tab('Explore');closeSiteMenus()">Community & more</button></div></details><a href="https://satvicmovement.org/" target="_blank" rel="noopener noreferrer" title="Find current opportunities on the official Satvic Movement website">Join our Team ↗</a><details class="site-dropdown"><summary>Blogs</summary><div class="dropdown-panel"><a href="https://blog.satvicmovement.org/recipes" target="_blank" rel="noopener noreferrer">Recipe collection ↗</a><a href="https://blog.satvicmovement.org/" target="_blank" rel="noopener noreferrer">Official blog ↗</a></div></details><a class="contact-pill" href="https://satvicmovement.org/" target="_blank" rel="noopener noreferrer" title="Find contact details on the official Satvic Movement website">Contact Us ↗</a></nav></details></div></div>`;
}
function closeSiteMenus() {
  document
    .querySelectorAll(".site-header details")
    .forEach(
      (e) =>
        (e.open =
          e.classList.contains("site-menu") && window.innerWidth > 1000),
    );
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.activeElement.closest(".site-header")) {
    const parent = document.activeElement.closest("details[open]");
    if (parent) {
      parent.open = false;
      parent.querySelector("summary").focus();
    }
  }
});
function header() {
  return `${siteHeader()}<header class="top"><div class="brand"><span class="space-label">YOUR DAILY SPACE</span><button class="avatar" aria-label="Open profile" onclick="tab('Profile')">☺</button></div><div class="eyebrow">Your satvic today 🌿</div><h1>Namaste, Anand</h1><div class="muted">A little nourishment. A little movement. A moment for you.</div><div class="statebar"><label><span class="hint">Demo persona · simulated</span><br><select aria-label="Demo persona · simulated" onchange="persona(this.value)"><option value="new" ${state.persona === "new" ? "selected" : ""}>Curious Kavya · new/free</option><option value="returning" ${state.persona === "returning" ? "selected" : ""}>Returning Riya · free</option><option value="enrolled" ${state.persona === "enrolled" ? "selected" : ""}>Committed Anand · enrolled</option><option value="completed" ${state.persona === "completed" ? "selected" : ""}>Growing Gaurav · completed</option></select></label><span class="badge"><span class="persona-icon ${state.persona}" aria-hidden="true">${{ new: "🌱", returning: "🍃", enrolled: "🪷", completed: "☀" }[state.persona]}</span> ${streak() ? streak() + " day practice streak" : "Begin your journey"}</span></div></header>`;
}
function resolveNextAction(persona, interest) {
  if (
    persona === "enrolled" &&
    ["live", "recording"].includes(V2.next(persona, sampleEnrollments()).kind)
  )
    return {
      label: "YOUR DEMO PROGRAM",
      title: "Return to your mat",
      description:
        state.enrollmentScenario === "live"
          ? "Current sample class · 3 Nov 2026, 08:00 IST. Fictional timetable, not a live session. View all classes in My Learning."
          : "Because you joined the sample Daily Yoga program. Recording access is illustrative, through 10 Nov 2026, 23:59 IST.",
      cta: "Resume demo class",
      type: "class",
    };
  if (persona === "returning")
    return {
      label: "A LITTLE CONTINUITY",
      title: "Come back to your quiet",
      description:
        "Continue your last free practice: a two-minute pause. Begin right where you are.",
      cta: "Continue free practice",
      type: "practice",
    };
  if (persona === "completed")
    return {
      label: "YOUR NEXT CHAPTER",
      title: "Keep the good growing",
      description:
        "A program ends. Your daily practice can keep unfolding, one gentle step at a time.",
      cta: "Choose today’s practice",
      type: "practice",
    };
  return {
    label: "YOUR NEXT SMALL STEP",
    title:
      interest === "Food"
        ? "Make room for nourishment"
        : "Two minutes, just for you",
    description:
      interest === "Food"
        ? "Begin with one plant-based meal. A small, achievable step to make your own."
        : "Relax your shoulders. Take a quiet breath. Your first Satvic step can be this simple.",
    cta: interest === "Food" ? "Explore a meal idea" : "Try a two-minute pause",
    type: interest === "Food" ? "recipeV2" : "practice",
  };
}
function hero() {
  const d = resolveNextAction(state.persona, state.goal);
  return `<section class="section"><div class="card hero"><div class="hero-copy"><span class="pill">${d.type === "class" ? "Paid · sample member" : "Free"} · ${d.label}</span><h2>${d.title}</h2><p>${d.description}</p><div class="actions"><button class="btn" onclick="openModal('${d.type}'${d.type === "recipeV2" ? ",\'bowl\'" : ""})">${d.cta} <span aria-hidden="true">→</span></button><button class="text-button" onclick="tab('Explore')">Choose something else</button></div><div class="hero-note">${state.persona === "enrolled" ? "Simulated enrollment · sample session 3 of 8" : "At your pace. Always optional."}</div></div><img class="hero-image" src="assets/yoga.jpg" alt="Satvic yoga practice preview"><span class="image-note">A moment of stillness</span></div></section>`;
}
function practice() {
  const c = checked().length;
  return `<section class="section" id="practices"><div class="section-title"><h2>Little steps for today</h2><small>${c}/4 chosen</small></div><div class="card practice"><div class="muted">Choose what feels right. All activities are optional.</div>${habits.map((t, i) => `<div class="habit"><label><input aria-label="${h(t)}" type="checkbox" ${checked().includes(i) ? "checked" : ""} onchange="mark(${i})"><span>${h(t)}</span></label></div>`).join("")}<div class="progress"><div style="width:${c * 25}%"></div></div><div class="hint">${c ? (storageAvailable ? "Beautiful. Your progress is saved on this device." : "Progress lasts for this visit; storage is unavailable.") : "Your journey can begin with just one step."}</div></div></section>`;
}
function content() {
  return `<section class="section"><div class="section-title"><h2>Discover Satvic goodness</h2><small>Swipe to explore</small></div><div class="horizontal">${recipes.map((r, i) => `<article class="card media"><img src="${r.src}" alt="${h(r.title)}"><div class="details"><span class="pill">${i === 2 ? "Free · official collection" : "Preview"}</span><h3>${h(r.title)}</h3><small>${h(r.desc)}</small><div class="actions"><button class="btn secondary" onclick="showRecipe('${["chocolate", "juice", "meals"][i]}')">Explore →</button></div></div></article>`).join("")}</div></section>`;
}
function goals() {
  return `<section class="section"><div class="section-title"><h2>What brings you here?</h2><small>Optional</small></div><div class="card practice"><div class="muted">Tell us one interest so we can make discovery easier—not to diagnose you.</div><div class="actions quiz">${["Food", "Yoga", "Both"].map((x) => `<button class="btn ${state.goal === x ? "" : "ghost"}" onclick="update({goal:'${x}'})">${x}</button>`).join("")}</div>${state.goal ? `<p class="muted">Wonderful! Your interest is ${h(state.goal.toLowerCase())}. This guides the new explorer’s next step. <button class="btn secondary" onclick="update({goal:''})">Clear</button></p>` : ""}</div></section>`;
}
function workshop() {
  return `<section class="section"><div class="section-title"><h2>${state.workshop ? "Explore a guided program" : "More ways to learn"}</h2></div><div class="card workshop"><img src="${state.workshop ? "assets/workshop.jpg" : "assets/yoga.jpg"}" alt="${state.workshop ? "Satvic cooking workshop preview" : "Satvic yoga practice"}"><div><span class="pill">${state.workshop ? "Paid · official program" : "Paid · evergreen"}</span><h3>${state.workshop ? "One Pot Meals Workshop" : "Daily Yoga Classes"}</h3><p>${state.workshop ? "Cook along with Satvic instructors. Check official page for current cohort availability." : "Build a gentle ongoing practice. Explore the official program details."}</p><button class="btn" onclick="openModal('workshop')">${state.workshop ? "View workshop" : "Explore classes"} →</button></div></div><label class="switchline"><span class="muted">Demo: workshop currently available</span><input type="checkbox" aria-label="Workshop available" ${state.workshop ? "checked" : ""} onchange="update({workshop:this.checked})"></label></section>`;
}
function onboard() {
  if (state.persona !== "new" || state.onboard === 3) return "";
  const k = state.onboard;
  return `<section class="section"><div class="card practice"><span class="pill">WELCOME · STEP ${k + 1} OF 3</span><h2>${["A gentle beginning", "Choose what interests you", resolveNextAction(state.persona, state.goal).title][k]}</h2><p class="muted">${["We’ll help you find your next meaningful step.", "Start with an interest; you can always change it.", resolveNextAction(state.persona, state.goal).description][k]}</p>${k === 1 ? `<div class="actions">${["Food", "Yoga", "Both"].map((x) => `<button class="btn ${state.goal === x ? "" : "ghost"}" onclick="update({goal:'${x}'})">${x}</button>`).join("")}</div>` : ""}<div class="actions"><button class="btn" onclick="update({onboard:${k + 1}})">${k === 2 ? "Finish setup" : "Continue"} →</button><button class="btn secondary" onclick="update({onboard:3})">Skip</button></div></div></section>`;
}
function homeBand(id,kind,body){return `<section id="${id}" class="home-band ${kind}" tabindex="-1"><div class="band-inner">${body}</div></section>`;}
function sectionNav(){return `<nav class="section-nav" aria-label="Dashboard sections">${[['next-step','Your next step'],['free-discovery','Free recipes & practice'],['learning-home','My Learning'],['wellbeing-home','Wellbeing'],['programs-home','Programs'],['friends-home','Invite a friend'],['stories-home','Stories']].map(([id,label])=>`<a href="#${id}" onclick="event.preventDefault();goToSection('${id}')">${label}</a>`).join('')}</nav>`;}
function goToSection(id){const el=document.getElementById(id);if(el){history.replaceState(null,'','#'+id);el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});el.focus({preventScroll:true});}}
function freeDiscovery(){return `<div class="band-heading"><span class="eyebrow">A FREE PLACE TO BEGIN</span><h2>A little nourishment. A little practice.</h2><p>Start with something you can use today. No account, no payment, and no perfect routine required.</p></div><div class="free-feature-grid"><article class="card first-recipe"><img src="assets/meal-plan.jpg" alt="Illustrative Satvic meal-planning scene"><div class="details"><span class="pill">Free · original prototype guide</span><h3>A simple fruit bowl, made your own</h3><p>Three easy steps to prepare something fresh. A small practical beginning.</p><div class="actions"><button class="btn" onclick="showRecipe('bowl')">Make a simple fruit bowl</button><button class="text-button" onclick="tab('Recipes')">Browse all recipes →</button></div></div></article>${practice()}</div>${content()}`;}
function learningOverview(){const eligible=sampleEnrollments().some(e=>!e.expired);return `<div class="learning-overview"><div><span class="eyebrow">MY LEARNING</span><h2>${eligible?'Come back to what you began.':'A place for your learning to grow.'}</h2><p>${eligible?'Your sample Daily Yoga lesson and notes are together, with clear recording and material access terms.':'Find your lessons, recordings and notes together. No connected enrollment is required to explore the free beginner preview.'}</p><div class="actions"><button class="btn" onclick="tab('My Learning')">Open My Learning</button><button class="btn ghost" onclick="openModal('lessonPreview')">Try beginner preview</button></div></div><article class="card learning-preview"><img src="assets/yoga.jpg" alt="Yoga practice from supplied research imagery"><div><span class="pill">${eligible?'Paid · sample member':'Preview · simulated lesson'}</span><h3>Daily Yoga</h3><p>${eligible?'Lesson 3 of 8 · illustrative recording access through 10 November 2026, 23:59 IST.':'Explore a beginner-friendly timeline with pause, rewind, replay and gentle playback speed.'}</p><small>Demo only · no official video or live class is connected.</small></div></article></div>`;}
function chatEntry(){return `<aside class="chat-entry"><div><span class="eyebrow">A LITTLE GUIDANCE</span><h3>Not sure where to go next?</h3><p>Ask Satvic Saathi about free recipes, sample classes or access terms. Source-linked FAQ answers, with an official-team fallback.</p><small>Scripted prototype chatbot · no account or medical advice.</small></div><button class="btn secondary" onclick="openModal('chat')">Chat with Satvic Saathi</button></aside>`;}
function home() {
 return `${invitationBanner()}${sectionNav()}${homeBand('next-step','next-band',hero())}${homeBand('free-discovery','cream-band',onboard()+freeDiscovery())}${homeBand('learning-home','sage-band',learningOverview())}${homeBand('wellbeing-home','wellbeing-band',`<div class="band-heading"><span class="eyebrow">NOTICE YOUR DAY</span><h2>Small habits, without judgement.</h2><p>A gentle reflection on what supported you. Always optional.</p></div><div class="wellbeing-grid">${wellbeing()}${goals()}</div>`)}${homeBand('programs-home','cream-band',`<div class="band-heading"><span class="eyebrow">WHEN YOU FEEL READY</span><h2>A little more structure, at your pace.</h2><p>Keep your free practice. Explore deeper learning only when it feels useful.</p></div><div class="program-grid">${offersSection()}${workshop()}</div>${chatEntry()}`)}${homeBand('friends-home','sage-band',inviteCard())}${homeBand('stories-home','stories-band',stories())}`;
}
function secondary() {
  if (state.tab === "My Learning") return learning();
  if (state.tab === "Recipes") return recipeList();
  let p = state.tab;
  if (p === "Explore")
    return `<div class="section-title"><h2>Explore the movement</h2></div><div class="links"><button class="tile" onclick="tab('Recipes')">Free / Preview · Recipes</button><button class="tile" onclick="openModal('workshop')">Paid · Workshops</button><button class="tile" onclick="openModal('lessonPreview')">Preview · Daily Yoga</button><button class="tile" onclick="link('https://dev.marketplace.satvicmovement.org/collections/all-products')">Paid · Shop & books ↗</button><button class="tile" onclick="openModal('community')">Preview · Potluck community</button></div><p class="hint">Marketplace opens an external development-store link supplied for assignment research, not a checkout inside this prototype.</p><article class="card practice"><span class="pill">Preview · screenshot reference</span><h3>Bread & Sandwiches Workshop</h3><p class="muted">Seen in the candidate dashboard screenshot. Current cohort, price, schedule and access are unverified.</p><a href="https://satvicmovement.org/" target="_blank" rel="noopener noreferrer">Check official workshop availability ↗</a></article>`;
  return `<div class="section-title"><h2>Your journey</h2></div><div class="card practice"><h3>Welcome, Anand 🌱</h3><p class="muted">Demo profile. Preferences and daily check-ins save locally.</p><div class="switchline">Daily reminder (demo only)<input type="checkbox" aria-label="Daily reminder" ${state.reminder ? "checked" : ""} onchange="update({reminder:this.checked})"></div><button class="btn secondary" onclick="resetDemo()">Reset demo data</button><details><summary>Demo event log · local only</summary><pre class="event-log">${h(JSON.stringify(demoEvents, null, 2))}</pre></details></div>`;
}
function modal() {
  const research = v2Dialog();
  if (research !== null) return research;
  const community = communityModal();
  if (community !== null) return community;
  const custom = specialModal();
  if (custom !== null) return custom;
  if (!state.modal) return "";
  let m = state.modal;
  let r = m.type === "recipe" ? recipes[m.id] : null;
  let title =
    m.type === "practice"
      ? "A two-minute quiet pause"
      : r
        ? r.title
        : m.type === "class"
          ? "Daily Yoga · class preview"
          : m.type === "community"
            ? "Potluck community"
            : state.workshop
              ? "One Pot Meals Workshop"
              : "Daily Yoga Classes";
  let desc =
    m.type === "practice"
      ? "Find a comfortable position. Let your shoulders soften and breathe naturally. Stay for a moment, or finish whenever you wish. This is a free guided prompt, with no timer or health promise."
      : r
        ? "Recipe preview based on the uploaded dashboard screenshot. Open the Satvic source to learn more."
        : m.type === "class"
          ? "This is a simulated class detail. In production, connect entitlement, schedule and resume position from the real account."
          : m.type === "community"
            ? "Community discovery is a future integration; this demo does not post or join groups."
            : "Total charge, term, renewal and included materials: confirm on the official page. Current availability and prices are not connected.";
  let url = r
    ? r.url
    : m.type === "class"
      ? "https://satvicmovement.org/workshops/yoga-sadhana-beginner/subscription/"
      : state.workshop
        ? "https://satvicmovement.org/workshops/onepotmeals/"
        : "https://satvicmovement.org/workshops/yoga-sadhana-beginner/subscription/";
  return `<div class="modalback" role="presentation" onclick="closeModal()"><section role="dialog" aria-modal="true" aria-label="${h(title)}" class="modal" onclick="event.stopPropagation()"><button class="x" aria-label="Close dialog" onclick="closeModal()">✕</button><div class="eyebrow">Satvic Movement · concept demo</div><h2>${h(title)}</h2><p>${h(desc)}</p>${m.type === "practice" ? `<button class="btn block" onclick="if(!checked().includes(1))mark(1);closeModal()">Log my breathing break ✓</button>` : ""}${m.type === "class" && state.persona === "enrolled" ? `<button class="btn block" onclick="update({session:true,modal:null})">${state.session ? "Class marked as started ✓" : "Start demo class"}</button><p class="hint">This does not enroll you, open a live session, or confirm actual attendance.</p>` : ""}<div class="actions">${m.type === "practice" || m.type === "community" ? "" : `<button class="btn secondary" onclick="link('${url}')">Official source ↗</button>`}<button class="btn ghost" onclick="closeModal()">Close preview</button></div></section></div>`;
}
function nav() {
  let tabs = [
    ["Home", "⌂"],
    ["Recipes", "♧"],
    ["My Learning", "◈"],
    ["Explore", "✿"],
    ["Profile", "☺"],
  ];
  return `<nav class="nav" aria-label="Primary navigation">${tabs.map(([t, i]) => `<button class="${state.tab === t ? "active" : ""}" aria-current="${state.tab === t ? "page" : "false"}" onclick="tab('${t}')"><b aria-hidden="true">${i}</b>${t}</button>`).join("")}</nav>`;
}
function tab(x) {
  if (x === "Workshops") x = "My Learning";
  if (x === "Home") track("home_view", { persona: state.persona });
  state.tab = x;
  save();
  render();
  window.scrollTo(0, 0);
}
function persona(x) {
  update({ persona: x, tab: "Home" });
}
function resetDemo() {
  if (confirm("Reset all locally saved demo progress?")) {
    state = { ...defaults, history: {} };
    save();
    render();
  }
}
function render() {
  const focus = document.activeElement;
  const focusLabel = focus?.getAttribute("aria-label");
  const focusText = focus?.tagName === "BUTTON" ? focus.textContent : null;
  document.getElementById("app").innerHTML =
    `<div id="page-content" ${state.modal ? "inert" : ""}>${header()}${nav()}${!storageAvailable ? '<div class="notice" role="status">Storage is unavailable. You can still explore; changes last for this visit.</div>' : ""}<div class="content screen ${state.tab==='Home'?'home-content':'detail-content'}">${state.tab === "Home" ? home() : secondary()}<p class="hint">Candidate concept · not an official Satvic product<br>Demo states & screenshot-derived visuals for research only.</p></div><button class="guide-launcher" onclick="openModal('chat')" aria-label="Open Satvic Saathi">Ask Satvic Saathi 🌱 <span aria-hidden="true">↗</span></button></div>${modal()}`;
  if (!state.modal) {
    const target = focusLabel
      ? document.querySelector(`[aria-label="${CSS.escape(focusLabel)}"]`)
      : focusText
        ? [...document.querySelectorAll("button")].find(
            (b) => b.textContent === focusText,
          )
        : null;
    target?.focus({ preventScroll: true });
  }
}
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.modal) closeModal();
  if (e.key === "Tab" && state.modal) {
    const items = [
      ...document.querySelectorAll(
        ".modal button,.modal a,.modal input:not([disabled]),.modal select",
      ),
    ];
    const first = items[0],
      last = items.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});
track("home_view", { persona: state.persona });
render();

let headerDesktop = window.innerWidth > 1000;
window.addEventListener("resize", () => {
  const desktop = window.innerWidth > 1000;
  if (desktop !== headerDesktop) {
    headerDesktop = desktop;
    const menu = document.querySelector(".site-menu");
    if (menu) menu.open = desktop;
  }
});
