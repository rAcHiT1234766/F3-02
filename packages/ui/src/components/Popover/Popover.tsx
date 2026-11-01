import { forwardRef, useId, type ReactElement, type ReactNode } from 'react';
import * as Primitive from '@radix-ui/react-popover';
import { IconButton } from '../IconButton/IconButton';
import { usePortalTheme } from '../../internal/usePortalTheme';
export interface PopoverProps {
  /** Heading at the top. Names the popover and its close button. */
  title: string;
  /** Element that opens and closes the popover. */
  trigger: ReactElement;
  /** Content of the popover. */
  children: ReactNode;
  /** Open state when controlled; pair with `onOpenChange`. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the new open state whenever it opens or closes. */
  onOpenChange?: (open: boolean) => void;
}
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  { title, trigger, children, ...props },
  ref,
) {
  const id = useId();
  const { anchor, theme } = usePortalTheme();
  return (
    <span ref={anchor} className="fui-portal-anchor">
      <Primitive.Root {...props}>
        <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
        <Primitive.Portal>
          <Primitive.Content
            ref={ref}
            data-ui-theme={theme}
            sideOffset={8}
            collisionPadding={12}
            className="fui-popover"
            aria-labelledby={id}
          >
            <div className="fui-dialog-heading">
              <h2 id={id} className="fui-dialog-title">
                {title}
              </h2>
              <Primitive.Close asChild>
                <IconButton label={`Close ${title}`} variant="secondary">
                  ×
                </IconButton>
              </Primitive.Close>
            </div>
            {children}
          </Primitive.Content>
        </Primitive.Portal>
      </Primitive.Root>
    </span>
  );
});
