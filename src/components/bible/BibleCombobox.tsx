import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

export interface ComboboxOption {
  value: string;
  label: string;
  detail?: string;
}

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

export function BibleCombobox({
  label,
  placeholder,
  value,
  options,
  disabled,
  onChange
}: {
  label?: string;
  placeholder: string;
  value: string;
  options: ComboboxOption[];
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const root = useRef<HTMLLabelElement>(null);
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = useState(selected?.label ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  useEffect(() => {
    setQuery(selected?.label ?? "");
  }, [selected?.label]);
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const matches = useMemo(() => {
    const term = normalize(query.trim());
    if (!term || selected?.label === query) return options;
    return options.filter((option) => normalize(option.label).includes(term));
  }, [options, query, selected?.label]);
  const choose = (option: ComboboxOption) => {
    setQuery(option.label);
    setOpen(false);
    onChange(option.value);
  };
  const keyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, matches.length - 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    }
    if (event.key === "Enter" && open && matches[active]) {
      event.preventDefault();
      choose(matches[active]);
    }
    if (event.key === "Escape") {
      setOpen(false);
      setQuery(selected?.label ?? "");
    }
  };
  return (
    <label
      className={`bible-combobox ${open ? "open" : ""} ${disabled ? "disabled" : ""}`}
      ref={root}
    >
      {label && <span>{label}</span>}
      <div className="bible-combobox-control">
        <Search />
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-autocomplete="list"
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => {
            setOpen(true);
            setActive(0);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(0);
            if (!event.target.value) onChange("");
          }}
          onKeyDown={keyDown}
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-label={`Mostrar opciones de ${label}`}
          onClick={() => setOpen((current) => !current)}
        >
          <ChevronDown />
        </button>
      </div>
      {open && !disabled && (
        <div className="bible-combobox-options" id={`${id}-options`} role="listbox">
          {matches.length ? (
            matches.map((option, index) => (
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={`${option.value === value ? "selected" : ""} ${index === active ? "active" : ""}`}
                key={option.value}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
              >
                <span>
                  <strong>{option.label}</strong>
                  {option.detail && <small>{option.detail}</small>}
                </span>
                {option.value === value && <Check />}
              </button>
            ))
          ) : (
            <p>No hay coincidencias</p>
          )}
        </div>
      )}
    </label>
  );
}
