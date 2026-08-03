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
