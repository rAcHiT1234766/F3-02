import { forwardRef, type ProgressHTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export interface ProgressProps
  extends Omit<
    ProgressHTMLAttributes<HTMLProgressElement>,
    'value' | 'max' | 'children' | 'aria-label'
  > {
  /** Accessible name, e.g. “Uploading report”. */
  label: string;
  /** Omit for indeterminate progress. Non-finite values are indeterminate. */
  value?: number;
  /** Value that means complete. Invalid values fall back to 100. */
  max?: number;
}

export const Progress = forwardRef<HTMLProgressElement, ProgressProps>(function Progress(
  { label, value, max = 100, className, ...props },
  ref,
) {
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current =
    value !== undefined && Number.isFinite(value) ? Math.min(limit, Math.max(0, value)) : undefined;
  return (
    <progress
      {...props}
      ref={ref}
      aria-label={label}
      max={limit}
      value={current}
      className={classes('fui-progress', className)}
    />
  );
});
