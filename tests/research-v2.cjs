const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    timezoneId: "Asia/Kolkata",
  });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  p.setDefaultTimeout(10000);
  const btn = (name) => p.getByRole("button", { name, exact: true });
  const nav = (name) =>
    p
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("button", { name, exact: true });
  const selectPersona = async (value) => {
    await nav("Profile").click();
    await p.locator(".demo-settings summary").click();
    await p.getByLabel("Demo persona · simulated").selectOption(value);
  };
  const close = () =>
    p.getByRole("button", { name: "Close dialog", exact: true }).click();
  await p.goto("http://127.0.0.1:8000");
  await p
    .getByRole("heading", { name: "Two minutes, just for you", exact: true })
    .waitFor();
  await btn("Continue →").click();
  await btn("Food").first().click();
  await btn("Continue →").click();
  await btn("Finish setup →").click();
  assert.equal(await p.evaluate(() => state.onboard), 3);
  await p.reload();
  assert.equal(await p.evaluate(() => state.goal), "Food");
  await btn("Explore a meal idea").click();
  await p
    .getByRole("dialog")
    .getByRole("heading", { name: "Simple fruit bowl", exact: true })
    .waitFor();
  await close();
  await p.evaluate(() => update({ onboard: 0 }));
  await btn("Skip").click();
  await p.evaluate(() =>
    update({ goal: "", history: {}, meaningfulComplete: false }),
  );
  for (const [persona, title] of [
    ["new", "Two minutes, just for you"],
    ["returning", "Come back to your quiet"],
    ["completed", "Keep the good growing"],
    ["enrolled", "Return to your mat"],
  ]) {
    await selectPersona(persona);
    await p.getByRole("heading", { name: title, exact: true }).waitFor();
  }
  console.log("PASS: four personas and optional onboarding persistence/skip");
  await selectPersona("new");
  await p
    .getByLabel("Move or stretch for a few minutes", { exact: true })
    .check();
  assert.equal(await p.evaluate(() => streak()), 1);
  assert.equal(await btn("Explore optional concepts").count(), 0);
  await p.evaluate(() => openModal("offers"));
  assert.equal(
    await p
      .getByText("Concept only — not available to purchase", { exact: true })
      .count(),
    0,
  );
  await close();
  await p.reload();
  assert.equal(
    await p
      .getByLabel("Move or stretch for a few minutes", { exact: true })
      .isChecked(),
    true,
  );
  await p
    .getByLabel("Move or stretch for a few minutes", { exact: true })
    .uncheck();
  assert.equal(await p.evaluate(() => streak()), 0);
  await nav("Recipes").click();
  await btn("Quick & Easy").click();
  await p.getByLabel("Search recipes", { exact: true }).fill("fruit");
  assert.equal(await p.locator(".recipe-tile").count(), 1);
  await btn("Save Simple fruit bowl").click();
  await btn("Unsave Simple fruit bowl").click();
  assert.equal(await p.evaluate(() => savedRecipes().length), 0);
  await btn("Save Simple fruit bowl").click();
  await p.reload();
  await nav("Recipes").click();
  await btn("Saved").click();
  assert.equal(await p.locator(".recipe-tile").count(), 1);
  await btn("All").click();
  await btn("Quick & Easy").click();
  await p.evaluate(() => window.scrollTo(0, 400));
  await btn("Open recipe").first().scrollIntoViewIfNeeded();
  const y = await p.evaluate(() => scrollY);
  await btn("Open recipe").first().click();
  await p
    .getByRole("dialog")
    .getByRole("heading", { name: "Simple fruit bowl", exact: true })
    .waitFor();
  await btn("Back to recipes").click();
  assert.equal(await p.evaluate(() => recipeFilter), "Quick & Easy");
  assert.ok(Math.abs((await p.evaluate(() => scrollY)) - y) < 2);
  await btn("Open recipe").first().click();
  await btn("I prepared this recipe").click();
  assert.equal(await p.evaluate(() => state.meaningfulComplete), true);
  await btn("Optional next-step concepts").click();
  assert.equal(
    await p
      .getByText("Concept only — not available to purchase", { exact: true })
      .count(),
    4,
  );
  for (const amount of [50, 100, 200, 250])
    await p.getByRole("heading", { name: new RegExp("₹" + amount) }).waitFor();
  await p
    .getByRole("button", { name: "I'm interested", exact: true })
    .first()
    .click();
  assert.equal(
    await p.evaluate(() => demoEvents.at(-1).name),
    "offer_interest",
  );
  await p.screenshot({ path: "screenshots/v2-concepts.png" });
  await close();
  console.log(
    "PASS: recipe filter/search/save, reload, scroll restoration, meaningful recipe action and optional concept offer interest",
  );
  await selectPersona("enrolled");
  await btn("Resume demo class").click();
  await p.clock.install();
  await btn("Play lesson").click();
  await p.clock.runFor(20000);
  await btn("Pause lesson").click();
  const at = await p.evaluate(() => player.time);
  assert.ok(at >= 19);
  await p.clock.runFor(5000);
  assert.equal(await p.evaluate(() => player.time), at);
  await btn("Rewind 10 seconds").click();
  assert.ok(Math.abs((await p.evaluate(() => player.time)) - (at - 10)) < 0.5);
  await btn("Replay lesson").click();
  assert.equal(await p.evaluate(() => player.time), 0);
  await p.getByLabel("Playback speed", { exact: true }).selectOption("0.75");
  await btn("Play lesson").click();
  await p.clock.runFor(8000);
  await btn("Pause lesson").click();
  assert.ok(Math.abs((await p.evaluate(() => player.time)) - 6) < 0.5);
  await p.getByLabel("Lesson position", { exact: true }).focus();
  await p.keyboard.press("Home");
  await p.keyboard.press("ArrowRight");
  assert.equal(await p.evaluate(() => player.time), 1);
  await p.screenshot({ path: "screenshots/v2-player.png" });
  await p.keyboard.press("Escape");
  assert.equal(await p.getByRole("dialog").count(), 0);
  await nav("My Learning").click();
  await btn("Open sample notes").click();
  await p
    .getByText(
      "View-only sample. Illustrative access ends 10 November 2026, 23:59 IST.",
      { exact: true },
    )
    .waitFor();
  await close();
  await p.getByLabel("Demo enrollment scenario").selectOption("expired");
  await p.getByRole("heading", { name: "Sample access has expired" }).waitFor();
  assert.equal(await btn("Open sample notes").count(), 0);
  await p.getByLabel("Demo enrollment scenario").selectOption("empty");
  await p
    .getByRole("heading", { name: "No sample course available" })
    .waitFor();
  await p.getByLabel("Demo enrollment scenario").selectOption("duplicate");
  assert.equal(
    await p
      .getByRole("heading", { name: "Daily Yoga · lesson 3 of 8", exact: true })
      .count(),
    1,
  );
  await p.getByLabel("Demo enrollment scenario").selectOption("live");
  await nav("Home").click();
  assert.match(await p.locator(".hero").textContent(), /Current sample class/);
  console.log(
    "PASS: sample lesson playback, pause, rewind, replay, speed; notes and empty/expired/duplicate/current enrollments",
  );
  await btn("Open Satvic Saathi").click();
  await btn("Which recipes are free?").click();
  await p
    .getByRole("link", { name: "Official source [R8] ↗", exact: true })
    .waitFor();
  await btn("How long can I access notes?").click();
  await p
    .getByRole("link", { name: "Official source [R9] ↗", exact: true })
    .waitFor();
  await p.getByRole("button", { name: "Helpful", exact: true }).last().click();
  assert.equal(await p.evaluate(() => demoEvents.at(-1).name), "faq_helpful");
  await p.getByLabel("Ask about content or access").fill("unicorn secret");
  await btn("Send").click();
  assert.match(
    await p.locator(".chat-log").textContent(),
    /I can't verify this for your program/,
  );
  await p
    .getByRole("link", {
      name: "Contact the Satvic team on the official site ↗",
    })
    .waitFor();
  await p.screenshot({ path: "screenshots/v2-faq.png" });
  await close();
  await nav("My Learning").click();
  await p.getByLabel("Workshop available", { exact: true }).uncheck();
  await p
    .getByRole("heading", { name: "Daily Yoga Classes", exact: true })
    .waitFor();
  await btn("Explore classes →").click();
  assert.match(await p.getByRole("dialog").textContent(), /Total charge/);
  await close();
  console.log(
    "PASS: source-bound FAQ, feedback, unknown fallback, human-support link, evergreen fallback and pricing transparency",
  );
  await selectPersona("new");
  await p.evaluate(() =>
    update({ goal: "", meaningfulComplete: false, onboard: 3 }),
  );
  await btn("Try a two-minute pause").click();
  await btn("Begin breathing").click();
  await p.clock.runFor(120000);
  await btn("Skip check-in").click();
  assert.equal(await p.evaluate(() => state.meaningfulComplete), true);
  await btn("Back to my day").click();
  for (const width of [320, 375, 390, 430, 1280]) {
    await p.setViewportSize({ width, height: 900 });
    await p.waitForTimeout(150);
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      "overflow " + width,
    );
    await p.waitForTimeout(150);
    await p.screenshot({
      path: `screenshots/v2-home-${width}.png`,
      fullPage: true,
    });
  }
  await selectPersona("enrolled");
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(150);
  await p.screenshot({ path: "screenshots/v2-enrolled.png", fullPage: true });
  await p.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await p
      .locator(".persona-icon")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  await btn("Reflect on my day →").click();
  for (let i = 0; i < 8; i++) await btn("Skip").click();
  assert.equal(await p.locator(".score-number").textContent(), "No score");
  await close();
  await btn("Invite a friend →").click();
  const invite = await p
    .getByLabel("Your demo invitation link", { exact: true })
    .inputValue();
  assert.match(invite, /ref=demo-/);
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
  await btn("Copy invitation link").click();
  assert.equal(await p.evaluate(() => navigator.clipboard.readText()), invite);
  await close();
  await p.goto(invite);
  await p
    .getByRole("heading", {
      name: "A quiet beginning, shared with you.",
      exact: true,
    })
    .waitFor();
  await btn("Try my first pause").click();
  await btn("Skip practice").click();
  await btn("Skip check-in").click();
  await btn("Back to my day").click();
  await p.locator(".site-menu > summary").click();
  await p.keyboard.press("Escape");
  assert.equal(await p.locator(".site-menu").getAttribute("open"), null);
  console.log(
    "PASS: food-interest free recipe route, wellbeing all-skip, invitation clipboard/arrival and mobile menu Escape",
  );
  await p.setViewportSize({ width: 1440, height: 1000 });
  await p.waitForTimeout(150);
  assert.deepEqual(
    await p.locator(".home-band").evaluateAll((es) => es.map((e) => e.id)),
    [
      "next-step",
      "free-discovery",
      "learning-home",
      "wellbeing-home",
      "programs-home",
      "friends-home",
      "stories-home",
    ],
  );
  assert.equal(
    await p
      .getByRole("navigation", { name: "Primary navigation" })
      .evaluate((e) => getComputedStyle(e).position),
    "static",
  );
  assert.ok(
    await p
      .locator(".hero")
      .evaluate((e) => e.getBoundingClientRect().width > 1000),
  );
  assert.ok(
    await p
      .locator(".hero h2")
      .evaluate((e) => parseFloat(getComputedStyle(e).fontSize) >= 48),
  );
  await p
    .getByRole("navigation", { name: "Dashboard sections" })
    .getByRole("link", { name: "My Learning", exact: true })
    .click();
  assert.equal(
    await p.evaluate(() => document.activeElement.id),
    "learning-home",
  );
  await btn("Chat with Satvic Saathi").click();
  await p
    .getByRole("dialog", { name: "Ask Satvic Saathi 🌱", exact: true })
    .waitFor();
  await close();
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(150);
  await p.screenshot({
    path: "screenshots/layout5-desktop.png",
    fullPage: true,
  });
  await p.setViewportSize({ width: 390, height: 844 });
  await p.waitForTimeout(150);
  assert.equal(
    await p
      .getByRole("navigation", { name: "Primary navigation" })
      .evaluate((e) => getComputedStyle(e).position),
    "fixed",
  );
  assert.equal(
    await p.getByRole("navigation", { name: "Dashboard sections" }).isVisible(),
    false,
  );
  await p.screenshot({
    path: "screenshots/layout5-mobile.png",
    fullPage: true,
  });
  console.log(
    "PASS: agreed section order, wide desktop layout, heading scale, section navigation/focus, embedded chatbot and mobile bottom navigation",
  );
  const off = await browser.newContext();
  await off.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("disabled", "SecurityError");
      },
    }),
  );
  const op = await off.newPage();
  await op.goto("http://127.0.0.1:8000");
  await op.locator(".notice[role=status]").waitFor();
  await op
    .getByLabel("Move or stretch for a few minutes", { exact: true })
    .check();
  assert.ok(
    await op
      .getByLabel("Move or stretch for a few minutes", { exact: true })
      .isChecked(),
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: full breathing completion, responsive screenshots, reduced motion, storage-disabled operation and no runtime errors",
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
