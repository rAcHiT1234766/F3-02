// Explicit offline preview only. This does not satisfy the Style Dictionary gate.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { flattenTokens, validateTokens } from '../packages/tokens/validate.mjs';

const read = async (name) =>
  JSON.parse(await readFile(`packages/tokens/source/${name}.json`, 'utf8'));
const [primitives, light, dark] = await Promise.all(['primitives', 'light', 'dark'].map(read));
validateTokens(primitives, light, dark);
let css = '/* OFFLINE PREVIEW: generated without Style Dictionary. Not release evidence. */\n';
for (const [theme, colors] of Object.entries({ light, dark })) {
  const tokens = flattenTokens({ ...primitives, ...colors });
  const resolve = (key) => {
    const value = tokens[key].value;
    return typeof value === 'string' && value.startsWith('{') ? resolve(value.slice(1, -1)) : value;
  };
  const declarations = Object.keys(tokens)
    .map((key) => {
      const name = key
        .replaceAll('.', '-')
        .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
      return `  --fui-${name}: ${resolve(key)};`;
    })
    .sort();
  css += `${theme === 'light' ? ':root, ' : ''}[data-ui-theme="${theme}"] {\n  color-scheme: ${theme};\n${declarations.join('\n')}\n}\n`;
}
await mkdir('packages/tokens/dist', { recursive: true });
await writeFile('packages/tokens/dist/themes.css', css);
console.warn('OFFLINE PREVIEW ONLY: token validation passed; Style Dictionary has not run.');
