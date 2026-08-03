import { BibleFinder } from "@/components/bible/BibleFinder";
import { useBibleVersion } from "@/hooks/useBibleVersion";
import { getBible } from "@/services/bible";
export default function BibleSearchPage() { const { version } = useBibleVersion(); const bible = getBible(version); return <div className="page"><header className="page-title"><p className="eyebrow">{version}</p><h1>Buscar en la Biblia</h1><p>Selecciona primero el libro y después el capítulo y versículo. La navegación es automática.</p></header><BibleFinder /><div className="bible-books"><h2>Libros</h2>{bible.books.map((book) => <a key={book.usfm} href={`/biblia/${book.usfm}/1?versiculo=1`}>{book.name}<small>{book.chapters.length} capítulos</small></a>)}</div></div>; }
