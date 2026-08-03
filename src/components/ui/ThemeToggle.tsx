import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return <button className="icon-button" onClick={onToggle} aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}>{dark ? <Sun /> : <Moon />}</button>;
}
