import { forwardRef, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden';

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Omit when an adjacent label or busy region already announces loading. */
  label?: string;
  /** Diameter of the spinner. */
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { label, size = 'md', className, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      role={label ? 'status' : undefined}
      aria-hidden={label ? undefined : true}
      className={classes('fui-spinner', `fui-spinner-${size}`, className)}
    >
      <span className="fui-spinner-ring" aria-hidden="true" />
      {label && <VisuallyHidden>{label}</VisuallyHidden>}
    </span>
  );
});
