import {
  ArrowLeft,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Heart,
  ListPlus,
  Presentation
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { BiblePresentation } from "@/components/bible/BiblePresentation";
import { BibleFinder } from "@/components/bible/BibleFinder";
import { AddVerseToListModal } from "@/components/bible/AddVerseToListModal";
import { SpeakButton } from "@/components/ui/SpeakButton";
import type { BibleVerse } from "@/types/bible";
import { FontSizeControl } from "@/components/songs/FontSizeControl";
import { useBibleFavorites } from "@/hooks/useBibleFavorites";
import { useBibleVersion } from "@/hooks/useBibleVersion";
import { useFontSize } from "@/hooks/useFontSize";
import { getBibleBook, getBibleChapter } from "@/services/bible";
import { storage } from "@/utils/storage";

export default function BibleReaderPage() {
  const { book = "", chapter = "1" } = useParams();
  const [params] = useSearchParams();
  const targetVerse = Math.max(1, Number(params.get("versiculo")) || 1);
  const chapterNumber = Number(chapter);
  const { version } = useBibleVersion();
  const bibleBook = getBibleBook(version, book);
  const bibleChapter = getBibleChapter(version, book, chapterNumber);
  const [visible, setVisible] = useState(10);
  const [presenting, setPresenting] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [listVerse, setListVerse] = useState<BibleVerse | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const font = useFontSize();
  const { isFavorite, toggleFavorite } = useBibleFavorites();
  useEffect(() => {
    setVisible(Math.max(10, Math.ceil(targetVerse / 10) * 10));
  }, [book, chapterNumber, targetVerse]);
  useEffect(() => {
    if (!bibleChapter) return;
    storage.write(`cantos:bible:last:${version}`, {
      book: book.toUpperCase(),
      chapter: chapterNumber,
      verse: targetVerse
    });
    window.setTimeout(
      () =>
        document
          .getElementById(`versiculo-${targetVerse}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      80
    );
  }, [bibleChapter, book, chapterNumber, targetVerse, version]);
  useEffect(() => {
    const update = () => setShowScrollTop(window.scrollY > 900);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    const element = sentinel.current;
    if (!element || !bibleChapter) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting)
          setVisible((value) => Math.min(value + 10, bibleChapter.verses.length));
      },
      { rootMargin: "240px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [bibleChapter]);
  if (!bibleBook || !bibleChapter)
    return (
      <div className="page not-found">
        <h1>Pasaje no encontrado</h1>
        <Link to="/buscar">Buscar otro pasaje</Link>
      </div>
    );
  const chapterIndex = bibleBook.chapters.findIndex((item) => item.number === chapterNumber);
  const previous = bibleBook.chapters[chapterIndex - 1];
  const next = bibleBook.chapters[chapterIndex + 1];
  return (
    <article className="page bible-reader">
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft />
        Volver
      </button>
      <header className="bible-reader-header">
        <div>
          <p className="eyebrow">{version}</p>
          <h1>
            {bibleBook.name} {chapterNumber}
          </h1>
        </div>
      </header>
      <div className="bible-reader-finder">
        <BibleFinder
          initialBook={bibleBook.usfm}
          initialChapter={chapterNumber}
          initialVerse={targetVerse}
        />
      </div>
      <button className="presentation-button" onClick={() => setPresenting(true)}>
        <Presentation />
        Presentar capítulo
      </button>
      <SpeakButton
        text={`${bibleBook.name}, capítulo ${chapterNumber}. ${bibleChapter.verses.map((verse) => `Versículo ${verse.verse}. ${verse.text}`).join(" ")}`}
        label="Reproducir audio del capítulo"
      />
      <div className="reading-tools">
        <span>Tamaño de letra</span>
        <FontSizeControl {...font} />
      </div>
      <div className={`bible-verses font-${font.size}`}>
        {bibleChapter.verses.slice(0, visible).map((verse) => {
          const reference = { book: verse.bookUsfm, chapter: verse.chapter, verse: verse.verse };
          return (
            <article
              key={verse.verse}
              id={`versiculo-${verse.verse}`}
              className={verse.verse === targetVerse ? "target" : ""}
            >
              <div className="bible-verse-tools">
                <span>{verse.reference}</span>
                <button
                  className={isFavorite(reference) ? "active" : ""}
                  onClick={() => toggleFavorite(reference)}
                  aria-label={`Guardar ${verse.reference} como favorito`}
                >
                  <Heart fill={isFavorite(reference) ? "currentColor" : "none"} />
                </button>
                <button
                  onClick={() => setListVerse(verse)}
                  aria-label={`Agregar ${verse.reference} a una lista`}
                >
                  <ListPlus />
                </button>
              </div>
              {verse.segments.map((segment, index) => (
                <div key={index}>
                  {segment.headings.map((heading) => (
                    <h2 key={`${heading.type}-${heading.text}`}>{heading.text}</h2>
                  ))}
                  <p>
                    <sup>{index === 0 ? verse.verse : ""}</sup>
                    {segment.text}
                  </p>
                </div>
              ))}
            </article>
          );
        })}
      </div>
      <div ref={sentinel} className="bible-sentinel">
        {visible < bibleChapter.verses.length ? "Cargando más versículos…" : "Fin del capítulo"}
      </div>
      <nav className="song-pagination">
        {previous ? (
          <Link to={`/biblia/${book}/${previous.number}?versiculo=1`}>
            <ChevronLeft />
            <span>
              <small>Capítulo anterior</small>
              {bibleBook.name} {previous.number}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/biblia/${book}/${next.number}?versiculo=1`}>
            <span>
              <small>Capítulo siguiente</small>
              {bibleBook.name} {next.number}
            </span>
            <ChevronRight />
          </Link>
        )}
      </nav>
      {presenting && (
        <BiblePresentation
          title={`${bibleBook.name} ${chapterNumber}`}
          version={version}
          verses={bibleChapter.verses}
          onClose={() => setPresenting(false)}
        />
      )}
      {listVerse && (
        <AddVerseToListModal
          reference={{
            book: listVerse.bookUsfm,
            chapter: listVerse.chapter,
            verse: listVerse.verse
          }}
          label={listVerse.reference}
          onClose={() => setListVerse(null)}
        />
      )}
      {showScrollTop && (
        <button
          className="bible-scroll-top"
          onClick={() =>
            document
              .getElementById("versiculo-1")
              ?.scrollIntoView({ behavior: "smooth", block: "center" })
          }
          aria-label="Regresar al versículo 1"
        >
          <ArrowUp />
          <span>Versículo 1</span>
        </button>
      )}
    </article>
  );
}
