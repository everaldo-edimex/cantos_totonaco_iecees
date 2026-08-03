import { useRegisterSW } from "virtual:pwa-register/react";

export function UpdatePrompt() {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW();
  if (!needRefresh) return null;
  return <aside className="update-prompt" aria-live="polite"><span>Hay una nueva versión disponible.</span><button onClick={() => void updateServiceWorker(true)}>Actualizar</button><button className="dismiss" onClick={() => setNeedRefresh(false)} aria-label="Cerrar aviso">×</button></aside>;
}
