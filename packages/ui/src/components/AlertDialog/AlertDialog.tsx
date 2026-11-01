import { forwardRef, type ReactElement, type ReactNode } from 'react';
import * as Primitive from '@radix-ui/react-alert-dialog';
import { Button } from '../Button/Button';
import { usePortalTheme } from '../../internal/usePortalTheme';
export interface AlertDialogProps {
  /** Question that names the action, e.g. “Archive Ada Lovelace?”. */
  title: string;
  /** Explains what happens if the user confirms. */
  description: ReactNode;
  /** Element that opens the dialog, usually a Button. Focus returns to it on close. */
  trigger: ReactElement;
  /** Text of the danger button that confirms. Name the action, e.g. “Archive employee”. */
  confirmLabel: string;
  /** Text of the button that closes without acting. It receives focus when the dialog opens. */
  cancelLabel?: string;
  /** Called when the user confirms; the dialog then closes. */
  onConfirm: () => void;
  /** Open state when controlled; pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new open state whenever it opens or closes. */
  onOpenChange?: (open: boolean) => void;
}
export const AlertDialog = forwardRef<HTMLDivElement, AlertDialogProps>(function AlertDialog(
  {
    title,
    description,
    trigger,
    confirmLabel,
    cancelLabel = 'Cancel',
    onConfirm,
    open,
    defaultOpen,
    onOpenChange,
  },
  ref,
) {
  const { anchor, theme } = usePortalTheme();
  return (
    <span ref={anchor} className="fui-portal-anchor">
      <Primitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
        <Primitive.Portal>
          <Primitive.Overlay className="fui-overlay" />
          <Primitive.Content ref={ref} data-ui-theme={theme} className="fui-dialog">
            <Primitive.Title className="fui-dialog-title">{title}</Primitive.Title>
            <Primitive.Description>{description}</Primitive.Description>
            <div className="fui-dialog-footer">
              <Primitive.Cancel asChild>
                <Button variant="secondary">{cancelLabel}</Button>
              </Primitive.Cancel>
              <Primitive.Action asChild>
                <Button variant="danger" onClick={onConfirm}>
                  {confirmLabel}
                </Button>
              </Primitive.Action>
            </div>
          </Primitive.Content>
        </Primitive.Portal>
      </Primitive.Root>
    </span>
  );
});
