import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Items to lay out.' },
  },
  args: {
    children: (
      <>
        <span>Alex Morgan</span>
        <span>Engineering</span>
        <span>Active</span>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        component:
          'Flex div with token gaps. Defaults: column, gap=4, align=stretch, justify=start, wrap=true. Rows wrap long content; wrap=false is an explicit single-line choice. DOM and focus order stay in source order. Native div props/ref and style override pass through.',
      },
    },
  },
} satisfies Meta<typeof Stack>;
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
export const Row: Story = { args: { direction: 'row', align: 'center', justify: 'between' } };
export const NoWrap: Story = { args: { direction: 'row', wrap: false } };
export const Center: Story = {
  args: { align: 'center', justify: 'center', style: { minHeight: 200 } },
};
