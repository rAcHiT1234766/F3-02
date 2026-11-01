import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    legend: {
      description: 'Caption that names the group. Screen readers announce it with each option.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Native radio buttons inside a labeled fieldset. Arrow keys move between enabled options. Use value/onValueChange or defaultValue. name is unique by default. Ref targets the fieldset.',
      },
    },
  },
  args: {
    legend: 'Work arrangement',
    options: [
      { value: 'office', label: 'Office' },
      { value: 'remote', label: 'Remote' },
      { value: 'hybrid', label: 'Hybrid', disabled: true },
    ],
    defaultValue: 'office',
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
