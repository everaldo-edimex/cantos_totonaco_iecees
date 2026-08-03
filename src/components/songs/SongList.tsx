import { Music } from "lucide-react";
import { SongCard } from "@/components/songs/SongCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Canto } from "@/types/song";

export function SongList({ songs, isFavorite, onFavorite, emptyMessage = "No hay cantos para mostrar." }: { songs: Canto[]; isFavorite: (numero: number) => boolean; onFavorite: (numero: number) => void; emptyMessage?: string }) {
  if (!songs.length) return <EmptyState icon={Music} title="Sin resultados" description={emptyMessage} />;
  return <div className="song-list">{songs.map((song) => <SongCard key={song.numero} song={song} favorite={isFavorite(song.numero)} onFavorite={() => onFavorite(song.numero)} />)}</div>;
}
