import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { classes } from '../../internal/classes';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Content shown above the body, such as a title. */
  header?: ReactNode;
  /** Content shown below the body, such as actions. */
  footer?: ReactNode;
}
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { header, footer, children, className, ...props },
  ref,
) {
  return (
    <div {...props} ref={ref} className={classes('fui-card', className)}>
      {header != null && <div className="fui-card-header">{header}</div>}
      <div className="fui-card-content">{children}</div>
      {footer != null && <div className="fui-card-footer">{footer}</div>}
    </div>
  );
});
