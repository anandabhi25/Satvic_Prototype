# Your Satvic Today

A mobile-first candidate concept for the Satvic Movement dashboard, improved from the supplied standalone starter. Built with vanilla HTML, CSS and JavaScript. This is **not an official Satvic product**.

## Run

From this repository:

```sh
python3 -m http.server 8000
```

Visit port 8000 in your own development browser. The app has no runtime package dependencies, API credentials, account connection, checkout, or build step. Serve over HTTP to use browser persistence reliably.

## Explore

- Switch the clearly labeled demo persona between new, returning, enrolled and completed learners.
- Complete or skip three-step onboarding; Food, Yoga or Both can be changed later.
- Open a free breathing prompt or resume the simulated enrolled program.
- Toggle or undo four optional daily habits. Streaks use local calendar dates and retain yesterday's streak until today's first check-in.
- Explore Home, Recipes, Workshops, Explore (Shop and Potluck), and Profile.
- Switch off workshop availability to see evergreen yoga discovery.
- Open recipe and class dialogs; Escape, close controls, focus trapping and focus restoration are supported.
- Profile offers a simulated reminder preference and a confirmed local-data reset.

Storage is local to this browser, not a real account. If storage is disabled, changes remain usable for the current visit. Class progress and availability are explicitly simulated. No real enrollment, schedule, video playback, notification delivery or payment is implemented.

## Test

Node.js and Chromium are needed only for the test suite:

```sh
npm ci
# Debian/Ubuntu: install Chromium through your OS package manager if absent.
npm test
# Or select an existing Chromium executable:
CHROMIUM_PATH=/path/to/chromium npm test
```

Keep the Python server running on port 8000 during tests. The suite uses Playwright with system Chromium (`/usr/bin/chromium` by default), asserts actual interactions and creates screenshots in `screenshots/`. See [QA_REPORT.md](QA_REPORT.md) for results and limits.

## Files and provenance

- `index.html`, `styles.css`, `app.js`: standalone application and deterministic `resolveNextAction()`.
- `assets/`: original screenshot-derived images supplied in `satvic_prototype.zip`, retained for research/prototyping. Recipe crops exclude embedded rating badges. The meal-planning screenshot is identified as illustrative rather than a photo of the named smoothie.
- `tests/prototype.cjs`: automated browser checks.
- `screenshots/`: captured concept views after onboarding plus simulated class dialog.

Source links are retained from the supplied brief. The dashboard reference could not be accessed from this cloud environment (HTTP proxy 403); no claim is made that external links, current cohorts, prices or availability were live-verified. The marketplace link is explicitly labeled as an external development store. These images are not represented as licensed production promotional assets.

## Design

Warm cream surfaces, forest-green actions, editorial serif headings, restrained lime illuminated button borders, generous spacing, local imagery and reduced-motion support. Primary recommendations are deterministic demo fixtures: enrolled content, last free practice, continued consistency or a beginner step. Real active-class priority requires authoritative entitlement and schedule data; no live class is invented in this prototype.

## Public browser preview with GitHub Pages

The root directory is ready for static GitHub Pages hosting (`.nojekyll` disables Jekyll processing). A repository administrator can enable it at:

https://github.com/anandabhi25/Satvic_Prototype/settings/pages

Choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**. GitHub will display the deployment URL when the build succeeds. The expected project URL is `https://anandabhi25.github.io/Satvic_Prototype/`; it is not confirmed live merely by committing these files. If Pages is unavailable for this repository's visibility and account plan, GitHub's settings will show that limitation; do not change repository visibility without explicit approval.
