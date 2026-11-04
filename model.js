// Pure v2 policy functions. Evidence describes research inputs, never measured outcomes.
(function (root) {
  const sources = {
    R1: "https://play.google.com/store/apps/details?id=com.satvic.movement&hl=en_IN",
    R8: "https://linktr.ee/satvic.food",
    R9: "https://satvicmovement.org/workshops/onepotmeals/",
    R10: "https://dev.marketplace.satvicmovement.org/collections/all-products",
    S3: "https://satvicmovement.org/",
    S6: "https://satvicmovement.org/workshops/yoga-sadhana-beginner/subscription/",
  };
  const faqs = [
    {
      id: "free",
      match: /free|recipe/i,
      source: "R8",
      answer:
        "The Satvic Food channel promotes free recipes. Explore the official recipe entry point; this demo also includes an original free fruit-bowl guide.",
    },
    {
      id: "notes",
      match: /notes|expir|recording|resource/i,
      source: "R9",
      answer:
        "Recording and material access depend on the program and its terms. My Learning shows illustrative sample rights only; confirm your actual notes and recording expiry on the official program page.",
    },
    {
      id: "replay",
      match: /replay|rewind|video|speed|preview/i,
      source: "S6",
      answer:
        "This prototype offers a simulated beginner timeline with pause, replay, rewind and speed controls. It is not a real Satvic video; confirm actual program previews and playback rights on the official page.",
    },
    {
      id: "class",
      match: /class|session|timetable/i,
      source: "R1",
      answer:
        "My Learning contains sample classes only. Your actual class link requires your authenticated Satvic account; this guide cannot see enrollment or your timetable.",
    },
    {
      id: "price",
      match: /pric|renew|cost|inclusion|workshop/i,
      source: "R9",
      answer:
        "Confirm the total charge, billing term, renewal and included materials on the official program page. We do not have verified current prices; the ₹50–₹250 cards here are research concepts, not Satvic inventory.",
    },
    {
      id: "support",
      match: /refund|sign.in|login|payment|subscription|support/i,
      source: "S3",
      answer:
        "I cannot verify account, payment or refund eligibility. Use the official website to contact the Satvic team; no support ticket is created by this demo.",
    },
    {
      id: "store",
      match: /book|store|shop|community|potluck/i,
      source: "R10",
      answer:
        "Explore includes books/store and community discovery. The supplied store is an external development marketplace; confirm availability before any purchase.",
    },
  ];
  function faq(text) {
    const aliases = [
      ["रेसिपी", "recipe"],
      ["मुफ़्त", "free"],
      ["नोट्स", "notes"],
      ["वीडियो", "video"],
      ["कीमत", "price"],
      ["रिफ़ंड", "refund"],
      ["क्लास", "class"],
      ["इलाज", "medical"],
      ["दवा", "medical"],
    ];
    for (const [hi, en] of aliases) if (text.includes(hi)) text += " " + en;
    if (
      /medical|medic|cure|disease|diagnos|pregnan|diabet|fasting|emergency|symptom|pain/i.test(
        text,
      )
    )
      return {
        id: "medical",
        source: "S3",
        answer:
          "I cannot give medical advice or assess symptoms. Please consult a qualified clinician; for an emergency contact local emergency services.",
      };
    return (
      faqs.find((f) => f.id === "support" && f.match.test(text)) ||
      faqs.find((f) => f.match.test(text)) || {
        id: "unknown",
        source: "S3",
        answer:
          "I can't verify this for your program; contact the Satvic team.",
      }
    );
  }
  function next(persona, enrollments = []) {
    const unique = [
      ...new Map(enrollments.map((e) => [e.id, e])).values(),
    ].filter((e) => e.eligible && !e.expired);
    const current = unique
      .filter((e) => e.live)
      .sort((a, b) => a.order - b.order)[0];
    if (current) return { kind: "live", id: current.id };
    if (unique.length) return { kind: "recording", id: unique[0].id };
    return { kind: persona === "returning" ? "free-resume" : "starter" };
  }
  const offers = [
    {
      price: 50,
      title: "Meal-prep mini checklist",
      benefit: "One original planning checklist",
      term: "Proposed: 7 days access",
    },
    {
      price: 100,
      title: "Three-day starter",
      benefit: "Three short practices and a reflection sheet",
      term: "Proposed: 14 days access",
    },
    {
      price: 200,
      title: "Technique class preview",
      benefit: "One focused technique lesson and practice notes",
      term: "Proposed: 7 days access",
    },
    {
      price: 250,
      title: "Gentle themed challenge",
      benefit: "Three lessons and a progress sheet",
      term: "Proposed: 14 days access",
    },
  ];
  function dayStreak(history, key) {
    const d = new Date(key + "T12:00:00");
    const date = (x) =>
      `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    if (!history[date(d)]?.length) d.setDate(d.getDate() - 1);
    let count = 0;
    while (history[date(d)]?.length && count < 3660) {
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }
  const api = { sources, faqs, faq, next, offers, dayStreak };
  root.V2 = api;
  if (typeof module !== "undefined") module.exports = api;
})(globalThis);
