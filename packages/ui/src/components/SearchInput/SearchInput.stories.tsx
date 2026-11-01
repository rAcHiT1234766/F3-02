import type { Meta, StoryObj } from '@storybook/react-vite';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Forms/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    'aria-label': {
      description: 'Accessible name when there is no visible label. Prefer a visible `<label>`.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Native search input plus a named clear button. Use value/onValueChange or defaultValue. Clearing emits an empty string and restores input focus. Supply a visible label. Ref targets the input.',
      },
    },
  },
  args: { 'aria-label': 'Search employees', defaultValue: 'Morgan' },
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
