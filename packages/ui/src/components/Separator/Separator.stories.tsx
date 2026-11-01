import type { Meta, StoryObj } from '@storybook/react-vite';
import { Separator } from './Separator';

const meta = {
  title: 'Layout/Separator',
  component: Separator,
  tags: ['autodocs'],
  args: {},
  parameters: {
    docs: {
      description: {
        component:
          'Static divider; defaults to a meaningful horizontal separator. Vertical uses aria-orientation and stretches in flex layouts. decorative hides it from assistive technology. Not a draggable splitter; it has no keyboard action or tab stop. Ref targets a div.',
      },
    },
  },
} satisfies Meta<typeof Separator>;
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
export const BetweenSections: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <p>Employee details</p>
      <Separator />
      <p>Employment history</p>
    </div>
  ),
};
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <span>Active employees</span>
      <Separator orientation="vertical" />
      <span>Archived employees</span>
    </div>
  ),
};
export const Decorative: Story = { args: { decorative: true } };
