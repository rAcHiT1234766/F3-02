import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    defaultChecked: { description: 'Initial on or off state when uncontrolled.' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A native checkbox with switch semantics for a boolean setting. Keep its label stable. checked/onChange and defaultChecked follow native contracts; Space toggles. Ref targets the input.',
      },
    },
  },
  args: { label: 'Enable notifications', defaultChecked: true },
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
