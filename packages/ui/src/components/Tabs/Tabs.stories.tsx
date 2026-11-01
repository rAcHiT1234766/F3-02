import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Radix horizontal tabs with automatic activation on arrow navigation. Use value/onValueChange or defaultValue; defaults to the first enabled tab. Panels are associated with their tabs. No navigation URLs.',
      },
    },
  },
  args: {
    label: 'Employee information',
    items: [
      { value: 'profile', label: 'Profile', content: <p>Employee profile details.</p> },
      { value: 'activity', label: 'Activity', content: <p>No recent activity.</p> },
      { value: 'billing', label: 'Billing', content: 'Unavailable', disabled: true },
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
export const KeyboardInteraction: Story = {
  name: 'Keyboard interaction',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Tab reaches the selected tab', async () => {
      await userEvent.tab();
      await expect(canvas.getByRole('tab', { name: 'Profile' })).toHaveFocus();
    });
    await step('Arrow keys switch tabs and show the matching panel', async () => {
      await userEvent.keyboard('{ArrowRight}');
      const activity = canvas.getByRole('tab', { name: 'Activity' });
      await expect(activity).toHaveFocus();
      await expect(activity).toHaveAttribute('aria-selected', 'true');
      await expect(canvas.getByRole('tabpanel')).toHaveTextContent('No recent activity.');
    });
    await step('The disabled tab is skipped', async () => {
      await userEvent.keyboard('{ArrowRight}');
      await expect(canvas.getByRole('tab', { name: 'Profile' })).toHaveFocus();
      await userEvent.keyboard('{ArrowLeft}');
      await expect(canvas.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    });
  },
};
