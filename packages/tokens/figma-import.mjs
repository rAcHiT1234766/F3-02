// Replaces source/*.json with a Tokens Studio export from Figma, after validation.
// Usage: npm run tokens:import [-- path/to/tokens.json]
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromTokensStudio, stringifySource } from './figma.mjs';
import { flattenTokens, validateTokens } from './validate.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const input = path.resolve(process.argv[2] ?? `${root}figma/tokens.json`);
const sources = fromTokensStudio(JSON.parse(await readFile(input, 'utf8')));
validateTokens(sources.primitives, sources.light, sources.dark);

for (const [set, tokens] of Object.entries(sources)) {
  const file = `${root}source/${set}.json`;
  const before = flattenTokens(JSON.parse(await readFile(file, 'utf8')));
  const after = flattenTokens(tokens);
  for (const name of new Set([...Object.keys(before), ...Object.keys(after)])) {
    const was = before[name]?.value;
    const now = after[name]?.value;
    if (was !== now) console.log(`${set}: ${name} ${was ?? '(new)'} -> ${now ?? '(removed)'}`);
  }
  await writeFile(file, `${stringifySource(tokens)}\n`);
}
console.log(`Imported ${input} into source/. Run npm run tokens:build to regenerate CSS.`);
