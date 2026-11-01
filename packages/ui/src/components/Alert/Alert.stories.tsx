import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Message text.' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Persistent inline feedback. No live announcement by default; announce polite or assertive only for newly changing content that warrants it. Text conveys meaning independently of color. Ref targets the wrapper.',
      },
    },
  },
  args: { title: 'Local preview', children: 'Changes reset when you refresh.', tone: 'neutral' },
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
