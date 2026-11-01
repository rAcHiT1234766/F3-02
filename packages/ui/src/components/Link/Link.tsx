import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * Destination URL. With `target="_blank"`, `noopener noreferrer` is added to `rel` automatically.
   */
  href: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, target, rel, children, ...props },
  ref,
) {
  const safeRel =
    target === '_blank'
      ? Array.from(new Set(`${rel ?? ''} noopener noreferrer`.trim().split(/\s+/))).join(' ')
      : rel;
  return (
    <a
      {...props}
      ref={ref}
      target={target}
      rel={safeRel}
      className={classes('fui-link', className)}
    >
      {children}
    </a>
  );
});
