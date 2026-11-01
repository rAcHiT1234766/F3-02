import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Drawer } from './Drawer';
import { Button } from '../Button/Button';
const meta: Meta<typeof Drawer> = {
  title: 'Overlays/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Side panel sharing Modal focus, Escape and theme behavior. side defaults to right. Supports the same controlled/uncontrolled and focus-ref contracts; ref targets the dialog content.',
      },
    },
  },
  args: {
    title: 'Employee details',
    trigger: <Button>View details</Button>,
    children: <p>Alex Morgan · Engineering</p>,
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
    const trigger = within(canvasElement).getByRole('button', { name: 'View details' });
    await step('Enter opens the drawer and moves focus inside it', async () => {
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      const drawer = await screen.findByRole('dialog', { name: 'Employee details' });
      await waitFor(() => expect(drawer).toContainElement(document.activeElement as HTMLElement));
    });
    await step('Escape closes it and focus returns to the trigger', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      await expect(trigger).toHaveFocus();
    });
    await step('Reopen for the visual snapshot', async () => {
      await userEvent.keyboard('{Enter}');
      await screen.findByRole('dialog', { name: 'Employee details' });
    });
  },
};
