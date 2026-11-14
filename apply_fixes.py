#!/usr/bin/env python3
"""Apply design-engineer positioning fixes to index.html.

Usage (from the repo root):  python3 apply_fixes.py index.html
Writes index.html.bak first, then reports every edit as OK or MISS.
Review the result with `git diff` before committing.
"""
import re, sys, shutil, pathlib

path = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "index.html")
s = path.read_text(encoding="utf-8")
shutil.copy(path, str(path) + ".bak")
report = []


def ex(name, old, new, count=1):
    """Exact-string replace."""
    global s
    if old in s:
        s = s.replace(old, new, count)
        report.append(("OK  ", name))
    else:
        report.append(("MISS", name))


def rx(name, pat, new, count=1):
    """Regex replace (new may be a literal string)."""
    global s
    s2, n = re.subn(pat, lambda m: new, s, count=count, flags=re.S)
    s = s2
    report.append(("OK  " if n else "MISS", name))


RESUME = "assets/resume/adonnis-blake-resume.pdf"  # <-- add your PDF here

# ---------- <head>: title, description, social, schema, styles ----------
ex("title", "<title>Adonnis Blake — Product Engineer / AI Build Practice</title>",
   "<title>Adonnis Blake — Design Engineer | UI, front-end &amp; product prototyping</title>")
rx("meta description", r'<meta content="A simplified portfolio[^"]*" name="description"/>',
   '<meta content="Design engineer who designs, builds, and ships product interfaces. Live apps, accessible front-end, and Claude-assisted workflows with every change tested live." name="description"/>')
ex("og:title", '<meta content="Adonnis Blake — Portfolio" property="og:title"/>',
   '<meta content="Adonnis Blake — Design Engineer" property="og:title"/>')
rx("og:description", r'<meta content="Product engineering, Claude-assisted[^"]*" property="og:description"/>',
   '<meta content="I design interfaces and build them: live apps, accessible front-end, and changes tested in the real product." property="og:description"/>')
ex("head additions", "</head>", """<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Adonnis Blake","jobTitle":"Design Engineer","sameAs":["https://github.com/adoblake"],"email":"mailto:adoblake@gmail.com"}</script>
<style>
.stack-strip dl{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin:1rem 0 0}
.stack-strip dl>div{padding:1rem;border:1px solid color-mix(in srgb,currentColor 18%,transparent);border-radius:12px}
.stack-strip dt{font-size:.8rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;opacity:.7}
.stack-strip dd{margin:.35rem 0 0}
.case-facts{font-size:.95rem;opacity:.85;margin:1rem 0}
.evidence-links{margin-top:1rem;display:flex;flex-wrap:wrap;gap:.75rem 1.25rem}
</style>
</head>""")

# ---------- header / nav ----------
ex("brand subtitle", '<small data-i18n="Product Engineer · Design · Art">Product Engineer · Design · Art</small>',
   "<small>Design Engineer · UI · Front-end</small>")
ex("desktop nav CTA",
   '<button class="button button-dark nav-project-button" data-i18n="Start project" data-inquiry-open="" type="button">Start project</button>',
   f'<a class="button button-dark nav-project-button" href="{RESUME}" target="_blank" rel="noopener">Résumé</a>')
ex("mobile nav CTA",
   '<button class="button button-dark" data-i18n="Start project" data-inquiry-open="" type="button">Start project</button>',
   f'<a class="button button-dark" href="{RESUME}" target="_blank" rel="noopener">Résumé</a>')

# ---------- hero ----------
ex("hero eyebrow", '<p class="eyebrow" data-i18n="Portfolio / 2026">Portfolio / 2026</p>',
   '<p class="eyebrow">Design Engineer · Open to roles</p>')
rx("hero h1", r'<h1 data-i18n="Product engineering that gets understood fast\.">.*?</h1>',
   "<h1>I design interfaces and build them.</h1>")
rx("hero lead", r'<p class="lead" data-i18n="I.m Adonnis Blake[^>]*>.*?</p>',
   '<p class="lead">I’m Adonnis Blake, a design engineer with a concept art and UI/UX background. I ship working front-end, design the flows behind it, and test every change in the live product. I use Claude to move faster on reasoning and edge cases; the decisions and the code review are mine.</p>')
rx("hero buttons", r'<div class="hero-actions">.*?</div>',
   f'<div class="hero-actions"><a class="button button-dark" href="#work">View live work</a> '
   f'<a class="button button-ghost" href="{RESUME}" target="_blank" rel="noopener">Résumé (PDF)</a> '
   '<a class="button button-ghost" href="https://github.com/adoblake" target="_blank" rel="noopener">GitHub</a></div>')
ex("hero overlay", '<p data-i18n="Product Engineer · Claude · GitHub · Live testing">Product Engineer · Claude · GitHub · Live testing</p>',
   "<p>Design Engineer · UI · Front-end · Live testing</p>")

# ---------- stack strip (only list what you can discuss in an interview) ----------
ex("stack strip", '<section aria-labelledby="quick-read-title"', """<section aria-labelledby="stack-title" class="section stack-strip">
<p class="eyebrow" id="stack-title">Stack &amp; practices</p>
<!-- Add Figma, React, TypeScript, etc. here ONLY if you can discuss them in an interview. -->
<dl>
<div><dt>Front-end</dt><dd>HTML · CSS · JavaScript</dd></div>
<div><dt>Design</dt><dd>UI/UX · Concept art · Brand identity · Layout systems</dd></div>
<div><dt>Quality</dt><dd>Accessibility (contrast, keyboard, reduced motion) · Responsive layouts · Light/dark theming · Automated checks (Python, Node)</dd></div>
<div><dt>Workflow</dt><dd>GitHub · GitHub Actions · Claude · Live testing</dd></div>
</dl>
</section>
<section aria-labelledby="quick-read-title\"""")

# ---------- workflow: replace the "can't show tickets" line with real evidence ----------
rx("workflow intro", r'<p data-i18n="I can.t show every internal ticket[^>]*>.*?</p>',
   '<p>This is the loop I follow on every build: understand the ticket, reason through options (with Claude where it helps), make the smallest safe change, test the behavior live, then document what changed. The proof is in the repos: this site’s own repo runs automated checks for color contrast, broken links, and translation coverage.</p>'
   '<p class="evidence-links">'
   '<a class="text-button" href="https://github.com/adoblake/portfolio-pe/blob/main/check-theme-contrast.py" target="_blank" rel="noopener">Contrast check</a>'
   '<a class="text-button" href="https://github.com/adoblake/portfolio-pe/blob/main/check-2day-links.js" target="_blank" rel="noopener">Link check</a>'
   '<a class="text-button" href="https://github.com/adoblake/portfolio-pe/blob/main/check-site.py" target="_blank" rel="noopener">Site check</a></p>')

# ---------- selected work heading + labels ----------
rx("work heading", r'<h2 data-i18n="Four focused projects\. Product thinking first\." id="selected-work-title">.*?</h2>',
   '<h2 id="selected-work-title">Two live apps, two design projects.</h2>')
rx("work intro", r'<p data-i18n="Each card gives the basic story[^>]*>.*?</p>',
   "<p>The apps lead: designed, built, and tested live. Brand and web work follows.</p>")
ex("2DAY label", '<p data-i18n="Product Engineering · AI-assisted app build">Product Engineering · AI-assisted app build</p>',
   "<p>Design Engineering · Built and tested live</p>")

# ---------- reorder cards: 2DAY, Bucketlist, Society 5ive, Neighbors ----------
cards = re.findall(r'<article class="project-card".*?</article>', s, re.S)
if len(cards) == 4:
    order = [cards[0], cards[2], cards[1], cards[3]]
    order = [re.sub(r'<span class="project-number">0\d</span>',
                    f'<span class="project-number">0{i+1}</span>', c) for i, c in enumerate(order)]
    a, b = s.index(cards[0]), s.index(cards[3]) + len(cards[3])
    s = s[:a] + "\n".join(order) + s[b:]
    report.append(("OK  ", "reorder project cards"))
else:
    report.append(("MISS", "reorder project cards"))

# ---------- reorder case sections: put Bucketlist right after 2DAY ----------
m = re.search(r'<section aria-labelledby="bucketlist-title".*?</section>', s, re.S)
if m and '<section aria-labelledby="society-title"' in s:
    sec = m.group(0)
    s = s.replace(sec, "", 1)
    s = s.replace('<section aria-labelledby="society-title"', sec + '\n<section aria-labelledby="society-title"', 1)
    report.append(("OK  ", "reorder case sections"))
else:
    report.append(("MISS", "reorder case sections"))

# ---------- case facts (role / status / source) ----------
rx("2DAY facts", r'<div class="case-actions">(?=\s*<a class="button button-dark" data-i18n="Try live 2DAY app")',
   '<p class="case-facts"><strong>Role:</strong> Design, front-end build, and live testing. '
   '<strong>Status:</strong> Live on GitHub Pages. '
   '<strong>Source:</strong> <a href="https://github.com/adoblake/2DAY-APP" target="_blank" rel="noopener">GitHub repo</a>.</p>\n'
   '<!-- TODO: add "Key decision" (what you chose, what you rejected, why) and "Result" (a real number or what you would measure next) -->\n'
   '<div class="case-actions">')
rx("Bucketlist facts", r'<div class="case-actions">(?=\s*<a class="button button-dark" data-i18n="Try BUCKETLIST")',
   '<p class="case-facts"><strong>Role:</strong> Design, front-end build, and live testing. '
   '<strong>Status:</strong> Working prototype; games and stats are browser-local, shared chat uses authenticated accounts. '
   '<strong>Source:</strong> <a href="https://github.com/adoblake/bucketlist" target="_blank" rel="noopener">GitHub repo</a>.</p>\n'
   '<!-- TODO: add "Key decision" and "Result" -->\n'
   '<div class="case-actions">')
ex("case buttons -> Get in touch",
   '<button class="button button-ghost" data-i18n="Start project" data-inquiry-open="" type="button">Start project</button>',
   '<button class="button button-ghost" data-inquiry-open="" type="button">Get in touch</button>', count=2)

# ---------- contact ----------
rx("contact heading", r'<h2 [^>]*id="contact-title">.*?</h2>',
   '<h2 id="contact-title">Hiring for a design engineer?</h2>')
rx("contact copy", r'<p data-i18n="Send the basics\. I.ll help[^>]*>.*?</p>',
   "<p>Here’s my résumé and the fastest way to reach me. I’m happy to walk through any project, the decisions behind it, and how I tested it.</p>")
ex("contact primary button",
   '<button class="button button-paper" data-i18n="Start project" data-inquiry-open="" type="button">Start project</button>',
   f'<a class="button button-paper" href="{RESUME}" target="_blank" rel="noopener">Résumé (PDF)</a>')
ex("inquiry project types", '<select name="type"><option>Product engineering / UI UX</option>',
   '<select name="type"><option>Full-time design engineer role</option><option>Contract / freelance</option><option>Product engineering / UI UX</option>')

path.write_text(s, encoding="utf-8")
for status, name in report:
    print(status, name)
print("\nBackup written to", str(path) + ".bak")
