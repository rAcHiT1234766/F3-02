import { useId, useMemo, useState, type ReactNode } from 'react';
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
  /**
   * Column definitions, in display order. Pass the same array between renders (define it outside
   * the component or with `useMemo`) so the grid can reuse its search index.
   */
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
  /**
   * Ids of the selected rows when you control the selection; pair with `onSelectionChange`. Ids
   * that are not in `data` are ignored.
   */
  selectedIds?: readonly string[];
  /** Ids of the rows selected when the grid first renders, when the selection is uncontrolled. */
  defaultSelectedIds?: readonly string[];
  /**
   * Called whenever the user changes the selection, with the ids of every selected row in `data`
   * order, including rows on other pages or hidden by the search.
   */
  onSelectionChange?: (ids: string[]) => void;
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
  selectedIds,
  defaultSelectedIds,
  onSelectionChange,
  loading,
  error,
  onRetry,
}: DataGridProps<T>) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ id: string; descending: boolean } | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [ownSelection, setOwnSelection] = useState<readonly string[]>(defaultSelectedIds ?? []);

  // Everything that walks all rows is memoised on its inputs, so typing, paging and ticking a
  // checkbox only repeat the work they change.
  const rowIds = useMemo(() => {
    const ids = data.map(getRowId);
    if (new Set(ids).size !== ids.length) throw new Error('DataGrid requires unique row IDs.');
    return ids;
  }, [data, getRowId]);
  const available = useMemo(() => new Set(rowIds), [rowIds]);
  // toLowerCase() equals toLocaleLowerCase('en') (English has no special casing rules) and skips
  // a locale lookup per call, which matters across 10,000 rows.
  const term = query.trim().toLowerCase();
  const searching = term !== '';
  // One lower-cased string per row, built on the first keystroke rather than at mount and reused
  // while the user keeps typing. The separator cannot be typed, so a term never spans columns.
  const searchIndex = useMemo(() => {
    if (!searching) return undefined;
    const searchable = columns.filter((column) => column.searchable !== false);
    return data.map((row) =>
      searchable
        .map((column) => String(column.value(row) ?? ''))
        .join('\u0000')
        .toLowerCase(),
    );
  }, [data, columns, searching]);
  const filtered = useMemo(
    () => (searchIndex ? data.filter((_, index) => searchIndex[index]!.includes(term)) : data),
    [data, searchIndex, term],
  );
  const sortColumn = sort ? columns.find((column) => column.id === sort.id) : undefined;
  const sortDescending = sort?.descending ?? false;
  const rows = useMemo(() => {
    if (!sortColumn) return filtered;
    // Read each value once instead of twice per comparison; the copy leaves `data` untouched.
    return filtered
      .map((row) => ({ row, value: sortColumn.value(row) }))
      .sort((a, b) => compareGridValues(a.value, b.value, sortDescending))
      .map((entry) => entry.row);
  }, [filtered, sortColumn, sortDescending]);

  const currentPage = Math.min(page, Math.max(1, Math.ceil(rows.length / pageSize)));
  if (page !== currentPage) setPage(currentPage);
  const visible = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const controlled = selectedIds !== undefined;
  const storedSelection = selectedIds ?? ownSelection;
  const selected = useMemo(
    () => new Set(storedSelection.filter((key) => available.has(key))),
    [storedSelection, available],
  );
  // Uncontrolled: forget rows that have left `data`, so they are not selected if they come back.
  if (!controlled && selected.size !== ownSelection.length) setOwnSelection([...selected]);
  const changeSelection = (update: (next: Set<string>) => void) => {
    const next = new Set(selected);
    update(next);
    const ids = rowIds.filter((key) => next.has(key));
    if (!controlled) setOwnSelection(ids);
    onSelectionChange?.(ids);
  };
  const visibleSelected = visible.filter((row) => selected.has(getRowId(row))).length;
  const toggle = (key: string, checked: boolean) =>
    changeSelection((next) => {
      if (checked) next.add(key);
      else next.delete(key);
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
      <p role="status">{`${rows.length} ${rows.length === 1 ? 'result' : 'results'}${
        multiple ? ` · ${selected.size} selected` : ''
      }`}</p>
      {multiple && selected.size > 0 && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => changeSelection((next) => next.clear())}
        >
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
                    changeSelection((next) =>
                      visible.forEach((row) => {
                        if (checked) next.add(getRowId(row));
                        else next.delete(getRowId(row));
                      }),
                    );
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
        totalItems={rows.length}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={setPage}
        label={`${caption} pages`}
      />
    </div>
  );
}
