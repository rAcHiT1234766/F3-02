import { forwardRef, useId, type FieldsetHTMLAttributes, type ReactNode } from 'react';
import { classes } from '../../internal/classes';
export interface FieldsetProps extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Caption that names the group. Screen readers announce it with each control inside. */
  legend: ReactNode;
  /** Guidance shown below the controls and announced with the group. */
  help?: ReactNode;
  /** Error message shown below the controls and announced with the group. */
  error?: ReactNode;
}
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(function Fieldset(
  { legend, help, error, children, className, 'aria-describedby': describedBy, ...props },
  ref,
) {
  const id = useId();
  return (
    <fieldset
      {...props}
      ref={ref}
      className={classes('fui-fieldset', className)}
      aria-describedby={
        [describedBy, help && `${id}-help`, error && `${id}-error`].filter(Boolean).join(' ') ||
        undefined
      }
    >
      <legend>{legend}</legend>
      {children}
      {help && (
        <p id={`${id}-help`} className="fui-help">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="fui-error">
          {error}
        </p>
      )}
    </fieldset>
  );
});
