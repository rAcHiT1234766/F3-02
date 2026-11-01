import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';

const meta = {
  title: 'Layout/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Content to constrain to the maximum width.' },
    style: { description: 'Inline styles, merged with the container’s own.' },
  },
  args: {
    children: 'Centered content with responsive gutters.',
    size: 'sm',
    style: { border: '1px solid var(--fui-color-border)' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Centered div with 1rem inline gutters and width:100%. Max width sm=40rem, md=64rem, lg=80rem (default). Border-box sizing prevents gutters from widening the page. Native attributes/ref, className and style pass through. Not a landmark by itself.',
      },
    },
  },
} satisfies Meta<typeof Container>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Dark: Story = { parameters: { theme: 'dark' } };
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 240 }}>
        <Story />
      </div>
    ),
  ],
};
export const Medium: Story = { args: { size: 'md' } };
export const Large: Story = { args: { size: 'lg' } };
