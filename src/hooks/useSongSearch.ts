import { useMemo } from "react";
import { getSongs } from "@/services/songs";
import { normalizeText } from "@/utils/text";
import type { Canto } from "@/types/song";
import { useAppMode } from "@/hooks/useAppMode";

export function useSongSearch(term: string) {
  const { mode } = useAppMode();
  const songs = getSongs(mode);
  return useMemo(() => {
    const query = normalizeText(term);
    return query
      ? songs.filter(
          (song: Canto) =>
            normalizeText(song.titulo).includes(query) || song.numero.toString().includes(query)
        )
      : songs;
  }, [songs, term]);
}
