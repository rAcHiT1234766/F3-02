import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';
import { spaceValue, type Space } from '../../internal/space';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of equal columns from 768px wide; narrower screens show one column. */
  columns?: 1 | 2 | 3 | 4;
  /** Space between items, as a step on the spacing token scale (0–8). */
  gap?: Space;
}
export const Grid = forwardRef<HTMLDivElement, GridProps>(function Grid(
  { columns = 2, gap = 4, className, style, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={classes('fui-grid', className)}
      style={{ '--fui-grid-columns': columns, gap: spaceValue(gap), ...style } as CSSProperties}
    />
  );
});
