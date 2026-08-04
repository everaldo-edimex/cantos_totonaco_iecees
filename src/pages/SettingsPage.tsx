import {
  BadgeInfo,
  Accessibility,
  BookOpen,
  Languages,
  Palette,
  PanelLeftClose,
  Type,
  X
} from "lucide-react";
import { useState } from "react";
import { useFontSize } from "@/hooks/useFontSize";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { themes, useTheme } from "@/hooks/useTheme";
import { FontSizeControl } from "@/components/songs/FontSizeControl";
import type { AppMode } from "@/types/preferences";
import { useAppMode } from "@/hooks/useAppMode";
import { useBibleVersion } from "@/hooks/useBibleVersion";
import { AccessibilityDialog } from "@/components/ui/AccessibilityDialog";
import { BibleCombobox } from "@/components/bible/BibleCombobox";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const font = useFontSize();
  const [collapsed, setCollapsed] = useLocalStorage("cantos:sidebar-collapsed", false);
  const { mode, setMode } = useAppMode();
  const [notice, setNotice] = useState<string | null>(null);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const { version: bibleVersion, setVersion: setBibleVersion } = useBibleVersion();
  const chooseMode = (nextMode: AppMode) => {
    if (nextMode === "totonaku") {
      setMode(nextMode);
      setNotice("Modo Totonakú activado.");
      return;
    }
    if (nextMode === "spanish") {
      setMode(nextMode);
      setNotice("Modo Español Beta activado. Tus favoritos y listas se guardan por separado.");
      return;
    }
    setMode("bible");
    setNotice(
      "Modo Biblia activado. Tus favoritos, temas y última lectura se guardan por traducción."
    );
  };
  return (
    <div className="page">
      <header className="page-title">
        <p className="eyebrow">A tu gusto</p>
        <h1>Configuración</h1>
        <p>Tus preferencias se guardan únicamente en este dispositivo.</p>
      </header>
      <div className="settings-list">
        <section className="mode-setting">
          <Languages />
          <div>
            <h2>Modo</h2>
            <p>Selecciona la edición de la app</p>
            <div className="mode-grid">
              <button
                className={mode === "totonaku" ? "selected" : ""}
                onClick={() => chooseMode("totonaku")}
                aria-pressed={mode === "totonaku"}
              >
                <Languages />
                <span>
                  <strong>Totonakú</strong>
                  <small>Disponible ahora</small>
                </span>
              </button>
              <button
                className={mode === "spanish" ? "selected" : ""}
                onClick={() => chooseMode("spanish")}
                aria-pressed={mode === "spanish"}
              >
                <Languages />
                <span>
                  <strong>Español</strong>
                  <small>Beta</small>
                </span>
              </button>
              <button
                className={mode === "bible" ? "selected" : ""}
                onClick={() => chooseMode("bible")}
                aria-pressed={mode === "bible"}
              >
                <BookOpen />
                <span>
                  <strong>Biblia</strong>
                  <small>Disponible ahora</small>
                </span>
              </button>
            </div>
            {mode === "bible" && (
              <div className="bible-version-setting">
                <BibleCombobox
                  label="Traducción bíblica"
                  placeholder="Selecciona una traducción"
                  value={bibleVersion}
                  options={[
                    { value: "RVR1960", label: "Reina Valera 1960", detail: "RVR1960" },
                    { value: "RVA2015", label: "Reina Valera Actualizada 2015", detail: "RVA2015" }
                  ]}
                  onChange={(value) => setBibleVersion(value === "RVA2015" ? "RVA2015" : "RVR1960")}
                />
              </div>
            )}
          </div>
        </section>
        <section className="theme-setting">
          <Palette />
          <div>
            <h2>Paleta de color</h2>
            <p>Elige el ambiente de la aplicación</p>
            <div className="theme-grid">
              {themes.map((option) => (
                <button
                  key={option.id}
                  className={theme === option.id ? "selected" : ""}
                  onClick={() => setTheme(option.id)}
                  aria-pressed={theme === option.id}
                >
                  <span>
                    {option.colors.map((color) => (
                      <i key={color} style={{ backgroundColor: color }} />
                    ))}
                  </span>
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section>
          <Accessibility />
          <div>
            <h2>Accesibilidad</h2>
            <p>Configura la aplicación según tus necesidades.</p>
          </div>
          <button className="text-button" onClick={() => setAccessibilityOpen(true)}>
            Configurar
          </button>
        </section>
        <section>
          <Type />
          <div>
            <h2>Tamaño de lectura</h2>
            <p>Ajusta la letra de los cantos</p>
          </div>
          <FontSizeControl {...font} />
        </section>
        <section className="desktop-setting">
          <PanelLeftClose />
          <div>
            <h2>Menú lateral</h2>
            <p>{collapsed ? "Contraído" : "Expandido"} en escritorio</p>
          </div>
          <button className="text-button" onClick={() => setCollapsed(!collapsed)}>
            Cambiar
          </button>
        </section>
        <section className="devotional-note">
          <BookOpen />
          <div>
            <h2>Una invitación</h2>
            <p>
              Esta aplicación es una ayuda y no sustituye la biblia o el himnario físico. Cuando sea posible, te
              invitamos a usar la biblia o himnario para cantar con mayor atención, apartarte de las
              distracciones digitales y disfrutar un momento más cercano con Dios.
            </p>
          </div>
        </section>
        <section className="version-card">
          <BadgeInfo />
          <div>
            <h2>Versión de la aplicación</h2>
            <p>
              {mode === "bible"
                ? `MCP V1.0`
                : mode === "spanish"
                  ? "Marina V2.0 Beta · Edición Español"
                  : "MCP V1.0 · Edición Totonakú"}
            </p>
          </div>
        </section>
      </div>
      {notice && (
        <aside className="mode-notice" role="status" aria-live="polite">
          <BadgeInfo />
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} aria-label="Cerrar mensaje">
            <X />
          </button>
        </aside>
      )}
      {accessibilityOpen && <AccessibilityDialog onClose={() => setAccessibilityOpen(false)} />}
    </div>
  );
}
