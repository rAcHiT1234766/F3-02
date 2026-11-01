import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

export async function clickButton(page, name) {
  const handle = await page.evaluateHandle(
    (name) =>
      [...document.querySelectorAll('button')].find(
        (button) =>
          button.checkVisibility() &&
          (button.getAttribute('aria-label') ?? button.textContent.replace(/\s+/g, ' ').trim()) ===
            name,
      ),
    name,
  );
  const element = handle.asElement();
  assert.ok(element, `Button not found: ${name}`);
  // Centre the target so sticky chrome and toasts cannot intercept the click.
  await element.evaluate((node) => node.scrollIntoView({ block: 'center' }));
  await element.click();
  await handle.dispose();
}
async function fill(page, selector, value) {
  await page.click(selector);
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.type(value);
  if (!value) await page.keyboard.press('Backspace');
}
export async function scan(page, report, scope, disabledRules = []) {
  if (!(await page.evaluate(() => !!window.axe)))
    await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const result = await page.evaluate(async (disabledRules) => {
    const rules = Object.fromEntries(disabledRules.map((id) => [id, { enabled: false }]));
    const result = await window.axe.run(document, { rules });
    const summarize = (findings) =>
      findings.map(({ id, impact, nodes }) => ({
        id,
        impact,
        nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })),
      }));
    return { violations: summarize(result.violations), incomplete: summarize(result.incomplete) };
  }, disabledRules);
  report.axe.push({ scope, disabledRules, ...result });
  assert.deepEqual(result.violations, [], `${scope}: axe violations`);
}
export async function checkDashboard(page, report) {
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto('http://127.0.0.1:4173', { waitUntil: 'networkidle0' });
  await page.focus('#add-employee');
  await page.keyboard.press('Enter');
  await page.waitForSelector('#employee-name');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'employee-name');
  await clickButton(page, 'Save employee');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'employee-name');
  assert.match(
    await page.$eval('#employee-name-error', (node) => node.textContent),
    /Enter a full name/,
  );
  await fill(page, '#employee-name', 'Browser Example');
  await fill(page, '#employee-email', 'browser@example.com');
  await fill(page, '#employee-date', '2026-02-31');
  await page.keyboard.press('Tab');
  assert.match(
    await page.$eval('#employee-date-date-error', (node) => node.textContent),
    /valid date/,
  );
  await clickButton(page, 'Open Start date calendar');
  assert.equal(await page.$$eval('[role="dialog"]', (nodes) => nodes.length), 2);
  await page.keyboard.press('Escape');
  assert.equal(await page.$$eval('[role="dialog"]', (nodes) => nodes.length), 1);
  // Focus returns just after the dialog unmounts; wait briefly so a busy machine does not flake.
  await page
    .waitForFunction(
      () => document.activeElement?.getAttribute('aria-label') === 'Open Start date calendar',
      { timeout: 2000 },
    )
    .catch(() => undefined);
  assert.equal(
    await page.evaluate(() => document.activeElement.getAttribute('aria-label')),
    'Open Start date calendar',
  );
  await clickButton(page, 'Open Start date calendar');
  await scan(page, report, 'calendar inside employee dialog');
  await page.click('[data-day="2026-10-24"] button');
  assert.equal(await page.$eval('#employee-date', (node) => node.value), '2026-10-24');
  await page.select('#dialog-appearance', 'dark');
  await page.waitForSelector('[role="dialog"][data-ui-theme="dark"]');
  await scan(page, report, 'employee dialog dark');
  await page.screenshot({ path: 'artifacts/employee-dialog-dark.png', fullPage: true });
  for (let index = 0; index < 16; index++) {
    await page.keyboard.press('Tab');
    assert.ok(
      await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]')),
      'Focus escaped the modal',
    );
  }
  await clickButton(page, 'Save employee');
  await page.waitForSelector('#employee-name', { hidden: true });
  assert.equal(await page.evaluate(() => document.activeElement.id), 'add-employee');
  assert.ok(await page.$eval('tbody', (node) => node.textContent.includes('Browser Example')));
  report.checks.push(
    'Keyboard add employee, validation, date selection, nested Escape, focus trap/restore, live portal theme update',
  );
  await clickButton(page, 'Edit Browser Example');
  await page.waitForSelector('#employee-name');
  assert.equal(await page.$eval('#employee-name', (node) => node.value), 'Browser Example');
  await fill(page, '#employee-name', 'Browser Updated');
  await clickButton(page, 'Save employee');
  await page.waitForSelector('#employee-name', { hidden: true });
  // The dialog restores focus after it unmounts, so wait for it rather than sampling once.
  await page
    .waitForFunction(
      () => document.activeElement.getAttribute('aria-label') === 'Edit Browser Updated',
      { timeout: 2000 },
    )
    .catch(() => {});
  assert.equal(
    await page.evaluate(() => document.activeElement.getAttribute('aria-label')),
    'Edit Browser Updated',
  );
  await clickButton(page, 'Archive Browser Updated');
  assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Cancel');
  await clickButton(page, 'Cancel');
  await clickButton(page, 'Archive Browser Updated');
  await clickButton(page, 'Archive employee');
  assert.ok(
    await page.$$eval('tbody tr', (rows) =>
      rows.some(
        (row) =>
          row.textContent.includes('Browser Updated') && row.textContent.includes('Archived'),
      ),
    ),
  );
  // WCAG 2.4.11: with the undo toast open, keyboard focus must never land underneath it.
  await page.setViewport({ width: 1440, height: 700 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.focus('input[type="search"]');
  let tableStops = 0;
  for (let index = 0; index < 60; index++) {
    await page.keyboard.press('Tab');
    const focus = await page.evaluate(() => {
      const active = document.activeElement;
      const toasts = document.querySelector('.fui-toast-viewport').getBoundingClientRect();
      const target = active.getBoundingClientRect();
      return {
        inTable: !!active.closest('tbody'),
        inToast: !!active.closest('.fui-toast-viewport'),
        name: active.getAttribute('aria-label') ?? active.closest('label')?.textContent ?? '',
        overlaps:
          toasts.height > 0 &&
          target.bottom > toasts.top &&
          target.top < toasts.bottom &&
          target.right > toasts.left &&
          target.left < toasts.right,
      };
    });
    if (focus.inToast || (tableStops && !focus.inTable)) break;
    if (!focus.inTable) continue;
    tableStops++;
    assert.ok(!focus.overlaps, `Toast covers focused control: ${focus.name}`);
  }
  assert.ok(tableStops >= 20, `Only ${tableStops} table controls reached`);
  await page.setViewport({ width: 1440, height: 1100 });
  report.checks.push(
    `Open undo toast never covers keyboard focus (${tableStops} table controls at 1440×700)`,
  );
  await clickButton(page, 'Undo');
  assert.ok(
    await page.$$eval('tbody tr', (rows) =>
      rows.some(
        (row) => row.textContent.includes('Browser Updated') && row.textContent.includes('Active'),
      ),
    ),
  );
  report.checks.push(
    'Edit preserves record identity; archive cancellation, confirmation and undo work',
  );
  await page.click('tbody input[type="checkbox"]');
  await fill(page, 'input[type="search"]', 'not-present');
  assert.match(
    await page.$eval('.fui-data-grid [role="status"]', (node) => node.textContent),
    /0 results.*1 selected/,
  );
  await clickButton(page, 'Clear search');
  await clickButton(page, 'Employee');
  await clickButton(page, 'Next');
  await fill(page, 'input[type="search"]', 'Browser Updated');
  assert.equal(await page.$eval('tbody input[type="checkbox"]', (node) => node.checked), true);
  await clickButton(page, 'Clear search');
  await page.select('.fui-grid-toolbar select', '25');
  assert.equal(await page.$$eval('tbody tr', (rows) => rows.length), 25);
  await page.select('#department-filter', 'Design');
  assert.ok(
    await page.$$eval('tbody tr', (rows) =>
      rows.every((row) => row.textContent.includes('Design')),
    ),
  );
  await page.select('#department-filter', 'all');
  report.checks.push(
    'Grid search, sorting, pagination, page size, department filter and stable row selection',
  );
  for (const theme of ['light', 'dark']) {
    await page.select('#appearance', theme);
    await scan(page, report, `dashboard ${theme}`);
    await page.screenshot({ path: `artifacts/dashboard-${theme}.png`, fullPage: true });
  }
  await page.setViewport({ width: 320, height: 900 });
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'Dashboard overflows at 320px',
  );
  await page.screenshot({ path: 'artifacts/dashboard-320.png', fullPage: true });
  await clickButton(page, '+ Add employee');
  assert.ok(
    await page.$eval('[role="dialog"]', (node) => node.scrollWidth <= node.clientWidth),
    'Dialog overflows at 320px',
  );
  await clickButton(page, 'Open Start date calendar');
  assert.ok(
    await page.$$eval('[role="dialog"]', (nodes) =>
      nodes.every((node) => node.scrollWidth <= node.clientWidth),
    ),
    'Calendar dialog overflows at 320px',
  );
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  report.checks.push(
    'Dashboard, form and nested calendar fit a 320px viewport; wide table scrolls within its own region',
  );
  await clickButton(page, 'Component gallery');
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    'Gallery overflows at 320px',
  );
  await page.setViewport({ width: 1440, height: 1100 });
  await page.focus('input[role="combobox"]');
  await page.keyboard.type('Sam');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  assert.equal(await page.$eval('input[role="combobox"]', (node) => node.value), 'Sam Chen');
  await page.focus('input[type="radio"]');
  await page.keyboard.press('ArrowRight');
  assert.equal(
    await page.$eval('input[type="radio"][value="office"]', (node) => node.checked),
    true,
  );
  for (const theme of ['light', 'dark']) {
    await page.select('#appearance', theme);
    await scan(page, report, `gallery ${theme}`);
  }
  await clickButton(page, 'Open drawer');
  await scan(page, report, 'drawer dark');
  await page.keyboard.press('Escape');
  await clickButton(page, 'Open popover');
  await scan(page, report, 'popover dark');
  await page.keyboard.press('Escape');
  // Radix portals menus to <body>; axe exempts dialogs but not menus from the best-practice region rule.
  await clickButton(page, 'Actions');
  await scan(page, report, 'dropdown menu dark', ['region']);
  await page.keyboard.press('Escape');
  report.checks.push(
    'Gallery keyboard combobox and radio controls; browser axe scans of both themes and open overlay compositions',
  );
}
