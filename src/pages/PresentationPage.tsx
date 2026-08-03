import { Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { getSong } from "@/services/songs";
import { useAppMode } from "@/hooks/useAppMode";

export default function PresentationPage() {
  const { numero } = useParams();
  const { mode } = useAppMode();
  const [params] = useSearchParams();
  const song = getSong(Number(numero), mode);
  const [index, setIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(true);
  const channelName = params.get("channel");
  useTheme();

  useEffect(() => {
    if (!channelName) return;
    const channel = new BroadcastChannel(channelName);
    channel.onmessage = (event: MessageEvent<{ type: string; index?: number }>) => {
      if (event.data.type === "slide" && typeof event.data.index === "number") setIndex(event.data.index);
      if (event.data.type === "close") window.close();
    };
    channel.postMessage({ type: "ready" });
    return () => channel.close();
  }, [channelName]);

  if (!song) return <div className="projector-error">Canto no encontrado</div>;
  const isTitle = index === 0;
  const verse = isTitle ? undefined : song.versos[index - 1];
  const total = song.versos.length + 1;
  const enterFullscreen = () => {
    void document.documentElement.requestFullscreen?.({ navigationUI: "hide" }).then(() => setShowFullscreen(false)).catch(() => setShowFullscreen(false));
  };

  return <div className="projector-view"><div className="presentation-progress"><span style={{ width: `${((index + 1) / total) * 100}%` }} /></div><main key={index} className={`${verse?.tipo === "coro" ? "is-chorus" : ""} ${isTitle ? "is-title-slide" : ""}`}><span>{isTitle ? `Canto ${song.numero}` : verse?.tipo === "coro" ? "Coro" : verse?.orden === undefined ? "Verso" : `Verso ${verse.orden}`}</span>{isTitle ? <h1>{song.titulo}</h1> : <p>{verse?.contenido}</p>}</main><footer><span>{song.numero} · {song.titulo}</span><small>{index + 1} / {total}</small></footer>{showFullscreen && <button className="projector-fullscreen" onClick={enterFullscreen}><Maximize2 />Pantalla completa</button>}</div>;
}
