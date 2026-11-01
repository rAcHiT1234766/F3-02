import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { classes } from '../../internal/classes';
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Directions in which the user can resize the field. */
  resize?: 'vertical' | 'none' | 'both';
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { rows = 4, resize = 'vertical', className, style, ...props },
  ref,
) {
  return (
    <textarea
      {...props}
      ref={ref}
      rows={rows}
      className={classes('fui-input', 'fui-control-md', className)}
      style={{ resize, ...style }}
    />
  );
});
