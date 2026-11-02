/* Validate creative copy translations and updated button/style wiring. */
const fs = require('node:fs');
const assert = require('node:assert/strict');
const home = fs.readFileSync('index.html', 'utf8');
const about = fs.readFileSync('about.html', 'utf8');
const i18n = fs.readFileSync('i18n.js', 'utf8');
const scripts = fs.readFileSync('scroll-story.js', 'utf8');
const css = fs.readFileSync('studio-polish.css', 'utf8');

const match = i18n.match(/const studioPacks = (\{.*?\});\n  for \(const language/);
assert.ok(match, 'Missing new localized copy bundle');
const packs = JSON.parse(match[1]);
const languages = ['es', 'fr', 'zh', 'ja'];
assert.deepEqual(Object.keys(packs).sort(), languages.slice().sort());
const englishKeys = Object.keys(packs.es);
assert.ok(englishKeys.length >= 15, 'Expected both creative and engineering narratives');
for (const language of languages) {
  const keys = Object.keys(packs[language]);
  assert.deepEqual(keys.sort(), englishKeys.slice().sort(), 'Inconsistent translation keys: ' + language);
  for (const english of englishKeys) {
    assert.ok(packs[language][english].trim(), 'Empty translation: ' + language + ' ' + english);
    assert.ok(
      home.includes('data-i18n="' + english + '"') || about.includes('data-i18n="' + english + '"'),
      'New translation key is not in either page: ' + english
    );
  }
}
for (const [page, source] of [['Home', home], ['About', about]]) {
  assert.equal((source.match(/href="studio-polish\.css"/g)||[]).length, 1, page + ' should load studio CSS once');
  assert.ok(source.includes('Product Engineer · Design · Art'), page + ' missing creative branding');
}
for (const token of ['.button.button-ghost', '.contact-card .button.button-outline-paper',
  '.work-section .filter.active', '.modal-panel #modalExamplesToggle', '.creative-foundation h2']) {
  assert.ok(css.includes(token), 'Missing action / creative CSS: ' + token);
}
assert.ok(scripts.includes("mark('.creative-foundation"), 'New section not part of scroll reveals');
assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length, 'CSS braces mismatch');
console.log('PASS: all five languages, studio buttons, creative section, and scroll registration.');
