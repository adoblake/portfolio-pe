from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent

class ReferenceParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.references = []

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        key = 'src' if tag in {'img', 'script', 'source'} else 'href' if tag in {'link', 'a'} else None
        if key and attributes.get(key):
            self.references.append(attributes[key])

missing = []
count = 0
for html in ROOT.rglob('*.html'):
    parser = ReferenceParser()
    parser.feed(html.read_text(encoding='utf-8'))
    for reference in parser.references:
        parsed = urlsplit(reference)
        if parsed.scheme or parsed.netloc or not parsed.path or parsed.path.startswith('/'):
            continue
        path = unquote(parsed.path)
        if not (html.parent / path).is_file():
            missing.append((html.relative_to(ROOT), path))
        count += 1

if missing:
    for location, target in missing:
        print(f'MISSING: {location} -> {target}')
    raise SystemExit(1)

print(f'OK: {count} local references validated across {len(list(ROOT.rglob("*.html")))} HTML files')
