import type { Meta, StoryObj } from '@storybook/react-vite';
import { Fieldset } from './Fieldset';
import { Checkbox } from '../Checkbox/Checkbox';
const meta: Meta<typeof Fieldset> = {
  title: 'Forms/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Controls in the group.' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Native fieldset and legend for related controls. disabled disables descendants; help and error are associated with the group. Ref targets the fieldset.',
      },
    },
  },
  args: {
    legend: 'Notifications',
    help: 'Choose any channels.',
    children: (
      <>
        <Checkbox label="Email" />
        <Checkbox label="In-app" />
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
