import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import * as Primitive from '@radix-ui/react-toast';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';

export interface ToastMessage {
  /** Main text of the notification. */
  message: string;
  /** Bold heading above the message. */
  title?: string;
  /** Colour of the toast. Danger toasts stay until dismissed. */
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  /**
   * Interrupts the screen reader and stays until dismissed. Use only for time-critical messages.
   */
  urgent?: boolean;
  /**
   * Milliseconds before the toast closes itself; 0 keeps it open. The timer pauses on hover and
   * focus. Toasts with an action, danger toasts and urgent toasts always stay open.
   */
  duration?: number;
  /**
   * Optional button such as Undo. `altText` tells screen reader users how to do the same thing
   * elsewhere. A toast with an action stays until dismissed.
   */
  action?: { label: string; altText: string; onClick: () => void };
}
interface Entry extends ToastMessage {
  id: number;
}
const Context = createContext<{
  notify: (message: ToastMessage) => number | null;
  dismiss: (id: number) => void;
} | null>(null);
export function useToast() {
  const context = useContext(Context);
  if (!context) throw new Error('useToast must be used inside ToastProvider.');
  return context;
}
export interface ToastProps extends ToastMessage {
  /** Whether the toast is shown, when you render a Toast yourself. */
  open?: boolean;
  /** Called when the toast closes, through its timer, swipe or dismiss button. */
  onOpenChange?: (open: boolean) => void;
}
export function Toast({
  message,
  title,
  tone = 'neutral',
  urgent = false,
  action,
  duration = 6000,
  ...props
}: ToastProps) {
  return (
    <Primitive.Root
      {...props}
      type={urgent ? 'foreground' : 'background'}
      duration={action || tone === 'danger' || urgent || duration === 0 ? Infinity : duration}
      className={`fui-toast fui-alert-${tone}`}
    >
      {title && <Primitive.Title className="fui-toast-title">{title}</Primitive.Title>}
      <Primitive.Description>{message}</Primitive.Description>
      <div className="fui-toast-actions">
        {action && (
          <Primitive.Action asChild altText={action.altText}>
            <Button size="sm" variant="secondary" onClick={action.onClick}>
              {action.label}
            </Button>
          </Primitive.Action>
        )}
        <Primitive.Close asChild>
          <IconButton size="sm" variant="secondary" label="Dismiss notification">
            ×
          </IconButton>
        </Primitive.Close>
      </div>
    </Primitive.Root>
  );
}
export function ToastProvider({
  children,
  maxToasts = 5,
}: {
  /** The app. Anything inside can call `useToast()`. */
  children: ReactNode;
  /**
   * Maximum number of toasts shown at once. Further `notify` calls return null instead of hiding a
   * toast the user may still need.
   */
  maxToasts?: number;
}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const entriesRef = useRef<Entry[]>([]);
  const sequence = useRef(0);
  const viewport = useRef<HTMLOListElement>(null);
  // Publish the space the open toasts cover so the page can keep focused content clear of it.
  useEffect(() => {
    const node = viewport.current;
    if (!node || typeof ResizeObserver === 'undefined') return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      const { top, height } = node.getBoundingClientRect();
      if (height > 0) {
        const gap = parseFloat(getComputedStyle(node).rowGap) || 0;
        root.style.setProperty('--fui-toast-inset', `${Math.ceil(innerHeight - top + gap)}px`);
      } else root.style.removeProperty('--fui-toast-inset');
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      root.style.removeProperty('--fui-toast-inset');
    };
  }, []);
  const dismiss = useCallback((id: number) => {
    entriesRef.current = entriesRef.current.filter((entry) => entry.id !== id);
    setEntries(entriesRef.current);
  }, []);
  const notify = useCallback(
    (message: ToastMessage) => {
      // Reject overflow instead of silently removing an actionable notification.
      if (entriesRef.current.length >= Math.max(1, maxToasts)) return null;
      const id = ++sequence.current;
      entriesRef.current = [...entriesRef.current, { ...message, id }];
      setEntries(entriesRef.current);
      return id;
    },
    [maxToasts],
  );
  return (
    <Context.Provider value={{ notify, dismiss }}>
      <Primitive.Provider label="Notification">
        {children}
        {entries.map(({ id, ...entry }) => (
          <Toast
            key={id}
            {...entry}
            open
            onOpenChange={(open) => {
              if (!open) dismiss(id);
            }}
          />
        ))}
        <Primitive.Viewport
          ref={viewport}
          className="fui-toast-viewport"
          label="Notifications (F8)"
        />
      </Primitive.Provider>
    </Context.Provider>
  );
}
