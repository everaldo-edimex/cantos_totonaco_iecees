import { ChorusBlock } from "@/components/songs/ChorusBlock";
import { VerseBlock } from "@/components/songs/VerseBlock";
import type { Canto } from "@/types/song";
import type { FontSize } from "@/types/preferences";

export function SongViewer({ song, fontSize }: { song: Canto; fontSize: FontSize }) {
  if (!song.versos.length) return <p className="no-verses">Este canto aún no tiene letra.</p>;
  return <div className={`song-viewer font-${fontSize}`}>{song.versos.map((verse, index) => verse.tipo ? <ChorusBlock key={index} content={verse.contenido} last={verse.tipo === "ultimo_coro"} /> : <VerseBlock key={index} order={verse.orden} content={verse.contenido} />)}</div>;
}
