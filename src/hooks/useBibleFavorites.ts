import { useBibleVersion } from "@/hooks/useBibleVersion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { BibleReference } from "@/types/bible";

const EMPTY: BibleReference[] = [];
export const bibleReferenceKey = (reference: BibleReference) => `${reference.book}.${reference.chapter}.${reference.verse}`;

export function useBibleFavorites() {
  const { version } = useBibleVersion();
  const [favorites, setFavorites] = useLocalStorage<BibleReference[]>(`cantos:bible:favorites:${version}`, EMPTY);
  const isFavorite = (reference: BibleReference) => favorites.some((item) => bibleReferenceKey(item) === bibleReferenceKey(reference));
  const toggleFavorite = (reference: BibleReference) => setFavorites((current) =>
    isFavorite(reference) ? current.filter((item) => bibleReferenceKey(item) !== bibleReferenceKey(reference)) : [...current, reference]
  );
  return { favorites, isFavorite, toggleFavorite };
}
