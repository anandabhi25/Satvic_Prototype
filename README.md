# Your Satvic Today — Research v2

A fully local, vanilla HTML/CSS/JavaScript candidate concept. It is **not an official Satvic product**, and it does not claim to fix the live app or reproduce reported production defects.

## Run and test

From `/workspace/Satvic_Prototype`:

```sh
python3 -m http.server 8000
```

Keep that server running. For browser tests in a second terminal:

```sh
npm ci
npm test
```

Tests require Node.js and Chromium at `/usr/bin/chromium`, or set `CHROMIUM_PATH` to an installed Chromium executable. On Debian/Ubuntu install Chromium using the OS package manager if absent. Serving the application needs only Python 3; there is no build, paid key or account credential. GitHub Pages serves these files directly. Versioned asset URLs distinguish this release (`research-v2`).

## Demo runbook

1. **Curious Kavya:** complete or skip optional onboarding. Try the free two-minute pause, or Recipes → Quick & Easy → Simple fruit bowl. The fruit-bowl guide is original prototype content; use its practical-completion control after preparing it. Checkbox-only habit logging does not unlock experiments.
2. After completing a breathing practice or using the recipe, explore optional ₹50/₹100/₹200/₹250 concepts. Every card says **Concept only — not available to purchase**, describes proposed benefits/terms and collects only local demo interest. No payment, reservation or contact collection occurs.
3. **Committed Anand:** resume the sample lesson from Home. Play/pause, rewind 10 seconds, seek, replay and select 0.75× or 1× speed. This is an original simulated 90-second timeline, not licensed Satvic video. My Learning includes sample notes, progress and fixed illustrative access terms referenced to 3 November 2026.
4. In My Learning, switch current/recording/expired/empty/duplicate enrollment cases. Current sample class wins; eligible recording follows; absent or expired rights lead to free discovery. Duplicate records do not create duplicate classes.
5. Search/filter recipes, save/unsave and return from detail without losing category or scroll. The screenshot-derived Chocolate Milkshake and Glowing Green Juice are **Preview**, with official source links; do not mistake them for locally available full recipes. The official free collection is linked separately.
6. Ask **Satvic Saathi** about free recipes, notes, replay, class access, pricing, sign-in/refunds or store. It uses illustrative allowlisted FAQ records with source IDs, feedback controls and official-site human-support fallback. It cannot see account data, invent policies or provide medical advice.
7. Explore retains Workshops, Daily Yoga preview, Shop/books and Potluck. Current program prices, schedules, renewal and expiry are unknown: confirm on the official source. Switching workshop availability off shows evergreen content.
8. Profile contains the local demo event log and reset. No event stream, chat, wellbeing answers or referral analytics are sent to a server. Device-local preference/history data and random referral codes can persist if storage permits.

## Structure

- `model.js`: pure resolver, FAQ/source register, concept definitions and calendar streak; directly unit-tested.
- `v2.js`: recipe library, sample learning resources, simulated player, source-bound FAQ, concept dialogs and local telemetry.
- `app.js`: application state, navigation, personas, rendering and modal accessibility.
- `journey.js`: breathing and optional non-clinical wellbeing reflection.
- `community.js`: demo friend invitation generation/copy/share; earlier discovery guide is superseded by the v2 FAQ.
- `styles.css`, `assets/`: supplied logo, screenshot-derived images and cream/sage/earth styling. Images are research materials, not a commercial rights clearance. The simple fruit-bowl image is explicitly illustrative.
- `tests/model.cjs`, `tests/research-v2.cjs`: current unit and browser suites. `tests/prototype.cjs` is the historical pre-v2 suite, retained for reference and superseded because navigation and FAQ behavior changed.
- `screenshots/v2-*`: current-release evidence. Earlier screenshot filenames are historical.
- `QA_REPORT.md`, `EVIDENCE_AND_BACKLOG.md`: executed checks, limitations, source classes and deferred work.

## Existing features retained

The calm header, supplied logo, four animated persona symbols/reduced-motion fallback, breathing journey, optional wellbeing habits reflection, five app destinations, demo invitations and official story-discovery link remain. Referral codes have no account attribution, rewards or tracking. The story card directs users to the official homepage; individual stories were not independently verified. No credentials are required.

## Layout 5 — website-inspired dashboard

The personalized app now expands into a spacious desktop layout, retaining the supplied logo and website-style header. Home follows the agreed sequence: next action → free recipes/practice → My Learning overview → wellbeing → optional programs/concepts → referrals → official stories. Desktop provides app tabs and sticky section links with keyboard focus destinations; mobile keeps bottom navigation and stacked sections. Cream/sage/teal bands, earthy pill buttons with restrained decorative glow, larger imagery and editorial headings follow the supplied official-site references. The live official site still returned HTTP 403, so no pixel-exact reproduction or current-site CSS extraction is claimed.

Satvic Saathi has both a discreet persistent launcher and a visible chat entry in the programs section. It remains the research-defined source-bound FAQ chatbot. All access, preview and proposed-price labels remain. Current asset version is `satvic-layout-5`; the footer reads **Layout 5**. Screenshots `layout5-desktop.png` and `layout5-mobile.png` capture the new layout; the `v2-*` functional captures are refreshed by the same test suite.
