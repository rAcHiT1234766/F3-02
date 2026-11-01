import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta = {
  title: 'Typography/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Text content.' },
  },
  args: { children: 'Clear language makes everyday work easier.' },
  parameters: {
    docs: {
      description: {
        component:
          'Body text with p/span/small/strong semantics; defaults to p/md/default tone. Ref targets the selected HTMLElement. Size is independent of semantics. Native attributes, className and style pass through. Keep block elements out of inline text.',
      },
    },
  },
} satisfies Meta<typeof Text>;
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
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Text size="lg">Lead paragraph</Text>
      <Text>Body paragraph</Text>
      <Text as="small" size="sm" tone="muted">
        Last updated today
      </Text>
      <Text as="strong">This action needs your attention.</Text>
    </div>
  ),
};
