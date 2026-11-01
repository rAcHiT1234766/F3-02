import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Combobox } from './Combobox';
const options = [
  { id: 'a', label: 'Alex' },
  { id: 'b', label: 'Alex' },
  { id: 'c', label: 'Chris', disabled: true },
  { id: 'd', label: 'Dana' },
];

test('controlled selection remains authoritative when the owner rejects a change', async () => {
  const change = jest.fn();
  render(<Combobox label="Manager" options={options} value="a" onValueChange={change} />);
  const input = screen.getByRole('combobox');
  await userEvent.clear(input);
  await userEvent.type(input, 'Dana');
  await userEvent.keyboard('{ArrowDown}{Enter}');
  expect(change).toHaveBeenLastCalledWith('d');
  expect(input).toHaveValue('Alex');
  await userEvent.click(screen.getByRole('button', { name: 'Clear Manager' }));
  expect(change).toHaveBeenLastCalledWith(null);
  expect(input).toHaveValue('Alex');
});

test('manual selection distinguishes duplicate labels and skips disabled options', async () => {
  const change = jest.fn();
  render(<Combobox label="Manager" options={options} onValueChange={change} />);
  const input = screen.getByRole('combobox');
  await userEvent.click(input);
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');
  expect(change).toHaveBeenLastCalledWith('d');
  expect(input).toHaveValue('Dana');
  await userEvent.clear(input);
  await userEvent.type(input, 'Alex');
  await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
  expect(change).toHaveBeenLastCalledWith('b');
});

test('Escape and blur restore committed text; clear resets query and selection with input focus', async () => {
  const change = jest.fn();
  const ref = createRef<HTMLInputElement>();
  render(
    <>
      <Combobox
        ref={ref}
        label="Manager"
        options={options}
        defaultValue="a"
        onValueChange={change}
      />
      <button>After</button>
    </>,
  );
  await userEvent.clear(ref.current!);
  await userEvent.type(ref.current!, 'Missing');
  expect(screen.getByRole('status')).toHaveTextContent('No matching options.');
  await userEvent.keyboard('{Escape}');
  expect(ref.current).toHaveValue('Alex');
  expect(change).not.toHaveBeenCalled();
  await userEvent.clear(ref.current!);
  await userEvent.type(ref.current!, 'unmatched');
  await userEvent.click(screen.getByRole('button', { name: 'After' }));
  expect(ref.current).toHaveValue('Alex');
  await userEvent.click(screen.getByRole('button', { name: 'Clear Manager' }));
  expect(change).toHaveBeenLastCalledWith(null);
  expect(ref.current).toHaveValue('');
  expect(ref.current).toHaveFocus();
});

test('pointer selection survives blur, ignores disabled options and handles controlled updates', async () => {
  const change = jest.fn();
  const { rerender } = render(
    <Combobox label="Manager" options={options} onValueChange={change} name="manager" />,
  );
  await userEvent.click(screen.getByRole('combobox'));
  await userEvent.click(screen.getByRole('option', { name: 'Chris' }));
  expect(change).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('option', { name: 'Dana' }));
  expect(change).toHaveBeenCalledWith('d');
  rerender(<Combobox label="Manager" options={options} value="a" onValueChange={change} />);
  expect(screen.getByRole('combobox')).toHaveValue('Alex');
  rerender(
    <Combobox label="Manager" options={options} value="d" onValueChange={change} disabled />,
  );
  expect(screen.getByRole('combobox')).toHaveValue('Dana');
  expect(screen.getByRole('combobox')).toBeDisabled();
});

test('IME Enter does not commit and normal text-editing keys are left alone', async () => {
  const change = jest.fn();
  render(<Combobox label="Manager" options={options} onValueChange={change} />);
  const input = screen.getByRole('combobox');
  await userEvent.click(input);
  await userEvent.keyboard('{ArrowUp}');
  fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
  expect(change).not.toHaveBeenCalled();
  await userEvent.keyboard('{Home}{End}{Tab}');
  expect(input).toHaveValue('');
});
