export const storage = {
  read<T>(key: string, fallback: T): T {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : (JSON.parse(value) as T);
    } catch {
      return fallback;
    }
  },
  write<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new CustomEvent("app-storage", { detail: key }));
    } catch {
      // The app remains usable when storage is unavailable or full.
    }
  }
};
