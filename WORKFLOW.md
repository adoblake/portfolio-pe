# GitHub-first portfolio workflow

**Repository:** `adoblake/portfolio-pe`  
**Baseline:** Round 31.7 — scroll-linked workflow + five-language selector.

## Future rounds
1. Start from the latest reviewed `main` branch. Do not start from an old ZIP or unrelated BucketList repository.
2. Create a short-lived branch such as `round-31-8-hero-polish`.
3. Change only the approved scope, preserving the current two-font system, project imagery, layout, modals and all five languages.
4. Commit **all source and asset changes**. Run `node --check script.js`, `node --check i18n.js`, and `python3 check-site.py`.
5. Open a pull request with a before/after summary and visual checks. Merge after review, then base the next iteration on `main`.

The Instagram motion reference informs restrained motion, not a replacement of the Round 31 design. The portfolio is a distinct project from `adoblake/making-bucketlist`.

## Asset note
Four large Only In Naples illustration SVGs were exported as visually equivalent 720 × 1152 embedded-WebP SVG previews for reliable GitHub upload. Their file paths remain unchanged. The original full-vector designs remain in the archived Round 31.7 ZIP if needed for future print-quality work.

## Review requirements
Translation packs cover English, Spanish, French, Simplified Chinese, and Japanese. Native-speaker copy review and actual desktop/mobile visual QA are still recommended before public publication.

## Design standard for every addition

Use the established portfolio components before introducing a new layout. 2DAY is the reference for product case studies: a `.app-case` section with `.case-copy` (eyebrow, serif heading, concise paragraph, and `.case-actions`) followed by `.app-showcase` (one linked `.app-proof` screenshot and `.app-proof-notes` with an eyebrow, serif subheading, and concise feature list). Bucketlist uses this same component. Supporting screenshots belong in the existing project dialog behind “More,” rather than a separate full-width gallery.

Keep the shared serif/sans typography, theme tokens, border radii, spacing, button hierarchy, title casing, responsive breakpoints, scroll reveals, and reduced-motion behavior. Reuse the existing Selected Work card pattern for new projects. Do not create project-specific layout overrides when the shared component covers the need.

Before handoff, compare the new section with 2DAY at desktop, tablet, and phone widths in both themes. Check all five languages, live links, project dialog, keyboard access, image loading, and horizontal overflow. Document any intentional departure from the established layout; do not silently introduce one.
