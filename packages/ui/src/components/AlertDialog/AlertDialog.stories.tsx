import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { AlertDialog } from './AlertDialog';
import { Button } from '../Button/Button';
const meta: Meta<typeof AlertDialog> = {
  title: 'Overlays/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Radix alert dialog with initial focus on Cancel. Outside clicks do not confirm or dismiss. onConfirm runs only for explicit confirmation; trigger and cancel restore focus. Supports open/onOpenChange or defaultOpen.',
      },
    },
  },
  args: {
    title: 'Archive employee?',
    description: 'This example only changes local data.',
    trigger: <Button variant="danger">Archive employee</Button>,
    confirmLabel: 'Archive',
    onConfirm: () => undefined,
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
  args: { onConfirm: fn() },
  play: async ({ args, canvasElement, step }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Archive employee' });
    await step('Opening moves focus to the safe Cancel action', async () => {
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      const dialog = await screen.findByRole('alertdialog', { name: 'Archive employee?' });
      await waitFor(() =>
        expect(within(dialog).getByRole('button', { name: 'Cancel' })).toHaveFocus(),
      );
    });
    await step('Escape cancels without confirming and restores focus', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
      await expect(args.onConfirm).not.toHaveBeenCalled();
      await expect(trigger).toHaveFocus();
    });
    await step('Reopen for the visual snapshot', async () => {
      await userEvent.keyboard('{Enter}');
      await screen.findByRole('alertdialog', { name: 'Archive employee?' });
    });
  },
};
