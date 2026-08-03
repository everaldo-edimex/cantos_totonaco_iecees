import { ArrowRight, Clock3, Heart, Music } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SongList } from "@/components/songs/SongList";
import { SearchBar } from "@/components/ui/SearchBar";
import { useFavorites } from "@/hooks/useFavorites";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSongSearch } from "@/hooks/useSongSearch";
import { getSong } from "@/services/songs";
import type { Canto } from "@/types/song";
import { useAppMode } from "@/hooks/useAppMode";
import BibleHomePage from "@/pages/BibleHomePage";

const EMPTY_RECENTS: number[] = [];

export default function HomePage() {
  const { isBible } = useAppMode();
  return isBible ? <BibleHomePage /> : <SongsHomePage />;
}
function SongsHomePage() {
  const [term, setTerm] = useState("");
  const results = useSongSearch(term).slice(0, 6);
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { mode, isSpanish } = useAppMode();
  const suffix = mode === "totonaku" ? "" : `:${mode}`;
  const [last] = useLocalStorage<number | null>(`cantos:last-song${suffix}`, null);
  const [recentIds] = useLocalStorage<number[]>(`cantos:recent-songs${suffix}`, EMPTY_RECENTS);
  const recent = (Array.isArray(recentIds) ? recentIds : []).map((numero) => getSong(numero, mode)).filter((song) => song !== undefined).slice(0, 3);
  const lastSong = last ? getSong(last, mode) : undefined;
  return <div className="page home-page"><section className="welcome"><p className="eyebrow">{isSpanish ? "Himnario Español · Beta" : "Tu himnario, siempre contigo"}</p><h1>Cantos para cada momento</h1><p>Busca y lee tus cantos aun cuando no tengas conexión.</p><SearchBar value={term} onChange={setTerm} />{term && <div className="home-results">{results.map((song: Canto) => <button key={song.numero} onClick={() => navigate(`/canto/${song.numero}`)}><span>{song.numero}</span>{song.titulo}<ArrowRight /></button>)}{!results.length && <p>No encontramos un canto con ese título o número.</p>}</div>}</section><div className="quick-links"><Link to="/cantos"><Music /><span><strong>Todos los cantos</strong><small>Consulta el himnario completo</small></span><ArrowRight /></Link><Link to="/favoritos"><Heart /><span><strong>Favoritos</strong><small>Encuentra tus cantos guardados</small></span><ArrowRight /></Link></div>{lastSong && <section><div className="section-heading"><h2>Último canto abierto</h2></div><Link className="last-song" to={`/canto/${lastSong.numero}`}><Clock3 /><span><small>Canto {lastSong.numero}</small><strong>{lastSong.titulo}</strong></span><ArrowRight /></Link></section>}{recent.length > 0 && <section><div className="section-heading"><h2>Recientes</h2><Link to="/cantos">Ver todos</Link></div><SongList songs={recent} isFavorite={isFavorite} onFavorite={toggleFavorite} /></section>}</div>;
}
