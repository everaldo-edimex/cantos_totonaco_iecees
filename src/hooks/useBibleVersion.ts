import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { BibleVersion } from "@/types/preferences";

export function useBibleVersion() {
  const [stored, setVersion] = useLocalStorage<BibleVersion>("cantos:bible-version", "RVR1960");
  const version: BibleVersion = stored === "RVA2015" ? "RVA2015" : "RVR1960";
  return { version, setVersion };
}
