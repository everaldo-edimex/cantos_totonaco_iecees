import { useState } from "react";
import { SongList } from "@/components/songs/SongList";
import { SearchBar } from "@/components/ui/SearchBar";
import { useFavorites } from "@/hooks/useFavorites";
import { useSongSearch } from "@/hooks/useSongSearch";
import { useAppMode } from "@/hooks/useAppMode";
import BibleSearchPage from "@/pages/BibleSearchPage";

export default function SearchPage() {
  const { isBible } = useAppMode();
  return isBible ? <BibleSearchPage /> : <SongSearchPage />;
}
function SongSearchPage() {
  const [term, setTerm] = useState("");
  const results = useSongSearch(term);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isSpanish } = useAppMode();
  return <div className="page"><header className="page-title"><p className="eyebrow">{isSpanish ? "Himnario Español · Beta" : "Encuentra un canto"}</p><h1>Buscar cantos</h1><p>Escribe el número o una parte del título. La búsqueda ignora mayúsculas y acentos.</p></header><SearchBar value={term} onChange={setTerm} autoFocus /><p className="result-count">{results.length} {results.length === 1 ? "canto" : "cantos"}</p><SongList songs={results} isFavorite={isFavorite} onFavorite={toggleFavorite} emptyMessage="Prueba con otro título o número." /></div>;
}
