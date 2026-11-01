import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisuallyHidden } from './VisuallyHidden';

const meta = {
  title: 'Typography/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Text for assistive technology only; it is not shown on screen.' },
  },
  args: { children: 'Only assistive technology reads this text.' },
  parameters: {
    docs: {
      description: {
        component:
          'Visually clips text while preserving accessibility-tree content. Native span props/ref pass through. Use for supplemental text or control names. Not a focusable skip-link utility: do not hide interactive children with it.',
      },
    },
  },
} satisfies Meta<typeof VisuallyHidden>;
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
export const ControlName: Story = {
  render: () => (
    <button type="button">
      <span aria-hidden="true">+</span>
      <VisuallyHidden>Add employee</VisuallyHidden>
    </button>
  ),
};
