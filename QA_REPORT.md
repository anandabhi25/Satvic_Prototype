# Prototype QA — 3 November 2026

## Verified

Ran `npm ci`, `node --check app.js`, `npm test` and `git diff --check` in the cloud environment. Application served by Python on port 8000; browser checks used headless system Chromium with the Asia/Kolkata timezone. Final browser suite passed all nine reported check groups, with no uncaught browser runtime errors.

1. All four personas display their expected primary recommendation.
2. Three-step onboarding completes; optional interest and completion persist after reload; skipping works.
3. Habits toggle, undo and persist across reload. Dated history covers today/yesterday continuity and a broken sequence.
4. Free practice opens and logs a breathing break idempotently. Enrolled class simulation marks a session started.
5. Dialog keyboard focus enters the close control, wraps forward/backward, closes with Escape, and returns to the trigger. Close control also tested.
6. All five navigation destinations work. Recipe dialog opens with the correct title. Unavailable workshops lead to evergreen yoga. New users have no enrolled-resume CTA.
7. No document horizontal overflow at 320, 375, 390, 430 and 1280px. Recipe cards intentionally scroll inside their own row.
8. Storage-disabled mode remains interactive and announces its limitation. Malformed persisted state recovers to useful defaults.
9. Confirmed reset clears saved habit history.

## Visual review

Inspected generated mobile and desktop captures. Preserved green/cream styling, supplied imagery, Anand, all destinations and demo labeling. Added subtle illuminated primary buttons. Cropped recipe imagery to omit screenshot rating badges; retained source assets unchanged. Screenshot views show onboarding completed; the fresh-browser onboarding is tested separately.

Artifacts: `screenshots/home-{320,375,390,430,1280}.png`, `screenshots/class-dialog-390.png`. Fixed navigation appears at the viewport bottom within full-page screenshots; it stays at the window bottom during normal scrolling.

## Pending and limitations

- Manual end-to-end keyboard review and VoiceOver/screen-reader testing are pending. Automated keyboard checks do not establish screen-reader usability or WCAG 2.2 AA conformance.
- Physical iOS/Android devices, Safari/Firefox, zoom, high-contrast settings and a complete contrast/accessibility audit are pending. Reduced-motion rules are implemented but were not separately audited.
- No real accounts, entitlements, live schedules, video, reminders, notifications, commerce, analytics collection or medical recommendations are connected. Active-class precedence and multiple real enrollments require future authoritative data integration.
- The requested dashboard URL returned proxy HTTP 403. External source pages, marketplace and current program details were not live-validated. The UI directs people to the source rather than inventing availability or price.
- Supplied visual assets are research materials, not a production licensing assertion. The app makes no new efficacy, cure, testimonial, rating or payment-success claims.
- Repository tests verify browser behavior and selected calendar sequences; daylight-saving transitions, midnight rollover while continuously open, storage quota failure after startup and cross-tab synchronization were not separately tested.

This is a working concept prototype, not a production-readiness certification.

## November 3 update: first-value journey

Added the supplied SVG logo on a green backing for contrast, mint/cream/terracotta styling, four animated persona symbols and reduced-motion fallback. Added a two-minute breathing guide with a natural-breathing alternative, pause/resume, skip, optional feelings check-in and completion choices. Only a completed practice is logged; skipping does not count as completion. Feelings are ephemeral. The optional eight-question wellbeing score excludes skipped answers, explains its arithmetic, handles all-skipped input without inventing a score and keeps answers in memory only.

Updated automated Chromium checks cover a full 120-second journey using Playwright's controlled clock, a paused interval, resume, optional check-in, completed-practice logging, skipping without logging, scoring/back navigation/all-skip, no score answers persisted, reduced-motion CSS, SVG loading and the official homepage link. Existing persona, onboarding, persistence, focus, navigation, viewport and storage recovery tests remain in the suite. Updated mobile/desktop screenshots plus breathing completion and wellbeing result captures are included. Manual VoiceOver and real-device review remain pending.

The official homepage returned HTTP 403 from the cloud environment. The Stories of Success card therefore links to the user-specified official homepage and explicitly directs users to its Stories of Success section. Individual story URLs, current testimonial copy and images were not retrievable or verified and have not been fabricated. Colors follow the user-supplied visual references rather than a live site CSS extraction.

## Reference header update

Added a full-width muted green website header with supplied white logo, desktop navigation dropdowns, Contact Us pill and a compact mobile menu. Added browser checks for mobile opening/closing, Escape, dropdown navigation to Recipes and Workshops, and desktop dropdown access. Existing full interaction suite and 320/375/390/430/1280px overflow checks are retained; screenshots refreshed. Careers and Contact intentionally lead to the official homepage because dedicated route URLs remain unverified. Shop/Books clearly identify the supplied external development store. This update does not assert external-link reachability. Manual screen-reader and real-device checks remain pending.
