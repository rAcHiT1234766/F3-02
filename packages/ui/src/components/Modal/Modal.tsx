import {
  forwardRef,
  useId,
  useRef,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IconButton } from '../IconButton/IconButton';
import { usePortalTheme } from '../../internal/usePortalTheme';
import { classes } from '../../internal/classes';

export interface ModalProps {
  /** Dialog title. Names the dialog and its close button. */
  title: string;
  /** Short text below the title, announced when the dialog opens. */
  description?: ReactNode;
  /** Element that opens the dialog. Omit it when you control `open` yourself. */
  trigger?: ReactElement;
  /** Open state when controlled; pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new open state whenever it opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Body of the dialog. */
  children: ReactNode;
  /** Actions shown at the bottom, such as Cancel and Save. */
  footer?: ReactNode;
  /** Element to focus when the dialog opens. Without it, the close button is focused. */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /**
   * Element to focus when the dialog closes. Without it, focus returns to the trigger, or to
   * whatever had focus before the dialog opened.
   */
  returnFocusRef?: RefObject<HTMLElement | null>;
  /** Extra class for the dialog panel. */
  className?: string;
}
export const Modal = forwardRef<HTMLDivElement, ModalProps>(function Modal(
  {
    title,
    description,
    trigger,
    open,
    defaultOpen,
    onOpenChange,
    children,
    footer,
    initialFocusRef,
    returnFocusRef,
    className,
  },
  ref,
) {
  const { anchor, theme } = usePortalTheme();
  const opener = useRef<HTMLElement | null>(null);
  const descriptionId = useId();
  return (
    <span ref={anchor} className="fui-portal-anchor">
      <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
        <Dialog.Portal>
          <Dialog.Overlay className="fui-overlay" />
          <Dialog.Content
            ref={ref}
            data-ui-theme={theme}
            className={classes('fui-dialog', className)}
            aria-describedby={description ? descriptionId : undefined}
            onOpenAutoFocus={(event) => {
              opener.current =
                document.activeElement instanceof HTMLElement ? document.activeElement : null;
              if (initialFocusRef?.current) {
                event.preventDefault();
                initialFocusRef.current.focus();
              }
            }}
            onCloseAutoFocus={(event) => {
              const target = returnFocusRef?.current ?? (!trigger ? opener.current : null);
              if (target?.isConnected) {
                event.preventDefault();
                target.focus();
              }
            }}
          >
            <div className="fui-dialog-heading">
              <Dialog.Title className="fui-dialog-title">{title}</Dialog.Title>
              <Dialog.Close asChild>
                <IconButton label={`Close ${title}`} variant="secondary">
                  ×
                </IconButton>
              </Dialog.Close>
            </div>
            {description && (
              <Dialog.Description id={descriptionId} className="fui-help">
                {description}
              </Dialog.Description>
            )}
            <div className="fui-dialog-body">{children}</div>
            {footer && <div className="fui-dialog-footer">{footer}</div>}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </span>
  );
});
