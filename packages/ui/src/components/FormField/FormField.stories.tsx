import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';
import { Input } from '../Input/Input';
const meta: Meta<typeof FormField> = {
  title: 'Forms/FormField',
  component: FormField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'One labeled control via a render function. Spread the supplied ID, required, invalid and description attributes. describedBy preserves existing help IDs; validation policy belongs to the form.',
      },
    },
  },
  args: {
    label: 'Work email',
    help: 'Use your work address.',
    required: true,
    children: (props) => <Input {...props} type="email" />,
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
export const Error: Story = { args: { error: 'Enter a work email address.' } };
