import { Link } from "react-router-dom";
import { FavoriteButton } from "@/components/songs/FavoriteButton";
import type { Canto } from "@/types/song";

export function SongCard({ song, favorite, onFavorite }: { song: Canto; favorite: boolean; onFavorite: () => void }) {
  return <article className="song-card"><Link to={`/canto/${song.numero}`}><span className="song-number">{song.numero}</span><span className="song-title">{song.titulo}</span><FavoriteButton active={favorite} onToggle={onFavorite} label={song.titulo} /></Link></article>;
}
