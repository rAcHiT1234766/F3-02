import { forwardRef, useId, useImperativeHandle, useRef, useState } from 'react';
import { Input } from '../Input/Input';
import { IconButton } from '../IconButton/IconButton';
import { useControllable } from '../../internal/useControllable';
export interface ComboboxOption {
  /** Unique value stored and submitted when the option is selected. */
  id: string;
  /** Text shown in the list and matched against what the user types. */
  label: string;
  /** Shown in the list but cannot be selected or reached with the arrow keys. */
  disabled?: boolean;
}
export interface ComboboxProps {
  /** Visible label of the input. */
  label: string;
  /** Choices, filtered as the user types. */
  options: ComboboxOption[];
  /** Selected option `id`, or null, when controlled. */
  value?: string | null;
  /** Initially selected option `id` when uncontrolled. */
  defaultValue?: string | null;
  /** Called with the selected option `id`, or null when it is cleared. */
  onValueChange?: (value: string | null) => void;
  /** Disables the input and its clear button. */
  disabled?: boolean;
  /** Form field name. The selected option `id` is submitted through a hidden input. */
  name?: string;
  /** Id of the input. Generated when omitted. */
  id?: string;
  /** Marks the field as required and adds “(required)” to the label. */
  required?: boolean;
  /** Ids of help or error text to announce with the input. */
  'aria-describedby'?: string;
  /** Marks the current value as invalid. */
  'aria-invalid'?: boolean;
}
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  {
    label,
    options,
    value,
    defaultValue = null,
    onValueChange,
    disabled,
    name,
    id,
    required,
    ...aria
  },
  ref,
) {
  const generated = useId();
  const inputId = id ?? generated;
  const listId = `${inputId}-list`;
  const [selected, setSelected] = useControllable(value, defaultValue, onValueChange);
  const selectedLabel = options.find((option) => option.id === selected)?.label ?? '';
  const [query, setQuery] = useState(selectedLabel);
  const [previous, setPrevious] = useState(selectedLabel);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => input.current!);
  if (selectedLabel !== previous) {
    setPrevious(selectedLabel);
    setQuery(selectedLabel);
  }
  const filtered = options.filter((option) =>
    option.label.toLocaleLowerCase('en').includes(query.toLocaleLowerCase('en')),
  );
  const enabled = filtered.filter((option) => !option.disabled);
  const activeOption = filtered.find((option) => option.id === active && !option.disabled);
  const optionId = (option: ComboboxOption) => `${listId}-${options.indexOf(option)}`;
  function restore() {
    setOpen(false);
    setQuery(selectedLabel);
    setActive(null);
  }
  function select(option: ComboboxOption) {
    if (option.disabled) return;
    setSelected(option.id);
    setQuery(value === undefined ? option.label : selectedLabel);
    setOpen(false);
    setActive(null);
  }
  return (
    <div className="fui-field fui-combobox">
      <label htmlFor={inputId}>
        {label}
        {required && ' (required)'}
      </label>
      {name && <input type="hidden" name={name} value={selected ?? ''} disabled={disabled} />}
      <div className="fui-search">
        <Input
          {...aria}
          ref={input}
          id={inputId}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-activedescendant={open && activeOption ? optionId(activeOption) : undefined}
          required={required}
          disabled={disabled}
          autoComplete="off"
          value={query}
          onFocus={() => setOpen(true)}
          onBlur={restore}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(null);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setOpen(true);
              const index = enabled.findIndex((option) => option.id === active);
              const next =
                index < 0
                  ? event.key === 'ArrowDown'
                    ? 0
                    : enabled.length - 1
                  : (index + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) %
                    enabled.length;
              const option = enabled[next];
              setActive(option?.id ?? null);
              if (option)
                document.getElementById(optionId(option))?.scrollIntoView?.({ block: 'nearest' });
            } else if (event.key === 'Enter' && open && activeOption) {
              event.preventDefault();
              select(activeOption);
            } else if (event.key === 'Escape' && open) {
              event.preventDefault();
              event.stopPropagation();
              restore();
            } else if (event.key === 'Tab') restore();
          }}
        />
        {(query || selected) && (
          <IconButton
            label={`Clear ${label}`}
            variant="secondary"
            disabled={disabled}
            onClick={() => {
              setSelected(null);
              setQuery(value === undefined ? '' : selectedLabel);
              setActive(null);
              setOpen(false);
              input.current?.focus();
            }}
          >
            ×
          </IconButton>
        )}
      </div>
      {open && !disabled && (
        <div className="fui-combobox-popup">
          <ul id={listId} role="listbox" aria-label={`${label} options`}>
            {filtered.map((option) => (
              <li
                key={option.id}
                id={optionId(option)}
                role="option"
                aria-selected={selected === option.id}
                aria-disabled={option.disabled || undefined}
                data-active={active === option.id || undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(option)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') select(option);
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
          {!filtered.length && <p role="status">No matching options.</p>}
        </div>
      )}
    </div>
  );
});
