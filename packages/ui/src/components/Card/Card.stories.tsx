import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from '../Button/Button';
import { Heading } from '../Heading/Heading';
import { Text } from '../Text/Text';
const meta = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Body content of the card.' },
  },
  args: {
    header: (
      <Heading level={3} size="sm">
        Alex Morgan
      </Heading>
    ),
    children: <Text>Engineering · Active employee</Text>,
    footer: <Button variant="secondary">View employee</Button>,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Noninteractive div surface with optional header/footer slots and a content area. Slots are ReactNode; use Heading for a real heading and Button or Link for actions. The card itself is not clickable, avoiding nested interactive elements. Native div attributes/ref pass through.',
      },
    },
  },
} satisfies Meta<typeof Card>;
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
export const ContentOnly: Story = { args: { header: undefined, footer: undefined } };
export const LongContent: Story = {
  args: {
    header: (
      <Heading level={3} size="sm">
        International customer experience and employee enablement
      </Heading>
    ),
    children: (
      <Text>
        Long labels wrap inside the card, including a.long.employee.identifier@example.com.
      </Text>
    ),
  },
};
