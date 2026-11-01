import { createElement, forwardRef, type HTMLAttributes } from 'react';
import { classes } from '../../internal/classes';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render. */
  as?: 'p' | 'span' | 'small' | 'strong';
  /** Font size. */
  size?: 'sm' | 'md' | 'lg';
  /** `muted` for secondary information. */
  tone?: 'default' | 'muted';
}

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as = 'p', size = 'md', tone = 'default', className, ...props },
  ref,
) {
  return createElement(as, {
    ...props,
    ref,
    className: classes('fui-text', `fui-type-${size}`, `fui-text-${tone}`, className),
  });
});
