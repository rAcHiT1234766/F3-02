import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { flattenTokens, validateTokens } from '../packages/tokens/validate.mjs';

const read = async (name) =>
  JSON.parse(await readFile(`packages/tokens/source/${name}.json`, 'utf8'));
const [primitives, light, dark] = await Promise.all(['primitives', 'light', 'dark'].map(read));
validateTokens(primitives, light, dark);
function luminance(hex) {
  const channels = hex
    .slice(1)
    .match(/../g)
    .map((part) => {
      const value = parseInt(part, 16) / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
const pairs = [
  ['text', 'background', 4.5],
  ['text', 'surface', 4.5],
  ['textMuted', 'background', 4.5],
  ['textMuted', 'surface', 4.5],
  ['onAction', 'action', 4.5],
  ['onAction', 'actionHover', 4.5],
  ['onAction', 'actionPressed', 4.5],
  ['onDanger', 'danger', 4.5],
  ['danger', 'surface', 4.5],
  ['success', 'successSurface', 4.5],
  ['warning', 'warningSurface', 4.5],
  ['border', 'surface', 3],
  ['focus', 'surface', 3],
  ['focus', 'background', 3],
];
const results = [];
for (const [theme, colors] of Object.entries({ light, dark })) {
  const tokens = flattenTokens({ ...primitives, ...colors });
  const resolve = (key) => {
    const value = tokens[key].value;
    return value.startsWith('{') ? resolve(value.slice(1, -1)) : value;
  };
  for (const [foreground, background, target] of pairs) {
    const values = [foreground, background].map((key) => luminance(resolve(`color.${key}`)));
    const ratio = (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
    results.push({
      theme,
      foreground,
      background,
      ratio: Number(ratio.toFixed(2)),
      target,
      pass: ratio >= target,
    });
  }
}
await mkdir('artifacts', { recursive: true });
await writeFile(
  'artifacts/token-contrast.json',
  JSON.stringify(
    {
      method:
        'WCAG sRGB relative luminance of opaque token pairs; no rendered/layout or disabled-state claim.',
      results,
    },
    null,
    2,
  ),
);
console.table(results);
if (results.some((result) => !result.pass)) process.exitCode = 1;
