// Runs Lighthouse (desktop and mobile) against the production dashboard build.
// Usage: npm run build:demo && npm run perf:lighthouse
// Lighthouse is fetched by npx at a pinned version rather than installed as a dependency.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const LIGHTHOUSE = 'lighthouse@13.5.0';
const root = process.cwd();
const chrome =
  process.env.BROWSER_EXECUTABLE ??
  [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].find(existsSync);
if (!chrome) throw new Error('Set BROWSER_EXECUTABLE to a Chrome/Chromium/Edge binary.');
if (!existsSync(path.join(root, 'apps/demo/dist/index.html'))) {
  throw new Error('Build the dashboard first: npm run build:demo');
}

const port = 4176;
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
    String(port),
    '--strictPort',
  ],
  { cwd: path.join(root, 'apps/demo'), windowsHide: true, stdio: 'pipe' },
);
let log = '';
server.stdout.on('data', (chunk) => (log += chunk));
server.stderr.on('data', (chunk) => (log += chunk));
for (let tries = 0; !log.includes(`127.0.0.1:${port}`); tries++) {
  if (tries > 150 || server.exitCode !== null) throw new Error(`Preview failed to start:\n${log}`);
  await new Promise((resolve) => setTimeout(resolve, 100));
}

await mkdir('artifacts', { recursive: true });
// Run npm's npx through Node itself: no shell, so arguments are never re-parsed.
const npxCli = [
  path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npx-cli.js'),
  path.join(path.dirname(process.execPath), '../lib/node_modules/npm/bin/npx-cli.js'),
].find(existsSync);
if (!npxCli) throw new Error("Could not locate npm's npx-cli.js next to this Node installation.");
const summary = {};
try {
  for (const formFactor of ['desktop', 'mobile']) {
    const output = path.join('artifacts', `lighthouse-${formFactor}.json`);
    const result = spawnSync(
      process.execPath,
      [
        npxCli,
        '-y',
        LIGHTHOUSE,
        `http://127.0.0.1:${port}/`,
        `--chrome-path=${chrome}`,
        '--chrome-flags=--headless=new',
        '--only-categories=performance,accessibility,best-practices,seo',
        ...(formFactor === 'desktop' ? ['--preset=desktop'] : []),
        '--output=json',
        `--output-path=${output}`,
        '--quiet',
      ],
      { stdio: 'inherit' },
    );
    if (result.status !== 0) throw new Error(`Lighthouse ${formFactor} run failed`);
    const report = JSON.parse(await readFile(output, 'utf8'));
    const audit = (id) => report.audits[id]?.displayValue;
    summary[formFactor] = {
      ...Object.fromEntries(
        Object.entries(report.categories).map(([id, category]) => [
          id,
          Math.round(category.score * 100),
        ]),
      ),
      'first-contentful-paint': audit('first-contentful-paint'),
      'largest-contentful-paint': audit('largest-contentful-paint'),
      'total-blocking-time': audit('total-blocking-time'),
      'cumulative-layout-shift': audit('cumulative-layout-shift'),
    };
  }
} finally {
  server.kill();
}
await writeFile(
  'artifacts/lighthouse-summary.json',
  JSON.stringify({ checkedAt: new Date().toISOString(), lighthouse: LIGHTHOUSE, summary }, null, 2),
);
console.table(summary);
