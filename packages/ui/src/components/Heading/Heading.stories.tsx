import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  argTypes: {
    children: { description: 'Heading text.' },
  },
  args: { children: 'Employee directory', level: 2 },
  parameters: {
    docs: {
      description: {
        component:
          'Semantic heading levels 1–6; level defaults to 2, visual size to md. A small h1 remains an h1. Choose a level based on document hierarchy, never appearance. Ref targets HTMLHeadingElement; native attributes pass through.',
      },
    },
  },
} satisfies Meta<typeof Heading>;
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
export const Levels: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading key={level} level={level} size="sm">
          Level {level}, small appearance
        </Heading>
      ))}
    </div>
  ),
};
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Heading key={size} size={size}>
          Heading size {size}
        </Heading>
      ))}
    </div>
  ),
};
