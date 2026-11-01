import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, within } from 'storybook/test';
import { Combobox } from './Combobox';

const meta: Meta<typeof Combobox> = {
  title: 'Forms/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Editable local single-select with stable IDs. Typing filters; arrows explore enabled options; Enter commits; Escape/Tab/blur restore the committed label. Text editing keys are preserved and IME Enter is ignored. Clear resets both query and selection. Provide options with unique IDs; duplicate labels are allowed. Ref targets the input.',
      },
    },
  },
  args: {
    label: 'Manager',
    options: [
      { id: 'alex', label: 'Alex Morgan' },
      { id: 'sam', label: 'Sam Rivera' },
      { id: 'lee', label: 'Lee Chen', disabled: true },
    ],
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
export const KeyboardInteraction: Story = {
  name: 'Keyboard interaction',
  play: async ({ canvasElement, step }) => {
    const input = within(canvasElement).getByRole('combobox', { name: 'Manager' });
    await step('Typing filters the options', async () => {
      await userEvent.click(input);
      await userEvent.type(input, 'Sa');
      const list = await screen.findByRole('listbox', { name: 'Manager options' });
      await expect(within(list).getAllByRole('option')).toHaveLength(1);
      await expect(within(list).getByRole('option')).toHaveTextContent('Sam Rivera');
    });
    await step('Arrow keys and Enter choose an option and close the list', async () => {
      await userEvent.keyboard('{ArrowDown}{Enter}');
      await expect(input).toHaveValue('Sam Rivera');
      await expect(input).toHaveAttribute('aria-expanded', 'false');
    });
    await step('Disabled options are listed but marked unavailable', async () => {
      await userEvent.clear(input);
      await userEvent.type(input, 'e');
      const list = await screen.findByRole('listbox', { name: 'Manager options' });
      await expect(within(list).getByRole('option', { name: 'Lee Chen' })).toHaveAttribute(
        'aria-disabled',
        'true',
      );
    });
  },
};
