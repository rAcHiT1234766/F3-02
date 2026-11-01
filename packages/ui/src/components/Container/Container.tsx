import { forwardRef, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum width of the content. */
  size?: 'sm' | 'md' | 'lg';
}
export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { size = 'lg', className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={classes('fui-container', `fui-container-${size}`, className)}
    />
  );
});
