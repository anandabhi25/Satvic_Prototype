const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    timezoneId: "Asia/Kolkata",
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://127.0.0.1:8000");
  const button = (name) => page.getByRole("button", { name, exact: true });
  const persona = page.getByLabel("Demo persona · simulated");
  for (const [value, title] of [
    ["new", "Two minutes, just for you"],
    ["returning", "Come back to your quiet"],
    ["enrolled", "Return to your mat"],
    ["completed", "Keep the good growing"],
  ]) {
    await persona.selectOption(value);
    await page.getByRole("heading", { name: title, exact: true }).waitFor();
  }
  console.log("PASS: all four persona primary actions");
  await persona.selectOption("new");
  await button("Continue →").click();
  await button("Food").first().click();
  await button("Continue →").click();
  await button("Finish setup →").click();
  assert.equal(await page.getByText("WELCOME · STEP 3 OF 3").count(), 0);
  await page.reload();
  assert.equal(await page.evaluate(() => state.onboard), 3);
  assert.equal(await page.evaluate(() => state.goal), "Food");
  await page.evaluate(() => update({ onboard: 0 }));
  await button("Skip").click();
  assert.equal(await page.evaluate(() => state.onboard), 3);
  console.log("PASS: onboarding completion, interest, skip and persistence");
  const habit = page.getByLabel("Move or stretch for a few minutes", {
    exact: true,
  });
  await habit.check();
  await page.reload();
  assert.equal(await habit.isChecked(), true);
  await habit.uncheck();
  assert.equal(await habit.isChecked(), false);
  await page.evaluate(() => {
    state.history = {};
    const d = new Date();
    d.setDate(d.getDate() - 1);
    state.history[dateKey(d)] = [0];
    d.setDate(d.getDate() - 1);
    state.history[dateKey(d)] = [0];
  });
  assert.equal(await page.evaluate(() => streak()), 2);
  await page.evaluate(() => {
    state.history[today()] = [1];
  });
  assert.equal(await page.evaluate(() => streak()), 3);
  await page.evaluate(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    delete state.history[dateKey(d)];
  });
  assert.equal(await page.evaluate(() => streak()), 1);
  console.log("PASS: habit toggle/undo/reload and dated consecutive streak");
  await page.evaluate(() => update({ goal: "Yoga" }));
  await page.evaluate(()=>update({history:{}}));
  await page.clock.install();
  await button("Try a two-minute pause").click();
  await button("Begin breathing").click();
  await page.clock.runFor(10000);
  await button("Pause").click();
  const elapsed=await page.evaluate(()=>breath.elapsed);
  await page.clock.runFor(5000);
  assert.equal(await page.evaluate(()=>breath.elapsed),elapsed);
  await button("Resume").click();
  await page.clock.runFor(110000);
  await page.getByRole('heading',{name:'How do you feel?',exact:true}).waitFor();
  await button('More settled').click();
  await button('Save practice and continue').click();
  await page.screenshot({path:'screenshots/breathing-complete-390.png'});
  await button('Back to my day').click();
  assert.equal(await page.getByLabel('Take a quiet breathing break',{exact:true}).isChecked(),true);
  await page.evaluate(()=>update({history:{}}));
  await button('Try a two-minute pause').click();
  await button('Skip practice').click();await button('Skip check-in').click();
  await button('Back to my day').click();
  assert.equal(await page.getByLabel('Take a quiet breathing break',{exact:true}).isChecked(),false);
  await button('Reflect on my day →').click();
  await button('Yes').click();await button('Previous question').click();await button('A little').click();
  await button('Not today').click();for(let i=0;i<6;i++)await button('Skip').click();
  assert.match(await page.locator('.score-number').textContent(),/0.5 \/ 2/);
  await page.screenshot({path:'screenshots/wellbeing-result-390.png'});
  assert.equal(await page.evaluate(()=>localStorage.getItem(KEY).includes('scoreAnswers')),false);
  await page.getByLabel('Close dialog',{exact:true}).click();
  await button('Reflect on my day →').click();for(let i=0;i<8;i++)await button('Skip').click();
  assert.equal(await page.locator('.score-number').textContent(),'No score');
  await page.keyboard.press('Escape');
  console.log('PASS: timed breathing, pause/resume, optional feeling, completion, skip without logging, score/back/all-skip/privacy');
  await persona.selectOption("enrolled");
  await button("Resume demo class").click();
  assert.equal(await page.getByRole("dialog").count(), 1);
  assert.equal(
    await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    ),
    "Close dialog",
  );
  await page.keyboard.press("Shift+Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Close preview",
  );
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    ),
    "Close dialog",
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  assert.match(
    await page.evaluate(() => document.activeElement.textContent),
    /Resume demo class/,
  );
  await button("Resume demo class").click();
  await button("Start demo class").click();
  assert.equal(await page.evaluate(() => state.session), true);
  console.log(
    "PASS: practice logging, class simulation, keyboard trap, Escape and focus restoration",
  );
  for (const tab of ["Recipes", "Workshops", "Explore", "Profile", "Home"]) {
    await page
      .getByRole("navigation")
      .getByRole("button", { name: tab, exact: true })
      .click();
    assert.equal(await page.evaluate(() => state.tab), tab);
  }
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Recipes", exact: true })
    .click();
  await button("Explore →").first().click();
  await page.getByRole("dialog", { name: "Chocolate Milkshake" }).waitFor();
  await page.getByLabel("Close dialog", { exact: true }).click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Workshops", exact: true })
    .click();
  await page.getByLabel("Workshop available", { exact: true }).uncheck();
  await page
    .getByRole("heading", { name: "Daily Yoga Classes", exact: true })
    .waitFor();
  await button("Explore classes →").click();
  await page.getByRole("dialog", { name: "Daily Yoga Classes" }).waitFor();
  await page.keyboard.press("Escape");
  await persona.selectOption("new");
  assert.equal(
    await page.getByRole("button", { name: /Resume demo class/ }).count(),
    0,
  );
  console.log(
    "PASS: five destinations, recipe dialog, evergreen fallback, no free-user class entitlement",
  );
  fs.mkdirSync("screenshots", { recursive: true });
  await page.evaluate(() =>
    update({ onboard: 3, goal: "", history: {}, workshop: true }),
  );
  for (const width of [320, 375, 390, 430, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `overflow at ${width}`,
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(150);
    await page.screenshot({
      path: `screenshots/home-${width}.png`,
      fullPage: true,
    });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await persona.selectOption("enrolled");
  await button("Resume demo class").click();
  await page.screenshot({ path: "screenshots/class-dialog-390.png" });
  await page.keyboard.press("Escape");
  console.log("PASS: viewport overflow checks and six screenshots");
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.persona-icon').evaluate(e=>getComputedStyle(e).animationName),'none');
  assert.equal(await page.locator('.brand-logo').evaluate(e=>e.complete&&e.naturalWidth>0),true);
  assert.equal(await page.getByRole('link',{name:'Read official stories ↗'}).getAttribute('href'),'https://satvicmovement.org/');
  console.log('PASS: reduced motion, supplied SVG loads, official homepage story link');
  const disabled = await browser.newContext();
  await disabled.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("disabled", "SecurityError");
      },
    });
  });
  const dp = await disabled.newPage();
  await dp.goto("http://127.0.0.1:8000");
  await dp.getByRole("status").waitFor();
  await dp
    .getByLabel("Move or stretch for a few minutes", { exact: true })
    .check();
  assert.equal(
    await dp
      .getByLabel("Move or stretch for a few minutes", { exact: true })
      .isChecked(),
    true,
  );
  await context.clearCookies();
  await page.goto("http://127.0.0.1:8000");
  await page.evaluate(() =>
    localStorage.setItem(
      "satvic-prototype-v3",
      JSON.stringify({ persona: "invalid", onboard: 99, history: null }),
    ),
  );
  await page.reload();
  await page
    .getByRole("heading", { name: "Two minutes, just for you", exact: true })
    .waitFor();
  console.log("PASS: storage disabled and malformed persisted state recovery");
  await page
    .getByLabel("Move or stretch for a few minutes", { exact: true })
    .check();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: "Profile", exact: true })
    .click();
  page.once("dialog", (d) => d.accept());
  await page
    .getByRole("button", { name: "Reset demo data", exact: true })
    .click();
  assert.equal(
    await page
      .getByLabel("Move or stretch for a few minutes", { exact: true })
      .isChecked(),
    false,
  );
  console.log("PASS: reset clears locally saved habit history");
  assert.deepEqual(errors, []);
  console.log("PASS: no browser runtime errors");
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
