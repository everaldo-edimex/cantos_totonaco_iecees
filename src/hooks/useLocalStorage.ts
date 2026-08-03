import { useCallback, useEffect, useRef, useState } from "react";
import { storage } from "@/utils/storage";

export function useLocalStorage<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => storage.read(key, fallback));
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    const sync = (event: Event) => {
      if (event instanceof StorageEvent && event.key !== key) return;
      if (event instanceof CustomEvent && event.detail !== key) return;
      setValue(storage.read(key, fallback));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("app-storage", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("app-storage", sync);
    };
  }, [fallback, key]);

  const update = useCallback(
    (next: T | ((current: T) => T)) => {
      const resolved = next instanceof Function ? next(valueRef.current) : next;
      valueRef.current = resolved;
      storage.write(key, resolved);
      setValue(resolved);
    },
    [key]
  );

  return [value, update] as const;
}
