import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { classes } from '../../internal/classes';
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Visible label of the slider. */
  label: string;
}
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, id, min = 0, max = 100, step = 1, className, ...props },
  ref,
) {
  const generated = useId();
  return (
    <div className="fui-field">
      <label htmlFor={id ?? generated}>{label}</label>
      <input
        {...props}
        id={id ?? generated}
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        className={classes('fui-slider', className)}
      />
    </div>
  );
});
