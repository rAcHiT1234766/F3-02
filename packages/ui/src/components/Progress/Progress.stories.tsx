import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { label: 'Importing employees', value: 65 },
  parameters: {
    docs: {
      description: {
        component:
          'Native progress element with required accessible label; max defaults to 100. Omitted or non-finite value is indeterminate. Finite values clamp to 0..max; invalid max falls back to 100. Controlled display only: caller owns task state. No keyboard interaction or implicit completion announcement. Ref targets HTMLProgressElement.',
      },
    },
  },
} satisfies Meta<typeof Progress>;
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
export const Indeterminate: Story = { args: { value: undefined } };
export const Complete: Story = { args: { value: 100 } };
export const Empty: Story = { args: { value: 0 } };
export const CustomRange: Story = {
  args: { label: '3 of 8 employees imported', max: 8, value: 3 },
};
