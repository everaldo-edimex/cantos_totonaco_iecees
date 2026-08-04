import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Canto } from "@/types/song";

interface PresentationModeProps {
  song: Canto;
  onClose: () => void;
  channelName?: string;
  useFullscreen?: boolean;
}

export function PresentationMode({ song, onClose, channelName, useFullscreen = true }: PresentationModeProps) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const start = useRef({ x: 0, y: 0 });
  const lastWheel = useRef(0);
  const isTitleSlide = index === 0;
  const verse = isTitleSlide ? undefined : song.versos[index - 1];
  const totalSlides = song.versos.length + 1;
  const channel = useRef<BroadcastChannel | null>(null);
  const currentIndex = useRef(0);
  currentIndex.current = index;

  const close = useCallback(() => {
    channel.current?.postMessage({ type: "close" });
    setLeaving(true);
    window.setTimeout(onClose, 220);
  }, [onClose]);
  const next = useCallback(() => {
    if (index >= totalSlides - 1) close();
    else setIndex((current) => current + 1);
  }, [close, index, totalSlides]);

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    if (useFullscreen) {
      void document.documentElement
        .requestFullscreen?.({ navigationUI: "hide" })
        .catch(() => undefined);
    }
    if ("wakeLock" in navigator) {
      void navigator.wakeLock.request("screen").then((lock) => {
        wakeLock = lock;
      }).catch(() => undefined);
    }
    return () => {
      void wakeLock?.release();
    };
  }, [useFullscreen]);

  useEffect(() => {
    if (!channelName) return;
    channel.current = new BroadcastChannel(channelName);
    channel.current.onmessage = (event: MessageEvent<{ type: string }>) => {
      if (event.data.type === "ready") channel.current?.postMessage({ type: "slide", index: currentIndex.current });
    };
    return () => channel.current?.close();
  }, [channelName]);

  useEffect(() => {
    channel.current?.postMessage({ type: "slide", index });
  }, [index]);


  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "ArrowLeft") close();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [close, next]);

  const finishGesture = (x: number, y: number) => {
    const deltaX = x - start.current.x;
    const deltaY = y - start.current.y;
    if (deltaY < -70 && Math.abs(deltaY) > Math.abs(deltaX)) next();
    else if (deltaY > 70 && Math.abs(deltaY) > Math.abs(deltaX)) close();
    else if (deltaX > 70) next();
    else if (deltaX < -70) close();
  };

  return (
    <div
      className={`presentation ${leaving ? "leaving" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`Presentación de ${song.titulo}`}
      onWheel={(event) => { const now = Date.now(); if (event.deltaY > 40 && now - lastWheel.current > 650) { lastWheel.current = now; next(); } }}
      onTouchStart={(event) => { const touch = event.touches[0]; start.current = { x: touch.clientX, y: touch.clientY }; }}
      onTouchEnd={(event) => { const touch = event.changedTouches[0]; finishGesture(touch.clientX, touch.clientY); }}
    >
      <header><div><small>Canto {song.numero}</small><strong>{song.titulo}</strong></div><button onClick={close} aria-label="Cerrar presentación"><X /></button></header>
      <div className="presentation-progress" aria-label={`Diapositiva ${index + 1} de ${totalSlides}`}><span style={{ width: `${((index + 1) / totalSlides) * 100}%` }} /></div>
      <main key={index} className={`${verse?.tipo ? "is-chorus" : ""} ${isTitleSlide ? "is-title-slide" : ""}`}>
        <span>{isTitleSlide ? `Canto ${song.numero}` : verse?.tipo === "ultimo_coro" ? "Último coro" : verse?.tipo === "coro" ? "Coro" : verse?.orden === undefined ? "Verso" : `Verso ${verse.orden}`}</span>
        {isTitleSlide ? <h1>{song.titulo}</h1> : <p>{verse?.contenido || "Este canto no tiene versos."}</p>}
      </main>
      <footer><span>Desliza a la derecha o hacia arriba para continuar</span><small>{index + 1} / {totalSlides}</small></footer>
    </div>
  );
}
