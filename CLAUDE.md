@AGENTS.md
@WORKFLOW.md

## Verify
- After any CSS or JS change: `python3 asset-versions.py` (refreshes `?v=` cache tags), then
  `node --check script.js` · `node --check i18n.js` · `python3 check-site.py` · `python3 check-theme-contrast.py`
- Run `verify-ui` against 2DAY's case study: desktop, tablet and phone, both themes, all five languages.
