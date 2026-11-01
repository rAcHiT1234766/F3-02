import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    'aria-label': {
      description: 'Accessible name when there is no visible label. Prefer a visible `<label>`.',
    },
    placeholder: { description: 'Example of the expected input. Never use it instead of a label.' },
    defaultValue: { description: 'Initial text when uncontrolled.' },
    rows: { description: 'Visible height in lines. Defaults to 4.' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Native multiline editing with refs, rows and form attributes. Vertical resizing by default. Supply a visible label or use FormField; controlled value and defaultValue follow native React contracts.',
      },
    },
  },
  args: { 'aria-label': 'Notes', placeholder: 'Add notes', defaultValue: 'Available after 10 AM.' },
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
