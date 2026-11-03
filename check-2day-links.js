/* Guard all 2DAY launch entry points against reverting to the old embedded demo. */
const fs = require('node:fs');
const assert = require('node:assert/strict');

const url = 'https://adoblake.github.io/2DAY-APP/';
const home = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');
const translations = fs.readFileSync('i18n.js', 'utf8');
const legacy = fs.readFileSync('assets/2day/latest/index.html', 'utf8');

const expected = [
  /<a class="project-visual has-image visual-twoday"[^>]*href="https:\/\/adoblake\.github\.io\/2DAY-APP\/"/,
  /<a class="text-button" data-i18n="Try live 2DAY app" href="https:\/\/adoblake\.github\.io\/2DAY-APP\/"/,
  /<a class="button button-dark" data-i18n="Try live 2DAY app" href="https:\/\/adoblake\.github\.io\/2DAY-APP\/"/,
  /<a class="app-proof" href="https:\/\/adoblake\.github\.io\/2DAY-APP\/"/,
];
for (const link of expected) assert.match(home, link, 'Missing 2DAY live launch link');
assert.equal(home.split(url).length - 1, 4, 'Expected four Home launch destinations');
assert.ok(script.includes("links:[['Try live 2DAY app','" + url + "']]"), 'Modal must launch refreshed 2DAY');
for (const source of [home, script]) {
  assert.ok(!source.includes('assets/2day/latest/index.html'), 'Outdated embedded 2DAY link still wired');
}
assert.ok(legacy.includes('<meta http-equiv="refresh" content="0; url=' + url), 'Old demo path must redirect');
assert.ok(legacy.includes('window.location.replace'), 'JavaScript redirect fallback missing');
assert.ok(legacy.includes('<a href="' + url), 'No-JS fallback link missing');
assert.equal((home.match(/data-modal-open="twoday"/g)||[]).length, 2, 'Case-study detail entry points changed unexpectedly');
assert.ok(home.includes('data-i18n-aria-label="Try live 2DAY app"'), 'Image launches need translatable accessible name');
assert.ok(translations.includes("'[data-i18n-aria-label]'"), 'Language selector does not localize launch aria labels');
const l = translations.match(/const launchLabels = (\{.*?\});\n  for \(const language/);
assert.ok(l, '2DAY translations missing');
const labels = JSON.parse(l[1]);
for (const lang of ['es','fr','zh','ja']) {
  assert.ok(labels[lang]?.['Try live 2DAY app'], lang + ': missing live-app text');
  assert.ok(labels[lang]?.['View case study'], lang + ': missing case study text');
}
console.log('PASS: 4 visible app entry points, modal, old-link redirect, 5-language accessibility.');
