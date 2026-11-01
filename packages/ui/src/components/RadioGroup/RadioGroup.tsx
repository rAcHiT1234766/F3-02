import { forwardRef, useId, type ReactNode } from 'react';
import { Fieldset, type FieldsetProps } from '../Fieldset/Fieldset';
import { useControllable } from '../../internal/useControllable';
export interface RadioOption {
  /** Value submitted with the form and passed to `onValueChange`. */
  value: string;
  /** Visible label of the option. */
  label: ReactNode;
  /** Shown but cannot be selected. */
  disabled?: boolean;
}
export interface RadioGroupProps extends Omit<FieldsetProps, 'onChange' | 'children'> {
  /** Form field name shared by the radios. Generated when omitted. */
  name?: string;
  /** Choices, in order. */
  options: RadioOption[];
  /** Selected value when controlled; pair with `onValueChange`. */
  value?: string;
  /** Initially selected value when uncontrolled. */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onValueChange?: (value: string) => void;
  /** Requires a choice before the form can be submitted. */
  required?: boolean;
}
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  { options, name, value, defaultValue = '', onValueChange, required, ...props },
  ref,
) {
  const id = useId();
  const [selected, setSelected] = useControllable(value, defaultValue, onValueChange);
  return (
    <Fieldset {...props} ref={ref}>
      {options.map((option) => (
        <label key={option.value} className="fui-choice">
          <input
            type="radio"
            name={name ?? id}
            value={option.value}
            checked={selected === option.value}
            onChange={() => setSelected(option.value)}
            disabled={option.disabled}
            required={required}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </Fieldset>
  );
});
