import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { SongPlaylist } from "@/types/playlist";
import { useAppMode } from "@/hooks/useAppMode";

const EMPTY: SongPlaylist[] = [];

export function usePlaylists() {
  const { mode } = useAppMode();
  const key = mode === "totonaku" ? "cantos:playlists" : `cantos:playlists:${mode}`;
  const [stored, setStored] = useLocalStorage<SongPlaylist[]>(key, EMPTY);
  const playlists = Array.isArray(stored) ? stored : EMPTY;
  const save = (playlist: SongPlaylist) =>
    setStored((current) => {
      const safe = Array.isArray(current) ? current : [];
      const exists = safe.some((item) => item.id === playlist.id);
      return exists ? safe.map((item) => (item.id === playlist.id ? playlist : item)) : [...safe, playlist];
    });
  const remove = (id: string) => setStored((current) => (Array.isArray(current) ? current.filter((item) => item.id !== id) : []));
  return { playlists, save, remove };
}
