import { forwardRef, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level, h1–h6. Choose it for the page outline, not for the look. */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size, independent of the level. */
  size?: 'sm' | 'md' | 'lg';
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, size = 'md', className, ...props },
  ref,
) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  return (
    <Tag
      {...props}
      ref={ref}
      className={classes('fui-heading', `fui-heading-${size}`, className)}
    />
  );
});
