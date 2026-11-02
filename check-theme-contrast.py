#!/usr/bin/env python3
"""Guardrails for the portfolio's two color modes (no external dependencies).

Pairwise WCAG contrast checks on actual site tokens / fixed-stage colors.
This is a deterministic regression check, not a substitute for browser QA.
"""
from pathlib import Path
import re


def rgb(hex_color):
    return tuple(int(hex_color.lstrip("#")[i:i+2], 16) for i in (0, 2, 4))


def luminance(color):
    values = [v / 255 for v in rgb(color)]
    linear = [v / 12.92 if v <= .04045 else ((v + .055) / 1.055) ** 2.4 for v in values]
    return sum(a * b for a, b in zip(linear, (.2126, .7152, .0722)))


def ratio(fg, bg):
    high, low = sorted((luminance(fg), luminance(bg)), reverse=True)
    return (high + .05) / (low + .05)


def mix(fg, bg, weight):
    a, b = rgb(fg), rgb(bg)
    return "#" + "".join(f"{round(x * weight + y * (1-weight)):02x}" for x, y in zip(a, b))


light = {"ink": "#101010", "paper": "#f7f7f2", "muted": "#6f6c64", "chapter": "#a74308"}
dark = {"ink": "#f7f7f2", "paper": "#101010", "muted": "#aaa69a", "chapter": "#ffad70"}

checks = []
for mode, theme in [("light", light), ("dark", dark)]:
    checks += [
        (f"{mode}: primary", theme["ink"], theme["paper"], 4.5),
        (f"{mode}: body/secondary", theme["muted"], theme["paper"], 4.5),
        (f"{mode}: chapter numerals", theme["chapter"], theme["paper"], 4.5),
        (f"{mode}: inverse contact text", theme["paper"], theme["ink"], 4.5),
        (f"{mode}: inverse contact description", mix(theme["paper"], theme["ink"], .82), theme["ink"], 4.5),
        (f"{mode}: selection/control focus", theme["chapter"], theme["paper"], 3.0),
    ]
checks += [
    ("society number on cream", "#38362f", "#d9d3c8", 4.5),
    ("2DAY number on black", "#f7f7f2", "#0a0a0a", 4.5),
    ("Naples number on navy", "#f7f7f2", "#12222e", 4.5),
    ("Neighbors number on black", "#f7f7f2", "#050505", 4.5),
    ("workflow top text", "#dedbd5", "#101010", 4.5),
    ("workflow stage label", "#f7f7f2", "#101010", 4.5),
    ("workflow orange label", "#ff934d", "#101010", 4.5),
    ("portrait caption", "#f7f7f2", "#101010", 4.5),
]

errors = []
for name, foreground, background, minimum in checks:
    result = ratio(foreground, background)
    print(f"{name:36} {result:.2f}:1 (minimum {minimum:.1f}:1)")
    if result < minimum:
        errors.append(f"{name}: {result:.2f}:1")

css = Path("theme-contrast.css").read_text()
for path in ["index.html", "about.html"]:
    html = Path(path).read_text()
    if html.count('href="theme-contrast.css"') != 1:
        errors.append(f"{path} should load contrast stylesheet once")
    if "portfolio-theme" not in html.split("</head>")[0]:
        errors.append(f"{path} should load saved theme before first paint")

critical = [
    "color-scheme: light", "color-scheme: dark", "--muted: #6f6c64",
    ".contact-card .eyebrow", ".contact-card .button-paper:hover",
    ".contact-card .button-outline-paper:hover",
    ".modal-close", "#modalExamplesToggle:hover",
    ".workflow-code-lines li:not(.is-current)",
    ".visual-society .project-number", ".visual-twoday .project-number",
    ".inquiry-form input::placeholder", ".language-control select option",
    ".story-chapter .eyebrow[data-story-index]::before"
]
for rule in critical:
    if rule not in css:
        errors.append(f"Missing theme-contrast guardrail: {rule}")

if css.count("{") != css.count("}"):
    errors.append("Unbalanced CSS braces")

if errors:
    raise SystemExit("Theme contrast validation failed:\\n" + "\\n".join(errors))
print(f"PASS: {len(checks)} contrast pairs and theme-link guardrails")
