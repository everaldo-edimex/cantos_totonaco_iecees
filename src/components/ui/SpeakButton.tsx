import { CircleStop, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";

export function SpeakButton({
  text,
  label = "Leer en voz alta"
}: {
  text: string;
  label?: string;
}) {
  const [speaking, setSpeaking] = useState(false);
  const { preferences } = useAccessibility();
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const toggle = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-MX";
    utterance.rate = preferences.speechRate;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };
  if (!("speechSynthesis" in window) || preferences.activeProfile !== "reading") return null;
  return (
    <button className={`speak-button ${speaking ? "speaking" : ""}`} onClick={toggle}>
      {speaking ? <CircleStop /> : <Volume2 />}
      {speaking ? "Detener lectura" : label}
    </button>
  );
}
