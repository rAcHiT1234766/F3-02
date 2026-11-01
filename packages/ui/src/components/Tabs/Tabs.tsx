import { type ReactNode } from 'react';
import * as Primitive from '@radix-ui/react-tabs';
export interface TabItem {
  /** Unique key of the tab. */
  value: string;
  /** Text of the tab. */
  label: string;
  /** Panel shown while the tab is selected. */
  content: ReactNode;
  /** Shown but cannot be selected. */
  disabled?: boolean;
}
export interface TabsProps {
  /** Accessible name of the tab list. */
  label: string;
  /** Tabs, in order. */
  items: TabItem[];
  /** Selected tab `value` when controlled; pair with `onValueChange`. */
  value?: string;
  /** Initially selected tab when uncontrolled. Defaults to the first enabled tab. */
  defaultValue?: string;
  /** Called with the `value` of the newly selected tab. */
  onValueChange?: (value: string) => void;
}
export function Tabs({
  label,
  items,
  defaultValue = items.find((item) => !item.disabled)?.value,
  ...props
}: TabsProps) {
  return (
    <Primitive.Root {...props} defaultValue={defaultValue} className="fui-tabs">
      <Primitive.List className="fui-tab-list" aria-label={label}>
        {items.map((item) => (
          <Primitive.Trigger
            className="fui-tab"
            key={item.value}
            value={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </Primitive.Trigger>
        ))}
      </Primitive.List>
      {items.map((item) => (
        <Primitive.Content className="fui-tab-panel" key={item.value} value={item.value}>
          {item.content}
        </Primitive.Content>
      ))}
    </Primitive.Root>
  );
}
