import StyleDictionary from 'style-dictionary';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { validateTokens } from './validate.mjs';

const root = fileURLToPath(new URL('.', import.meta.url));
const read = async (name) => JSON.parse(await readFile(`${root}source/${name}.json`, 'utf8'));
const [primitives, light, dark] = await Promise.all(['primitives', 'light', 'dark'].map(read));
validateTokens(primitives, light, dark);

StyleDictionary.registerFormat({
  name: 'foundation/theme',
  format: ({ dictionary, options }) => {
    const selector =
      options.theme === 'light' ? ':root,\n[data-ui-theme="light"]' : '[data-ui-theme="dark"]';
    return `${selector} {\n  color-scheme: ${options.theme};\n${dictionary.allTokens
      .map((token) => `  --${token.name}: ${token.value};`)
      .sort()
      .join('\n')}\n}\n`;
  },
});

await mkdir(`${root}dist`, { recursive: true });
for (const [theme, colors] of Object.entries({ light, dark })) {
  const dictionary = new StyleDictionary({
    tokens: { ...primitives, ...colors },
    platforms: {
      css: {
        transformGroup: 'css',
        prefix: 'fui',
        buildPath: `${root}dist/`,
        files: [{ destination: `${theme}.css`, format: 'foundation/theme', options: { theme } }],
      },
    },
  });
  await dictionary.buildAllPlatforms();
}
await writeFile(
  `${root}dist/themes.css`,
  (
    await Promise.all(
      ['light', 'dark'].map((theme) => readFile(`${root}dist/${theme}.css`, 'utf8')),
    )
  ).join('\n'),
);
console.log('Validated light/dark tokens and built theme CSS with Style Dictionary.');
