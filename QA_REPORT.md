# Research v2 QA — 3 November 2026

Candidate concept, not an official Satvic application. This report covers the current `research-v2` release; previous screenshot filenames and `tests/prototype.cjs` describe historical releases.

## Executed environment and commands

Cloud Linux, Python HTTP server on port 8000, system Chromium via Playwright, Asia/Kolkata browser timezone. `npm test` runs `tests/model.cjs` and `tests/research-v2.cjs`. `node --check` and `git diff --check` supplement the functional tests. Browser time is advanced with Playwright's controlled clock for breathing and lesson playback; no live media or account service is used.

## Current results

| Check | Outcome | Evidence |
|---|---|---|
| Resolver priority, no/expired/duplicate/unauthorized enrollment fixtures | PASS | Pure model assertions; current sample class precedes recording, then free resume/starter |
| FAQ allowlist, medical boundary, unknown fallback, source IDs | PASS | Pure assertions and browser source-link queries |
| Proposed offer definitions and calendar streak | PASS | Pure benefits/terms/price and consecutive-calendar-day assertions |
| Four personas and optional onboarding completion/skip/reload | PASS | Browser interactions; food-interest opens original free guide |
| Habit toggle/undo/reload; checkbox does not unlock concepts | PASS | Browser assertions on streak, persistence and gated concept cards |
| Recipe search/filter/save/unsave/reload and detail back restoration | PASS | Category and exact scroll-offset assertions |
| Practical free recipe completion and optional concepts | PASS | No offer cards before meaningful completion; four labeled cards after completion; local intent event |
| Beginner timeline play/pause/rewind/replay/seekable control and 0.75× speed | PASS for play/pause/rewind/replay/speed/keyboard seek | Browser clock and numeric timeline assertions; keyboard seek is tested; direct pointer-drag behavior is NOT TESTED |
| My Learning notes and current/recording/expired/empty/duplicate cases | PASS | Browser resource title, expiry and hidden-access assertions |
| Source-bound FAQ, feedback, unknown reply and support link | PASS | Browser clicks, source URLs and local event assertions |
| No workshop → evergreen; unknown total/term disclosure | PASS | Browser toggle and pricing-dialog text |
| Complete breathing practice unlocks optional ideas | PASS | Controlled 120-second journey; completion state assertion |
| 320/375/390/430/1280px document overflow | PASS | Browser width assertions and captured screenshots |
| Escape dialog close, mobile menu close, reduced motion | PASS for tested paths | Browser key actions and computed animation assertion; full keyboard traversal audit is NOT TESTED |
| Retained wellbeing and referrals | PASS for all-skip result, copy and arrival | Clipboard content and invitation/free-practice route assertions |
| Storage-disabled operation and uncaught page errors | PASS | Separate denied-storage context; no uncaught page errors in tested main flow |

## Current screenshots

- `screenshots/v2-home-{320,375,390,430,1280}.png`: home after a completed free action, not a fresh install.
- `screenshots/v2-enrolled.png`: sample current-class persona.
- `screenshots/v2-player.png`: simulated timeline at gentle speed.
- `screenshots/v2-concepts.png`: four explicitly non-purchasable price hypotheses.
- `screenshots/v2-faq.png`: source-bound FAQ and fallback.

Mobile home and player screenshots were visually reviewed during implementation. Fixed bottom navigation and the help launcher appear at the viewport bottom within full-page screenshots, as they do during normal scrolling.

## Open issues and limits

| Item | Severity / scope | Status |
|---|---|---|
| Full VoiceOver/screen-reader, contrast/zoom and WCAG 2.2 AA audit | Medium before broader testing | NOT TESTED; no certification claim |
| Physical iOS/Android devices and Safari/Firefox | Medium | NOT TESTED |
| Native share sheet, clipboard-denial fallback and range-pointer dragging | Low for concept | Implemented, NOT TESTED on real devices |
| Real workshop access, live class schedule, current price, billing and support policies | Production dependency | No connected backend; illustrative fixtures only |
| Official sources' present availability and per-story URLs | External verification gap | Not live-validated in this release; supplied research/source ledger used with attribution |
| Startup freezes, latency, buffering and crash diagnosis | Post-prototype engineering | NOT IMPLEMENTED; no production-fix claim |
| Cohort conversion, retention, affordability and margin hypotheses | Research | NOT MEASURED; no numerical uplift claimed |
| Offline network recovery, quota errors, cross-tab sync and midnight/DST rollover | Later robustness checks | NOT TESTED in current suite |

See `EVIDENCE_AND_BACKLOG.md` for REVIEW/OFFICIAL/SCREENSHOT/HYPOTHESIS/PROPOSAL boundaries and separate phase-2 work. No checkout, enrollment, refund, testimonial outcome, referral reward or production analytics event is fabricated.

## Layout 5 update — 3 November 2026

`npm test` passed after restructuring Home into the requested seven sections and expanding desktop widths. New browser assertions verify exact section order, a desktop hero wider than 1000px at 1440px viewport width, primary heading scale, static desktop app navigation, section-link focus transfer, the embedded Satvic Saathi entry point, fixed mobile bottom navigation and hidden mobile section links. Existing 320/375/390/430/1280 overflow checks, unit tests and all functional regressions passed. Current captures include `layout5-desktop.png` and `layout5-mobile.png` in addition to refreshed `v2-*` screenshots. Main-flow browser error capture remained empty.

The design retains the logo, website header, earthy/sage/cream palette, imagery and subtle button glow. The desktop home screenshot was visually reviewed; a small inherited card-heading style discovered during that review was corrected and its resulting headline scale is now asserted. Source access was retried and returned HTTP 403; supplied visual references were used. GitHub Pages deployment and live content cannot be independently verified from this environment. Manual screen-reader, physical-device and full contrast certification remain pending as above.

## Daily 6 — 4 November 2026

The candidate mail patch applied cleanly after `git apply --check`. Its browser-test caveat is superseded by the executed Daily 6 suite: model, adapted research-v2 regressions and `tests/daily6.cjs` pass. Tests cover moving sample personas to Profile, a shorter mobile Home (fresh 390px page under 2600 CSS pixels), check-in state/reload/day reset without practice-streak or offer unlocking, reduced-motion animation, English/Hindi preview and light/dark persistence, 0.5×/illustrative data-saver selection, post-value voluntary next-step cards, comparison dialog and 320/390/430/1440 overflow checks. Existing desktop order/navigation, recipe, learning, FAQ, wellbeing, referral and storage-denied checks continue to pass. Responsive tests wait for breakpoint rerenders before reading computed styles.

Screenshots: `screenshots/daily6-{320,390,430,1440}.png` and `daily6-hindi-dark.png`. English mobile and Hindi/dark captures were visually reviewed; badge/footer dark contrast was corrected after review. Native Hindi copy review, full translation coverage for lengthy source/demo details, full contrast certification, physical-device tests and genuine video data-saving remain pending. No conversion uplift is claimed; purchases, referral rewards and actual payments remain unconnected. Latest interface assets use `daily-6` without a visible build label; candidate disclosures remain.
