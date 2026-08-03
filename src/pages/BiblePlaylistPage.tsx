import { ArrowLeft, Presentation } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BiblePresentation } from "@/components/bible/BiblePresentation";
import { SpeakButton } from "@/components/ui/SpeakButton";
import { useBiblePlaylists } from "@/hooks/useBiblePlaylists";
import { useBibleVersion } from "@/hooks/useBibleVersion";
import { getBibleVerse } from "@/services/bible";

const formatDate = (value: number) =>
  new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", year: "numeric" }).format(
    value
  );
export default function BiblePlaylistPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { version } = useBibleVersion();
  const { playlists } = useBiblePlaylists();
  const [presenting, setPresenting] = useState(false);
  const playlist = playlists.find((item) => item.id === id);
  if (!playlist)
    return (
      <div className="page not-found">
        <h1>Tema no encontrado</h1>
        <Link to="/listas">Volver a temas y prédicas</Link>
      </div>
    );
  const verses = playlist.references
    .map((reference) => getBibleVerse(version, reference.book, reference.chapter, reference.verse))
    .filter((verse) => verse !== undefined);
  return (
    <article className="page bible-playlist-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft />
        Temas y prédicas
      </button>
      <header className="page-title">
        <p className="eyebrow">
          {version} · Creada el {formatDate(playlist.createdAt)}
        </p>
        <h1>{playlist.title}</h1>
        <p>
          {verses.length} {verses.length === 1 ? "versículo" : "versículos"}
        </p>
      </header>
      <button
        className="presentation-button"
        disabled={!verses.length}
        onClick={() => setPresenting(true)}
      >
        <Presentation />
        Presentar tema
      </button>
      <SpeakButton
        text={`${playlist.title}. ${verses.map((verse) => `${verse.reference}. ${verse.text}`).join(" ")}`}
        label="Reproducir audio del tema"
      />
      <div className="bible-topic-verses">
        {verses.map((verse) => (
          <article key={`${verse.bookUsfm}.${verse.chapter}.${verse.verse}`}>
            <Link to={`/biblia/${verse.bookUsfm}/${verse.chapter}?versiculo=${verse.verse}`}>
              {verse.reference}
            </Link>
            {verse.segments.map((segment, index) => (
              <div key={index}>
                {segment.headings.map((heading) => (
                  <h2 key={`${heading.type}-${heading.text}`}>{heading.text}</h2>
                ))}
                <p>{segment.text}</p>
              </div>
            ))}
          </article>
        ))}
      </div>
      {presenting && (
        <BiblePresentation
          title={playlist.title}
          version={version}
          verses={verses}
          onClose={() => setPresenting(false)}
        />
      )}
    </article>
  );
}
