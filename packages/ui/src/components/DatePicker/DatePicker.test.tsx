import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from './DatePicker';
import { Calendar } from '../Calendar/Calendar';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';

test('controlled date remains authoritative when the owner rejects a valid edit', async () => {
  const change = jest.fn();
  render(<DatePicker label="Date" value="2026-10-23" onValueChange={change} />);
  const input = screen.getByRole('textbox');
  await userEvent.clear(input);
  await userEvent.type(input, '2026-10-24');
  await userEvent.tab();
  expect(change).toHaveBeenLastCalledWith('2026-10-24');
  expect(input).toHaveValue('2026-10-23');
  await userEvent.click(screen.getByRole('button', { name: 'Clear Date' }));
  expect(change).toHaveBeenLastCalledWith(null);
  expect(input).toHaveValue('2026-10-23');
});

test('invalid draft preserves the last committed date; valid blur and clear emit date-only values', async () => {
  const change = jest.fn();
  render(<DatePicker label="Start date" defaultValue="2026-10-23" onValueChange={change} />);
  const input = screen.getByRole('textbox', { name: 'Start date' });
  await userEvent.clear(input);
  await userEvent.type(input, '2026-02-31');
  await userEvent.tab();
  expect(input).toHaveValue('2026-02-31');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(change).not.toHaveBeenCalled();
  expect(input).toHaveAccessibleDescription(expect.stringContaining('Enter a valid date'));
  await userEvent.clear(input);
  await userEvent.type(input, '2024-02-29');
  await userEvent.tab();
  expect(change).toHaveBeenLastCalledWith('2024-02-29');
  await userEvent.click(screen.getByRole('button', { name: 'Clear Start date' }));
  expect(change).toHaveBeenLastCalledWith(null);
  expect(input).toHaveValue('');
});
test('bounds, controlled updates and read-only calendar actions', async () => {
  const change = jest.fn();
  const { rerender } = render(
    <DatePicker
      label="Date"
      value="2026-10-23"
      min="2026-10-01"
      max="2026-10-31"
      onValueChange={change}
    />,
  );
  const input = screen.getByRole('textbox');
  await userEvent.clear(input);
  await userEvent.type(input, '2026-11-01');
  await userEvent.tab();
  expect(screen.getByRole('alert')).toHaveTextContent('Choose 2026-10-31 or earlier.');
  expect(change).not.toHaveBeenCalled();
  rerender(<DatePicker label="Date" value="2026-10-25" readOnly />);
  expect(input).toHaveValue('2026-10-25');
  expect(screen.getByRole('button', { name: 'Open Date calendar' })).toBeDisabled();
});
test('calendar selects a day and nested Escape returns focus without closing the parent dialog', async () => {
  const change = jest.fn();
  render(
    <Modal title="Employee" trigger={<Button>Add</Button>}>
      <DatePicker
        label="Start"
        defaultValue="2026-10-23"
        defaultMonth="2026-10-01"
        onValueChange={change}
      />
    </Modal>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Add' }));
  await userEvent.click(screen.getByRole('button', { name: 'Open Start calendar' }));
  expect(screen.getAllByRole('dialog', { hidden: true })).toHaveLength(2);
  await userEvent.click(screen.getByRole('button', { name: /October 24, 2026/ }));
  expect(change).toHaveBeenLastCalledWith('2026-10-24');
  expect(screen.getAllByRole('dialog')).toHaveLength(1);
  await userEvent.click(screen.getByRole('button', { name: 'Open Start calendar' }));
  await userEvent.keyboard('{Escape}');
  expect(screen.getByRole('dialog', { name: 'Employee' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Open Start calendar' })).toHaveFocus();
});
test('inline calendar can clear selected date and disables out-of-range days', async () => {
  const change = jest.fn();
  render(
    <Calendar
      defaultValue="2026-10-23"
      defaultMonth="2026-10-01"
      min="2026-10-20"
      max="2026-10-25"
      onValueChange={change}
    />,
  );
  expect(screen.getByRole('button', { name: /October 19, 2026/ })).toBeDisabled();
  await userEvent.click(screen.getByRole('button', { name: /October 23, 2026/ }));
  expect(change).toHaveBeenLastCalledWith(null);
});
