import js from '@eslint/js';
import globals from 'globals';
import ts from 'typescript-eslint';
import a11y from 'eslint-plugin-jsx-a11y';
import hooks from 'eslint-plugin-react-hooks';

export default ts.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/storybook-static/**',
      '.cache/**',
      'coverage/**',
      'artifacts/**',
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node, ...globals.browser, ...globals.jest } },
  },
  {
    files: ['**/*.tsx'],
    plugins: { 'jsx-a11y': a11y, 'react-hooks': hooks },
    rules: { ...a11y.configs.recommended.rules, ...hooks.configs.recommended.rules },
  },
);
