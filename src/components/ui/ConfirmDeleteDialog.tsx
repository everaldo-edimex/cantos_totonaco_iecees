import { AlertTriangle, X } from "lucide-react";
import { useEffect, useRef } from "react";

export function ConfirmDeleteDialog({
  itemName,
  onCancel,
  onConfirm
}: {
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const cancelButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelButton.current?.focus();
    const key = (event: KeyboardEvent) => event.key === "Escape" && onCancel();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onCancel]);
  return (
    <div
      className="playlist-modal centered-modal confirm-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className="confirm-delete-dialog">
        <header>
          <AlertTriangle />
          <div>
            <p className="eyebrow">Confirmar eliminación</p>
            <h2 id="confirm-delete-title">¿Deseas eliminar “{itemName}”?</h2>
          </div>
          <button className="confirm-close" onClick={onCancel} aria-label="Cerrar">
            <X />
          </button>
        </header>
        <p>Esta acción eliminará la lista guardada en este dispositivo.</p>
        <footer>
          <button ref={cancelButton} className="confirm-no" onClick={onCancel}>
            No, conservar
          </button>
          <button className="confirm-yes" onClick={onConfirm}>
            Sí, eliminar
          </button>
        </footer>
      </div>
    </div>
  );
}
