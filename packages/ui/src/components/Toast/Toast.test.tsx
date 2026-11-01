import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastProvider, useToast, type ToastMessage } from './Toast';
function Example({
  message = { message: 'Saved', duration: 1000 },
  maxToasts = 5,
}: {
  message?: ToastMessage;
  maxToasts?: number;
}) {
  return (
    <ToastProvider maxToasts={maxToasts}>
      <Trigger message={message} />
    </ToastProvider>
  );
}
function Trigger({ message }: { message: ToastMessage }) {
  const { notify, dismiss } = useToast();
  return (
    <>
      <button onClick={() => notify(message)}>Notify</button>
      <button onClick={() => dismiss(1)}>Dismiss first</button>
    </>
  );
}
test('bounded queue rejects overflow and dismiss releases capacity', async () => {
  render(<Example maxToasts={1} message={{ title: 'Success', message: 'Saved', duration: 0 }} />);
  await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
  await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
  expect(screen.getAllByRole('button', { name: 'Dismiss notification' })).toHaveLength(1);
  await userEvent.click(screen.getByRole('button', { name: 'Dismiss first' }));
  expect(screen.queryByRole('button', { name: 'Dismiss notification' })).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
  await userEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
  expect(screen.queryByRole('button', { name: 'Dismiss notification' })).not.toBeInTheDocument();
});
test('actionable notifications persist and invoke their action', async () => {
  const action = jest.fn();
  render(
    <Example
      message={{
        message: 'Archived',
        action: { label: 'Undo', altText: 'Restore the employee', onClick: action },
      }}
    />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Notify' }));
  await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
  expect(action).toHaveBeenCalledTimes(1);
  await waitFor(() =>
    expect(screen.queryByRole('button', { name: 'Undo' })).not.toBeInTheDocument(),
  );
});
test('open toasts publish the space they cover and clear it when gone', async () => {
  const callbacks: ResizeObserverCallback[] = [];
  const original = globalThis.ResizeObserver;
  globalThis.ResizeObserver = class {
    constructor(callback: ResizeObserverCallback) {
      callbacks.push(callback);
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
  const root = document.documentElement;
  try {
    const { unmount } = render(<Example />);
    const viewport = document.querySelector<HTMLElement>('.fui-toast-viewport')!;
    const notify = () => callbacks.forEach((callback) => callback([], {} as ResizeObserver));
    viewport.getBoundingClientRect = () => ({ top: innerHeight - 100, height: 84 }) as DOMRect;
    viewport.style.rowGap = '12px';
    act(notify);
    expect(root.style.getPropertyValue('--fui-toast-inset')).toBe('112px');
    viewport.getBoundingClientRect = () => ({ top: innerHeight - 16, height: 0 }) as DOMRect;
    act(notify);
    expect(root.style.getPropertyValue('--fui-toast-inset')).toBe('');
    viewport.getBoundingClientRect = () => ({ top: innerHeight - 100, height: 84 }) as DOMRect;
    act(notify);
    unmount();
    expect(root.style.getPropertyValue('--fui-toast-inset')).toBe('');
  } finally {
    globalThis.ResizeObserver = original;
  }
});
test('nonactionable notifications expire and pause while focus is inside the viewport', async () => {
  jest.useFakeTimers();
  try {
    render(<Example />);
    fireEvent.click(screen.getByRole('button', { name: 'Notify' }));
    act(() => {
      jest.advanceTimersByTime(200);
    });
    const dismiss = screen.getByRole('button', { name: 'Dismiss notification' });
    act(() => {
      dismiss.focus();
    });
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(dismiss).toBeInTheDocument();
    act(() => {
      screen.getByRole('button', { name: 'Notify' }).focus();
    });
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(screen.queryByRole('button', { name: 'Dismiss notification' })).not.toBeInTheDocument();
  } finally {
    jest.useRealTimers();
  }
});
