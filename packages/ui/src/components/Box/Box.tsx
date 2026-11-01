import { forwardRef, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';
import { spaceValue, type Space } from '../../internal/space';

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  /** Inner spacing, as a step on the spacing token scale (0–8). */
  padding?: Space;
}
export const Box = forwardRef<HTMLDivElement, BoxProps>(function Box(
  { padding = 0, className, style, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={classes('fui-box', className)}
      style={{ padding: spaceValue(padding), ...style }}
    />
  );
});
