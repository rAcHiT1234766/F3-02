import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { Button } from './Button';

test('defaults to a non-submitting button and calls the click handler', async () => {
  const click = jest.fn();
  const submit = jest.fn((event) => event.preventDefault());
  render(
    <form onSubmit={submit}>
      <Button onClick={click}>Save</Button>
    </form>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(click).toHaveBeenCalledTimes(1);
  expect(submit).not.toHaveBeenCalled();
});
test('explicit submit participates in native form submission', async () => {
  const submit = jest.fn((event) => event.preventDefault());
  render(
    <form onSubmit={submit}>
      <Button type="submit">Save</Button>
    </form>,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(submit).toHaveBeenCalledTimes(1);
});
test.each([{ disabled: true }, { loading: true }])('prevents activation for %j', async (props) => {
  const click = jest.fn();
  render(
    <Button {...props} onClick={click}>
      Save changes
    </Button>,
  );
  const button = screen.getByRole('button', { name: 'Save changes' });
  await userEvent.click(button);
  fireEvent.click(button);
  expect(button).toBeDisabled();
  expect(click).not.toHaveBeenCalled();
});
test('forwards a focusable ref and supports Enter and Space', async () => {
  const ref = createRef<HTMLButtonElement>();
  const click = jest.fn();
  render(
    <Button ref={ref} onClick={click}>
      Open
    </Button>,
  );
  ref.current?.focus();
  expect(ref.current).toHaveFocus();
  await userEvent.keyboard('{Enter} ');
  expect(click).toHaveBeenCalledTimes(2);
});
test('representative variants have no detectable axe violations', async () => {
  const { container } = render(
    <main>
      <Button>Save</Button>
      <Button variant="secondary" size="sm">
        Cancel
      </Button>
      <Button variant="danger" size="lg" loading>
        Deleting
      </Button>
    </main>,
  );
  // Color contrast requires browser layout; it is separately reviewed in a browser.
  const results = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } });
  expect(results.violations).toEqual([]);
});
