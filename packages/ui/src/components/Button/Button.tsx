import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Primary is the default. Include meaningful action text for danger actions. */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Height and padding of the button. */
  size?: 'sm' | 'md' | 'lg';
  /** Uses native disabled behavior while retaining the accessible name. */
  loading?: boolean;
}

const variants = {
  primary: 'fui-button-primary',
  secondary: 'fui-button-secondary',
  danger: 'fui-button-danger',
};
const sizes = { sm: 'fui-control-sm', md: 'fui-control-md', lg: 'fui-control-lg' };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    type = 'button',
    className,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes('fui-button', variants[variant], sizes[size], className)}
    >
      {loading && <span className="fui-button-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
});
