// Builds the DataGrid performance harness against the production library build and
// measures it in headless Chrome. Usage: npm run build && npm run perf
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import react from '@vitejs/plugin-react';
import { build } from 'vite';

const root = process.cwd();
const executablePath =
  process.env.BROWSER_EXECUTABLE ??
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find(existsSync);
if (!executablePath) throw new Error('Set BROWSER_EXECUTABLE to a Chrome/Chromium/Edge binary.');

const outDir = await mkdtemp(path.join(os.tmpdir(), 'foundation-perf-'));
await build({
  root: path.join(root, 'scripts/perf'),
  configFile: false,
  logLevel: 'warn',
  plugins: [react()],
  build: { outDir, emptyOutDir: true },
});

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = path.join(outDir, pathname === '/' ? 'index.html' : pathname);
  if (!file.startsWith(outDir)) return response.writeHead(403).end();
  try {
    const body = await readFile(file);
    response.writeHead(200, {
      'content-type': types[path.extname(file)] ?? 'application/octet-stream',
    });
    response.end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

const sizes = [100, 1000, 10000];
const repeats = 7;
const browser = await puppeteer.launch({ executablePath, headless: true, pipe: true });
let results;
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle0' });
  results = await page.evaluate((s, r) => window.runPerf(s, r), sizes, repeats);
  results = { browser: await browser.version(), results };
} finally {
  await browser.close();
  server.close();
}

const report = {
  checkedAt: new Date().toISOString(),
  method:
    'Production build in headless Chrome. Each timing is React update plus forced layout (no paint), ' +
    `median and max of ${repeats} runs after warm-up. Page size 10.`,
  machine: `${os.cpus()[0]?.model.trim()} (${os.cpus().length} threads), ${process.platform}`,
  ...results,
};
await mkdir('artifacts', { recursive: true });
await writeFile('artifacts/perf-datagrid.json', JSON.stringify(report, null, 2));
console.log(report.machine, '|', report.browser);
console.table(
  Object.fromEntries(
    sizes.map((size) => [
      `${size} rows`,
      Object.fromEntries(
        Object.entries(report.results[size]).map(([action, { median, max }]) => [
          action,
          `${median} ms (max ${max})`,
        ]),
      ),
    ]),
  ),
);
