export function MobileSidebarOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <button className={`sidebar-overlay ${open ? "visible" : ""}`} onClick={onClose} aria-label="Cerrar menú" tabIndex={open ? 0 : -1} />;
}
