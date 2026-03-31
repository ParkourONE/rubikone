"use client";

import { useAdmin } from "@/providers/admin-provider";
import { usePathname } from "next/navigation";

const PAGE_NAMES: Record<string, string> = {
  "/": "Startseite",
  "/konzept": "Konzept",
  "/raumgestaltung": "Raumgestaltung",
  "/koeniz": "Referenz Koeniz",
  "/impulsworkshop": "Impulsworkshop",
  "/ueber-uns": "Ueber uns",
  "/kontakt": "Kontakt",
  "/konfigurator": "Konfigurator",
};

export function AdminToolbar() {
  const { isAdmin, hasChanges, saving, saveContent, logout } = useAdmin();
  const pathname = usePathname();

  if (!isAdmin) return null;

  // Don't show on admin pages
  if (pathname.startsWith("/admin")) return null;

  const pageName = PAGE_NAMES[pathname] || pathname;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gray-900 text-white h-10 flex items-center px-4 text-sm shadow-lg">
      {/* Left: Brand */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="font-semibold">RubikONE Editor</span>
      </div>

      {/* Center: Page name */}
      <div className="flex-1 text-center text-gray-400">{pageName}</div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {hasChanges && (
          <button
            onClick={saveContent}
            disabled={saving}
            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded text-xs font-medium transition-colors"
          >
            {saving ? "Speichert..." : "Speichern & Deployen"}
          </button>
        )}
        <button
          onClick={logout}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs font-medium transition-colors"
        >
          Beenden
        </button>
      </div>
    </div>
  );
}
