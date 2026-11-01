import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta = {
  title: 'Feedback/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { name: 'Alex Morgan' },
  parameters: {
    docs: {
      description: {
        component:
          'Circular image with initials fallback; name is required. Defaults to md and meaningful image semantics named by name. Set decorative beside the same visible name. src failures reveal initials; changing src retries the new image. Empty name falls back to Unknown person. fallback overrides initials. Ref targets the wrapper span.',
      },
    },
  },
} satisfies Meta<typeof Avatar>;
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
const portrait =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="#08695e"/><circle cx="48" cy="34" r="16" fill="#ffffff"/><path d="M16 96v-14a32 32 0 0 1 64 0v14" fill="#ffffff"/></svg>',
  );
export const Image: Story = { args: { src: portrait } };
export const BrokenImage: Story = { args: { src: 'data:image/png;base64,invalid' } };
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Avatar key={size} name="Alex Morgan" size={size} />
      ))}
    </div>
  ),
};
export const Decorative: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Avatar name="Alex Morgan" decorative />
      <span>Alex Morgan</span>
    </div>
  ),
};
export const Empty: Story = { args: { name: '' } };
