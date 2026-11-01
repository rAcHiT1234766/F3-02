// Runs every story in the built Storybook in headless Chrome: play-function (interaction)
// tests must pass, and the accessibility addon's axe scan must report no violations.
// Usage: npm run build:storybook && npm run test:storybook
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const root = process.cwd();
const staticDir = path.join(root, 'packages/ui/storybook-static');
if (!existsSync(path.join(staticDir, 'index.json'))) {
  throw new Error('Build Storybook first: npm run build:storybook');
}
const executablePath =
  process.env.BROWSER_EXECUTABLE ??
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find(existsSync);
if (!executablePath) throw new Error('Set BROWSER_EXECUTABLE to a Chrome/Chromium/Edge binary.');

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};
const server = createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  const file = path.join(staticDir, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
  if (!file.startsWith(staticDir)) return response.writeHead(403).end();
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
const base = `http://127.0.0.1:${server.address().port}`;

const index = JSON.parse(await readFile(path.join(staticDir, 'index.json'), 'utf8'));
const stories = Object.values(index.entries).filter((entry) => entry.type === 'story');
const browser = await puppeteer.launch({ executablePath, headless: true, pipe: true });
const results = [];
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  // Record Storybook channel events from the moment the preview creates its channel.
  await page.evaluateOnNewDocument(() => {
    window.__events = [];
    let channel;
    Object.defineProperty(window, '__STORYBOOK_ADDONS_CHANNEL__', {
      configurable: true,
      get: () => channel,
      set: (value) => {
        channel = value;
        const emit = value.emit.bind(value);
        value.emit = (name, ...args) => {
          window.__events.push({ name, args: JSON.parse(JSON.stringify(args ?? null)) });
          return emit(name, ...args);
        };
      },
    });
  });
  for (const story of stories) {
    await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story`, { waitUntil: 'load' });
    const outcome = await page
      .waitForFunction(
        () => {
          const done = window.__events.find((event) =>
            [
              'storyFinished',
              'storyErrored',
              'storyThrewException',
              'playFunctionThrewException',
              'storyMissing',
            ].includes(event.name),
          );
          return done ?? false;
        },
        { timeout: 20000, polling: 100 },
      )
      .then((handle) => handle.jsonValue())
      .catch(() => ({ name: 'timeout', args: [] }));
    const finished = outcome.name === 'storyFinished' ? outcome.args[0] : undefined;
    const a11y = finished?.reporters?.find((reporter) => reporter.type === 'a11y');
    const violations = a11y?.result?.violations ?? [];
    const playError =
      outcome.name === 'storyFinished'
        ? finished.status === 'error' && !violations.length
          ? 'Story finished with an error'
          : undefined
        : `${outcome.name}: ${JSON.stringify(outcome.args?.[0]?.message ?? outcome.args?.[0] ?? '').slice(0, 300)}`;
    results.push({
      id: story.id,
      play: story.tags?.includes('play-fn') ?? false,
      error: playError,
      scanned: Boolean(a11y?.result),
      violations: violations.map(
        (violation) => `${violation.id} (${violation.nodes?.length ?? 0})`,
      ),
    });
  }
} finally {
  await browser.close();
  server.close();
}

const failed = results.filter(
  (result) => result.error || result.violations.length || !result.scanned,
);
const interactive = results.filter((result) => result.play);
await mkdir('artifacts', { recursive: true });
await writeFile(
  'artifacts/storybook-check.json',
  JSON.stringify(
    { checkedAt: new Date().toISOString(), stories: results.length, results },
    null,
    2,
  ),
);
console.log(
  `${results.length} stories rendered; ${interactive.length} interaction tests; ` +
    `${interactive.filter((result) => !result.error).length} passed.`,
);
const scanned = results.filter((result) => result.scanned);
console.log(
  `Accessibility (axe): ${scanned.length}/${results.length} stories scanned, ` +
    `${scanned.filter((result) => !result.violations.length).length} with no violations.`,
);
for (const result of failed) {
  console.log(
    `FAIL ${result.id}${result.scanned ? '' : ' | not scanned by axe'}${result.error ? ` | ${result.error}` : ''}${result.violations.length ? ` | axe: ${result.violations.join(', ')}` : ''}`,
  );
}
if (failed.length) process.exitCode = 1;
