import { DayPicker } from 'react-day-picker';
import { parseDateOnly, formatDateOnly, validateDateBounds } from '../../internal/dateOnly';
import { useControllable } from '../../internal/useControllable';
export interface CalendarProps {
  /** Accessible name of the calendar. */
  label?: string;
  /** Selected date as `YYYY-MM-DD`, or null, when controlled. */
  value?: string | null;
  /** Initially selected date as `YYYY-MM-DD` when uncontrolled. */
  defaultValue?: string | null;
  /** Called with the selected date as `YYYY-MM-DD`, or null when it is cleared. */
  onValueChange?: (value: string | null) => void;
  /** Earliest selectable date as `YYYY-MM-DD`. Earlier months cannot be shown. */
  min?: string;
  /** Latest selectable date as `YYYY-MM-DD`. Later months cannot be shown. */
  max?: string;
  /**
   * Month shown first, given as any `YYYY-MM-DD` date in it. Without it, the calendar opens on the
   * selected date, then on `min`.
   */
  defaultMonth?: string;
  /** Makes every day unselectable. */
  disabled?: boolean;
  /**
   * Moves focus into the calendar when it appears. Use only when a user action opened it, such as a
   * dialog trigger.
   */
  focusOnMount?: boolean;
}
export function Calendar({
  label = 'Choose a date',
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  defaultMonth,
  disabled,
  focusOnMount,
}: CalendarProps) {
  validateDateBounds(min, max);
  const [selected, setSelected] = useControllable(value, defaultValue, onValueChange);
  if (selected && !parseDateOnly(selected))
    throw new Error('Calendar value must be a valid YYYY-MM-DD date or null.');
  const lower = min ? parseDateOnly(min) : undefined;
  const upper = max ? parseDateOnly(max) : undefined;
  return (
    <DayPicker
      className="fui-calendar"
      mode="single"
      aria-label={label}
      labels={{
        labelDayButton: (date, modifiers) =>
          `${modifiers.today ? 'Today, ' : ''}${new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date)}${modifiers.selected ? ', selected' : ''}`,
      }}
      selected={selected ? parseDateOnly(selected) : undefined}
      onSelect={(date) => setSelected(date ? formatDateOnly(date) : null)}
      defaultMonth={
        defaultMonth ? parseDateOnly(defaultMonth) : selected ? parseDateOnly(selected) : lower
      }
      startMonth={lower}
      endMonth={upper}
      // This is opt-in focus for a calendar opened by a dialog trigger, never page-load focus.
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={focusOnMount}
      disabled={
        disabled
          ? true
          : [...(lower ? [{ before: lower }] : []), ...(upper ? [{ after: upper }] : [])]
      }
      footer={selected ? `Selected: ${selected}` : 'No date selected.'}
    />
  );
}
