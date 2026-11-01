// DataGrid performance harness: renders the production library build with N rows and
// times common interactions. Each timing covers React's update plus a forced layout.
import { flushSync } from 'react-dom';
import { createRoot, type Root } from 'react-dom/client';
import { DataGrid, type GridColumn } from '@rachitp72/foundation-ui';
import '@rachitp72/foundation-ui/styles.css';

type Row = { id: string; name: string; department: string; projects: number };
const departments = ['Engineering', 'Design', 'Finance', 'People', 'Operations'];
const makeRows = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `row-${index}`,
    name: `Employee ${index + 1}`,
    department: departments[index % departments.length]!,
    projects: (index * 7) % 50,
  }));
const columns: GridColumn<Row>[] = [
  { id: 'name', header: 'Name', value: (row) => row.name, sortable: true },
  { id: 'department', header: 'Department', value: (row) => row.department, sortable: true },
  { id: 'projects', header: 'Projects', value: (row) => row.projects, sortable: true },
];

const container = document.getElementById('root')!;
const settle = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)));
const timed = (action: () => void) => {
  const start = performance.now();
  flushSync(action);
  void container.offsetHeight; // include layout
  return performance.now() - start;
};
const button = (name: string) =>
  [...container.querySelectorAll('button')].find((element) =>
    element.textContent?.trim().startsWith(name),
  )!;
const setSearch = (value: string) => {
  const input = container.querySelector<HTMLInputElement>('input[type="search"]')!;
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};
const summary = (samples: number[]) => {
  const sorted = [...samples].sort((a, b) => a - b);
  return {
    median: +sorted[Math.floor(sorted.length / 2)]!.toFixed(2),
    max: +sorted.at(-1)!.toFixed(2),
  };
};

/** Fails loudly if an action did not have its intended effect, so timings are trustworthy. */
const check = (condition: boolean, message: string) => {
  if (!condition) throw new Error(`Harness check failed: ${message}`);
};
const status = () => container.querySelector('[role="status"]')?.textContent ?? '';
const sortState = (header: string) =>
  [...container.querySelectorAll('th')]
    .find((cell) => cell.textContent?.includes(header))
    ?.getAttribute('aria-sort');
// "employee 1" matches Employee 1, 10–19, 100–199, … up to the row count.
const searchMatches = (count: number) =>
  Array.from({ length: count }, (_, index) => `employee ${index + 1}`).filter((name) =>
    name.includes('employee 1'),
  ).length;

async function measure(count: number, repeats: number) {
  const data = makeRows(count);
  const samples: Record<string, number[]> = {
    mount: [],
    search: [],
    clearSearch: [],
    sortNumber: [],
    sortText: [],
    nextPage: [],
    selectRow: [],
  };
  for (let run = 0; run < repeats; run++) {
    let root: Root | undefined;
    samples.mount!.push(
      timed(() => {
        root = createRoot(container);
        root.render(
          <DataGrid
            caption="Employees"
            data={data}
            columns={columns}
            getRowId={(row) => row.id}
            getRowLabel={(row) => row.name}
          />,
        );
      }),
    );
    await settle();
    check(status().startsWith(`${count} results`), `mount shows ${count} results`);
    samples.search!.push(timed(() => setSearch('employee 1')));
    check(status().startsWith(`${searchMatches(count)} results`), 'search filters rows');
    await settle();
    samples.clearSearch!.push(timed(() => setSearch('')));
    check(status().startsWith(`${count} results`), 'clearing search restores rows');
    await settle();
    samples.sortNumber!.push(timed(() => button('Projects').click()));
    check(sortState('Projects') === 'ascending', 'number column sorted');
    await settle();
    samples.sortText!.push(timed(() => button('Name').click()));
    check(sortState('Name') === 'ascending', 'text column sorted');
    await settle();
    samples.nextPage!.push(timed(() => button('Next').click()));
    check(container.querySelector('[aria-current="page"]')?.textContent === '2', 'moved to page 2');
    await settle();
    samples.selectRow!.push(
      timed(() =>
        container.querySelector<HTMLInputElement>('tbody input[type="checkbox"]')!.click(),
      ),
    );
    check(status().endsWith('1 selected'), 'row selected');
    await settle();
    flushSync(() => root!.unmount());
    await settle();
  }
  return Object.fromEntries(
    Object.entries(samples).map(([name, values]) => [name, summary(values)]),
  );
}

declare global {
  interface Window {
    runPerf: (
      sizes: number[],
      repeats: number,
    ) => Promise<Record<number, Record<string, { median: number; max: number }>>>;
  }
}
window.runPerf = async (sizes, repeats) => {
  const results: Record<number, Record<string, { median: number; max: number }>> = {};
  await measure(100, 2); // warm up the JIT and styles
  for (const size of sizes) results[size] = await measure(size, repeats);
  return results;
};
