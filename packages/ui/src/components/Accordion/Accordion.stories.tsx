import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Radix disclosure sections with heading buttons. Enter/Space toggle; arrows move among headers. One section opens by default; multiple allows several. Controlled value is an array, including in single mode; defaultValue initializes only once.',
      },
    },
  },
  args: {
    items: [
      {
        value: 'access',
        title: 'Who can access this?',
        content: <p>Only this local demo session.</p>,
      },
      { value: 'storage', title: 'Is data saved?', content: <p>State resets on refresh.</p> },
    ],
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
export const Multiple: Story = { args: { multiple: true, defaultValue: ['access', 'storage'] } };
export const KeyboardInteraction: Story = {
  name: 'Keyboard interaction',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('button', { name: 'Who can access this?' });
    const second = canvas.getByRole('button', { name: 'Is data saved?' });
    await step('Enter expands a section and reveals its content', async () => {
      first.focus();
      await userEvent.keyboard('{Enter}');
      await expect(first).toHaveAttribute('aria-expanded', 'true');
      await expect(canvas.getByText('Only this local demo session.')).toBeVisible();
    });
    await step('Down arrow moves to the next header; opening it closes the first', async () => {
      await userEvent.keyboard('{ArrowDown}');
      await expect(second).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await expect(second).toHaveAttribute('aria-expanded', 'true');
      await expect(first).toHaveAttribute('aria-expanded', 'false');
    });
  },
};
