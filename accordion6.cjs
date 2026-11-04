// Accordion daily check-in + celebration (5 Nov 2026), built on the Daily 6 check-in.
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium", args: ["--no-sandbox"] });
  const errors = [];
  const fresh = async (o = {}) => {
    const c = await browser.newContext({ viewport: { width: 390, height: 844 }, timezoneId: "Asia/Kolkata", ...o });
    const p = await c.newPage();
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("http://127.0.0.1:8000/");
    await p.waitForSelector("h1");
    return p;
  };
  let p = await fresh();
  const calm = p.getByRole("button", { name: "Check in: Calm" });
  assert.equal(await calm.isVisible(), true, "open by default");
  assert.equal(await p.locator(".ci-sum small").innerText(), "Takes 10 seconds");
  await p.locator(".check-accordion > details > summary").click();
  assert.equal(await calm.isVisible(), false);
  await p.reload();
  assert.equal(await p.getByRole("button", { name: "Check in: Calm" }).isVisible(), false, "collapsed state persists");
  await p.locator(".check-accordion > details > summary").click();
  await p.getByRole("button", { name: "Check in: Calm" }).click();
  assert.equal(await p.locator(".ci-burst i").count(), 16);
  assert.equal(await p.locator(".check-accordion.celebrate").count(), 1);
  assert.equal(await p.locator(".ci-ring.done").count(), 1);
  assert.equal(await p.locator(".ci-sum small").innerText(), "Done for today");
  await p.getByRole("button", { name: "Check in: Tired" }).click();
  assert.equal(await p.locator(".ci-burst").count(), 0, "changing the answer does not re-celebrate");
  assert.equal(await p.evaluate(() => state.meaningfulComplete || false), false, "check-in is not a completed practice");
  console.log("PASS: check-in accordion collapses and persists; celebration only on the first check-in of the day; no inflated progress");
  const rm = await fresh({ reducedMotion: "reduce" });
  await rm.getByRole("button", { name: "Check in: Okay" }).click();
  assert.equal(await rm.locator(".ci-burst").evaluate((e) => getComputedStyle(e).display), "none");
  console.log("PASS: celebration hidden under reduced motion");
  p = await fresh();
  await p.evaluate(() => setPreference("language", "hi"));
  assert.match(await p.locator(".ci-sum").innerText(), /रोज़ का चेक-इन/);
  assert.equal(await p.locator("details.check-accordion, .check-accordion > details").count(), 1);
  for (const w of [320, 390]) { await p.setViewportSize({ width: w, height: 800 }); assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)); }
  console.log("PASS: Hindi summary text and no sideways scroll at 320/390");
  assert.deepEqual(errors, []);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
