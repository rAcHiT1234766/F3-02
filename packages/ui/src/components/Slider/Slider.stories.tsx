import type { Meta, StoryObj } from '@storybook/react-vite';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: { description: 'Initial value when uncontrolled.' },
    'aria-valuetext': {
      description: 'Readable form of the value for screen readers, e.g. “3 days”.',
    },
    min: { description: 'Lowest value. Defaults to 0.' },
    max: { description: 'Highest value. Defaults to 100.' },
    step: { description: 'Difference between neighbouring values. Defaults to 1.' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Native single-thumb range. Arrow, Home and End behavior is provided by the browser. Native onChange/value/defaultValue and refs are supported. Update aria-valuetext with value when custom units are needed.',
      },
    },
  },
  args: {
    label: 'Volume',
    min: 0,
    max: 100,
    step: 10,
    defaultValue: 50,
    'aria-valuetext': '50 percent',
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
