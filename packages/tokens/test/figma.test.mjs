import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fromTokensStudio, stringifySource, toTokensStudio } from '../figma.mjs';

const read = (name) =>
  JSON.parse(readFileSync(new URL(`../source/${name}.json`, import.meta.url), 'utf8'));
const sources = () => ({
  primitives: read('primitives'),
  light: read('light'),
  dark: read('dark'),
});

test('Tokens Studio round trip preserves the source sets', () => {
  assert.deepEqual(fromTokensStudio(toTokensStudio(sources())), sources());
});
test('imported sets are written byte-for-byte in the repository style', () => {
  for (const set of ['primitives', 'light', 'dark']) {
    const raw = readFileSync(new URL(`../source/${set}.json`, import.meta.url), 'utf8');
    assert.equal(`${stringifySource(JSON.parse(raw))}\n`, raw);
  }
});
test('Figma-edited values normalize to the source schema', () => {
  const file = toTokensStudio(sources());
  file.primitives.space['1'] = { $value: 4, $type: 'spacing' };
  file.primitives.font.weight.medium = { value: 'Semi Bold', type: 'fontWeights' };
  file.light.color.background = { value: '#F3F6F5FF', type: 'color' };
  const result = fromTokensStudio(file);
  assert.deepEqual(result.primitives.space['1'], { value: '4px', type: 'dimension' });
  assert.deepEqual(result.primitives.font.weight.medium, { value: 600, type: 'fontWeight' });
  assert.equal(result.light.color.background.value, '#f3f6f5');
});
test('a missing token set is reported', () => {
  const file = toTokensStudio(sources());
  delete file.dark;
  assert.throws(() => fromTokensStudio(file), /"dark" is missing/);
});
