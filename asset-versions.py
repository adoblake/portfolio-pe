"""Stamp local CSS/JS links with a content fingerprint so browsers never mix
a new page with cached old styles or scripts.

    python3 asset-versions.py          # update ?v= tags after editing CSS/JS
    python3 asset-versions.py --check  # fail if any tag is stale (used in CI)
"""
import hashlib
import re
import sys
from pathlib import Path

PAGES = ["index.html", "about.html"]
LINK = re.compile(r'((?:href|src)=")([\w.-]+\.(?:css|js))(?:\?v=[0-9a-f]*)?(")')


def fingerprint(name):
    return hashlib.sha256(Path(name).read_bytes()).hexdigest()[:10]


def stamp(html):
    def repl(m):
        name = m.group(2)
        if not Path(name).is_file():
            return m.group(0)
        return f"{m.group(1)}{name}?v={fingerprint(name)}{m.group(3)}"
    return LINK.sub(repl, html)


check = "--check" in sys.argv
stale = []
for page in PAGES:
    html = Path(page).read_text(encoding="utf-8")
    updated = stamp(html)
    if updated != html:
        stale.append(page)
        if not check:
            Path(page).write_text(updated, encoding="utf-8")

if check and stale:
    raise SystemExit("Stale asset versions in: " + ", ".join(stale) + ". Run python3 asset-versions.py")
print(("PASS: asset versions current" if check else "Asset versions updated") + f" ({', '.join(PAGES)})")
