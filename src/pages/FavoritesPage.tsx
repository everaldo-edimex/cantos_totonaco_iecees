import { Heart } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { SongList } from "@/components/songs/SongList";
import { useFavorites } from "@/hooks/useFavorites";
import { getSongs } from "@/services/songs";
import type { Canto } from "@/types/song";
import { useAppMode } from "@/hooks/useAppMode";
import BibleFavoritesPage from "@/pages/BibleFavoritesPage";

export default function FavoritesPage() {
  const { isBible } = useAppMode();
  return isBible ? <BibleFavoritesPage /> : <SongFavoritesPage />;
}
function SongFavoritesPage() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { mode, isSpanish } = useAppMode();
  const songs = getSongs(mode);
  const selected = songs.filter((song: Canto) => favorites.includes(song.numero));
  return <div className="page"><header className="page-title"><p className="eyebrow">{isSpanish ? "Himnario en Español" : "Tu colección"}</p><h1>Favoritos</h1><p>Los cantos que guardes en este modo aparecerán aquí.</p></header>{selected.length ? <SongList songs={selected} isFavorite={isFavorite} onFavorite={toggleFavorite} /> : <EmptyState icon={Heart} title="Aún no hay favoritos" description="Toca el corazón junto a un canto para guardarlo aquí." />}</div>;
}
