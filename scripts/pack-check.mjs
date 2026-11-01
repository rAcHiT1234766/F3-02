import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import assert from 'node:assert/strict';
import { checkConsumer } from './consumer-browser.mjs';

const root = process.cwd();
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run this script using npm run pack:check.');
function npm(args, cwd, capture = false) {
  const result = spawnSync(process.execPath, [npmCli, ...args], {
    cwd,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
  });
  if (result.status !== 0) throw new Error(`npm ${args.join(' ')} failed\n${result.stderr ?? ''}`);
  return result.stdout;
}
await mkdir('artifacts', { recursive: true });
const ui = path.join(root, 'packages/ui');
const dry = JSON.parse(npm(['pack', '--dry-run', '--json'], ui, true))[0];
for (const file of dry.files) {
  if (!/^(dist\/|package\.json$|README\.md$|LICENSE$)/.test(file.path)) {
    throw new Error(`Unexpected release file: ${file.path}`);
  }
}
for (const expected of ['dist/index.js', 'dist/index.d.ts', 'dist/styles.css']) {
  if (!dry.files.some((file) => file.path === expected)) throw new Error(`Missing ${expected}`);
}
const packed = JSON.parse(
  npm(['pack', '--json', '--pack-destination', path.join(root, 'artifacts')], ui, true),
)[0];
const archive = path.join(root, 'artifacts', packed.filename);
const consumer = await mkdtemp(path.join(tmpdir(), 'foundation-consumer-'));
const react = JSON.parse(await readFile('node_modules/react/package.json', 'utf8')).version;
const dev = JSON.parse(await readFile('package.json', 'utf8')).devDependencies;
const manifest = {
  name: 'foundation-independent-consumer',
  private: true,
  type: 'module',
  scripts: { build: 'tsc --noEmit && vite build' },
  dependencies: { '@rachitp72/foundation-ui': `file:${archive}`, react, 'react-dom': react },
  devDependencies: {
    vite: dev.vite,
    typescript: dev.typescript,
    '@types/react': dev['@types/react'],
    '@types/react-dom': dev['@types/react-dom'],
  },
};
await writeFile(path.join(consumer, 'package.json'), JSON.stringify(manifest, null, 2));
await writeFile(
  path.join(consumer, 'vite.config.js'),
  `import { defineConfig } from 'vite';
import { writeFileSync } from 'node:fs';
export default defineConfig({plugins:[{name:'record-modules',generateBundle(_,bundle){writeFileSync('modules.json',JSON.stringify(Object.values(bundle).filter(chunk=>chunk.type==='chunk').flatMap(chunk=>Object.entries(chunk.modules).filter(([,value])=>value.renderedLength>0).map(([name])=>name))));}}]});`,
);
await writeFile(
  path.join(consumer, 'tsconfig.json'),
  JSON.stringify({
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      jsx: 'react-jsx',
      strict: true,
      skipLibCheck: true,
    },
    include: ['main.tsx'],
  }),
);
await writeFile(
  path.join(consumer, 'index.html'),
  '<html lang="en"><head><title>Independent consumer</title></head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>',
);
await writeFile(
  path.join(consumer, 'main.tsx'),
  `
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { Button, Input, DataGrid, DatePicker } from '@rachitp72/foundation-ui';
import '@rachitp72/foundation-ui/styles.css';
function App() {
  const [value, setValue] = useState('');
  const [saved, setSaved] = useState('');
  return <main data-ui-theme="light"><h1 id="host-heading">Independent host heading</h1><label htmlFor="name">Name</label>
    <Input id="name" value={value} onChange={e => setValue(e.target.value)} />
    <Button id="save" onClick={() => setSaved(value)}>Save</Button><p id="saved" role="status">{saved}</p>
    <DataGrid caption="Records" data={[{id:'a',name:'First'},{id:'b',name:'Second'}]} columns={[{id:'name',header:'Name',value:row=>row.name,sortable:true}]} getRowId={row=>row.id} />
    <DatePicker id="date" label="Start date" defaultMonth="2026-10-01" /></main>;
}
createRoot(document.getElementById('root')!).render(<App />);
`,
);
npm(['install', '--no-audit', '--no-fund'], consumer);
npm(['run', 'build'], consumer);
const browserInteraction = await checkConsumer(consumer);
const fullSource = await readFile(path.join(consumer, 'main.tsx'), 'utf8');
const measurements = [];
async function measure(name, directory) {
  const files = await readdir(path.join(consumer, directory, 'assets'));
  const sizes = await Promise.all(
    files
      .filter((file) => /\.(js|css)$/.test(file))
      .map(async (file) => {
        const data = await readFile(path.join(consumer, directory, 'assets', file));
        return { file, rawBytes: data.length, gzipBytes: gzipSync(data).length };
      }),
  );
  const modules = JSON.parse(await readFile(path.join(consumer, 'modules.json'), 'utf8'));
  const calendarModules = modules.filter((module) => module.includes('react-day-picker'));
  measurements.push({
    name,
    reactIncluded: true,
    files: sizes,
    calendarModules: calendarModules.length,
  });
  return calendarModules;
}
await measure('Button/Input/DataGrid/DatePicker', 'dist');
// What each component costs on top of React itself, gzipped JavaScript. Budgets fail the
// check if a change makes a common import noticeably heavier.
const budgets = { Button: 1024, DataGrid: 5 * 1024 };
const sources = {
  'React only': `import {createRoot} from 'react-dom/client';createRoot(document.getElementById('root')!).render(<button>Save</button>);`,
  Button: `import {createRoot} from 'react-dom/client';import {Button} from '@rachitp72/foundation-ui';import '@rachitp72/foundation-ui/styles.css';createRoot(document.getElementById('root')!).render(<Button>Save</Button>);`,
  DataGrid: `import {createRoot} from 'react-dom/client';import {DataGrid} from '@rachitp72/foundation-ui';import '@rachitp72/foundation-ui/styles.css';createRoot(document.getElementById('root')!).render(<DataGrid caption="Records" data={[{id:'a',name:'First'}]} columns={[{id:'name',header:'Name',value:row=>row.name}]} getRowId={row=>row.id} />);`,
};
try {
  for (const [name, source] of Object.entries(sources)) {
    await writeFile(path.join(consumer, 'main.tsx'), source);
    const out = `dist-${name.toLowerCase().replace(/\s+/g, '-')}`;
    npm(['run', 'build', '--', '--outDir', out], consumer);
    const calendarModules = await measure(`${name}${name === 'React only' ? '' : ' only'}`, out);
    assert.equal(calendarModules.length, 0, `${name} import includes unused calendar runtime`);
  }
} finally {
  await writeFile(path.join(consumer, 'main.tsx'), fullSource);
}
const jsGzip = (name) =>
  measurements
    .find((measurement) => measurement.name === name)
    .files.filter((file) => file.file.endsWith('.js'))
    .reduce((sum, file) => sum + file.gzipBytes, 0);
const componentCost = Object.fromEntries(
  Object.entries(budgets).map(([name, budget]) => {
    const added = jsGzip(`${name} only`) - jsGzip('React only');
    assert.ok(added <= budget, `${name} adds ${added} B gzip JS, over its ${budget} B budget`);
    return [name, { addedJsGzipBytes: added, budgetBytes: budget }];
  }),
);
const css = await readFile(path.join(ui, 'dist/styles.css'));
// One file per module: measure every module, not just the index of re-exports.
const jsFiles = (await readdir(path.join(ui, 'dist'), { recursive: true })).filter((file) =>
  file.endsWith('.js'),
);
const jsModules = await Promise.all(jsFiles.map((file) => readFile(path.join(ui, 'dist', file))));
const tokenSource = await readFile('packages/tokens/dist/themes.css', 'utf8');
await writeFile(
  'artifacts/package-check.json',
  JSON.stringify(
    {
      checkedAt: new Date().toISOString(),
      node: process.version,
      archive,
      consumer,
      version: packed.version,
      tarballBytes: packed.size,
      packageJsModules: jsModules.length,
      packageJsBytes: jsModules.reduce((sum, data) => sum + data.length, 0),
      packageJsGzipBytes: jsModules.reduce((sum, data) => sum + gzipSync(data).length, 0),
      componentCost,
      packageCssBytes: css.length,
      packageCssGzipBytes: gzipSync(css).length,
      typecheck: 'passed',
      build: 'passed',
      tokenPipeline: tokenSource.includes('OFFLINE PREVIEW')
        ? 'provisional preview; Style Dictionary not run'
        : 'Style Dictionary output; verify provenance separately',
      browserInteraction,
      measurements,
      note: 'Package file sizes exclude external runtime dependencies. Consumer bundles include React and used runtime dependencies. One complete stylesheet is intentional.',
    },
    null,
    2,
  ),
);
for (const [name, cost] of Object.entries(componentCost)) {
  console.log(
    `${name} adds ${(cost.addedJsGzipBytes / 1024).toFixed(1)} KB gzip JS (budget ${cost.budgetBytes / 1024} KB)`,
  );
}
console.log(`Independent type/build check passed. Consumer retained at ${consumer}`);
