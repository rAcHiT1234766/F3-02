import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Native checkbox with a wrapping label. Supports checked/onChange, defaultChecked, disabled, required and an indeterminate state. Space changes state. Ref targets the input.',
      },
    },
  },
  args: { label: 'Send email updates' },
};
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { parameters: { theme: 'dark' } };
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
};
export const Mixed: Story = { args: { indeterminate: true } };
export const Disabled: Story = { args: { disabled: true } };
