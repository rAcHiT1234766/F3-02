import { Button } from '../Button/Button';
export interface PaginationProps {
  /** Total number of items across all pages. */
  totalItems: number;
  /** Number of items per page. */
  pageSize: number;
  /** Current page, starting at 1. Values out of range are clamped. */
  page: number;
  /** Called with the page the user chose. */
  onPageChange: (page: number) => void;
  /** Accessible name of the navigation landmark. Make it unique if a page has several. */
  label?: string;
}
export function Pagination({
  totalItems,
  pageSize,
  page,
  onPageChange,
  label = 'Pagination',
}: PaginationProps) {
  const count = Math.max(1, Math.ceil(Math.max(0, totalItems) / Math.max(1, pageSize)));
  const current = Math.min(count, Math.max(1, page));
  const pages = Array.from(
    new Set([
      1,
      ...Array.from({ length: 5 }, (_, i) => current + i - 2).filter((n) => n > 1 && n < count),
      count,
    ]),
  );
  return (
    <nav className="fui-pagination" aria-label={label}>
      <Button
        variant="secondary"
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
      >
        Previous
      </Button>
      {pages.map((number, index) => (
        <span key={number}>
          {index > 0 && number - pages[index - 1]! > 1 && <span aria-hidden="true"> … </span>}
          <Button
            variant={current === number ? 'primary' : 'secondary'}
            aria-label={`Page ${number}`}
            aria-current={current === number ? 'page' : undefined}
            onClick={() => {
              if (number !== current) onPageChange(number);
            }}
          >
            {number}
          </Button>
        </span>
      ))}
      <Button
        variant="secondary"
        disabled={current === count}
        onClick={() => onPageChange(current + 1)}
      >
        Next
      </Button>
    </nav>
  );
}
