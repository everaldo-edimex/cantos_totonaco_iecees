import { ArrowLeft, ChevronLeft, ChevronRight, Presentation } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FavoriteButton } from "@/components/songs/FavoriteButton";
import { FontSizeControl } from "@/components/songs/FontSizeControl";
import { SongViewer } from "@/components/songs/SongViewer";
import { PresentationMode } from "@/components/songs/PresentationMode";
import { useFavorites } from "@/hooks/useFavorites";
import { useFontSize } from "@/hooks/useFontSize";
import { getSong, getSongs } from "@/services/songs";
import { storage } from "@/utils/storage";
import type { Canto } from "@/types/song";
import { useAppMode } from "@/hooks/useAppMode";

export default function SongPage() {
  const [presenting, setPresenting] = useState(false);
  const [projectionChannel, setProjectionChannel] = useState<string | undefined>();
  const projectionWindow = useRef<Window | null>(null);
  const { numero } = useParams();
  const { mode } = useAppMode();
  const navigate = useNavigate();
  const songs = getSongs(mode);
  const song = getSong(Number(numero), mode);
  const { isFavorite, toggleFavorite } = useFavorites();
  const font = useFontSize();
  const index = song ? songs.findIndex((item: Canto) => item.numero === song.numero) : -1;
  useEffect(() => {
    if (!song) return;
    const suffix = mode === "totonaku" ? "" : `:${mode}`;
    storage.write(`cantos:last-song${suffix}`, song.numero);
    const recentKey = `cantos:recent-songs${suffix}`;
    const recent = storage.read<number[]>(recentKey, []);
    storage.write(
      recentKey,
      [
        song.numero,
        ...(Array.isArray(recent) ? recent.filter((id) => id !== song.numero) : [])
      ].slice(0, 5)
    );
  }, [mode, song]);
  if (!song)
    return (
      <div className="page not-found">
        <h1>Canto no encontrado</h1>
        <p>El número solicitado no existe en el himnario.</p>
        <Link to="/cantos">Ver todos los cantos</Link>
      </div>
    );
  const previous = songs[index - 1];
  const next = songs[index + 1];
  const startPresentation = async () => {
    if (!window.getScreenDetails || !window.screen.isExtended) {
      setProjectionChannel(undefined);
      setPresenting(true);
      return;
    }
    const popup = window.open(
      "about:blank",
      `cantos-projector-${song.numero}`,
      "popup=yes,width=800,height=600"
    );
    if (!popup) {
      setProjectionChannel(undefined);
      setPresenting(true);
      return;
    }
    try {
      const details = await window.getScreenDetails();
      const target = details.screens.find((screen) => screen !== details.currentScreen);
      if (!target) {
        popup.close();
        setProjectionChannel(undefined);
        setPresenting(true);
        return;
      }
      const channel = `cantos-presentation-${song.numero}-${Date.now()}`;
      popup.moveTo(target.availLeft, target.availTop);
      popup.resizeTo(target.availWidth, target.availHeight);
      const appBase = new URL(import.meta.env.BASE_URL, window.location.origin);
      popup.location.href = `${appBase.href}#/presentar/${song.numero}?channel=${encodeURIComponent(channel)}`;
      popup.focus();
      projectionWindow.current = popup;
      setProjectionChannel(channel);
      setPresenting(true);
    } catch {
      popup.close();
      setProjectionChannel(undefined);
      setPresenting(true);
    }
  };
  const closePresentation = () => {
    projectionWindow.current?.close();
    projectionWindow.current = null;
    setProjectionChannel(undefined);
    setPresenting(false);
    if (document.fullscreenElement) void document.exitFullscreen();
  };
  return (
    <article className="page song-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft />
        Volver
      </button>
      <header className="song-header">
        <div>
          <p className="eyebrow">Canto {song.numero}</p>
          <h1>{song.titulo}</h1>
        </div>
        <FavoriteButton
          active={isFavorite(song.numero)}
          onToggle={() => toggleFavorite(song.numero)}
          label={song.titulo}
        />
      </header>
      <button
        className="presentation-button"
        onClick={() => void startPresentation()}
        disabled={!song.versos.length}
      >
        <Presentation />
        Presentar canto
      </button>
      <div className="reading-tools">
        <span>Tamaño de letra</span>
        <FontSizeControl {...font} />
      </div>
      <SongViewer song={song} fontSize={font.size} />
      <nav className="song-pagination" aria-label="Navegación entre cantos">
        {previous ? (
          <Link to={`/canto/${previous.numero}`}>
            <ChevronLeft />
            <span>
              <small>Anterior</small>
              {previous.titulo}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/canto/${next.numero}`}>
            <span>
              <small>Siguiente</small>
              {next.titulo}
            </span>
            <ChevronRight />
          </Link>
        )}
      </nav>
      {presenting && (
        <PresentationMode
          song={song}
          onClose={closePresentation}
          channelName={projectionChannel}
          useFullscreen={!projectionChannel}
        />
      )}
    </article>
  );
}
