import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const meta = {
  title: 'Feedback/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Short label text.' },
  },
  args: { children: 'Active', tone: 'success' },
  parameters: {
    docs: {
      description: {
        component:
          'Static span for categories and statuses, defaults to neutral. Always include meaningful text: color alone must not communicate state. No implicit live region or click behavior. Ref targets the span; supply an appropriate surrounding announcement when data changes.',
      },
    },
  },
} satisfies Meta<typeof Badge>;
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
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Badge>Engineering</Badge>
      <Badge tone="success">Active</Badge>
      <Badge tone="warning">On leave</Badge>
      <Badge tone="danger">Archived</Badge>
    </div>
  ),
};
