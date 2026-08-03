import { Heart, House, ListMusic, Music, Search, Settings, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarItem } from "@/components/navigation/SidebarItem";
import { SearchBar } from "@/components/ui/SearchBar";
import { useSongSearch } from "@/hooks/useSongSearch";
import type { Canto } from "@/types/song";
import { useAppMode } from "@/hooks/useAppMode";

const songItems = [
  { to: "/", label: "Inicio", icon: House, end: true },
  { to: "/buscar", label: "Buscar cantos", icon: Search },
  { to: "/cantos", label: "Todos los cantos", icon: Music },
  { to: "/favoritos", label: "Favoritos", icon: Heart },
  { to: "/listas", label: "Mis listas", icon: ListMusic },
  { to: "/configuracion", label: "Configuración", icon: Settings }
];

const bibleItems = [
  { to: "/", label: "Inicio", icon: House, end: true },
  { to: "/buscar", label: "Buscar en la Biblia", icon: Search },
  { to: "/favoritos", label: "Versículos favoritos", icon: Heart },
  { to: "/listas", label: "Temas y prédicas", icon: ListMusic },
  { to: "/configuracion", label: "Configuración", icon: Settings }
];

export function Sidebar({ open, collapsed, onClose }: { open: boolean; collapsed: boolean; onClose: () => void }) {
  const [term, setTerm] = useState("");
  const { mode } = useAppMode();
  const items = mode === "bible" ? bibleItems : songItems;
  const matches = useSongSearch(term).slice(0, 5);
  const navigate = useNavigate();
  const choose = (numero: number) => { setTerm(""); onClose(); navigate(`/canto/${numero}`); };
  return <aside id="main-sidebar" className={`sidebar ${open ? "open" : ""} ${collapsed ? "collapsed" : ""}`} aria-label="Navegación principal"><div className="sidebar-heading"><span>Menú</span><button className="icon-button mobile-close" onClick={onClose} aria-label="Cerrar menú"><X /></button></div><nav>{items.map((item) => <SidebarItem key={item.to} {...item} onSelect={onClose} />)}</nav>{!collapsed && mode !== "bible" && <div className="sidebar-search"><SearchBar value={term} onChange={setTerm} compact />{term && <div className="suggestions">{matches.length ? matches.map((song: Canto) => <button key={song.numero} onClick={() => choose(song.numero)}><span>{song.numero}</span>{song.titulo}</button>) : <p>Sin coincidencias</p>}</div>}</div>}</aside>;
}
