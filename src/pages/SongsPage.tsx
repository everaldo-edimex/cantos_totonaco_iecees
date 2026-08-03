import { useState } from "react";
import { SongList } from "@/components/songs/SongList";
import { SearchBar } from "@/components/ui/SearchBar";
import { useFavorites } from "@/hooks/useFavorites";
import { useSongSearch } from "@/hooks/useSongSearch";
import { useAppMode } from "@/hooks/useAppMode";

export default function SongsPage() {
  const [filter, setFilter] = useState("");
  const filtered = useSongSearch(filter);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isSpanish } = useAppMode();
  return <div className="page"><header className="page-title"><p className="eyebrow">{isSpanish ? "Himnario Español · Beta" : "Himnario completo"}</p><h1>Todos los cantos</h1><p>Explora los cantos ordenados por número.</p></header><SearchBar value={filter} onChange={setFilter} /><p className="result-count">{filtered.length} {filtered.length === 1 ? "canto" : "cantos"}</p><SongList songs={filtered} isFavorite={isFavorite} onFavorite={toggleFavorite} /></div>;
}
