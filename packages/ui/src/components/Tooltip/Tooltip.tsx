import { type ReactElement } from 'react';
import * as Primitive from '@radix-ui/react-tooltip';
import { usePortalTheme } from '../../internal/usePortalTheme';
export interface TooltipProps {
  /** Short supplementary text. Never put essential information or controls in a tooltip. */
  content: string;
  /** Focusable element that shows the tooltip on hover or keyboard focus. */
  children: ReactElement;
  /** Milliseconds of hovering before the tooltip appears. */
  delayDuration?: number;
}
export function Tooltip({ content, children, delayDuration = 300 }: TooltipProps) {
  const { anchor, theme } = usePortalTheme();
  return (
    <span ref={anchor} className="fui-portal-anchor">
      <Primitive.Provider delayDuration={delayDuration}>
        <Primitive.Root>
          <Primitive.Trigger asChild>{children}</Primitive.Trigger>
          <Primitive.Portal>
            <Primitive.Content
              data-ui-theme={theme}
              sideOffset={8}
              collisionPadding={12}
              className="fui-tooltip"
            >
              {content}
              <Primitive.Arrow className="fui-tooltip-arrow" />
            </Primitive.Content>
          </Primitive.Portal>
        </Primitive.Root>
      </Primitive.Provider>
    </span>
  );
}
