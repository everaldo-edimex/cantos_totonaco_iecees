import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BibleVerse } from "@/types/bible";

export function BiblePresentation({ title, version, verses, onClose }: { title: string; version: string; verses: BibleVerse[]; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const start = useRef({ x: 0, y: 0 });
  const lastWheel = useRef(0);
  const total = verses.length + 1;
  const close = useCallback(() => { if (document.fullscreenElement) void document.exitFullscreen(); onClose(); }, [onClose]);
  const next = useCallback(() => index >= total - 1 ? close() : setIndex((value) => value + 1), [close, index, total]);
  useEffect(() => { void document.documentElement.requestFullscreen?.({ navigationUI: "hide" }).catch(() => undefined); }, []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (event.key === "ArrowRight") next(); if (event.key === "ArrowLeft" || event.key === "Escape") close(); };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [close, next]);
  const verse = index ? verses[index - 1] : undefined;
  const gesture = (x: number, y: number) => { const dx = x - start.current.x; const dy = y - start.current.y; if ((dx > 70 && Math.abs(dx) > Math.abs(dy)) || (dy < -70 && Math.abs(dy) > Math.abs(dx))) next(); else if (dx < -70 || dy > 70) close(); };
  return <div className="presentation bible-presentation" role="dialog" aria-modal="true"
    onWheel={(event) => { const now = Date.now(); if (event.deltaY > 40 && now - lastWheel.current > 650) { lastWheel.current = now; next(); } }}
    onTouchStart={(event) => { const touch = event.touches[0]; start.current = { x: touch.clientX, y: touch.clientY }; }}
    onTouchEnd={(event) => { const touch = event.changedTouches[0]; gesture(touch.clientX, touch.clientY); }}>
    <header><div><small>{version}</small><strong>{title}</strong></div><button onClick={close} aria-label="Cerrar presentación"><X /></button></header>
    <div className="presentation-progress"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
    <main key={index} className={!verse ? "is-title-slide" : ""}>
      {!verse ? <><span>Lectura bíblica</span><h1>{title}</h1></> : <>
        <span className="bible-slide-reference">{verse.reference}</span>
        {verse.segments.map((segment, segmentIndex) => <div key={segmentIndex}>{segment.headings.map((heading) => <h2 key={`${heading.type}-${heading.text}`}>{heading.text}</h2>)}<p>{segment.text}</p></div>)}
      </>}
    </main><footer><span>{version}</span><small>{index + 1} / {total}</small></footer>
  </div>;
}
