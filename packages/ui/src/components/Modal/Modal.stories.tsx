import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Modal } from './Modal';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
const meta: Meta<typeof Modal> = {
  title: 'Overlays/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Modal dialog built on Radix Dialog. Requires a title. Trigger must accept forwarded props/ref. Supports open/onOpenChange or defaultOpen; initialFocusRef overrides first-control focus. Escape and Close dismiss, focus returns to the trigger. Static theme attributes propagate to the portal and update while open.',
      },
    },
  },
  args: {
    title: 'Edit profile',
    description: 'Changes remain in this example.',
    trigger: <Button>Edit profile</Button>,
    children: (
      <label htmlFor="story-profile-name">
        Full name
        <Input id="story-profile-name" defaultValue="Alex Morgan" />
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
export const Open: Story = { args: { defaultOpen: true } };
export const OpenDark: Story = { args: { defaultOpen: true }, parameters: { theme: 'dark' } };
export const KeyboardInteraction: Story = {
  name: 'Keyboard interaction',
  play: async ({ canvasElement, step }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Edit profile' });
    await step('Enter opens the dialog and moves focus inside it', async () => {
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      const dialog = await screen.findByRole('dialog', { name: 'Edit profile' });
      await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    });
    await step('Tab keeps focus inside the dialog', async () => {
      const dialog = screen.getByRole('dialog', { name: 'Edit profile' });
      for (let press = 0; press < 4; press++) {
        await userEvent.tab();
        await expect(dialog).toContainElement(document.activeElement as HTMLElement);
      }
    });
    await step('Escape closes it and focus returns to the trigger', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      await expect(trigger).toHaveFocus();
    });
    await step('Reopen for the visual snapshot', async () => {
      await userEvent.keyboard('{Enter}');
      await screen.findByRole('dialog', { name: 'Edit profile' });
    });
  },
};
