import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { DropdownMenu } from './DropdownMenu';
import { Button } from '../Button/Button';
const meta: Meta<typeof DropdownMenu> = {
  title: 'Navigation/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Radix action menu. Arrow keys, Home/End, typeahead, Enter and Escape follow the primitive. Disabled actions cannot activate. Provide a labeled trigger accepting props/ref. Ref is not exposed by this aggregate API.',
      },
    },
  },
  args: {
    label: 'Employee actions',
    trigger: <Button variant="secondary">Actions</Button>,
    items: [
      { id: 'edit', label: 'Edit', onSelect: () => undefined },
      { id: 'divide', separator: true },
      { id: 'export', label: 'Export', onSelect: () => undefined, disabled: true },
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
    const trigger = within(canvasElement).getByRole('button', { name: 'Actions' });
    await step('Enter opens the menu and focuses the first action', async () => {
      trigger.focus();
      await userEvent.keyboard('{Enter}');
      const menu = await screen.findByRole('menu', { name: 'Employee actions' });
      await waitFor(() =>
        expect(within(menu).getByRole('menuitem', { name: 'Edit' })).toHaveFocus(),
      );
    });
    await step('Disabled actions are announced as unavailable', async () => {
      await expect(screen.getByRole('menuitem', { name: 'Export' })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });
    await step('Escape closes the menu and focus returns to the trigger', async () => {
      await userEvent.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
      await expect(trigger).toHaveFocus();
    });
    await step('Reopen for the visual snapshot', async () => {
      await userEvent.keyboard('{Enter}');
      await screen.findByRole('menu', { name: 'Employee actions' });
    });
  },
};
