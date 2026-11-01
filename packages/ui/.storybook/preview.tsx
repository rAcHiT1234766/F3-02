import type { Preview } from '@storybook/react-vite';
import isChromatic from 'chromatic/isChromatic';
import '../src/styles.css';

// Calendars highlight "today", so visual snapshots would change every day. Freeze the
// clock during Chromatic runs only; people browsing Storybook still see the real date.
if (isChromatic()) {
  const frozen = new Date('2026-10-23T12:00:00').getTime();
  class FrozenDate extends Date {
    constructor(...args: unknown[]) {
      super(...((args.length ? args : [frozen]) as [number]));
    }
    static now() {
      return frozen;
    }
  }
  globalThis.Date = FrozenDate as DateConstructor;
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Preview theme',
      toolbar: { icon: 'paintbrush', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, context) => (
      <div
        data-ui-theme={context.parameters.theme ?? context.globals.theme}
        style={{
          padding: 24,
          background: 'var(--fui-color-background)',
          color: 'var(--fui-color-text)',
          fontFamily: 'var(--fui-font-body)',
          minHeight: 160,
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    a11y: { test: 'error' },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          ['Colors', 'Spacing and radius', 'Typography'],
          'Guides',
          ['Design tokens', 'Accessibility', 'Contributing', 'Versioning and releases'],
          'Actions',
          'Forms',
          'Data',
          'Dates',
          'Overlays',
          'Navigation',
          'Feedback',
          'Typography',
          'Layout',
        ],
      },
    },
  },
};
export default preview;
