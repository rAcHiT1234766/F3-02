import { forwardRef, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Colour of the badge. The text must carry the meaning; colour only reinforces it. */
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', className, ...props },
  ref,
) {
  return (
    <span {...props} ref={ref} className={classes('fui-badge', `fui-badge-${tone}`, className)} />
  );
});
