import { forwardRef } from 'react';
import { Button, type ButtonProps } from '../Button/Button';
import { classes } from '../../internal/classes';

export interface IconButtonProps extends Omit<ButtonProps, 'aria-label' | 'aria-labelledby'> {
  /** Required action name, independent of the decorative icon. */
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, children, className, ...props },
  ref,
) {
  return (
    <Button
      {...props}
      ref={ref}
      aria-label={label}
      className={classes('fui-icon-button', className)}
    >
      <span aria-hidden="true" className="fui-icon-button-glyph">
        {children}
      </span>
    </Button>
  );
});
