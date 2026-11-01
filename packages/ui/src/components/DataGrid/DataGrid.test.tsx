import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DataGrid, compareGridValues, type GridColumn } from './DataGrid';
type Row = { id: string; name: string; count: number | null };
const data: Row[] = Array.from({ length: 31 }, (_, i) => ({
  id: `row-${i}`,
  name: i < 2 ? 'Same name' : `Person ${i}`,
  count: i === 30 ? null : 30 - i,
}));
const columns: GridColumn<Row>[] = [
  { id: 'name', header: 'Name', value: (row) => row.name, sortable: true },
  { id: 'count', header: 'Projects', value: (row) => row.count, sortable: true },
];
const props = {
  data,
  columns,
  getRowId: (row: Row) => row.id,
  getRowLabel: (row: Row) => `${row.name} (${row.id})`,
  caption: 'People',
};

test('the announced result count uses the singular for one match', async () => {
  render(<DataGrid {...props} />);
  await userEvent.type(screen.getByRole('searchbox'), 'Person 15');
  expect(screen.getByRole('status')).toHaveTextContent(/^1 result · 0 selected$/);
});

test('selection uses IDs across pages and filters, and removed IDs are pruned', async () => {
  const { rerender } = render(<DataGrid {...props} />);
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select Same name (row-0)' }));
  expect(screen.getByRole('checkbox', { name: 'Select Same name (row-1)' })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Select visible page' })).toBePartiallyChecked();
  await userEvent.click(screen.getByRole('button', { name: 'Next' }));
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select visible page' }));
  expect(screen.getByRole('status')).toHaveTextContent('11 selected');
  await userEvent.type(screen.getByRole('searchbox'), 'Same');
  expect(screen.getByRole('status')).toHaveTextContent('2 results · 11 selected');
  expect(screen.getByRole('checkbox', { name: 'Select Same name (row-0)' })).toBeChecked();
  rerender(<DataGrid {...props} data={data.slice(1)} />);
  expect(screen.getByRole('status')).toHaveTextContent('10 selected');
  await userEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(screen.getByRole('status')).toHaveTextContent('0 selected');
});

test('numeric sorting cycles, keeps null last, never mutates input and resets pagination', async () => {
  render(<DataGrid {...props} />);
  const header = screen.getByRole('columnheader', { name: 'Projects' });
  await userEvent.click(screen.getByRole('button', { name: 'Projects' }));
  expect(header).toHaveAttribute('aria-sort', 'ascending');
  expect(screen.getAllByRole('row')[1]).toHaveTextContent('Person 29');
  await userEvent.click(screen.getByRole('button', { name: /Projects/ }));
  expect(header).toHaveAttribute('aria-sort', 'descending');
  expect(screen.getAllByRole('row')[1]).toHaveTextContent('Same name');
  await userEvent.click(screen.getByRole('button', { name: /Projects/ }));
  expect(header).toHaveAttribute('aria-sort', 'none');
  expect(data[0]?.id).toBe('row-0');
  await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
  await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Rows per page' }), '25');
  expect(screen.getByRole('button', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page');
});

test('shrinking data clamps pages, no results and error/retry have usable presentation', async () => {
  const retry = jest.fn();
  const { rerender } = render(<DataGrid {...props} />);
  await userEvent.click(screen.getByRole('button', { name: 'Page 4' }));
  rerender(<DataGrid {...props} data={data.slice(0, 1)} />);
  expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  await userEvent.type(screen.getByRole('searchbox'), 'missing');
  expect(screen.getByText('No matching records.')).toBeInTheDocument();
  rerender(<DataGrid {...props} data={[]} />);
  expect(screen.getByText('No records yet.')).toBeInTheDocument();
  rerender(<DataGrid {...props} loading />);
  expect(screen.getByRole('table')).toHaveAttribute('aria-busy', 'true');
  rerender(<DataGrid {...props} error="Unavailable" onRetry={retry} />);
  await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
  expect(retry).toHaveBeenCalledTimes(1);
});

test('multiple instances keep their search and row labels separate', async () => {
  render(
    <>
      <DataGrid {...props} caption="A" selectionMode="none" />
      <DataGrid {...props} caption="B" />
    </>,
  );
  const tables = screen.getAllByRole('table');
  expect(tables).toHaveLength(2);
  expect(within(tables[0]!).queryByRole('checkbox')).not.toBeInTheDocument();
  const inputs = screen.getAllByRole('searchbox');
  expect(inputs[0]?.id).not.toBe(inputs[1]?.id);
});

test('controlled selection reports ids in data order and only changes through selectedIds', async () => {
  const onSelectionChange = jest.fn();
  const { rerender } = render(
    <DataGrid {...props} selectedIds={['row-3', 'gone']} onSelectionChange={onSelectionChange} />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('31 results · 1 selected');
  expect(screen.getByRole('checkbox', { name: 'Select Person 3 (row-3)' })).toBeChecked();
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select Same name (row-0)' }));
  // Unknown ids are dropped from the report, and the grid waits for the parent to accept it.
  expect(onSelectionChange).toHaveBeenLastCalledWith(['row-0', 'row-3']);
  expect(screen.getByRole('checkbox', { name: 'Select Same name (row-0)' })).not.toBeChecked();
  rerender(
    <DataGrid {...props} selectedIds={['row-3', 'row-0']} onSelectionChange={onSelectionChange} />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('2 selected');
  await userEvent.click(screen.getByRole('button', { name: 'Clear selection' }));
  expect(onSelectionChange).toHaveBeenLastCalledWith([]);
});

test('uncontrolled selection starts from defaultSelectedIds and reports page selection', async () => {
  const onSelectionChange = jest.fn();
  const { rerender } = render(
    <DataGrid
      {...props}
      defaultSelectedIds={['row-20', 'missing']}
      onSelectionChange={onSelectionChange}
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('1 selected');
  await userEvent.click(screen.getByRole('checkbox', { name: 'Select visible page' }));
  expect(onSelectionChange).toHaveBeenLastCalledWith([
    ...Array.from({ length: 10 }, (_, i) => `row-${i}`),
    'row-20',
  ]);
  expect(screen.getByRole('status')).toHaveTextContent('11 selected');
  // A row that leaves the data is forgotten, so it is not selected again when it returns.
  rerender(<DataGrid {...props} data={data.slice(1)} />);
  expect(screen.getByRole('status')).toHaveTextContent('10 selected');
  rerender(<DataGrid {...props} />);
  expect(screen.getByRole('checkbox', { name: 'Select Same name (row-0)' })).not.toBeChecked();
});

test('selecting, paging and searching do not re-read every row', async () => {
  const value = jest.fn((row: Row) => row.name);
  const rowsRead = () => new Set(value.mock.calls.map(([row]) => row.id)).size;
  const { unmount } = render(
    <DataGrid {...props} columns={[{ id: 'name', header: 'Name', value, sortable: true }]} />,
  );
  await userEvent.click(screen.getByRole('button', { name: 'Name' }));
  value.mockClear();
  await userEvent.click(screen.getAllByRole('checkbox')[1]!);
  await userEvent.click(screen.getByRole('button', { name: 'Next' }));
  // Only the cells shown on pages 1 and 2 are read; the sorted order is reused.
  expect(rowsRead()).toBe(20);
  unmount();
  value.mockClear();
  render(<DataGrid {...props} columns={[{ id: 'name', header: 'Name', value }]} />);
  // Mounting does not build the search index: only the 10 displayed rows are read.
  expect(rowsRead()).toBe(10);
  await userEvent.type(screen.getByRole('searchbox'), 'P');
  value.mockClear();
  await userEvent.type(screen.getByRole('searchbox'), 'erson 2');
  expect(screen.getByRole('status')).toHaveTextContent('11 results');
  // The index built on the first keystroke is reused; later keystrokes read only displayed rows.
  expect(rowsRead()).toBeLessThan(data.length);
});

test('typed comparison is stable and null stays last in both directions', () => {
  expect(compareGridValues(2, 10, false)).toBeLessThan(0);
  expect(compareGridValues('Name 2', 'Name 10', false)).toBeLessThan(0);
  expect(compareGridValues(null, 2, true)).toBe(1);
  expect(compareGridValues(2, null, false)).toBe(-1);
  expect(compareGridValues(null, null, false)).toBe(0);
  expect(compareGridValues(2, 2, true)).toBe(-0);
});
