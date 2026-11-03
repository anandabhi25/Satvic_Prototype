const assert = require("node:assert/strict");
const m = require("../model.js");
assert.equal(m.next("new", []).kind, "starter");
assert.equal(m.next("returning", []).kind, "free-resume");
const rec = { id: "a", eligible: true, live: false, expired: false, order: 2 };
const live = { id: "b", eligible: true, live: true, expired: false, order: 1 };
assert.equal(m.next("enrolled", [rec, live]).id, "b");
assert.equal(m.next("enrolled", [rec, rec]).kind, "recording");
assert.equal(m.next("enrolled", [{ ...rec, expired: true }]).kind, "starter");
assert.equal(m.next("enrolled", [{ ...rec, eligible: false }]).kind, "starter");
assert.equal(m.faq("Which recipes are free?").id, "free");
assert.equal(m.faq("notes expiry").id, "notes");
assert.equal(m.faq("refund").id, "support");
assert.equal(m.faq("unicorn account secret").id, "unknown");
assert.equal(m.faq("cure diabetes with free recipes").id, "medical");
for (const f of m.faqs) assert.ok(m.sources[f.source]);
assert.deepEqual(
  m.offers.map((x) => x.price),
  [50, 100, 200, 250],
);
for (const o of m.offers) {
  assert.ok(o.benefit);
  assert.match(o.term, /Proposed/);
}
assert.equal(
  m.dayStreak({ "2026-11-02": [0], "2026-11-03": [0, 1, 2] }, "2026-11-03"),
  2,
);
assert.equal(m.dayStreak({ "2026-11-02": [0] }, "2026-11-03"), 1);
assert.equal(m.dayStreak({}, "2026-11-03"), 0);
console.log(
  "PASS: pure resolver priorities, empty/expired/duplicate/unauthorized cases, FAQ allowlist/fallback, offer terms and calendar streak",
);
