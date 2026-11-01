import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { DataGrid } from './DataGrid';

const meta: Meta<typeof DataGrid<{ id: string; name: string; count: number }>> = {
  title: 'Data/DataGrid',
  component: DataGrid<{ id: string; name: string; count: number }>,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Native interactive table, not spreadsheet semantics. Internal search, sort and page state; selection is internal by default, or controlled with `selectedIds` and `onSelectionChange` so the app can act on the selected rows. Filters then sorts then pages; sorting cycles ascending/descending/original and puts null last. English numeric collation. Stable unique IDs required. Selection survives filtering and paging, select-all affects the visible page, removed IDs are pruned. Supports loading, error/retry and empty states.',
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
export const BulkAction: Story = {
  name: 'Bulk action on selected rows',
  parameters: {
    docs: {
      description: {
        story:
          'The app keeps the selection in its own state through `selectedIds` and `onSelectionChange`, so a toolbar button can act on every selected row, including rows on other pages.',
      },
    },
  },
  render: function BulkActionGrid(args) {
    const [rows, setRows] = useState(args.data);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    return (
      <Stack gap={3}>
        <Stack direction="row" gap={2} align="center">
          <Button
            variant="danger"
            size="sm"
            disabled={!selectedIds.length}
            onClick={() => {
              setRows(rows.filter((row) => !selectedIds.includes(row.id)));
              setSelectedIds([]);
            }}
          >
            Remove selected employees ({selectedIds.length})
          </Button>
        </Stack>
        <DataGrid
          {...args}
          data={rows}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </Stack>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const remove = () => canvas.getByRole('button', { name: /Remove selected employees/ });
    await step('The action is unavailable until rows are selected', async () => {
      await expect(remove()).toBeDisabled();
    });
    await step('Selecting rows on two pages enables the action', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Employee 01' }));
      await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Select Employee 12' }));
      await expect(remove()).toHaveTextContent('Remove selected employees (2)');
    });
    await step('The action removes both rows and clears the selection', async () => {
      await userEvent.click(remove());
      await expect(canvas.getByText(/^\d+ results?/)).toHaveTextContent('30 results · 0 selected');
      await expect(remove()).toBeDisabled();
    });
  },
};
