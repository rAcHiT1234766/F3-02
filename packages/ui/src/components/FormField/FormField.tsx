import { useId, type ReactNode } from 'react';

export interface FieldControlProps {
  /** Id to put on the control so the label points to it. */
  id: string;
  /** Whether the control is required. */
  required?: boolean;
  /** Ids of the help and error text that describe the control. */
  'aria-describedby'?: string;
  /** Set when the field has an error. */
  'aria-invalid'?: true;
}
export interface FormFieldProps {
  /** Id given to the control. Generated when omitted. */
  id?: string;
  /** Visible label, linked to the control. */
  label: ReactNode;
  /** Guidance shown below the control and announced with it. */
  help?: ReactNode;
  /** Error message shown below the control. Also marks the control as invalid. */
  error?: ReactNode;
  /** Marks the control as required and adds “(required)” to the label. */
  required?: boolean;
  /** Ids of other elements that describe the control, announced before the help and error text. */
  describedBy?: string;
  /** Render function that receives the id and ARIA attributes to spread onto the control. */
  children: (props: FieldControlProps) => ReactNode;
}
export function FormField({
  id,
  label,
  help,
  error,
  required,
  describedBy,
  children,
}: FormFieldProps) {
  const generated = useId();
  const controlId = id ?? generated;
  const description =
    [describedBy, help ? `${controlId}-help` : '', error ? `${controlId}-error` : '']
      .filter(Boolean)
      .join(' ') || undefined;
  return (
    <div className="fui-field">
      <label htmlFor={controlId}>
        {label}
        {required && <span> (required)</span>}
      </label>
      {children({
        id: controlId,
        required,
        'aria-describedby': description,
        'aria-invalid': error ? true : undefined,
      })}
      {help && (
        <p id={`${controlId}-help`} className="fui-help">
          {help}
        </p>
      )}
      {error && (
        <p id={`${controlId}-error`} className="fui-error">
          {error}
        </p>
      )}
    </div>
  );
}
