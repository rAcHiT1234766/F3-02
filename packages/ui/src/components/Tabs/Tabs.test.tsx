import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';
import { Accordion } from '../Accordion/Accordion';
import { DropdownMenu } from '../DropdownMenu/DropdownMenu';
import { Tooltip } from '../Tooltip/Tooltip';
import { Pagination } from '../Pagination/Pagination';
import { Button } from '../Button/Button';

test('tabs navigate with arrows, skip disabled tabs and expose the selected panel', async () => {
  render(
    <Tabs
      label="Profile"
      items={[
        { value: 'a', label: 'About', content: 'About content' },
        { value: 'b', label: 'Locked', disabled: true, content: 'Hidden' },
        { value: 'c', label: 'Work', content: 'Work content' },
      ]}
    />,
  );
  act(() => screen.getByRole('tab', { name: 'About' }).focus());
  await userEvent.keyboard('{ArrowRight}');
  expect(screen.getByRole('tab', { name: 'Work' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Work content');
});
test('accordion supports single collapse and multiple expansion', async () => {
  const items = [
    { value: 'a', title: 'First', content: 'First details' },
    { value: 'b', title: 'Second', content: 'Second details' },
  ];
  const { rerender } = render(<Accordion items={items} />);
  await userEvent.click(screen.getByRole('button', { name: 'First' }));
  await userEvent.click(screen.getByRole('button', { name: 'Second' }));
  expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'false');
  await userEvent.click(screen.getByRole('button', { name: 'Second' }));
  expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'false');
  rerender(<Accordion items={items} multiple />);
  await userEvent.click(screen.getByRole('button', { name: 'First' }));
  await userEvent.click(screen.getByRole('button', { name: 'Second' }));
  expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('aria-expanded', 'true');
});
test('menu keyboard navigation skips disabled actions and restores focus', async () => {
  const select = jest.fn();
  render(
    <DropdownMenu
      label="Employee actions"
      trigger={<Button>Actions</Button>}
      items={[
        { id: 'a', label: 'Disabled', disabled: true, onSelect: select },
        { id: 's', separator: true },
        { id: 'b', label: 'Edit', onSelect: select },
      ]}
    />,
  );
  const trigger = screen.getByRole('button', { name: 'Actions' });
  trigger.focus();
  await userEvent.keyboard('{ArrowDown}');
  // The label prop names the menu, not the trigger text.
  expect(screen.getByRole('menu', { name: 'Employee actions' })).toBeInTheDocument();
  expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  await userEvent.keyboard('{Enter}');
  expect(select).toHaveBeenCalledTimes(1);
  expect(trigger).toHaveFocus();
});
test('tooltip is available on keyboard focus and dismisses with Escape', async () => {
  render(
    <Tooltip content="More information" delayDuration={0}>
      <Button>Help</Button>
    </Tooltip>,
  );
  await userEvent.tab();
  expect(await screen.findByRole('tooltip')).toHaveTextContent('More information');
  await userEvent.keyboard('{Escape}');
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
});
test('pagination guards boundaries and clamps shrinking totals', async () => {
  const change = jest.fn();
  const { rerender } = render(
    <Pagination totalItems={0} pageSize={10} page={5} onPageChange={change} />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Next' }));
  await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
  expect(change).not.toHaveBeenCalled();
  rerender(<Pagination totalItems={120} pageSize={10} page={6} onPageChange={change} />);
  await userEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(change).toHaveBeenLastCalledWith(7);
  await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
  expect(change).toHaveBeenLastCalledWith(5);
  await userEvent.click(screen.getByRole('button', { name: 'Page 12' }));
  expect(change).toHaveBeenLastCalledWith(12);
});
