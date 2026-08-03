import type { LucideIcon } from "lucide-react";

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return <div className="empty-state"><Icon aria-hidden="true" size={38} /><h2>{title}</h2><p>{description}</p></div>;
}
