# Accessibility review — November 14, 2026

Target: WCAG 2.2 Level AA for the portfolio Home and About pages and their shared navigation, project/image dialogs, and inquiry form. This is an implementation review, not a conformance certification. Linked apps and the separately linked Society 5ive demonstration are outside this review.

## Findings and changes

1. **Home navigation — checks pass.** The logo and theme controls now derive their accessible names from their visible labels. Project-image controls have localized names that include their visible project numbers. Labeled content groups have valid group semantics. Skip links transfer keyboard focus to their destination; anchor/focus scroll offsets account for the fixed header. Relevant criteria: 1.3.1, 2.4.1, 2.4.7, 2.4.11, 2.5.3, 4.1.2.
2. **Mobile navigation — checks pass.** The closed panel is removed from focus/navigation with native `hidden`. Escape closes the menu and returns focus to its opener. Changing navigation breakpoints closes stale menus and relocates focus when needed. Relevant criteria: 2.1.1, 2.1.2, 2.4.3, 4.1.2.
3. **Project and image dialogs — checks pass.** Closed dialogs are hidden and inert. Opening focuses the actual Close button rather than the non-focusable backdrop; background content becomes inert. Forward/reverse Tab cycles stay inside. Escape and Close restore the opener. The image dialog is named by its caption, and the examples toggle identifies its controlled region. Relevant criteria: 2.1.1, 2.1.2, 2.4.3, 4.1.2.
4. **Inquiry form — checks pass.** Existing explicit labels and native required/email validation remain in use; name and email now have appropriate autocomplete purposes. Invalid submission focuses the first missing field. Tests do not send an email. Relevant criteria: 1.3.5, 3.3.1, 3.3.2, 4.1.2.
5. **About and responsive content — checks pass.** Skip navigation works on About. Translated hero/workflow content wraps instead of widening a 320px layout. Shared product-case layouts remain intact. English text-spacing overrides were checked at 1440, 390, and 320px for horizontal overflow. Relevant criteria: 1.4.10, 1.4.12.

## Verification

- Playwright/Chromium and axe-core 4.14.0: **46 states, zero automated violations** for WCAG A/AA rules through 2.2 and axe best practices. The matrix covers both pages, light/dark, 320/1440px, and English, Spanish, French, Simplified Chinese, and Japanese; additional scans cover open menus and dialogs.
- Keyboard checks cover skip links, initial modal focus, forward/reverse focus wrapping, Escape, focus return, closed-dialog exclusion, and invalid form inputs.
- Existing JavaScript, link/asset, translation-copy, and 20 palette-contrast checks pass. The existing reduced-motion CSS is preserved.
- `tests/accessibility.cjs` is a repeatable browser regression test. GitHub Actions installs its pinned tools outside the checkout and runs it on pull requests and main pushes. The existing validation YAML was also corrected so the contrast command actually runs as a separate command.
- Local evidence and raw axe results are saved under `/workspace/review/accessibility/`. The inspected sequence is `01-home-navigation.png`, `02-mobile-navigation.png`, `03-project-dialog.png`, `04-inquiry-dialog.png`, and `05-about.png`; `verified-axe.json` retains both violations and incomplete/manual-review results. These local artifacts are not deployed website content.

## Remaining manual verification

Automated success does not establish full WCAG conformance. Axe cannot resolve some contrast checks over gradients, photographs, and composited backgrounds; those remain explicitly marked incomplete in the results. The palette contrast script and screenshot review supplement, but do not replace, a complete rendered-pixel contrast review.

Before claiming conformance, perform an end-to-end screen-reader review (for example NVDA with Firefox and VoiceOver with Safari), real browser zoom/text-resize checks, touch/assistive-input tests, and a semantic review of screenshot alternatives and translated content. Physical-device behavior and the external mail application's accessibility were not verified. No accessibility certification or guarantee is implied.

## Repeat locally

With Node.js 24, Python 3, and an installed browser:

```sh
npm install --prefix /tmp/portfolio-a11y-tools --no-save --ignore-scripts playwright@1.62.1 axe-core@4.14.0
python3 -m http.server 8010 --bind 127.0.0.1
```

In another terminal, use a system Chromium or install Playwright's browser using its CLI:

```sh
NODE_PATH=/tmp/portfolio-a11y-tools/node_modules BROWSER_EXECUTABLE=/usr/bin/chromium node tests/accessibility.cjs
```

`APP_URL` overrides the server address; `A11Y_RESULTS` saves full JSON results. Omit `BROWSER_EXECUTABLE` to use Playwright's installed Chromium. Test dependencies do not change the portfolio's dependency-free runtime.
