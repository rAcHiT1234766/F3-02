# Public API and data contracts

## Button

Native `ButtonHTMLAttributes<HTMLButtonElement>` with a forwarded DOM ref.

| Prop       | Default        | Contract                                                         |
| ---------- | -------------- | ---------------------------------------------------------------- |
| `variant`  | `primary`      | `primary`, `secondary`, `danger`                                 |
| `size`     | `md`           | `sm`, `md`, `lg`                                                 |
| `loading`  | `false`        | Native disabled plus busy state; children retain accessible name |
| `type`     | `button`       | Explicit `submit` is needed for form submission                  |
| `disabled` | native default | Disables focus and activation                                    |
| `onClick`  | none           | Native React mouse event                                         |

Enter and Space activate enabled buttons. Text must identify the action.
Loading spinners are decorative and do not create duplicate live announcements.
The button does not own async work or automatically announce completion.

## Input

Native `InputHTMLAttributes<HTMLInputElement>` with a forwarded DOM ref.
`controlSize` defaults to `md` and accepts `sm`, `md`, `lg`. Native `size` still
controls the input's character-width hint; library CSS supplies full container width.
`type` defaults to text. Controlled `value/onChange` and uncontrolled `defaultValue`
follow React's native contracts. Do not switch between controlled/uncontrolled modes.

Provide a visible label using `htmlFor`/`id` or wrapping. Supply existing help/error
IDs in `aria-describedby` and set `aria-invalid` after validation. The component
preserves these attributes exactly. Placeholder is not a label.

## DataGrid

Generic `DataGrid<T>`: a native table with search, sort, paging and row selection. Full prop
descriptions are in Storybook (Data/DataGrid).

| Prop                 | Default    | Contract                                                                  |
| -------------------- | ---------- | ------------------------------------------------------------------------- |
| `data`               | required   | Rows to show; the grid never mutates it                                   |
| `columns`            | required   | `id`, `header`, `value(row)`; optional `render`, `sortable`, `searchable` |
| `getRowId`           | required   | Unique, stable string per row; duplicates throw                           |
| `caption`            | required   | Names the table, its scroll region and its pagination                     |
| `selectionMode`      | `multiple` | `multiple` adds row and select-page checkboxes; `none` removes them       |
| `selectedIds`        | none       | Controlled selection (since 0.2.0); ids not in `data` are ignored         |
| `defaultSelectedIds` | `[]`       | Initial selection when uncontrolled (since 0.2.0)                         |
| `onSelectionChange`  | none       | Receives every selected id in `data` order after each user change (0.2.0) |
| `loading`, `error`   | none       | Replace the rows with a loading or error message; `onRetry` adds Retry    |

Search matches any searchable column (case-insensitive), then sorting applies, then paging.
Sorting cycles ascending, descending, unsorted and keeps empty values last. Selection survives
search and paging; the select-page checkbox affects only the visible page.

Row ids, the search index and the sorted order are memoised on `data`, `columns` and
`getRowId`. Pass the same `columns` array between renders (module level or `useMemo`) so typing
and paging reuse them.

```tsx
const [selected, setSelected] = useState<string[]>([]);
<Button disabled={!selected.length} onClick={() => archive(selected)}>
  Archive selected ({selected.length})
</Button>;
<DataGrid
  data={employees}
  columns={columns}
  getRowId={(row) => row.id}
  caption="Employees"
  selectedIds={selected}
  onSelectionChange={setSelected}
/>;
```

## Current demo data

`name: string`, `email: string`, field error strings, and one feedback string.
Validation runs on submit, focuses the first invalid field, and retains user input.
Email validation is illustrative; no backend verifies or stores an address.

## Planned employee contract

```ts
type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'on-leave' | 'archived';
  startDate: string; // valid YYYY-MM-DD
};
```

All 44 inventory components are exported from `@rachitp72/foundation-ui`; their prop
types ship in `dist/**/*.d.ts` and each has Storybook examples. The employee
dashboard in `apps/demo` uses the `Employee` shape above with fictional data.
Contracts remain provisional until Figma reconciliation and manual review.
