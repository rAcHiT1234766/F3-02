import { createRef } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { Modal } from './Modal';
import { Drawer } from '../Drawer/Drawer';
import { AlertDialog } from '../AlertDialog/AlertDialog';
import { Popover } from '../Popover/Popover';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';

test('modal has a title/description, receives initial focus, traps Tab and restores trigger focus', async () => {
  const ref = createRef<HTMLInputElement>();
  render(
    <Modal
      title="Edit employee"
      description="Local data only"
      initialFocusRef={ref}
      trigger={<Button>Edit</Button>}
    >
      <label htmlFor="modal-name">
        Name
        <Input id="modal-name" ref={ref} />
      </label>
      <Button>Save</Button>
    </Modal>,
  );
  const trigger = screen.getByRole('button', { name: 'Edit' });
  await userEvent.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'Edit employee' });
  expect(dialog).toHaveAccessibleDescription('Local data only');
  expect(ref.current).toHaveFocus();
  within(dialog).getByRole('button', { name: 'Save' }).focus();
  await userEvent.tab();
  expect(within(dialog).getByRole('button', { name: 'Close Edit employee' })).toHaveFocus();
  expect(
    (await axe.run(dialog, { rules: { 'color-contrast': { enabled: false } } })).violations,
  ).toEqual([]);
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(trigger).toHaveFocus());
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('drawer carries the nearest theme into its portal and updates it while open', async () => {
  const { rerender } = render(
    <div data-ui-theme="dark">
      <Drawer title="Details" trigger={<Button>Details</Button>}>
        <p>Employee details</p>
      </Drawer>
    </div>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Details' }));
  expect(screen.getByRole('dialog')).toHaveAttribute('data-ui-theme', 'dark');
  rerender(
    <div data-ui-theme="light">
      <Drawer title="Details" trigger={<Button>Details</Button>}>
        <p>Employee details</p>
      </Drawer>
    </div>,
  );
  await waitFor(() => expect(screen.getByRole('dialog')).toHaveAttribute('data-ui-theme', 'light'));
  await userEvent.click(screen.getByRole('button', { name: 'Close Details' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('confirmation focuses cancel and only explicit confirmation invokes the action', async () => {
  const confirm = jest.fn();
  render(
    <AlertDialog
      title="Archive?"
      description="Move this local record to archive."
      trigger={<Button>Archive employee</Button>}
      confirmLabel="Confirm archive"
      onConfirm={confirm}
    />,
  );
  const trigger = screen.getByRole('button', { name: 'Archive employee' });
  await userEvent.click(trigger);
  expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  expect(confirm).not.toHaveBeenCalled();
  await userEvent.click(trigger);
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(confirm).not.toHaveBeenCalled();
  await userEvent.click(trigger);
  await userEvent.click(screen.getByRole('button', { name: 'Confirm archive' }));
  expect(confirm).toHaveBeenCalledTimes(1);
});

test('nested popover Escape closes only the top layer', async () => {
  render(
    <Modal title="Edit" trigger={<Button>Open editor</Button>}>
      <Popover title="Help" trigger={<Button>Help</Button>}>
        <Button>Read guidance</Button>
      </Popover>
    </Modal>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Open editor' }));
  await userEvent.click(screen.getByRole('button', { name: 'Help' }));
  expect(screen.getAllByRole('dialog')).toHaveLength(2);
  await userEvent.keyboard('{Escape}');
  expect(screen.getByRole('dialog', { name: 'Edit' })).toBeInTheDocument();
  expect(screen.queryByRole('dialog', { name: 'Help' })).not.toBeInTheDocument();
});
