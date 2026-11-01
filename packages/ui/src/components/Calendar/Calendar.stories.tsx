import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Dates/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'React DayPicker single-date Gregorian calendar with English labels. Values are YYYY-MM-DD strings or null. Use value/onValueChange or defaultValue. Arrow and Page navigation come from DayPicker. Invalid bounds throw; min/max disable out-of-range days. Set defaultMonth for deterministic examples.',
      },
    },
  },
  args: {
    defaultMonth: '2026-10-01',
    defaultValue: '2026-10-23',
    min: '2026-01-01',
    max: '2027-12-31',
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
