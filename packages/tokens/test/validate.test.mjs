import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateTokens } from '../validate.mjs';

const read = (name) =>
  JSON.parse(readFileSync(new URL(`../source/${name}.json`, import.meta.url), 'utf8'));
const fixtures = () => ['primitives', 'light', 'dark'].map(read);

test('both provisional themes validate', () =>
  assert.doesNotThrow(() => validateTokens(...fixtures())));
test('missing theme keys fail', () => {
  const [p, l, d] = fixtures();
  delete d.color.focus;
  assert.throws(() => validateTokens(p, l, d), /keys do not match/);
});
test('a missing required key in both themes fails', () => {
  const [p, l, d] = fixtures();
  delete l.color.focus;
  delete d.color.focus;
  assert.throws(() => validateTokens(p, l, d), /Missing semantic/);
});
test('unknown references fail', () => {
  const [p, l, d] = fixtures();
  l.color.text.value = '{palette.missing}';
  assert.throws(() => validateTokens(p, l, d), /Unknown reference/);
});
test('circular aliases fail', () => {
  const [p, l, d] = fixtures();
  l.color.text.value = '{color.surface}';
  l.color.surface.value = '{color.text}';
  assert.throws(() => validateTokens(p, l, d), /Circular/);
});
test('invalid dimensions and mixed schemas fail', () => {
  const [p, l, d] = fixtures();
  p.space['1'].value = 'four';
  assert.throws(() => validateTokens(p, l, d), /Invalid dimension/);
  p.space['1'] = { $value: 4, $type: 'dimension' };
  assert.throws(() => validateTokens(p, l, d), /Mixed token schema/);
});
