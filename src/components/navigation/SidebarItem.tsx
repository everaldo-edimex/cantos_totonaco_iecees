import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

export function SidebarItem({ to, label, icon: Icon, onSelect, end }: { to: string; label: string; icon: LucideIcon; onSelect: () => void; end?: boolean }) {
  return <NavLink to={to} end={end} onClick={onSelect} title={label} className={({ isActive }) => isActive ? "sidebar-item active" : "sidebar-item"}><Icon aria-hidden="true" /><span>{label}</span></NavLink>;
}
