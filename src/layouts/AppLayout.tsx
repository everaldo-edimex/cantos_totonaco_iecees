import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileSidebarOverlay } from "@/components/navigation/MobileSidebarOverlay";
import { Sidebar } from "@/components/navigation/Sidebar";
import { UpdatePrompt } from "@/components/ui/UpdatePrompt";
import { InstallPrompt } from "@/components/ui/InstallPrompt";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTheme } from "@/hooks/useTheme";
import { useAccessibility } from "@/hooks/useAccessibility";

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useLocalStorage("cantos:sidebar-collapsed", false);
  const { theme, toggleTheme } = useTheme();
  useAccessibility(true);
  const handleMenu = () =>
    window.matchMedia("(min-width: 1024px)").matches
      ? setCollapsed((value) => !value)
      : setMobileOpen((value) => !value);
  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", close);
    document.body.classList.toggle("menu-open", mobileOpen);
    return () => {
      window.removeEventListener("keydown", close);
      document.body.classList.remove("menu-open");
    };
  }, [mobileOpen]);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const syncViewport = () => {
      document.documentElement.style.setProperty("--visual-viewport-top", `${viewport.offsetTop}px`);
      document.documentElement.style.setProperty("--visual-viewport-height", `${viewport.height}px`);
      document.documentElement.classList.toggle("keyboard-open", viewport.height < window.innerHeight - 120);
    };
    syncViewport();
    viewport.addEventListener("resize", syncViewport);
    viewport.addEventListener("scroll", syncViewport);
    return () => {
      viewport.removeEventListener("resize", syncViewport);
      viewport.removeEventListener("scroll", syncViewport);
      document.documentElement.style.removeProperty("--visual-viewport-top");
      document.documentElement.style.removeProperty("--visual-viewport-height");
      document.documentElement.classList.remove("keyboard-open");
    };
  }, []);
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;
    const start = (event: TouchEvent) => {
      if (window.innerWidth >= 1024 || mobileOpen || event.touches.length !== 1) return;
      const touch = event.touches[0];
      tracking = touch.clientX <= 32;
      startX = touch.clientX;
      startY = touch.clientY;
    };
    const end = (event: TouchEvent) => {
      if (!tracking || event.changedTouches.length !== 1) return;
      const touch = event.changedTouches[0];
      const horizontal = touch.clientX - startX;
      const vertical = Math.abs(touch.clientY - startY);
      if (horizontal >= 64 && horizontal > vertical * 1.25) setMobileOpen(true);
      tracking = false;
    };
    const cancel = () => { tracking = false; };
    window.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchend", end, { passive: true });
    window.addEventListener("touchcancel", cancel, { passive: true });
    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchend", end);
      window.removeEventListener("touchcancel", cancel);
    };
  }, [mobileOpen]);
  return (
    <div className={`app-shell ${collapsed ? "sidebar-is-collapsed" : ""}`}>
      <a className="skip-link" href="#main-content">
        Saltar al contenido
      </a>
      <Header
        onMenu={handleMenu}
        expanded={mobileOpen || !collapsed}
        theme={theme}
        onTheme={toggleTheme}
      />
      <Sidebar open={mobileOpen} collapsed={collapsed} onClose={() => setMobileOpen(false)} />
      <MobileSidebarOverlay open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main id="main-content" className="app-main">
        <Outlet />
      </main>
      <UpdatePrompt />
      <InstallPrompt />
    </div>
  );
}
