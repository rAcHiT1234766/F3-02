import { forwardRef, type InputHTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visual height, independent of the native HTML size attribute. */
  controlSize?: 'sm' | 'md' | 'lg';
}
const sizes = { sm: 'fui-control-sm', md: 'fui-control-md', lg: 'fui-control-lg' };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { controlSize = 'md', className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      {...props}
      ref={ref}
      type={type}
      className={classes('fui-input', sizes[controlSize], className)}
    />
  );
});
