import rawSpanishSongs from "@/data/cantos_espanol.json";
import rawTotonakuSongs from "@/data/cantos_totonaku.json";
import type { Canto } from "@/types/song";
import type { AppMode } from "@/types/preferences";

export const totonakuSongs: Canto[] = [...(rawTotonakuSongs as Canto[])].sort(
  (a: Canto, b: Canto) => a.numero - b.numero
);
export const spanishSongs: Canto[] = [...(rawSpanishSongs as Canto[])].sort(
  (a: Canto, b: Canto) => a.numero - b.numero
);

export const getSongs = (mode: AppMode): Canto[] =>
  mode === "spanish" ? spanishSongs : totonakuSongs;

export const getSong = (numero: number, mode: AppMode) =>
  getSongs(mode).find((song: Canto) => song.numero === numero);
