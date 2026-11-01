import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

export async function checkConsumer(consumer) {
  const executablePath =
    process.env.BROWSER_EXECUTABLE ??
    [
      'C:/Program Files/Google/Chrome/Application/chrome.exe',
      'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
      '/usr/bin/google-chrome',
      '/usr/bin/chromium',
    ].find(existsSync);
  if (!executablePath)
    throw new Error('Set BROWSER_EXECUTABLE for the independent consumer browser check.');
  const server = spawn(
    process.execPath,
    [
      path.join(consumer, 'node_modules/vite/bin/vite.js'),
      'preview',
      '--host',
      '127.0.0.1',
      '--port',
      '4175',
      '--strictPort',
    ],
    // NO_COLOR keeps Vite from wrapping the port in colour codes (always on for Windows),
    // which would stop the readiness check below from matching '127.0.0.1:4175'.
    { cwd: consumer, windowsHide: true, stdio: 'pipe', env: { ...process.env, NO_COLOR: '1' } },
  );
  let log = '';
  let startupError;
  server.stdout.on('data', (chunk) => {
    log += chunk;
  });
  server.stderr.on('data', (chunk) => {
    log += chunk;
  });
  server.on('error', (error) => {
    startupError = error;
  });
  let browser;
  try {
    for (let count = 0; !log.includes('127.0.0.1:4175'); count++) {
      if (startupError || server.exitCode !== null || count >= 150)
        throw new Error(`Consumer preview failed: ${startupError ?? log}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      pipe: true,
      timeout: 15000,
    });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('http://127.0.0.1:4175', { waitUntil: 'networkidle0' });
    await page.type('#name', 'Independent consumer');
    await page.click('#save');
    assert.equal(await page.$eval('#saved', (node) => node.textContent), 'Independent consumer');
    await page.type('input[type="search"]', 'Second');
    assert.equal(await page.$$eval('tbody tr', (rows) => rows.length), 1);
    await page.click('tbody input[type="checkbox"]');
    assert.match(
      await page.$eval('.fui-data-grid [role="status"]', (node) => node.textContent),
      /1 selected/,
    );
    await page.click('button[aria-label="Open Start date calendar"]');
    await page.click('[data-day="2026-10-24"] button');
    assert.equal(await page.$eval('#date', (node) => node.value), '2026-10-24');
    assert.equal(
      await page.$eval('#save', (node) => getComputedStyle(node).backgroundColor),
      'rgb(8, 105, 94)',
    );
    assert.notEqual(
      await page.$eval('#host-heading', (node) => getComputedStyle(node).marginTop),
      '0px',
      'Library reset host heading margin',
    );
    assert.deepEqual(errors, []);
    await page.screenshot({ path: 'artifacts/independent-consumer.png', fullPage: true });
    return {
      status: 'passed',
      browser: await browser.version(),
      checks: [
        'Input/save feedback',
        'Grid search and selection',
        'Calendar selection',
        'Compiled token CSS',
        'Host heading margin retained',
        'No browser exceptions',
      ],
    };
  } finally {
    await browser?.close();
    server.kill();
  }
}
