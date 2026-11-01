import { createRef, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { FormField } from './FormField';
import { Input } from '../Input/Input';
import { Textarea } from '../Textarea/Textarea';
import { Checkbox } from '../Checkbox/Checkbox';
import { RadioGroup } from '../RadioGroup/RadioGroup';
import { Switch } from '../Switch/Switch';
import { Select } from '../Select/Select';
import { SearchInput } from '../SearchInput/SearchInput';
import { Slider } from '../Slider/Slider';

test('field preserves external descriptions and wires label, required, help and error', async () => {
  const { container } = render(
    <main>
      <p id="policy">Company policy</p>
      <FormField
        id="email"
        label="Email"
        required
        help="Work address"
        error="Enter an email"
        describedBy="policy"
      >
        {(props) => <Input {...props} />}
      </FormField>
    </main>,
  );
  const input = screen.getByRole('textbox', { name: 'Email (required)' });
  expect(input).toBeRequired();
  expect(input).toHaveAccessibleDescription('Company policy Work address Enter an email');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(
    (await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })).violations,
  ).toEqual([]);
});

test('generated field IDs stay distinct and textarea supports controlled edits and refs', async () => {
  const ref = createRef<HTMLTextAreaElement>();
  function Example() {
    const [value, setValue] = useState('');
    return (
      <>
        <FormField label="Notes">
          {(props) => (
            <Textarea
              {...props}
              ref={ref}
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          )}
        </FormField>
        <FormField label="Other">{(props) => <Input {...props} />}</FormField>
      </>
    );
  }
  render(<Example />);
  await userEvent.type(screen.getByRole('textbox', { name: 'Notes' }), 'First{Enter}Second');
  expect(ref.current).toHaveValue('First\nSecond');
  expect(ref.current?.id).not.toBe(screen.getByRole('textbox', { name: 'Other' }).id);
});

test('checkbox label toggles native form state; mixed and disabled states are preserved', async () => {
  const ref = createRef<HTMLInputElement>();
  const change = jest.fn();
  const { rerender } = render(
    <Checkbox ref={ref} label="Receive updates" indeterminate onChange={change} />,
  );
  expect(ref.current?.indeterminate).toBe(true);
  await userEvent.click(screen.getByText('Receive updates'));
  expect(ref.current).toBeChecked();
  expect(change).toHaveBeenCalledTimes(1);
  rerender(
    <Checkbox ref={ref} label="Receive updates" indeterminate={false} disabled onChange={change} />,
  );
  expect(ref.current?.indeterminate).toBe(false);
  await userEvent.click(screen.getByText('Receive updates'));
  expect(change).toHaveBeenCalledTimes(1);
});

test('hidden checkbox label keeps the accessible name and the clickable label', async () => {
  render(<Checkbox label="Select Ada" hideLabel />);
  const checkbox = screen.getByRole('checkbox', { name: 'Select Ada' });
  expect(screen.getByText('Select Ada')).toHaveClass('fui-visually-hidden');
  expect(checkbox.closest('label')).toHaveClass('fui-choice', 'fui-choice-compact');
  await userEvent.click(checkbox.closest('label')!);
  expect(checkbox).toBeChecked();
});

test('radio group has a group name, selects one option and honors disabled group', async () => {
  const change = jest.fn();
  const options = [
    { value: 'a', label: 'Office' },
    { value: 'b', label: 'Remote' },
    { value: 'c', label: 'Unavailable', disabled: true },
  ];
  const { rerender } = render(
    <RadioGroup
      legend="Location"
      help="Choose one"
      options={options}
      defaultValue="a"
      onValueChange={change}
    />,
  );
  expect(screen.getByRole('group', { name: 'Location' })).toHaveAccessibleDescription('Choose one');
  await userEvent.click(screen.getByRole('radio', { name: 'Remote' }));
  expect(screen.getByRole('radio', { name: 'Office' })).not.toBeChecked();
  expect(screen.getByRole('radio', { name: 'Remote' })).toBeChecked();
  expect(change).toHaveBeenLastCalledWith('b');
  rerender(<RadioGroup legend="Location" options={options} value="a" disabled error="Locked" />);
  expect(screen.getByRole('radio', { name: 'Office' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Remote' })).toBeDisabled();
});

test('switch Space activation, select changes and range units are exposed', async () => {
  const change = jest.fn();
  render(
    <>
      <Switch label="Notifications" />
      <label htmlFor="department-test">
        Department
        <Select id="department-test" defaultValue="design" onChange={change}>
          <option value="design">Design</option>
          <option value="engineering">Engineering</option>
        </Select>
      </label>
      <Slider label="Volume" defaultValue={30} aria-valuetext="30 percent" />
    </>,
  );
  screen.getByRole('switch', { name: 'Notifications' }).focus();
  await userEvent.keyboard(' ');
  expect(screen.getByRole('switch')).toBeChecked();
  await userEvent.selectOptions(screen.getByRole('combobox'), 'engineering');
  expect(screen.getByRole('combobox')).toHaveValue('engineering');
  expect(change).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('slider', { name: 'Volume' })).toHaveAttribute(
    'aria-valuetext',
    '30 percent',
  );
});

test('search emits changes and clear restores focus; controlled value remains authoritative', async () => {
  const change = jest.fn();
  const ref = createRef<HTMLInputElement>();
  const { rerender } = render(
    <SearchInput aria-label="Search" ref={ref} defaultValue="Alex" onValueChange={change} />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
  expect(ref.current).toHaveValue('');
  expect(ref.current).toHaveFocus();
  expect(change).toHaveBeenLastCalledWith('');
  await userEvent.type(ref.current!, 'Lee');
  expect(change).toHaveBeenLastCalledWith('Lee');
  rerender(<SearchInput aria-label="Search" value="Fixed" onValueChange={change} />);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Other' } });
  expect(screen.getByRole('searchbox')).toHaveValue('Fixed');
  rerender(<SearchInput aria-label="Search" value="Fixed" readOnly />);
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
