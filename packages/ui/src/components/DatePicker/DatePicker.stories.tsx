import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Dates/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Date-only input and modal calendar. Draft text is committed on blur when valid, invalid text retains the last valid selection and shows an associated error. Calendar selection commits immediately; Clear emits null. Controlled value/onValueChange or defaultValue supported. Calendar Escape closes the inner dialog only; refs target the text input.',
      },
    },
  },
  args: {
    label: 'Start date',
    defaultValue: '2026-10-23',
    defaultMonth: '2026-10-01',
    min: '2026-01-01',
    max: '2027-12-31',
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
export const ReadOnly: Story = { args: { readOnly: true } };
export const Disabled: Story = { args: { disabled: true } };
export const KeyboardInteraction: Story = {
  name: 'Keyboard interaction',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Start date' });
    await step('An impossible date is rejected with an explanation', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, '2026-02-31');
      await userEvent.tab();
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(canvas.getByText('Enter a valid date in YYYY-MM-DD format.')).toBeVisible();
    });
    await step('The calendar opens on the last valid date; arrows move by day', async () => {
      await expect(canvas.getByRole('button', { name: 'Open Start date calendar' })).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await screen.findByRole('dialog', { name: 'Choose Start date' });
      await waitFor(() => expect(document.activeElement).toHaveAccessibleName(/October 23, 2026/));
      await userEvent.keyboard('{ArrowRight}');
      await expect(document.activeElement).toHaveAccessibleName(/October 24, 2026/);
    });
    await step('Enter picks the date, closes the calendar and fixes the field', async () => {
      await userEvent.keyboard('{Enter}');
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
      await expect(input).toHaveValue('2026-10-24');
      await expect(input).not.toHaveAttribute('aria-invalid', 'true');
    });
    await step('Reopen for the visual snapshot', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Open Start date calendar' }));
      await screen.findByRole('dialog', { name: 'Choose Start date' });
    });
  },
};
