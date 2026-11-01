import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx', '../docs/**/*.mdx'],
  addons: [
    {
      name: '@storybook/addon-docs',
      // GitHub-flavoured Markdown, so the documentation pages can use tables.
      options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
    },
    '@storybook/addon-a11y',
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  docs: {},
  core: { disableTelemetry: true },
};
export default config;
