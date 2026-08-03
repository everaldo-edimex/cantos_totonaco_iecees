import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBible } from "@/services/bible";
import { useBibleVersion } from "@/hooks/useBibleVersion";
import { BibleCombobox } from "@/components/bible/BibleCombobox";
import type { BibleReference } from "@/types/bible";

export function BibleFinder({ initialBook = "", initialChapter, initialVerse, navigateOnSelect = true, onReference }: { initialBook?: string; initialChapter?: number; initialVerse?: number; navigateOnSelect?: boolean; onReference?: (reference: BibleReference) => void }) {
  const { version } = useBibleVersion();
  const bible = getBible(version);
  const navigate = useNavigate();
  const [book, setBook] = useState(initialBook);
  const [chapter, setChapter] = useState(initialChapter ? String(initialChapter) : "");
  const [verse, setVerse] = useState(initialVerse ? String(initialVerse) : "");
  const selectedBook = useMemo(() => bible.books.find((item) => item.usfm === book), [bible.books, book]);
  const selectedChapter = useMemo(() => selectedBook?.chapters.find((item) => item.number === Number(chapter)), [chapter, selectedBook]);

  useEffect(() => {
    setBook(initialBook);
    setChapter(initialChapter ? String(initialChapter) : "");
    setVerse(initialVerse ? String(initialVerse) : "");
  }, [initialBook, initialChapter, initialVerse]);

  const chooseChapter = (value: string) => {
    setChapter(value);
    setVerse("");
    if (navigateOnSelect && book && value) navigate(`/biblia/${book}/${value}?versiculo=1`);
  };
  const chooseVerse = (value: string) => {
    setVerse(value);
    if (book && chapter && value) {
      onReference?.({ book, chapter: Number(chapter), verse: Number(value) });
      if (navigateOnSelect) navigate(`/biblia/${book}/${chapter}?versiculo=${value}`);
    }
  };

  return <div className="bible-finder">
    <BibleCombobox label="Libro" placeholder="Escribe un libro" value={book} options={bible.books.map((item) => ({ value: item.usfm, label: item.name, detail: `${item.chapters.length} capítulos` }))} onChange={(value) => { setBook(value); setChapter(""); setVerse(""); }} />
    <BibleCombobox label="Capítulo" placeholder="Escribe" value={chapter} options={(selectedBook?.chapters ?? []).map((item) => ({ value: String(item.number), label: String(item.number), detail: `${item.verses.length} versículos` }))} disabled={!selectedBook} onChange={chooseChapter} />
    <BibleCombobox label="Versículo" placeholder="Escribe" value={verse} options={(selectedChapter?.verses ?? []).map((item) => ({ value: String(item.verse), label: String(item.verse), detail: item.text.slice(0, 52) }))} disabled={!selectedChapter} onChange={chooseVerse} />
  </div>;
}
