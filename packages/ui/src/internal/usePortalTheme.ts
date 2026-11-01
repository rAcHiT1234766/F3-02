import { useEffect, useRef, useState } from 'react';

/** Observe the actual DOM boundary so portals also work without a provider. */
export function usePortalTheme() {
  const anchor = useRef<HTMLSpanElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const element = anchor.current;
    if (!element) return;
    const update = () =>
      setTheme(
        element.closest('[data-ui-theme]')?.getAttribute('data-ui-theme') === 'dark'
          ? 'dark'
          : 'light',
      );
    update();
    const observer = new MutationObserver(update);
    for (let parent: HTMLElement | null = element; parent; parent = parent.parentElement) {
      observer.observe(parent, { attributes: true, attributeFilter: ['data-ui-theme'] });
    }
    return () => observer.disconnect();
  }, []);
  return { anchor, theme };
}
