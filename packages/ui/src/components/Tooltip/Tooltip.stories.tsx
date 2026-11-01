import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, within } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { IconButton } from '../IconButton/IconButton';
const meta: Meta<typeof Tooltip> = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Radix tooltip for short supplemental text. Hover or keyboard focus opens; Escape closes. Provide a focusable trigger with its own accessible name. Interactive content belongs in Popover.',
      },
    },
  },
  args: {
    content: 'Download employee records',
    children: <IconButton label="Download">↓</IconButton>,
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
    await step('Keyboard focus shows the tooltip, not only hover', async () => {
      await userEvent.tab();
      await expect(within(canvasElement).getByRole('button', { name: 'Download' })).toHaveFocus();
      await expect(await screen.findByRole('tooltip')).toHaveTextContent(
        'Download employee records',
      );
    });
  },
};
