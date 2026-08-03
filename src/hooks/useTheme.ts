import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Theme } from "@/types/preferences";

export const themes: { id: Theme; name: string; colors: string[] }[] = [
  { id: "ivory", name: "Luz de Cristo", colors: ["#f8f7f2", "#0b2447", "#d7ad53"] },
  { id: "midnight", name: "Noche de oración", colors: ["#0d1724", "#152438", "#f4d88f"] },
  { id: "pure", name: "Gracia divina", colors: ["#ffffff", "#24364b", "#4f7cac"] },
  { id: "forest", name: "Jardín del Edén", colors: ["#f1f5ef", "#173f35", "#c99b45"] },
  { id: "terracotta", name: "Tierra prometida", colors: ["#fff7f0", "#63372c", "#d47754"] }
];

const preferredTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "midnight" : "ivory";

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>("cantos:theme", preferredTheme());
  const safeTheme: Theme = themes.some((item) => item.id === theme) ? theme : preferredTheme();
  useEffect(() => {
    document.documentElement.dataset.theme = safeTheme;
    document.documentElement.classList.toggle("dark", safeTheme === "midnight");
  }, [safeTheme]);
  return {
    theme: safeTheme,
    setTheme,
    toggleTheme: () => setTheme(safeTheme === "midnight" ? "ivory" : "midnight")
  };
}
