import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { AccessibilityPreferences, AccessibilityProfile } from "@/types/accessibility";

export const defaultAccessibility: AccessibilityPreferences = {
  activeProfile: null,
  highContrast: false,
  largeInterface: false,
  largeTargets: false,
  textSpacing: false,
  readableFont: false,
  reduceMotion: false,
  focusMode: false,
  underlineActions: false,
  speechRate: 1
};
const accessibilityPresets: Record<AccessibilityProfile, Partial<AccessibilityPreferences>> = {
  vision: { highContrast: true, largeInterface: true, underlineActions: true },
  motor: { largeTargets: true, reduceMotion: true },
  reading: {
    textSpacing: true,
    readableFont: true,
    reduceMotion: true,
    focusMode: true,
    speechRate: 1
  },
  hearing: { largeTargets: true, underlineActions: true }
};
export function useAccessibility(apply = false) {
  const [preferences, setPreferences] = useLocalStorage<AccessibilityPreferences>(
    "cantos:accessibility",
    defaultAccessibility
  );
  const safe = { ...defaultAccessibility, ...(preferences ?? {}) };
  useEffect(() => {
    if (!apply) return;
    const root = document.documentElement;
    const classes: [string, boolean][] = [
      ["a11y-contrast", safe.highContrast],
      ["a11y-large", safe.largeInterface],
      ["a11y-targets", safe.largeTargets],
      ["a11y-spacing", safe.textSpacing],
      ["a11y-readable", safe.readableFont],
      ["a11y-reduce-motion", safe.reduceMotion],
      ["a11y-focus", safe.focusMode],
      ["a11y-underline", safe.underlineActions]
    ];
    classes.forEach(([name, active]) => root.classList.toggle(name, active));
    return () => classes.forEach(([name]) => root.classList.remove(name));
  }, [
    apply,
    safe.focusMode,
    safe.highContrast,
    safe.largeInterface,
    safe.largeTargets,
    safe.readableFont,
    safe.reduceMotion,
    safe.textSpacing,
    safe.underlineActions
  ]);
  const update = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => setPreferences((current) => ({ ...defaultAccessibility, ...(current ?? {}), [key]: value }));
  const activate = (profile: AccessibilityProfile) => {
    setPreferences((current) =>
      current?.activeProfile === profile
        ? { ...defaultAccessibility, ...current, activeProfile: profile }
        : { ...defaultAccessibility, ...accessibilityPresets[profile], activeProfile: profile }
    );
  };
  return { preferences: safe, update, activate, reset: () => setPreferences(defaultAccessibility) };
}
