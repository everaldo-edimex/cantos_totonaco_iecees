import { ArrowRight, BookOpen, Clock3, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { BibleFinder } from "@/components/bible/BibleFinder";
import { useBibleVersion } from "@/hooks/useBibleVersion";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getBible } from "@/services/bible";
import type { BibleReference } from "@/types/bible";

export default function BibleHomePage() {
  const { version } = useBibleVersion();
  const bible = getBible(version);
  const [last] = useLocalStorage<BibleReference | null>(`cantos:bible:last:${version}`, null);
  const lastBook = last && bible.books.find((book) => book.usfm === last.book);
  return <div className="page home-page"><section className="welcome bible-welcome"><p className="eyebrow">{bible.metadata.abbreviation}</p><h1>Lee y presenta la Palabra</h1><p>Selecciona el libro, capítulo y versículo. No necesitas conexión.</p><BibleFinder /></section>
    <div className="quick-links"><Link to="/buscar"><BookOpen /><span><strong>Buscar en la Biblia</strong><small>Ve directamente a un pasaje</small></span><ArrowRight /></Link><Link to="/favoritos"><Heart /><span><strong>Versículos favoritos</strong><small>Consulta lo que has guardado</small></span><ArrowRight /></Link></div>
    {last && lastBook && <section><div className="section-heading"><h2>Continuar leyendo</h2></div><Link className="last-song" to={`/biblia/${last.book}/${last.chapter}?versiculo=${last.verse}`}><Clock3 /><span><small>{version}</small><strong>{lastBook.name} {last.chapter}:{last.verse}</strong></span><ArrowRight /></Link></section>}
    <section className="bible-info"><BookOpen /><div><h2>{bible.metadata.title}</h2><p><strong>{bible.metadata.abbreviation}</strong> · {bible.metadata.language}</p><p>Publicada por {bible.metadata.publisher}</p><small>{bible.metadata.copyright}</small></div></section>
  </div>;
}
