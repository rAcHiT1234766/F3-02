import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    'aria-label': {
      description: 'Accessible name when there is no visible label. Prefer a visible `<label>`.',
    },
    defaultValue: { description: 'Initially selected option value when uncontrolled.' },
    children: { description: 'The `<option>` elements.' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Native single-select. Supply options and an associated label or FormField. value/onChange and defaultValue follow native contracts. Ref targets the select; native keyboard navigation is preserved.',
      },
    },
  },
  args: {
    'aria-label': 'Department',
    defaultValue: '',
    children: (
      <>
        <option value="" disabled>
          Choose a department
        </option>
        <option>Engineering</option>
        <option>Design</option>
      </>
    ),
  },
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
