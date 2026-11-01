import { forwardRef, type SelectHTMLAttributes } from 'react';
import { classes } from '../../internal/classes';
export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'multiple'>;
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <select {...props} ref={ref} className={classes('fui-input', 'fui-control-md', className)}>
      {children}
    </select>
  );
});
