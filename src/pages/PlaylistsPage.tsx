import { ListMusic, Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { SearchBar } from "@/components/ui/SearchBar";
import { usePlaylists } from "@/hooks/usePlaylists";
import { useSongSearch } from "@/hooks/useSongSearch";
import { getSong } from "@/services/songs";
import type { SongPlaylist } from "@/types/playlist";
import { useAppMode } from "@/hooks/useAppMode";
import BiblePlaylistsPage from "@/pages/BiblePlaylistsPage";

const createId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
const formatDate = (value: number) =>
  new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" }).format(
    value
  );

export default function PlaylistsPage() {
  const { isBible } = useAppMode();
  return isBible ? <BiblePlaylistsPage /> : <SongPlaylistsPage />;
}
function SongPlaylistsPage() {
  const { playlists, save, remove } = usePlaylists();
  const { mode, isSpanish } = useAppMode();
  const [editing, setEditing] = useState<SongPlaylist | null>(null);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState<SongPlaylist | null>(null);
  const results = useSongSearch(search);
  useEffect(() => {
    if (!modalOpen) return;
    const scrollTop = window.scrollY;
    document.body.classList.add("playlist-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollTop}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.classList.remove("playlist-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollTop);
    };
  }, [modalOpen]);

  const openNew = () => {
    setEditing(null);
    setTitle("");
    setSearch("");
    setSelected([]);
  };
  const openEdit = (playlist: SongPlaylist) => {
    setEditing(playlist);
    setTitle(playlist.title);
    setSearch("");
    setSelected(playlist.songNumbers);
  };
  const close = () => {
    setEditing(null);
    setTitle("");
    setSearch("");
    setSelected([]);
    setModalOpen(false);
  };
  const startNew = () => {
    openNew();
    setModalOpen(true);
  };
  const startEdit = (playlist: SongPlaylist) => {
    openEdit(playlist);
    setModalOpen(true);
  };
  const toggle = (numero: number) =>
    setSelected((current) =>
      current.includes(numero) ? current.filter((item) => item !== numero) : [...current, numero]
    );
  const submit = () => {
    const cleanTitle = title.trim();
    if (!cleanTitle || !selected.length) return;
    save({
      id: editing?.id ?? createId(),
      title: cleanTitle,
      songNumbers: selected,
      createdAt: editing?.createdAt ?? Date.now()
    });
    close();
  };
  return (
    <div className="page">
      <header className="page-title playlist-title">
        <div>
          <p className="eyebrow">
            {isSpanish ? "Listas del Himnario Español" : "Organiza tus alabanzas"}
          </p>
          <h1>Mis listas</h1>
          <p>Crea colecciones para cultos, reuniones o momentos especiales.</p>
        </div>
        <button className="add-list-button" onClick={startNew}>
          <Plus />
          Nueva lista
        </button>
      </header>
      {playlists.length ? (
        <div className="playlists">
          {playlists.map((playlist) => (
            <article key={playlist.id}>
              <header>
                <div>
                  <ListMusic />
                  <span>
                    <h2>{playlist.title}</h2>
                    <small>
                      {playlist.songNumbers.length}{" "}
                      {playlist.songNumbers.length === 1 ? "canto" : "cantos"} · Creada el{" "}
                      {formatDate(playlist.createdAt)}
                    </small>
                  </span>
                </div>
                <button onClick={() => startEdit(playlist)} aria-label={`Editar ${playlist.title}`}>
                  <Pencil />
                </button>
                <button
                  className="delete-list"
                  onClick={() => setDeleting(playlist)}
                  aria-label={`Eliminar lista ${playlist.title}`}
                >
                  <Trash2 />
                </button>
              </header>
              <ol>
                {playlist.songNumbers.map((numero) => {
                  const song = getSong(numero, mode);
                  return song ? (
                    <li key={numero}>
                      <Link to={`/canto/${numero}`}>
                        <span>{numero}</span>
                        {song.titulo}
                      </Link>
                    </li>
                  ) : null;
                })}
              </ol>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ListMusic}
          title="Aún no tienes listas"
          description="Crea una lista y selecciona los cantos que quieras incluir."
        />
      )}
      {modalOpen && (
        <div
          className="playlist-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="playlist-dialog-title"
        >
          <div className="playlist-panel">
            <header>
              <div>
                <p className="eyebrow">{editing ? "Editar colección" : "Nueva colección"}</p>
              </div>
              <button onClick={close} aria-label="Cerrar">
                <X />
              </button>
            </header>
            <label className="title-field">
              Título de la lista
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ej. Culto del domingo"
                autoFocus
              />
            </label>
            <SearchBar value={search} onChange={setSearch} />
            <p className="selection-count">
              {selected.length}{" "}
              {selected.length === 1 ? "canto seleccionado" : "cantos seleccionados"}
            </p>
            <div className="song-checklist">
              {results.map((song) => (
                <label key={song.numero}>
                  <input
                    type="checkbox"
                    checked={selected.includes(song.numero)}
                    onChange={() => toggle(song.numero)}
                  />
                  <span className="check-number">{song.numero}</span>
                  <span>{song.titulo}</span>
                </label>
              ))}
            </div>
            <footer>
              <button className="cancel-list" onClick={close}>
                Cancelar
              </button>
              <button
                className="save-list"
                onClick={submit}
                disabled={!title.trim() || !selected.length}
              >
                {editing ? "Guardar cambios" : "Agregar lista"}
              </button>
            </footer>
          </div>
        </div>
      )}
      {deleting && (
        <ConfirmDeleteDialog
          itemName={deleting.title}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            remove(deleting.id);
            setDeleting(null);
          }}
        />
      )}
    </div>
  );
}
