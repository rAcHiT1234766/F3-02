import { forwardRef } from 'react';
import { Modal, type ModalProps } from '../Modal/Modal';
import { classes } from '../../internal/classes';
export interface DrawerProps extends ModalProps {
  /** Edge of the screen the panel is attached to. */
  side?: 'left' | 'right';
}
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  { side = 'right', className, ...props },
  ref,
) {
  return (
    <Modal
      {...props}
      ref={ref}
      className={classes('fui-drawer', `fui-drawer-${side}`, className)}
    />
  );
});
