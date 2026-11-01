import { forwardRef, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';
import { spaceValue, type Space } from '../../internal/space';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Lays the children out in a column or a row. */
  direction?: 'row' | 'column';
  /** Space between children, as a step on the spacing token scale (0–8). */
  gap?: Space;
  /** Alignment of the children across the stack direction. */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Distribution of the children along the stack direction. */
  justify?: 'start' | 'center' | 'end' | 'between';
  /** Lets children wrap onto a new line when space runs out. */
  wrap?: boolean;
}
export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  {
    direction = 'column',
    gap = 4,
    align = 'stretch',
    justify = 'start',
    wrap = true,
    className,
    style,
    ...props
  },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={classes('fui-stack', className)}
      style={{
        flexDirection: direction,
        gap: spaceValue(gap),
        alignItems: align === 'start' || align === 'end' ? `flex-${align}` : align,
        justifyContent: {
          start: 'flex-start',
          end: 'flex-end',
          center: 'center',
          between: 'space-between',
        }[justify],
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    />
  );
});
