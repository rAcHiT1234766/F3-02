import { useState } from 'react';

export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
) {
  const [internal, setInternal] = useState(defaultValue);
  const current = value === undefined ? internal : value;
  function set(next: T) {
    if (current !== next) {
      if (value === undefined) setInternal(next);
      onChange?.(next);
    }
  }
  return [current, set] as const;
}
