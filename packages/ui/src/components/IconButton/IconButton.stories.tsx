import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';
import { useState } from 'react';
const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    children: {
      description:
        'Icon or glyph. Hidden from assistive technology, which announces `label` instead.',
    },
  },
  args: { label: 'Add employee', children: <span>+</span> },
  parameters: {
    docs: {
      description: {
        component:
          'Named native button; label is required and the icon is decorative. Defaults to primary/md/type=button. Forwards a button ref and native callbacks. Enter/Space activate; disabled/loading prevent activation. Do not put interactive elements inside the icon.',
      },
    },
  },
} satisfies Meta<typeof IconButton>;
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
export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      <IconButton label="Add employee">+</IconButton>
      <IconButton label="Close" variant="secondary" size="sm">
        ×
      </IconButton>
      <IconButton label="Delete employee" variant="danger" size="lg">
        −
      </IconButton>
      <IconButton label="Save employee" loading>
        ✓
      </IconButton>
      <IconButton label="Unavailable" disabled>
        +
      </IconButton>
    </div>
  ),
};
function ToggleExample() {
  const [saved, setSaved] = useState(false);
  return (
    <IconButton label="Save favorite" aria-pressed={saved} onClick={() => setSaved(!saved)}>
      {saved ? '★' : '☆'}
    </IconButton>
  );
}
export const Toggle: Story = { render: () => <ToggleExample /> };
