# Adonnis Blake — Design Engineer Portfolio

A static portfolio showing design-engineering work: two live apps (2DAY and Bucketlist), plus brand and web projects, with case studies, light/dark theming, and five-language support.

<!-- Add your live URL here, e.g. **Live site:** https://adoblake.github.io/portfolio-pe/ -->

## What it demonstrates

- **Front-end craft:** hand-written HTML, CSS, and JavaScript with no framework or build step.
- **Accessibility:** skip link, keyboard-operable modals and accordions, reduced-motion support, and an automated color-contrast check for both themes.
- **Responsive design:** desktop and mobile navigation, scroll-linked workflow section, light/dark theme with saved preference.
- **Internationalization:** English, Español, Français, 简体中文, 日本語 (`i18n.js`), with a translation-key coverage check.
- **Quality habits:** scripted checks for contrast, links, and site structure (see below).

## Stack

HTML · CSS · JavaScript · Python and Node (check scripts) · GitHub Actions

## Run it

```
python3 -m http.server 8000
```

Open `http://localhost:8000`. No backend, account, or build system is required.

## Checks

| Script | What it checks |
| --- | --- |
| `check-site.py` | Site structure and asset references |
| `check-theme-contrast.py` | Text/background contrast in both themes |
| `check-2day-links.js` | Links to the 2DAY app |
| `check-studio-copy.js` | Copy consistency |

## Structure

- `index.html` — home, work, workflow, contact
- `about.html` — about page
- `styles.css` plus `interaction.css`, `navigation.css`, `work-showcase.css`, `scroll-story.css`, `studio-polish.css`, `theme-contrast.css` — layered styles
- `i18n.js` — language packs and selector
- `script.js`, `scroll-story.js` — interactions
- `assets/` — project and portrait images

## Notes

- Linked client sites and app demos are separate products and are not translated by this site's language menu.
- Translations have not had native-speaker review.
