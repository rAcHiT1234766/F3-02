import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from './Pagination';
import { useState } from 'react';
function Example() {
  const [page, setPage] = useState(1);
  return <Pagination totalItems={123} pageSize={10} page={page} onPageChange={setPage} />;
}
const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Controlled one-based pagination. Supply totalItems, pageSize, page and onPageChange. Values clamp for display, zero results show page one, and boundary controls are disabled. Large ranges use ellipses.',
      },
    },
  },
  render: () => <Example />,
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
