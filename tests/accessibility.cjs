/* Run with Playwright + axe-core available through NODE_PATH; see ACCESSIBILITY.md. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require('playwright');
const base = process.env.APP_URL || 'http://127.0.0.1:8010';
const axePath = process.env.AXE_CORE_PATH || require.resolve('axe-core/axe.min.js');
const tags = ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice'];
(async () => {
  const browser = await chromium.launch({
    ...(process.env.BROWSER_EXECUTABLE ? {executablePath: process.env.BROWSER_EXECUTABLE} : {}),
    args:['--no-sandbox']
  });
  const page = await browser.newPage({reducedMotion:'reduce'});
  const errors = [], results = [];
  page.on('pageerror', error => errors.push(error.message));
  const scan = async name => {
    if (!await page.evaluate(() => !!window.axe)) await page.addScriptTag({path:axePath});
    const result = await page.evaluate(tags => axe.run(document, {runOnly:{type:'tag',values:tags}}), tags);
    results.push({name, violations:result.violations, incomplete:result.incomplete});
    if (process.env.A11Y_RESULTS) fs.writeFileSync(process.env.A11Y_RESULTS, JSON.stringify(results,null,2));
    assert.deepEqual(result.violations.map(v => `${v.id}: ${v.nodes.map(n=>n.target.join(' ')).join(', ')}`), [], name);
  };
  for (const route of ['index.html','about.html']) {
    await page.goto(`${base}/${route}`);
    for (const width of [1440,320]) {
      await page.setViewportSize({width,height:1000});
      for (const theme of ['light','dark']) for (const language of ['en','es','fr','zh','ja']) {
        await page.evaluate(({theme,language}) => {
          window.PortfolioI18n.set(language);
          document.documentElement.dataset.theme = theme;
        }, {theme,language});
        await scan(`${route}/${width}/${theme}/${language}`);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow ${route}/${width}/${theme}/${language}`);
      }
    }
    await page.goto(`${base}/${route}`);
    await page.keyboard.press('Tab');
    assert.equal(await page.locator(':focus').getAttribute('class'), 'skip');
    await page.keyboard.press('Enter');
    assert.equal(await page.locator(':focus').getAttribute('id'), route==='index.html'?'work':'story');
    await page.setViewportSize({width:390,height:844});
    await page.locator('.menu-button').click();
    await scan(`${route}/open-mobile-menu`);
    await page.keyboard.press('Escape');
    assert(await page.locator('#mobileNav').evaluate(e=>e.hidden));
    assert(await page.locator('.menu-button').evaluate(e=>e===document.activeElement));
    await page.setViewportSize({width:1440,height:1000});
    const dialogs = route==='index.html' ? [
      ['[data-modal-open="twoday"]','#projectModal'], ['[data-image]','#imageModal'],
      ['[data-inquiry-open]','#inquiryModal']
    ] : [['[data-inquiry-open]','#inquiryModal']];
    for (const [trigger,id] of dialogs) {
      if (await page.locator(trigger).count() === 0) {
        // No control opens this dialog on this page: it must stay hidden and out of the focus order.
        assert(await page.locator(id).evaluate(e=>e.hidden&&e.inert), `Unreachable dialog ${id} must stay hidden and inert`);
        continue;
      }
      const opener = page.locator(trigger).first();
      await opener.click();
      assert(await page.locator(id).evaluate(e=>e.contains(document.activeElement)), 'Initial dialog focus');
      assert(await page.locator('main').evaluate(e=>e.inert), 'Background must be inert');
      await scan(`${route}/${id}`);
      for (const key of ['Tab','Shift+Tab']) for (let i=0;i<18;i++) {
        await page.keyboard.press(key);
        assert(await page.locator(id).evaluate(e=>e.contains(document.activeElement)), 'Focus escaped dialog');
      }
      if (id==='#inquiryModal') {
        await page.locator('#inquiryForm button[type=submit]').click();
        assert.equal(await page.locator(':focus').getAttribute('name'),'name');
        await page.locator('[name=name]').fill('Accessibility test');
        await page.locator('[name=email]').fill('invalid');
        assert.equal(await page.locator('[name=email]').evaluate(e=>e.validity.typeMismatch),true);
      }
      await page.keyboard.press('Escape');
      assert(await opener.evaluate(e=>e===document.activeElement), 'Focus not restored');
      assert(await page.locator(id).evaluate(e=>e.hidden&&e.inert));
      assert(!await page.locator('main').evaluate(e=>e.inert));
    }
  }
  assert.deepEqual(errors,[]);
  if (process.env.A11Y_RESULTS) fs.writeFileSync(process.env.A11Y_RESULTS, JSON.stringify(results,null,2));
  console.log(`PASS: ${results.length} axe states; both pages, 320/1440px, both themes, five languages, skip links, menus, all dialogs, focus/keyboard isolation, and form validation. No automated violations.`);
  await browser.close();
})().catch(error => {console.error(error);process.exit(1);});
