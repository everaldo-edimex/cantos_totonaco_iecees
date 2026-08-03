import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { Theme } from "@/types/preferences";
import { useAppMode } from "@/hooks/useAppMode";
import { useAccessibility } from "@/hooks/useAccessibility";

export function Header({
  onMenu,
  expanded,
  theme,
  onTheme
}: {
  onMenu: () => void;
  expanded: boolean;
  theme: Theme;
  onTheme: () => void;
}) {
  const { isSpanish, isBible } = useAppMode();
  const { preferences } = useAccessibility();
  const accessibilityName = preferences.activeProfile
    ? { vision: "Visual", motor: "Motriz", reading: "Lectura y atención", hearing: "Auditiva" }[
        preferences.activeProfile
      ]
    : null;
  return (
    <header className="app-header">
      <button
        className="icon-button"
        onClick={onMenu}
        aria-label="Abrir o contraer menú"
        aria-expanded={expanded}
        aria-controls="main-sidebar"
      >
        <Menu />
      </button>
      <div className="brand">
        <img src="/favicon-192.png" alt="" />
        <span className="desktop-brand-text">
          {isBible ? "Santa Biblia" : "Cantos Evangélicos"}{" "}
          <em>{isBible ? "RVR / RVA" : isSpanish ? "Español Beta" : "Totonakú"}</em>
          <small>Cristo Es El Señor</small>
        </span>
        <span className="mobile-brand-text">{isBible ? "Modo Biblia" : isSpanish ? "Cantos Español" : "Cantos Totonakú"}</span>
      </div>
      {accessibilityName && (
        <span className="active-accessibility" title="Perfil de accesibilidad activo">
          <span>Accesibilidad: </span>
          {accessibilityName}
        </span>
      )}
      <ThemeToggle dark={theme === "midnight"} onToggle={onTheme} />
    </header>
  );
}
