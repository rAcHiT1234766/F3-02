import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Items placed in the grid.' },
  },
  args: {
    columns: 3,
    children: (
      <>
        <div>Engineering</div>
        <div>People operations</div>
        <div>Customer experience and support</div>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        component:
          'Responsive div grid; columns accepts 1..4 and defaults to 2, gap defaults to token 4. Uses one column below the 48rem viewport breakpoint. Children can shrink and long words wrap. Native div attributes/ref and style pass through; no grid widget role or keyboard system.',
      },
    },
  },
} satisfies Meta<typeof Grid>;
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
export const FourColumns: Story = {
  args: {
    columns: 4,
    children: (
      <>
        <div>One</div>
        <div>Two</div>
        <div>Three</div>
        <div>Four</div>
      </>
    ),
  },
};
export const SingleColumn: Story = { args: { columns: 1 } };
