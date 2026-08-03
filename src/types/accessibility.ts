export type AccessibilityProfile = "vision" | "motor" | "reading" | "hearing";
export interface AccessibilityPreferences {
  activeProfile: AccessibilityProfile | null;
  highContrast: boolean;
  largeInterface: boolean;
  largeTargets: boolean;
  textSpacing: boolean;
  readableFont: boolean;
  reduceMotion: boolean;
  focusMode: boolean;
  underlineActions: boolean;
  speechRate: number;
}
