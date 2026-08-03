import { ListPlus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useBiblePlaylists } from "@/hooks/useBiblePlaylists";
import { bibleReferenceKey } from "@/hooks/useBibleFavorites";
import type { BibleReference } from "@/types/bible";

const createId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
export function AddVerseToListModal({ reference, label, onClose }: { reference: BibleReference; label: string; onClose: () => void }) {
  const { playlists, save } = useBiblePlaylists();
  const [title, setTitle] = useState("");
  const add = (id: string) => { const list = playlists.find((item) => item.id === id); if (!list) return; const exists = list.references.some((item) => bibleReferenceKey(item) === bibleReferenceKey(reference)); save(exists ? list : { ...list, references: [...list.references, reference] }); onClose(); };
  const create = () => { if (!title.trim()) return; save({ id: createId(), title: title.trim(), references: [reference], createdAt: Date.now() }); onClose(); };
  return <div className="playlist-modal centered-modal" role="dialog" aria-modal="true" aria-label={`Agregar ${label} a una lista`}><div className="verse-list-dialog"><header><div><p className="eyebrow">Agregar a una lista</p><h2>{label}</h2></div><button onClick={onClose} aria-label="Cerrar"><X /></button></header>
    {playlists.length > 0 && <div className="available-bible-lists">{playlists.map((list) => <button key={list.id} onClick={() => add(list.id)}><ListPlus /><span><strong>{list.title}</strong><small>{list.references.length} versículos</small></span></button>)}</div>}
    <div className="quick-create-list"><label className="title-field">O crea una lista nueva<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Nombre de la lista" /></label><button onClick={create} disabled={!title.trim()}><Plus />Crear y agregar</button></div>
  </div></div>;
}
