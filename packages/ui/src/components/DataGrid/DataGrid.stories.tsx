import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DataGrid } from './DataGrid';

const meta: Meta<typeof DataGrid<{ id: string; name: string; count: number }>> = {
  title: 'Data/DataGrid',
  component: DataGrid<{ id: string; name: string; count: number }>,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Native interactive table, not spreadsheet semantics. Internal search, sort, page and selection state. Filters then sorts then pages; sorting cycles ascending/descending/original and puts null last. English numeric collation. Stable unique IDs required. Selection survives filtering and paging, select-all affects the visible page, removed IDs are pruned. Supports loading, error/retry and empty states.',
      },
    },
  },
  args: {
    caption: 'Employees',
    data: Array.from({ length: 32 }, (_, i) => ({
      id: `e${i}`,
      name: `Employee ${String(i + 1).padStart(2, '0')}`,
      count: i + 1,
    })),
    columns: [
      { id: 'name', header: 'Name', value: (row) => row.name, sortable: true },
      { id: 'count', header: 'Projects', value: (row) => row.count, sortable: true },
    ],
    getRowId: (row) => row.id,
    getRowLabel: (row) => row.name,
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
export const Empty: Story = { args: { data: [] } };
export const Loading: Story = { args: { loading: true } };
export const Error: Story = {
  args: { error: 'Preview error. Please try again.', onRetry: () => undefined },
};
export const SearchSelectSort: Story = {
  name: 'Search, select and sort',
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const status = () => canvas.getByText(/^\d+ results?/);
    await step('Search filters rows and the count is announced', async () => {
      await userEvent.type(canvas.getByRole('searchbox', { name: 'Search records' }), 'Employee 1');
      await expect(status()).toHaveTextContent('10 results · 0 selected');
    });
    await step('Selecting a row updates the announced count', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Employee 10' }));
      await expect(status()).toHaveTextContent('10 results · 1 selected');
    });
    await step('Sorting is exposed on the column header', async () => {
      await userEvent.click(canvas.getByRole('button', { name: /Projects/ }));
      await expect(canvas.getByRole('columnheader', { name: /Projects/ })).toHaveAttribute(
        'aria-sort',
        'ascending',
      );
    });
  },
};
