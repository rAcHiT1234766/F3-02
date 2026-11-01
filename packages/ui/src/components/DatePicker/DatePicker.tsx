import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import { Calendar } from '../Calendar/Calendar';
import { Modal } from '../Modal/Modal';
import { dateError, validateDateBounds } from '../../internal/dateOnly';
import { useControllable } from '../../internal/useControllable';
export interface DatePickerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'min' | 'max' | 'size'
  > {
  /** Visible label. Also names the calendar button and dialog. */
  label: string;
  /** Date as `YYYY-MM-DD`, or null, when controlled. */
  value?: string | null;
  /** Initial date as `YYYY-MM-DD` when uncontrolled. */
  defaultValue?: string | null;
  /**
   * Called with a valid date, or null when cleared. Typed text is checked when the field loses
   * focus; invalid text shows an error and is not passed on.
   */
  onValueChange?: (value: string | null) => void;
  /** Earliest allowed date as `YYYY-MM-DD`, for both typing and the calendar. */
  min?: string;
  /** Latest allowed date as `YYYY-MM-DD`, for both typing and the calendar. */
  max?: string;
  /**
   * Month the calendar opens on, given as any `YYYY-MM-DD` date in it. Without it, the calendar
   * opens on the selected date, then on `min`.
   */
  defaultMonth?: string;
}
export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePicker(
  {
    label,
    value,
    defaultValue = null,
    onValueChange,
    min,
    max,
    defaultMonth,
    id,
    disabled,
    readOnly,
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
    onBlur,
    ...props
  },
  ref,
) {
  validateDateBounds(min, max);
  const generated = useId();
  const controlId = id ?? generated;
  const [committed, setCommitted] = useControllable(value, defaultValue, onValueChange);
  const [draft, setDraft] = useState(committed ?? '');
  const [previous, setPrevious] = useState(committed);
  const [error, setError] = useState<string>();
  const [open, setOpen] = useState(false);
  if (previous !== committed) {
    setPrevious(committed);
    setDraft(committed ?? '');
    setError(undefined);
  }
  function commit(text: string) {
    const problem = dateError(text, min, max);
    setError(problem);
    if (!problem) {
      setCommitted(text || null);
      if (value !== undefined) setDraft(committed ?? '');
    }
  }
  return (
    <div className="fui-field">
      <label htmlFor={controlId}>
        {label}
        {props.required && ' (required)'}
      </label>
      <div className="fui-date-row">
        <Input
          {...props}
          id={controlId}
          ref={ref}
          disabled={disabled}
          readOnly={readOnly}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={(event) => {
            if (!disabled && !readOnly) commit(draft);
            onBlur?.(event);
          }}
          placeholder="YYYY-MM-DD"
          aria-invalid={error ? true : invalid}
          aria-describedby={[describedBy, `${controlId}-format`, error && `${controlId}-date-error`]
            .filter(Boolean)
            .join(' ')}
        />
        <Modal
          title={`Choose ${label}`}
          open={open}
          onOpenChange={setOpen}
          trigger={
            <Button
              variant="secondary"
              disabled={disabled || readOnly}
              aria-label={`Open ${label} calendar`}
            >
              Calendar
            </Button>
          }
        >
          <Calendar
            label={label}
            value={committed}
            min={min}
            max={max}
            defaultMonth={defaultMonth}
            focusOnMount
            onValueChange={(date) => {
              setDraft(value === undefined ? (date ?? '') : (committed ?? ''));
              setError(undefined);
              setCommitted(date);
              setOpen(false);
            }}
          />
        </Modal>
        {(draft || committed) && (
          <Button
            variant="secondary"
            disabled={disabled || readOnly}
            onClick={() => {
              setDraft(value === undefined ? '' : (committed ?? ''));
              setError(undefined);
              setCommitted(null);
            }}
            aria-label={`Clear ${label}`}
          >
            Clear
          </Button>
        )}
      </div>
      <p id={`${controlId}-format`} className="fui-help">
        Format: YYYY-MM-DD.
      </p>
      {error && (
        <p id={`${controlId}-date-error`} className="fui-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
