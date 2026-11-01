import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, within } from 'storybook/test';
import { Toast } from './Toast';
import { ToastProvider, useToast } from './Toast';
import { Button } from '../Button/Button';
function Example() {
  const { notify } = useToast();
  return (
    <Button
      onClick={() => notify({ message: 'Employee saved.', title: 'Success', tone: 'success' })}
    >
      Save employee
    </Button>
  );
}
const meta: Meta<typeof Toast> = {
  title: 'Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Radix toast with polite announcements by default, pause on hover/focus/window blur and F8 viewport access. ToastProvider and useToast provide a queue of at most five; notify returns null when full. Actions, urgent messages, danger and duration=0 persist until dismissed. No extra live region is added.',
      },
    },
  },
  render: () => (
    <ToastProvider>
      <Example />
    </ToastProvider>
  ),
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
export const ShowsNotification: Story = {
  name: 'Shows a notification',
  play: async ({ canvasElement, step }) => {
    await step('Saving shows a notification without moving focus', async () => {
      const button = within(canvasElement).getByRole('button', { name: 'Save employee' });
      await userEvent.click(button);
      await expect(await screen.findByText('Employee saved.')).toBeVisible();
      await expect(button).toHaveFocus();
    });
  },
};
