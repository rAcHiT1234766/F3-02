import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { classes } from '../../internal/classes';
export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  /** Visible label. Clicking it toggles the checkbox. */
  label: ReactNode;
  /** Shows the mixed state, e.g. a “select all” box when only some items are selected. */
  indeterminate?: boolean;
  /** Keeps the label for assistive technology but hides it visually, e.g. in table rows. */
  hideLabel?: boolean;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate = false, hideLabel = false, className, ...props },
  ref,
) {
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current!);
  useEffect(() => {
    if (input.current) input.current.indeterminate = indeterminate;
  }, [indeterminate, props.checked]);
  return (
    <label className={classes('fui-choice', hideLabel && 'fui-choice-compact', className)}>
      <input
        {...props}
        ref={input}
        type="checkbox"
        aria-checked={indeterminate ? 'mixed' : undefined}
      />
      <span className={hideLabel ? 'fui-visually-hidden' : undefined}>{label}</span>
    </label>
  );
});
