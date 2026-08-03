import { Heart } from "lucide-react";

export function FavoriteButton({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) {
  return <button className={`favorite-button ${active ? "active" : ""}`} onClick={(event) => { event.preventDefault(); event.stopPropagation(); onToggle(); }} aria-label={active ? `Quitar ${label} de favoritos` : `Agregar ${label} a favoritos`} aria-pressed={active}><Heart fill={active ? "currentColor" : "none"} /></button>;
}
