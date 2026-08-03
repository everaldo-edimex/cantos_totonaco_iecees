import { Search, X } from "lucide-react";
import type { ChangeEvent } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
  compact?: boolean;
}

export function SearchBar({ value, onChange, autoFocus, compact }: SearchBarProps) {
  return (
    <div className="search-wrap">
      <Search aria-hidden="true" size={20} />
      <label className="sr-only" htmlFor={compact ? "sidebar-search" : "song-search"}>Buscar por título o número</label>
      <input
        id={compact ? "sidebar-search" : "song-search"}
        type="search"
        value={value}
        autoFocus={autoFocus}
        placeholder="Buscar por título o número…"
        autoComplete="off"
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      />
      {value && <button className="icon-button small" onClick={() => onChange("")} aria-label="Limpiar búsqueda"><X size={18} /></button>}
    </div>
  );
}
