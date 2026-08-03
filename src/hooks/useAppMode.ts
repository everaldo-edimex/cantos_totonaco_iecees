import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { AppMode } from "@/types/preferences";

const ACTIVE_MODES: AppMode[] = ["totonaku", "spanish", "bible"];

export function useAppMode() {
  const [storedMode, setStoredMode] = useLocalStorage<AppMode>("cantos:mode", "totonaku");
  const mode: AppMode = ACTIVE_MODES.includes(storedMode) ? storedMode : "totonaku";
  return {
    mode,
    setMode: (nextMode: AppMode) => {
      if (ACTIVE_MODES.includes(nextMode)) setStoredMode(nextMode);
    },
    isSpanish: mode === "spanish",
    isBible: mode === "bible"
  };
}
