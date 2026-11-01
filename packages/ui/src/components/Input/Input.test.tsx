import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { Input } from './Input';

test('supports uncontrolled editing and native callbacks', async () => {
  const change = jest.fn();
  render(
    <>
      <label htmlFor="uncontrolled-name">Name</label>
      <Input id="uncontrolled-name" defaultValue="Ada" onChange={change} />
    </>,
  );
  const input = screen.getByRole('textbox', { name: 'Name' });
  await userEvent.type(input, ' Cole');
  expect(input).toHaveValue('Ada Cole');
  expect(change).toHaveBeenCalledTimes(5);
});
test('controlled changes and prop updates are reflected', async () => {
  function Example() {
    const [value, setValue] = useState('');
    return (
      <Input aria-label="Name" value={value} onChange={(event) => setValue(event.target.value)} />
    );
  }
  const view = render(<Example />);
  await userEvent.type(screen.getByRole('textbox'), 'Alex');
  expect(screen.getByRole('textbox')).toHaveValue('Alex');
  view.rerender(<Input aria-label="Name" value="Sam" readOnly />);
  expect(screen.getByRole('textbox')).toHaveValue('Sam');
});
test.each([{ disabled: true }, { readOnly: true }])('preserves %j behavior', async (props) => {
  render(<Input aria-label="Name" defaultValue="Ada" {...props} />);
  await userEvent.type(screen.getByRole('textbox'), 'x');
  expect(screen.getByRole('textbox')).toHaveValue('Ada');
});
test('preserves required, native size, descriptions and focus ref', async () => {
  const ref = createRef<HTMLInputElement>();
  const { container } = render(
    <main>
      <label htmlFor="name">Name</label>
      <Input
        id="name"
        name="name"
        ref={ref}
        required
        size={24}
        controlSize="sm"
        aria-invalid="true"
        aria-describedby="hint error"
      />
      <p id="hint">Use your full name.</p>
      <p id="error">Name is required.</p>
    </main>,
  );
  ref.current?.focus();
  const input = screen.getByRole('textbox', { name: 'Name' });
  expect(input).toHaveFocus();
  expect(input).toBeRequired();
  expect(input).toHaveAttribute('size', '24');
  expect(input).toHaveAccessibleDescription('Use your full name. Name is required.');
  expect(
    (await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })).violations,
  ).toEqual([]);
});
