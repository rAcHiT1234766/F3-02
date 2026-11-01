import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from './Button';

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Visible text of the button, which is also its accessible name.' },
    type: {
      description:
        'Native button type. Defaults to `button` so it never submits a form by accident; use `submit` in forms.',
    },
  },
  args: { children: 'Save changes' },
  parameters: {
    docs: {
      description: {
        component:
          'Native action button. Defaults to type="button", variant="primary", size="md". Pass type="submit" inside forms. Disabled and loading buttons leave the tab order and prevent activation; loading keeps the original name. Ref targets HTMLButtonElement. Enter and Space activate. Give icon-only controls an accessible name. className and native event props pass through.',
      },
    },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button>Save changes</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="danger">Archive employee</Button>
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
      <Button size="sm">Small</Button>
      <Button>Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };
export const IconWithText: Story = {
  args: {
    children: (
      <>
        <span aria-hidden="true">＋</span>Add employee
      </>
    ),
  },
};
export const LongLabel: Story = {
  args: { children: 'Save all changes and return to your employee directory' },
  decorators: [
    (Story) => (
      <div style={{ width: 220 }}>
        <Story />
      </div>
    ),
  ],
};
function FormExample() {
  const [saved, setSaved] = useState(false);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <Button type="submit">Save profile</Button>
      <p role="status">{saved ? 'Profile saved locally.' : ''}</p>
    </form>
  );
}
export const FormUsage: Story = { render: () => <FormExample /> };
export const Dark: Story = { ...Variants, parameters: { theme: 'dark' } };
