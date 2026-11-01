import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { classes } from '../../internal/classes';
export interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'role' | 'children'> {
  /** Visible label. Clicking it toggles the switch, which is announced as on or off. */
  label: ReactNode;
}
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, className, ...props },
  ref,
) {
  return (
    <label className={classes('fui-choice', 'fui-switch', className)}>
      <input {...props} ref={ref} type="checkbox" role="switch" />
      <span>{label}</span>
    </label>
  );
});
