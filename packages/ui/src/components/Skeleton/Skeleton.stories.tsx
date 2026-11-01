import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: { width: '100%', height: '1rem' },
  parameters: {
    docs: {
      description: {
        component:
          'Decorative placeholder span, always aria-hidden. No children or interactive content. Defaults to full width, 1rem height, rounded corners. CSS dimensions and style pass through; reduced motion stops pulsing. Announce loading on the owning region, not on each placeholder. Ref targets span.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;
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
export const ProfileLoading: Story = {
  render: () => (
    // Skeletons are hidden from assistive technology; a status message says what is loading.
    <div aria-busy="true" style={{ display: 'grid', gap: 16 }}>
      <VisuallyHidden role="status">Loading employee profile</VisuallyHidden>
      <Skeleton shape="circle" width={64} height={64} />
      <Skeleton width="65%" />
      <Skeleton />
      <Skeleton width="85%" />
    </div>
  ),
};
export const Circle: Story = { args: { width: 64, height: 64, shape: 'circle' } };
