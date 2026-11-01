import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Input, type InputProps } from '../Input/Input';
import { IconButton } from '../IconButton/IconButton';
import { useControllable } from '../../internal/useControllable';
export interface SearchInputProps
  extends Omit<InputProps, 'value' | 'defaultValue' | 'onChange' | 'type'> {
  /** Search text when controlled; pair with `onValueChange`. */
  value?: string;
  /** Initial search text when uncontrolled. */
  defaultValue?: string;
  /** Called with the new text on every change, including when cleared. */
  onValueChange?: (value: string) => void;
  /** Accessible name of the clear button, which appears while there is text. */
  clearLabel?: string;
}
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, defaultValue = '', onValueChange, clearLabel = 'Clear search', ...props },
  ref,
) {
  const [query, setQuery] = useControllable(value, defaultValue, onValueChange);
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current!);
  return (
    <div className="fui-search">
      <Input
        {...props}
        ref={input}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {query && !props.disabled && !props.readOnly && (
        <IconButton
          label={clearLabel}
          variant="secondary"
          onClick={() => {
            setQuery('');
            input.current?.focus();
          }}
        >
          ×
        </IconButton>
      )}
    </div>
  );
});
