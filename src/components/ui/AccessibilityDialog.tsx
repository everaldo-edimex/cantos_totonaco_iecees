import { Brain, Ear, Eye, Hand, RotateCcw, X } from "lucide-react";
import { useState } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";
import type { AccessibilityPreferences, AccessibilityProfile } from "@/types/accessibility";
import { BibleCombobox } from "@/components/bible/BibleCombobox";

const profiles = [
  {
    id: "vision" as const,
    name: "Visual",
    detail: "Baja visión, contraste o percepción de color",
    icon: Eye
  },
  {
    id: "motor" as const,
    name: "Motriz",
    detail: "Movilidad limitada, temblores o control por teclado",
    icon: Hand
  },
  {
    id: "reading" as const,
    name: "Lectura y atención",
    detail: "Dislexia, aprendizaje, memoria o concentración",
    icon: Brain
  },
  { id: "hearing" as const, name: "Auditiva", detail: "Contenido alternativo al sonido", icon: Ear }
];
function Toggle({
  name,
  description,
  checked,
  onChange
}: {
  name: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="a11y-toggle">
      <span>
        <strong>{name}</strong>
        <small>{description}</small>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <i />
    </label>
  );
}
export function AccessibilityDialog({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useState<AccessibilityProfile | null>(null);
  const { preferences, update, activate, reset } = useAccessibility();
  const toggle = (key: keyof AccessibilityPreferences) => (value: boolean) => update(key, value);
  return (
    <div
      className="playlist-modal centered-modal accessibility-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
    >
      <div className="accessibility-dialog">
        <header>
          <div>
            <p className="eyebrow">Personaliza tu experiencia</p>
            <h2 id="accessibility-title">Accesibilidad</h2>
          </div>
          <button onClick={onClose} aria-label="Cerrar">
            <X />
          </button>
        </header>
        {!profile ? (
          <>
            <p className="a11y-intro">
              Selecciona la necesidad que deseas configurar. Puedes regresar y combinar opciones de
              diferentes secciones.
            </p>
            <div className="a11y-profiles">
              {profiles.map((item) => (
                <button
                  key={item.id}
                  className={preferences.activeProfile === item.id ? "active" : ""}
                  onClick={() => setProfile(item.id)}
                >
                  <item.icon />
                  <span>
                    <strong>{item.name}</strong>
                    <small>
                      {item.detail}
                      {preferences.activeProfile === item.id ? " · Activo" : ""}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button className="a11y-back" onClick={() => setProfile(null)}>
              ‹ Todas las opciones
            </button>
            <h3>{profiles.find((item) => item.id === profile)?.name}</h3>
            <div className="a11y-options">
              {profile === "vision" && (
                <>
                  <Toggle
                    name="Alto contraste"
                    description="Aumenta la diferencia entre texto, fondo y controles."
                    checked={preferences.highContrast}
                    onChange={toggle("highContrast")}
                  />
                  <Toggle
                    name="Interfaz grande"
                    description="Amplía textos, menús y controles de toda la aplicación."
                    checked={preferences.largeInterface}
                    onChange={toggle("largeInterface")}
                  />
                  <Toggle
                    name="Subrayar acciones"
                    description="Hace más fáciles de distinguir enlaces y elementos interactivos."
                    checked={preferences.underlineActions}
                    onChange={toggle("underlineActions")}
                  />
                </>
              )}
              {profile === "motor" && (
                <>
                  <Toggle
                    name="Botones grandes"
                    description="Aumenta el área para tocar botones e iconos."
                    checked={preferences.largeTargets}
                    onChange={toggle("largeTargets")}
                  />
                  <Toggle
                    name="Reducir movimiento"
                    description="Elimina animaciones y transiciones innecesarias."
                    checked={preferences.reduceMotion}
                    onChange={toggle("reduceMotion")}
                  />
                  <p className="a11y-note">
                    La aplicación admite Tab, Enter, Escape y flechas para navegar mediante teclado
                    o dispositivos de apoyo.
                  </p>
                </>
              )}
              {profile === "reading" && (
                <>
                  <Toggle
                    name="Mayor espaciado"
                    description="Aumenta el espacio entre letras, palabras y líneas."
                    checked={preferences.textSpacing}
                    onChange={toggle("textSpacing")}
                  />
                  <Toggle
                    name="Fuente de lectura sencilla"
                    description="Usa una tipografía abierta y evita estilos decorativos."
                    checked={preferences.readableFont}
                    onChange={toggle("readableFont")}
                  />
                  <Toggle
                    name="Modo de concentración"
                    description="Oculta elementos secundarios durante la lectura."
                    checked={preferences.focusMode}
                    onChange={toggle("focusMode")}
                  />
                  <Toggle
                    name="Reducir movimiento"
                    description="Evita animaciones que puedan distraer."
                    checked={preferences.reduceMotion}
                    onChange={toggle("reduceMotion")}
                  />
                  <div className="speech-rate speech-rate-combobox">
                    <span>
                      <strong>Velocidad de lectura</strong>
                      <small>Para la función de lectura en voz alta.</small>
                    </span>
                    <BibleCombobox
                      placeholder="Velocidad"
                      value={String(preferences.speechRate)}
                      options={[
                        { value: "0.75", label: "Lenta", detail: "0.75×" },
                        { value: "1", label: "Normal", detail: "1×" },
                        { value: "1.25", label: "Rápida", detail: "1.25×" }
                      ]}
                      onChange={(value) => update("speechRate", Number(value))}
                    />
                  </div>
                </>
              )}
              {profile === "hearing" && (
                <p className="a11y-note">
                  Actualmente los cantos y la Biblia son contenido visual y no dependen del sonido.
                  Cuando se incorporen pistas musicales o videos, tendrán texto alternativo,
                  controles visibles y subtítulos cuando estén disponibles.
                </p>
              )}
            </div>
          </>
        )}
        <footer>
          <button className="a11y-reset" onClick={reset}>
            <RotateCcw />
            Restablecer ajustes
          </button>
          <button
            className="save-list"
            disabled={!profile}
            onClick={() => {
              if (profile) activate(profile);
              onClose();
            }}
          >
            Activar
          </button>
        </footer>
      </div>
    </div>
  );
}
