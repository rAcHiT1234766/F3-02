import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export interface SkeletonProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** CSS width of the placeholder. */
  width?: CSSProperties['width'];
  /** CSS height of the placeholder. */
  height?: CSSProperties['height'];
  /** `circle` for avatars, `rounded` for text and blocks. */
  shape?: 'rounded' | 'circle';
}

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { width = '100%', height = '1rem', shape = 'rounded', style, className, ...props },
  ref,
) {
  return (
    <span
      {...props}
      ref={ref}
      aria-hidden="true"
      className={classes('fui-skeleton', `fui-skeleton-${shape}`, className)}
      style={{ width, height, ...style }}
    />
  );
});
