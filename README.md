# Adonnis Blake — Product Engineer Portfolio

**Round 31.7 — Interactive workflow and full-site language controls**

This static site is based on **Round 31.6.4**, using its exact layout, images, project cards, typography, and About page as the starting point.

## What's new
- Scroll-linked workflow focus: the left preview emphasizes whichever step on the right is nearest the center of the viewport. `<details>` tabs remain manually expandable and keyboard-accessible.
- Subtle hero portrait depth during desktop scrolling; small project-card reveal/hover motion.
- Motion automatically reduces or stops when the visitor requests reduced motion.
- Full portfolio-language selection in desktop and mobile menus: English, Español, Français, 简体中文, 日本語.
- Translation covers the **portfolio site**: Home, About, headings, content, workflow explanations, selected project cards, project details, inquiries and select menus. Proper project/brand names and images retain their original artwork.
- Language selection persists via local storage and a `?lang=` link parameter between Home and About. English remains the default.
- Replaced an old JavaScript file that referred to outdated modal IDs, so project/image/inquiry modal handlers now match the actual markup.

## Run it
Open `index.html` in a browser, or serve the folder as static files. For example, from this directory:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`. No backend, account, external localization API, or build system is required.

## Files
- `index.html`: Home / work / workflow
- `about.html`: About page
- `styles.css`: original Round 31.6.4 styles
- `interaction.css`: small additions for the motion, controls and modal layouts
- `i18n.js`: human-authored language packs and selector logic
- `script.js`: interactions and translated project dialogs
- `assets/`: original project and portrait assets

**Note:** External client sites and separately linked app demonstrations are independent products and are not translated by this portfolio's menu. Professional native-speaker copy review is recommended before public launch.

**Validation:** HTML asset references, script syntax, translation-key coverage, and CSS parsing were checked. Automated Chromium preview was blocked by this environment's browser policy, so complete visual/interaction QA still needs to be performed in a real browser before deployment.
