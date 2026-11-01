// Writes figma/tokens-studio-import.json for loading into Tokens Studio for Figma.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { toTokensStudio } from './figma.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const sources = {};
for (const set of ['primitives', 'light', 'dark']) {
  sources[set] = JSON.parse(await readFile(`${root}source/${set}.json`, 'utf8'));
}
await mkdir(`${root}figma`, { recursive: true });
const target = `${root}figma/tokens-studio-import.json`;
await writeFile(target, `${JSON.stringify(toTokensStudio(sources), null, 2)}\n`);
console.log(`Wrote ${target}`);
