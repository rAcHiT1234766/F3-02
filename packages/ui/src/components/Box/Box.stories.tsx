import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './Box';

const meta = {
  title: 'Layout/Box',
  component: Box,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Content of the box.' },
  },
  args: { padding: 4, children: 'A block with token-based padding.' },
  parameters: {
    docs: {
      description: {
        component:
          'Noninteractive div wrapper, padding defaults to 0; accepts token steps 0..8. Native attributes, div ref, className and style pass through. Inline style can override padding. No implied landmark or state.',
      },
    },
  },
} satisfies Meta<typeof Box>;
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
export const Spacing: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {([0, 2, 4, 6] as const).map((padding) => (
        <Box
          key={padding}
          padding={padding}
          style={{ border: '1px solid var(--fui-color-border)' }}
        >
          Padding {padding}
        </Box>
      ))}
    </div>
  ),
};
