import { type ReactElement, type ReactNode } from 'react';
import * as Primitive from '@radix-ui/react-dropdown-menu';
import { usePortalTheme } from '../../internal/usePortalTheme';
export type MenuItem =
  | { id: string; label: ReactNode; onSelect: () => void; disabled?: boolean; separator?: false }
  | { id: string; separator: true };
export interface DropdownMenuProps {
  /** Element that opens the menu, usually a Button. */
  trigger: ReactElement;
  /** Menu entries, in order. An entry with `separator: true` draws a divider. */
  items: MenuItem[];
  /** Accessible name of the menu. */
  label: string;
}
export function DropdownMenu({ trigger, items, label }: DropdownMenuProps) {
  const { anchor, theme } = usePortalTheme();
  return (
    <span ref={anchor} className="fui-portal-anchor">
      {/* Non-modal: a modal menu aria-hides the page while it stays focusable. */}
      <Primitive.Root modal={false}>
        <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
        <Primitive.Portal>
          <Primitive.Content
            data-ui-theme={theme}
            sideOffset={8}
            collisionPadding={12}
            className="fui-menu"
            // Radix labels the menu by its trigger, which would override aria-label.
            aria-labelledby={undefined}
            aria-label={label}
          >
            {items.map((item) =>
              item.separator ? (
                <Primitive.Separator key={item.id} className="fui-menu-separator" />
              ) : (
                <Primitive.Item
                  key={item.id}
                  className="fui-menu-item"
                  disabled={item.disabled}
                  onSelect={item.onSelect}
                >
                  {item.label}
                </Primitive.Item>
              ),
            )}
          </Primitive.Content>
        </Primitive.Portal>
      </Primitive.Root>
    </span>
  );
}
