import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { classes } from '../../internal/classes';
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Bold heading shown above the message. */
  title?: ReactNode;
  /** Colour of the alert. Make sure the text also states the meaning. */
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  /**
   * How screen readers are told: `off` for content present on page load, `polite` (status) for
   * updates, `assertive` (alert) only for urgent errors.
   */
  announce?: 'off' | 'polite' | 'assertive';
}
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { title, tone = 'neutral', announce = 'off', children, className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      role={announce === 'assertive' ? 'alert' : announce === 'polite' ? 'status' : undefined}
      className={classes('fui-alert', `fui-alert-${tone}`, className)}
    >
      {title && <strong>{title}</strong>}
      <div>{children}</div>
    </div>
  );
});
