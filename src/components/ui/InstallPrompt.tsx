import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "cantos:install-prompt-dismissed";

function isInstalled() {
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone;
  return iosStandalone === true || window.matchMedia("(display-mode: standalone)").matches;
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    if (isInstalled() || localStorage.getItem(DISMISSED_KEY)) return;

    if (isIos) setVisible(true);

    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    const installed = () => {
      setVisible(false);
      setInstallEvent(null);
      localStorage.removeItem(DISMISSED_KEY);
    };
    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", installed);
    };
  }, [isIos]);

  const close = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
  };

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setVisible(false);
    setInstallEvent(null);
  };

  if (!visible || (!isIos && !installEvent)) return null;

  return (
    <div className="install-overlay" role="dialog" aria-modal="true" aria-labelledby="install-title">
      <section className="install-dialog">
        <button className="install-close" onClick={close} aria-label="Cerrar invitación">
          <X />
        </button>
        <img src={`${import.meta.env.BASE_URL}pwa-192x192.png`} alt="Logo de Cristo Es El Señor" />
        <p className="eyebrow">Llévala contigo</p>
        <h2 id="install-title">Instala Cristo Es El Señor</h2>
        <p>Accede desde la pantalla de inicio y consulta tus cantos y la Biblia incluso sin conexión.</p>
        {isIos ? (
          <div className="ios-install-steps">
            <span><Share /> Pulsa el botón <strong>Compartir</strong> del navegador.</span>
            <span>Después elige <strong>Agregar a pantalla de inicio</strong> y confirma con <strong>Agregar</strong>.</span>
          </div>
        ) : (
          <button className="install-action" onClick={() => void install()}>
            <Download /> Instalar aplicación
          </button>
        )}
        <button className="install-later" onClick={close}>Ahora no</button>
      </section>
    </div>
  );
}
