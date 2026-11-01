import { type ReactNode } from 'react';
import * as Primitive from '@radix-ui/react-accordion';
import { useControllable } from '../../internal/useControllable';
export interface AccordionItem {
  /** Unique key of the item, as used in `value` and `defaultValue`. */
  value: string;
  /** Text of the heading button that expands and collapses the item. */
  title: string;
  /** Content revealed while the item is expanded. */
  content: ReactNode;
  /** Prevents the item from being expanded or collapsed. */
  disabled?: boolean;
}
export interface AccordionProps {
  /** Sections to render, in order. */
  items: AccordionItem[];
  /**
   * Allows several items to be open at once. When false, opening one item closes the other, and the
   * open item can still be collapsed.
   */
  multiple?: boolean;
  /** Values of the open items when controlled; pair with `onValueChange`. */
  value?: string[];
  /** Values of the initially open items when uncontrolled. */
  defaultValue?: string[];
  /** Called with the values of the open items whenever one opens or closes. */
  onValueChange?: (value: string[]) => void;
}
export function Accordion({
  items,
  multiple = false,
  value,
  defaultValue = [],
  onValueChange,
}: AccordionProps) {
  const [expanded, setExpanded] = useControllable(value, defaultValue, onValueChange);
  const children = items.map((item) => (
    <Primitive.Item
      className="fui-accordion-item"
      key={item.value}
      value={item.value}
      disabled={item.disabled}
    >
      <Primitive.Header className="fui-accordion-heading">
        <Primitive.Trigger className="fui-accordion-trigger">
          {item.title}
          <span aria-hidden="true">⌄</span>
        </Primitive.Trigger>
      </Primitive.Header>
      <Primitive.Content className="fui-accordion-content">{item.content}</Primitive.Content>
    </Primitive.Item>
  ));
  return multiple ? (
    <Primitive.Root type="multiple" value={expanded} onValueChange={setExpanded}>
      {children}
    </Primitive.Root>
  ) : (
    <Primitive.Root
      type="single"
      collapsible
      value={expanded[0] ?? ''}
      onValueChange={(value) => setExpanded(value ? [value] : [])}
    >
      {children}
    </Primitive.Root>
  );
}
