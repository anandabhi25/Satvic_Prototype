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
