import { useId, useState, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { SearchInput } from '../SearchInput/SearchInput';
import { Select } from '../Select/Select';
import { Pagination } from '../Pagination/Pagination';
import { Table } from '../Table/Table';
import { Alert } from '../Alert/Alert';

export interface GridColumn<T> {
  /** Unique key of the column. */
  id: string;
  /** Text of the column heading. */
  header: string;
  /**
   * Returns the cell value used for sorting, searching and, without `render`, display. Return null
   * for an empty cell, shown as “—”.
   */
  value: (row: T) => string | number | null;
  /** Custom cell content. Sorting and search still use `value`. */
  render?: (row: T) => ReactNode;
  /** Turns the heading into a button that sorts ascending, then descending, then unsorted. */
  sortable?: boolean;
  /** Set to false to leave this column out of search. */
  searchable?: boolean;
}
export interface DataGridProps<T> {
  /** Rows to display. When it changes, selection is kept for rows that are still present. */
  data: readonly T[];
  /** Column definitions, in display order. */
  columns: GridColumn<T>[];
  /** Returns a unique, stable id for a row. Duplicate ids throw an error. */
  getRowId: (row: T) => string;
  /**
   * Returns a readable name for a row, used in its checkbox label “Select …”. Defaults to the row
   * id.
   */
  getRowLabel?: (row: T) => string;
  /** Table caption. Also names the scroll region and the pagination. */
  caption: string;
  /** Visible label of the search field. */
  searchLabel?: string;
  /** Rows per page when the grid first renders. */
  defaultPageSize?: 10 | 25 | 50;
  /** `multiple` adds row checkboxes and a select-page checkbox; `none` removes selection. */
  selectionMode?: 'none' | 'multiple';
  /** Replaces the rows with a loading message and marks the table busy. */
  loading?: boolean;
  /** Message shown in a danger alert. The rows are replaced with “Records unavailable.” */
  error?: string;
  /** Adds a Retry button to the error alert. */
  onRetry?: () => void;
}
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });
export function compareGridValues(
  a: string | number | null,
  b: string | number | null,
  descending: boolean,
) {
  if (a === null) return b === null ? 0 : 1;
  if (b === null) return -1;
  const result =
    typeof a === 'number' && typeof b === 'number' ? a - b : collator.compare(String(a), String(b));
  return descending ? -result : result;
}
export function DataGrid<T>({
  data,
  columns,
  getRowId,
  getRowLabel = getRowId,
  caption,
  searchLabel = 'Search records',
  defaultPageSize = 10,
  selectionMode = 'multiple',
  loading,
  error,
  onRetry,
}: DataGridProps<T>) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ id: string; descending: boolean } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previousIds, setPreviousIds] = useState('');
  const ids = data.map(getRowId);
  const signature = JSON.stringify(ids);
  if (signature !== previousIds) {
    setPreviousIds(signature);
    const available = new Set(ids);
    setSelected(new Set([...selected].filter((key) => available.has(key))));
  }
  if (new Set(ids).size !== ids.length) throw new Error('DataGrid requires unique row IDs.');
  const term = query.trim().toLocaleLowerCase('en');
  const filtered = data.filter(
    (row) =>
      !term ||
      columns.some(
        (column) =>
          column.searchable !== false &&
          String(column.value(row) ?? '')
            .toLocaleLowerCase('en')
            .includes(term),
      ),
  );
  const column = columns.find((column) => column.id === sort?.id);
  if (column && sort)
    filtered.sort((a, b) => compareGridValues(column.value(a), column.value(b), sort.descending));
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / pageSize)));
  if (page !== currentPage) setPage(currentPage);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const visibleSelected = visible.filter((row) => selected.has(getRowId(row))).length;
  const toggle = (key: string, checked: boolean) =>
    setSelected((previous) => {
      const next = new Set(previous);
      if (checked) next.add(key);
      else next.delete(key);
      return next;
    });
  const multiple = selectionMode === 'multiple';
  return (
    <div className="fui-data-grid">
      <div className="fui-grid-toolbar">
        <div className="fui-field">
          <label htmlFor={`${id}-search`}>{searchLabel}</label>
          <SearchInput
            id={`${id}-search`}
            value={query}
            onValueChange={(value) => {
              setQuery(value);
              setPage(1);
            }}
          />
        </div>
        <div className="fui-field">
          <label htmlFor={`${id}-size`}>Rows per page</label>
          <Select
            id={`${id}-size`}
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            {[10, 25, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </Select>
        </div>
      </div>
      {/* One text node: screen readers announce it whole, and it renders exactly like before. */}
      <p role="status">{`${filtered.length} ${filtered.length === 1 ? 'result' : 'results'}${
        multiple ? ` · ${selected.size} selected` : ''
      }`}</p>
      {multiple && selected.size > 0 && (
        <Button variant="secondary" size="sm" onClick={() => setSelected(new Set())}>
          Clear selection
        </Button>
      )}
      {error && (
        <Alert tone="danger" announce="polite" title="Unable to load records">
          {error}
          {onRetry && (
            <Button variant="secondary" onClick={onRetry}>
              Retry
            </Button>
          )}
        </Alert>
      )}
      <Table
        caption={caption}
        scrollLabel={`${caption}: scrollable table`}
        aria-busy={loading || undefined}
      >
        <thead>
          <tr>
            {multiple && (
              <th scope="col" className="fui-grid-select">
                <Checkbox
                  label="Select visible page"
                  hideLabel
                  checked={visible.length > 0 && visibleSelected === visible.length}
                  indeterminate={visibleSelected > 0 && visibleSelected < visible.length}
                  disabled={!visible.length || loading || !!error}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setSelected((previous) => {
                      const next = new Set(previous);
                      visible.forEach((row) => {
                        if (checked) next.add(getRowId(row));
                        else next.delete(getRowId(row));
                      });
                      return next;
                    });
                  }}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                aria-sort={
                  column.sortable
                    ? sort?.id === column.id
                      ? sort.descending
                        ? 'descending'
                        : 'ascending'
                      : 'none'
                    : undefined
                }
              >
                {column.sortable ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSort(
                        sort?.id !== column.id
                          ? { id: column.id, descending: false }
                          : !sort.descending
                            ? { id: column.id, descending: true }
                            : null,
                      );
                      setPage(1);
                    }}
                  >
                    {column.header}
                    {sort?.id === column.id && (
                      <span aria-hidden="true">{sort.descending ? ' ↓' : ' ↑'}</span>
                    )}
                  </Button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading || error || visible.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (multiple ? 1 : 0)}>
                {loading
                  ? 'Loading records…'
                  : error
                    ? 'Records unavailable.'
                    : data.length
                      ? 'No matching records.'
                      : 'No records yet.'}
              </td>
            </tr>
          ) : (
            visible.map((row) => (
              <tr key={getRowId(row)}>
                {multiple && (
                  <td className="fui-grid-select">
                    <Checkbox
                      label={`Select ${getRowLabel(row)}`}
                      hideLabel
                      checked={selected.has(getRowId(row))}
                      onChange={(event) => toggle(getRowId(row), event.target.checked)}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.id}>
                    {column.render ? column.render(row) : (column.value(row) ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <Pagination
        totalItems={filtered.length}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={setPage}
        label={`${caption} pages`}
      />
    </div>
  );
}
