import { useBibleVersion } from "@/hooks/useBibleVersion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { BiblePlaylist } from "@/types/bible";

const EMPTY: BiblePlaylist[] = [];
export function useBiblePlaylists() {
  const { version } = useBibleVersion();
  const [playlists, setPlaylists] = useLocalStorage<BiblePlaylist[]>(`cantos:bible:playlists:${version}`, EMPTY);
  const save = (playlist: BiblePlaylist) => setPlaylists((current) => current.some((item) => item.id === playlist.id)
    ? current.map((item) => item.id === playlist.id ? playlist : item) : [...current, playlist]);
  const remove = (id: string) => setPlaylists((current) => current.filter((item) => item.id !== id));
  return { playlists, save, remove };
}
