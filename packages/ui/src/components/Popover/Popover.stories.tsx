import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Popover } from './Popover';
import { Button } from '../Button/Button';
const meta: Meta<typeof Popover> = {
  title: 'Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Anchored nonmodal dialog built on Radix Popover. Title names the dialog. Trigger must accept props/ref. Escape, outside interaction and Close dismiss. Focus enters on opening and returns on close. Theme follows the trigger boundary.',
      },
    },
  },
  args: {
    title: 'Filters',
    trigger: <Button variant="secondary">Open filters</Button>,
    children: (
      <label>
        <input type="checkbox" /> Active employees only
      </label>
    ),
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
    const trigger = within(canvasElement).getByRole('button', { name: 'Open filters' });
    await step('Enter opens the popover and moves focus into it', async () => {
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      const popover = await screen.findByRole('dialog', { name: 'Filters' });
      await waitFor(() => expect(popover).toContainElement(document.activeElement as HTMLElement));
    });
    await step('Escape closes it and focus returns to the trigger', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      await expect(trigger).toHaveFocus();
    });
    await step('Reopen for the visual snapshot', async () => {
      await userEvent.keyboard('{Enter}');
      await screen.findByRole('dialog', { name: 'Filters' });
    });
  },
};
