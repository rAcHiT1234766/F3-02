import { forwardRef, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export type VisuallyHiddenProps = HTMLAttributes<HTMLSpanElement>;
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ className, ...props }, ref) {
    return <span {...props} ref={ref} className={classes('fui-visually-hidden', className)} />;
  },
);
