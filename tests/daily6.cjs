const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  const c = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await c.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto("http://127.0.0.1:8000");
  assert.equal(await p.getByLabel("Demo persona · simulated").count(), 0);
  assert.ok(
    await p.evaluate(() => document.documentElement.scrollHeight < 2600),
  );
  await p.getByRole("button", { name: "Check in: Calm", exact: true }).click();
  assert.match(await p.getByRole("status").textContent(), /You showed up/);
  assert.equal(await p.evaluate(() => streak()), 0);
  assert.equal(
    await p.evaluate(() => Boolean(state.meaningfulComplete)),
    false,
  );
  await p.reload();
  assert.equal(
    await p
      .getByRole("button", { name: "Check in: Calm", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await p.evaluate(() => {
    state.checkInDate = "2000-01-01";
    render();
  });
  assert.equal(
    await p
      .getByRole("button", { name: "Check in: Calm", exact: true })
      .getAttribute("aria-pressed"),
    "false",
  );
  await p.getByRole("button", { name: "Check in: Okay", exact: true }).click();
  await p.emulateMedia({ reducedMotion: "reduce" });
  assert.equal(
    await p
      .locator(".checkin-sprout")
      .evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  await p.getByRole("switch", { name: "Dark theme", exact: true }).click();
  assert.equal(await p.locator("body").getAttribute("data-theme"), "dark");
  await p.reload();
  assert.equal(await p.locator("body").getAttribute("data-theme"), "dark");
  await p.getByRole("switch", { name: "Switch language", exact: true }).click();
  assert.equal(await p.locator("html").getAttribute("lang"), "hi");
  await p
    .getByRole("heading", { name: "आज आप कैसा महसूस कर रहे हैं?", exact: true })
    .waitFor();
  await p.screenshot({
    path: "screenshots/daily6-hindi-dark.png",
    fullPage: true,
  });
  await p.reload();
  assert.equal(await p.locator("html").getAttribute("lang"), "hi");
  await p.getByRole("switch", { name: "Switch language", exact: true }).click();
  await p.getByRole("switch", { name: "Dark theme", exact: true }).click();
  await p
    .getByRole("button", { name: "What is new in this concept?", exact: true })
    .click();
  await p
    .getByRole("dialog")
    .getByRole("heading", { name: "What is new in this concept?", exact: true })
    .waitFor();
  await p.keyboard.press("Escape");
  await p
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("button", { name: "Profile", exact: true })
    .click();
  await p.locator(".demo-settings summary").click();
  await p.getByLabel("Demo persona · simulated").selectOption("enrolled");
  await p
    .getByRole("heading", { name: "Namaste, Anand", exact: true })
    .waitFor();
  await p
    .getByRole("button", { name: "Resume demo class", exact: true })
    .click();
  await p.getByLabel("Playback speed", { exact: true }).selectOption("0.5");
  await p.getByLabel("Video quality", { exact: true }).selectOption("saver");
  assert.equal(await p.evaluate(() => player.quality), "saver");
  await p.keyboard.press("Escape");
  await p
    .getByRole("navigation", { name: "Primary navigation" })
    .getByRole("button", { name: "Profile", exact: true })
    .click();
  await p.locator(".demo-settings summary").click();
  await p.getByLabel("Demo persona · simulated").selectOption("new");
  await p.evaluate(() => {
    completedFree("recipe");
    render();
  });
  await p
    .getByRole("button", { name: "Choose my next step", exact: true })
    .click();
  assert.equal(await p.locator(".next-step-options article").count(), 4);
  assert.match(
    await p.getByRole("dialog").textContent(),
    /no purchase is required/,
  );
  await p.keyboard.press("Escape");
  for (const width of [320, 390, 430, 1440]) {
    await p.setViewportSize({ width, height: 900 });
    await p.waitForTimeout(150);
    assert.ok(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.screenshot({
      path: `screenshots/daily6-${width}.png`,
      fullPage: true,
    });
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS: compact mobile, daily check-in persistence/day reset/no streak inflation, reduced motion, Hindi preview/theme persistence, persona settings, patch player controls, voluntary next steps and responsive screenshots",
  );
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
