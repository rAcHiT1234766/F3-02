import { forwardRef, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export interface SeparatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'tabIndex'> {
  /** Direction of the line. */
  orientation?: 'horizontal' | 'vertical';
  /** Hides the line from assistive technology when it is purely visual. */
  decorative?: boolean;
}

export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', decorative = false, className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      role={decorative ? 'none' : 'separator'}
      aria-hidden={decorative || undefined}
      aria-orientation={decorative ? undefined : orientation}
      className={classes('fui-separator', `fui-separator-${orientation}`, className)}
    />
  );
});
