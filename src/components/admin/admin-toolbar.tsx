"use client";

import { useAdmin } from "@/providers/admin-provider";
import { usePathname } from "next/navigation";
import { EditModeToggle } from "@/components/cms/overlay/EditModeToggle";
import { ResponsivePreviewToggle } from "@/components/cms/overlay/ResponsivePreviewToggle";

const PAGE_NAMES: Record<string, string> = {
  "/": "Startseite",
  "/konzept": "Konzept",
  "/raumgestaltung": "Raumgestaltung",
  "/koeniz": "Referenz Köniz",
  "/impulsworkshop": "Impulsworkshop",
  "/ueber-uns": "Über uns",
  "/kontakt": "Kontakt",
  "/konfigurator": "Konfigurator",
  "/datenschutz": "Datenschutz",
  "/impressum": "Impressum",
};

export function AdminToolbar() {
  const { isAdmin, hasChanges, saving, saveContent, logout } = useAdmin();
  const pathname = usePathname();

  if (!isAdmin) return null;
  if (pathname.startsWith("/admin")) return null;

  const pageName = PAGE_NAMES[pathname] || pathname;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-4 py-2 bg-[#1D1D1F]/90 backdrop-blur-xl text-white rounded-full shadow-2xl text-sm">
      <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
      <span className="text-white/60 font-medium">{pageName}</span>
      <div className="w-px h-4 bg-white/20 mx-1" />
      <EditModeToggle />
      <div className="w-px h-4 bg-white/20 mx-1" />
      <ResponsivePreviewToggle />
      <div className="w-px h-4 bg-white/20 mx-1" />
      {hasChanges && (
        <button
          onClick={saveContent}
          disabled={saving}
          className="px-3 py-1 bg-white/15 hover:bg-white/25 disabled:opacity-50 rounded-full text-xs font-medium transition-colors"
        >
          {saving ? "Speichert..." : "Speichern"}
        </button>
      )}
      <button
        onClick={logout}
        className="px-3 py-1 text-white/50 hover:text-white/80 text-xs font-medium transition-colors"
      >
        Beenden
      </button>
    </div>
  );
}
