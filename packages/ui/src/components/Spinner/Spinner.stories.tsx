import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  args: { label: 'Loading employees' },
  parameters: {
    docs: {
      description: {
        component:
          'Visual loading ring. No label means decorative and hidden from assistive technology. A label creates a polite status containing visually hidden text; use only one announcement per loading region. Size defaults to md. Ref targets span. Motion stops with prefers-reduced-motion.',
      },
    },
  },
} satisfies Meta<typeof Spinner>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { parameters: { theme: 'dark' } };
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 240 }}>
        <Story />
      </div>
    ),
  ],
};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Spinner key={size} size={size} />
      ))}
    </div>
  ),
};
export const Decorative: Story = {
  render: () => (
    <p>
      <Spinner /> Loading employees…
    </p>
  ),
};
