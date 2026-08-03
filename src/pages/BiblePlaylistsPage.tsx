import { ListMusic, ListPlus, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BibleFinder } from "@/components/bible/BibleFinder";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDeleteDialog } from "@/components/ui/ConfirmDeleteDialog";
import { bibleReferenceKey } from "@/hooks/useBibleFavorites";
import { useBiblePlaylists } from "@/hooks/useBiblePlaylists";
import { useBibleVersion } from "@/hooks/useBibleVersion";
import { getBibleVerse } from "@/services/bible";
import type { BiblePlaylist, BibleReference } from "@/types/bible";

const createId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
const formatDate = (value: number) =>
  new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" }).format(
    value
  );
export default function BiblePlaylistsPage() {
  const { version } = useBibleVersion();
  const { playlists, save, remove } = useBiblePlaylists();
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<BibleReference[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BiblePlaylist | null>(null);
  const [deleting, setDeleting] = useState<BiblePlaylist | null>(null);
  const addReference = (reference: BibleReference) =>
    setSelected((items) =>
      items.some((item) => bibleReferenceKey(item) === bibleReferenceKey(reference))
        ? items
        : [...items, reference]
    );
  const close = () => {
    setOpen(false);
    setEditing(null);
    setTitle("");
    setSelected([]);
  };
  const startNew = () => {
    setEditing(null);
    setTitle("");
    setSelected([]);
    setOpen(true);
  };
  const startEdit = (playlist: BiblePlaylist) => {
    setEditing(playlist);
    setTitle(playlist.title);
    setSelected(playlist.references);
    setOpen(true);
  };
  const submit = () => {
    if (!title.trim() || !selected.length) return;
    save({
      id: editing?.id ?? createId(),
      title: title.trim(),
      references: selected,
      createdAt: editing?.createdAt ?? Date.now()
    });
    close();
  };
  return (
    <div className="page">
      <header className="page-title playlist-title">
        <div>
          <p className="eyebrow">{version}</p>
          <h1>Temas y prédicas</h1>
          <p>Agrupa cualquier versículo para una enseñanza o predicación.</p>
        </div>
        <button className="add-list-button" onClick={startNew}>
          <Plus />
          Nuevo tema
        </button>
      </header>
      {playlists.length ? (
        <div className="playlists bible-topic-list">
          {playlists.map((list) => (
            <article key={list.id}>
              <header>
                <Link className="playlist-summary" to={`/tema/${list.id}`}>
                  <ListMusic />
                  <span>
                    <h2>{list.title}</h2>
                    <small>
                      {list.references.length} versículos · Creada el {formatDate(list.createdAt)}
                    </small>
                  </span>
                </Link>
                <button
                  className="add-verses-list"
                  onClick={() => startEdit(list)}
                  aria-label={`Agregar versículos a ${list.title}`}
                  title="Agregar versículos"
                >
                  <ListPlus />
                </button>
                <button
                  className="delete-list"
                  onClick={() => setDeleting(list)}
                  aria-label={`Eliminar ${list.title}`}
                >
                  <Trash2 />
                </button>
              </header>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={ListMusic}
          title="Aún no tienes temas"
          description="Crea un tema y selecciona los versículos que quieras incluir."
        />
      )}
      {open && (
        <div
          className="playlist-modal centered-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bible-list-title"
        >
          <div className="playlist-panel bible-list-panel">
            <header>
              <div>
                <p className="eyebrow">{editing ? "Editar tema" : "Nuevo tema"}</p>
                <h2 id="bible-list-title">{editing ? editing.title : "Crear colección bíblica"}</h2>
              </div>
              <button onClick={close} aria-label="Cerrar">
                <X />
              </button>
            </header>
            <label className="title-field">
              Título
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ej. Predicación del domingo"
                autoFocus
              />
            </label>
            <p className="selection-count">Busca y selecciona cualquier versículo</p>
            <BibleFinder navigateOnSelect={false} onReference={addReference} />
            <div className="selected-bible-verses">
              {selected.length ? (
                selected.map((ref) => {
                  const verse = getBibleVerse(version, ref.book, ref.chapter, ref.verse);
                  return verse ? (
                    <div key={bibleReferenceKey(ref)}>
                      <span>
                        <strong>{verse.reference}</strong>
                        <small>{verse.text}</small>
                      </span>
                      <button
                        onClick={() =>
                          setSelected((items) =>
                            items.filter(
                              (item) => bibleReferenceKey(item) !== bibleReferenceKey(ref)
                            )
                          )
                        }
                        aria-label={`Quitar ${verse.reference}`}
                      >
                        <X />
                      </button>
                    </div>
                  ) : null;
                })
              ) : (
                <p>Aún no has seleccionado versículos.</p>
              )}
            </div>
            <footer>
              <button className="cancel-list" onClick={close}>
                Cancelar
              </button>
              <button
                className="save-list"
                disabled={!title.trim() || !selected.length}
                onClick={submit}
              >
                {editing ? "Guardar cambios" : "Crear tema"}
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
