import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useAppMode } from "@/hooks/useAppMode";

const EMPTY: number[] = [];

export function useFavorites() {
  const { mode } = useAppMode();
  const key = mode === "totonaku" ? "cantos:favorites" : `cantos:favorites:${mode}`;
  const [stored, setStored] = useLocalStorage<number[]>(key, EMPTY);
  const favorites = Array.isArray(stored) ? stored.filter(Number.isFinite) : EMPTY;
  const isFavorite = (numero: number) => favorites.includes(numero);
  const toggleFavorite = (numero: number) =>
    setStored((current) => {
      const safe = Array.isArray(current) ? current.filter(Number.isFinite) : [];
      return safe.includes(numero) ? safe.filter((item) => item !== numero) : [...safe, numero];
    });
  return { favorites, isFavorite, toggleFavorite };
}
