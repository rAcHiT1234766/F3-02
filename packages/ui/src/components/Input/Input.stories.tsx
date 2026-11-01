import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { Input, type InputProps } from './Input';

function LabeledInput(args: InputProps) {
  const id = useId();
  return (
    <div style={{ maxWidth: 420, display: 'grid', gap: 8 }}>
      <label htmlFor={id}>Full name</label>
      <Input {...args} id={id} />
    </div>
  );
}
const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { description: 'Example of the expected input. Never use it instead of a label.' },
    type: { description: 'Native input type. Defaults to `text`.' },
  },
  args: { placeholder: 'For example, Alex Morgan' },
  render: (args) => <LabeledInput {...args} />,
  parameters: {
    docs: {
      description: {
        component:
          'Native input with a forwarded HTMLInputElement ref. Defaults to type="text" and controlSize="md". Supply a visible label. Placeholder is a hint. value/onChange is controlled; defaultValue initializes an uncontrolled input. Native attributes, including size, name, required, disabled, readOnly and aria-describedby, are preserved. Validation belongs to the form. Use controlSize for visual height.',
      },
    },
  },
} satisfies Meta<typeof Input>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Filled: Story = { args: { defaultValue: 'Alex Morgan' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Alex Morgan' } };
export const ReadOnly: Story = { args: { readOnly: true, value: 'Alex Morgan' } };
export const Required: Story = { args: { required: true } };
export const HelpText: Story = {
  render: () => (
    <div>
      <LabeledInput aria-describedby="name-help" />
      <p id="name-help">Use the name shown in your employee directory.</p>
    </div>
  ),
};
export const Error: Story = {
  render: () => (
    <div>
      <LabeledInput required aria-invalid="true" aria-describedby="name-error" />
      <p id="name-error">Enter a full name.</p>
    </div>
  ),
};
function ControlledInput() {
  const [value, setValue] = useState('');
  return (
    <>
      <LabeledInput value={value} onChange={(event) => setValue(event.target.value)} />
      <p>Current value: {value || '(empty)'}</p>
    </>
  );
}
export const Controlled: Story = { render: () => <ControlledInput /> };
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
};
export const Dark: Story = { parameters: { theme: 'dark' } };
