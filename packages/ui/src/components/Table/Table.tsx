import { forwardRef, type TableHTMLAttributes, type ReactNode } from 'react';
import { classes } from '../../internal/classes';
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Visible caption that names the table. */
  caption: ReactNode;
  /**
   * Accessible name of the scroll region around the table. Keyboard users can focus it to scroll
   * wide tables.
   */
  scrollLabel?: string;
}
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table(
  { caption, scrollLabel = 'Scrollable table', children, className, ...props },
  ref,
) {
  // A named scroll region must be focusable for keyboard users to scroll wide tables.
  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div className="fui-table-scroll" role="region" aria-label={scrollLabel} tabIndex={0}>
      <table {...props} ref={ref} className={classes('fui-table', className)}>
        <caption>{caption}</caption>
        {children}
      </table>
    </div>
  );
});
