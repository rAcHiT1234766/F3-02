import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import os from 'node:os';
import puppeteer from 'puppeteer-core';
import { checkDashboard } from './dashboard-check.mjs';

const require = createRequire(import.meta.url);
const root = process.cwd();
const executablePath =
  process.env.BROWSER_EXECUTABLE ??
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find(existsSync);
if (!executablePath)
  throw new Error('Set BROWSER_EXECUTABLE to an installed Chrome/Chromium/Edge binary.');
await mkdir('artifacts', { recursive: true });
const server = spawn(
  process.execPath,
  [
    path.join(root, 'node_modules/vite/bin/vite.js'),
    'preview',
    '--configLoader',
    'runner',
    '--host',
    '127.0.0.1',
    '--port',
    '4173',
    '--strictPort',
  ],
  // NO_COLOR: Vite colours the port on some terminals, which breaks the readiness match below.
  {
    cwd: path.join(root, 'apps/demo'),
    windowsHide: true,
    stdio: 'pipe',
    env: { ...process.env, NO_COLOR: '1' },
  },
);
let serverLog = '';
server.stdout.on('data', (chunk) => {
  serverLog += chunk;
});
server.stderr.on('data', (chunk) => {
  serverLog += chunk;
});
let browser;
const report = {
  date: new Date().toISOString(),
  node: process.version,
  os: `${os.platform()} ${os.release()}`,
  checks: [],
  axe: [],
  status: 'failed',
};
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      clearInterval(poll);
      reject(new Error(`Preview server did not start: ${serverLog}`));
    }, 15000);
    const poll = setInterval(() => {
      if (serverLog.includes('127.0.0.1:4173')) {
        clearInterval(poll);
        clearTimeout(timeout);
        resolve();
      } else if (server.exitCode !== null) {
        clearInterval(poll);
        clearTimeout(timeout);
        reject(new Error(serverLog));
      }
    }, 100);
    server.on('error', (error) => {
      clearInterval(poll);
      clearTimeout(timeout);
      reject(error);
    });
  });
  browser = await puppeteer.launch({
    executablePath,
    headless: true,
    pipe: true,
    timeout: 15000,
    userDataDir: path.join(root, '.cache/browser-profile'),
    dumpio: process.env.FUI_BROWSER_DEBUG === '1',
  });
  report.browser = await browser.version();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewport({ width: 1440, height: 1100 });
  await page.goto('http://127.0.0.1:4173?view=foundation', { waitUntil: 'networkidle0' });
  await page.click('button[type="submit"]');
  assert.equal(await page.evaluate(() => document.activeElement?.id), 'full-name');
  assert.equal(
    await page.$eval('#name-error', (node) => node.textContent),
    'Enter your full name.',
  );
  report.checks.push('Empty submit shows associated errors and focuses first invalid input');
  await page.type('#full-name', 'Alex Morgan');
  await page.type('#email', 'alex@example.com');
  await page.keyboard.press('Enter');
  assert.match(
    await page.$eval('[role="status"]', (node) => node.textContent),
    /Profile for Alex Morgan saved/,
  );
  report.checks.push('Keyboard form submission updates local feedback');
  await page.focus('.button-examples button');
  await page.keyboard.press('Enter');
  assert.match(
    await page.$eval('[role="status"]', (node) => node.textContent),
    /Primary action activated/,
  );
  report.checks.push('Native keyboard button activation works');
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  for (const theme of ['light', 'dark']) {
    await page.select('select', theme);
    const result = await page.evaluate(async () => {
      const result = await window.axe.run(document);
      return {
        violations: result.violations.map(({ id, impact, nodes }) => ({
          id,
          impact,
          targets: nodes.map((node) => node.target),
        })),
        incomplete: result.incomplete.map(({ id, nodes }) => ({
          id,
          targets: nodes.map((node) => node.target),
        })),
      };
    });
    report.axe.push({ theme, ...result });
    await page.screenshot({ path: `artifacts/workbench-${theme}.png`, fullPage: true });
    assert.deepEqual(result.violations, [], `${theme} axe violations`);
  }
  report.checks.push(
    'Browser axe scan in both themes (including contrast; incomplete findings retained)',
  );
  await page.setViewport({ width: 320, height: 900 });
  await page.select('select', 'light');
  assert.ok(
    await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    'Page overflows at 320px',
  );
  await page.screenshot({ path: 'artifacts/workbench-320.png', fullPage: true });
  report.checks.push('320px viewport has no horizontal page overflow');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  assert.equal(
    await page.$eval('.fui-button-spinner', (node) => getComputedStyle(node).animationName),
    'none',
  );
  report.checks.push('Reduced motion disables spinner animation');
  await checkDashboard(page, report);
  assert.deepEqual(errors, []);
  report.checks.push('No uncaught browser errors');
  report.status = 'passed';
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  report.error = error instanceof Error ? error.message : String(error);
  throw error;
} finally {
  await writeFile('artifacts/browser-check.json', JSON.stringify(report, null, 2));
  await browser?.close();
  server.kill();
}
