"use client";

import { useState, useRef, useEffect } from "react";
import { useAdmin } from "@/providers/admin-provider";
import { usePathname, useRouter } from "next/navigation";

const PAGE_NAMES: Record<string, string> = {
  "/": "Startseite",
  "/konzept": "Konzept",
  "/raumgestaltung": "Raumgestaltung",
  "/koeniz": "Referenz Koeniz",
  "/impulsworkshop": "Impulsworkshop",
  "/ueber-uns": "Ueber uns",
  "/kontakt": "Kontakt",
  "/konfigurator": "Konfigurator",
  "/datenschutz": "Datenschutz",
  "/impressum": "Impressum",
};

export function AdminSidebar() {
  const {
    isAdmin,
    registeredSections,
    editingSection,
    setEditingSection,
    sidebarOpen,
    setSidebarOpen,
  } = useAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [pageMenuOpen, setPageMenuOpen] = useState(false);
  const pageMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pageMenuRef.current && !pageMenuRef.current.contains(e.target as Node)) {
        setPageMenuOpen(false);
      }
    }
    if (pageMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [pageMenuOpen]);

  if (!isAdmin) return null;
  if (pathname.startsWith("/admin")) return null;

  const pageName = PAGE_NAMES[pathname] || pathname;

  const handleBlockClick = (key: string, label: string) => {
    // Scroll to section
    const el = document.getElementById(`section-${key}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // Open edit panel
    setEditingSection(key, label);
  };

  const handleDelete = (key: string) => {
    if (deleteConfirm === key) {
      // TODO: Implement actual block deletion logic
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(key);
      // Auto-dismiss confirmation after 3 seconds
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className="fixed top-0 left-0 h-full z-[90] bg-white border-r border-[#e5e5e5] flex flex-col transition-transform duration-200 ease-out"
        style={{
          width: 260,
          boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-260px)",
        }}
      >
        {/* Header with page selector */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#e5e5e5]">
          <div className="relative flex-1 min-w-0" ref={pageMenuRef}>
            <button
              onClick={() => setPageMenuOpen(!pageMenuOpen)}
              className="flex items-center gap-2 min-w-0 w-full group/page"
            >
              <div className="w-2 h-2 rounded-full bg-[#00a8ab] flex-shrink-0" />
              <span className="text-[13px] font-semibold text-gray-900 truncate">
                {pageName}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`text-gray-400 flex-shrink-0 transition-transform duration-150 ${pageMenuOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {pageMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg z-10 py-1 max-h-[320px] overflow-y-auto">
                {Object.entries(PAGE_NAMES).map(([path, name]) => (
                  <button
                    key={path}
                    onClick={() => {
                      setPageMenuOpen(false);
                      if (path !== pathname) {
                        router.push(path);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 text-[13px] transition-colors ${
                      path === pathname
                        ? "bg-[#f0fafa] text-[#00a8ab] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-7 h-7 rounded-md hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Sidebar schliessen"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M11 17l-5-5 5-5" />
              <path d="M18 17l-5-5 5-5" />
            </svg>
          </button>
        </div>

        {/* Section label */}
        <div className="px-4 pt-3 pb-1">
          <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
            Bloecke
          </span>
        </div>

        {/* Block list */}
        <div className="flex-1 overflow-y-auto">
          {registeredSections.length === 0 ? (
            <p className="px-4 py-6 text-[12px] text-gray-400 text-center">
              Keine Bloecke auf dieser Seite
            </p>
          ) : (
            registeredSections.map((section) => {
              const isActive = editingSection === section.key;
              return (
                <div
                  key={section.key}
                  className={`group/row flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-100 ${
                    isActive
                      ? "bg-[#f0fafa] border-l-[3px] border-l-[#00a8ab]"
                      : "border-l-[3px] border-l-transparent hover:bg-gray-50"
                  }`}
                  onClick={() => handleBlockClick(section.key, section.label)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Drag handle placeholder */}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      className="text-gray-300 flex-shrink-0 opacity-0 group-hover/row:opacity-100 transition-opacity"
                    >
                      <circle cx="3" cy="2" r="1" fill="currentColor" />
                      <circle cx="7" cy="2" r="1" fill="currentColor" />
                      <circle cx="3" cy="5" r="1" fill="currentColor" />
                      <circle cx="7" cy="5" r="1" fill="currentColor" />
                      <circle cx="3" cy="8" r="1" fill="currentColor" />
                      <circle cx="7" cy="8" r="1" fill="currentColor" />
                    </svg>
                    <span
                      className={`text-[13px] font-medium truncate ${
                        isActive ? "text-[#00a8ab]" : "text-gray-700"
                      }`}
                    >
                      {section.label}
                    </span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(section.key);
                    }}
                    className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-all ${
                      deleteConfirm === section.key
                        ? "bg-red-100 text-red-500 opacity-100"
                        : "opacity-0 group-hover/row:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    }`}
                    aria-label={
                      deleteConfirm === section.key
                        ? "Loeschen bestaetigen"
                        : "Block loeschen"
                    }
                    title={
                      deleteConfirm === section.key
                        ? "Nochmal klicken zum Bestaetigen"
                        : "Block loeschen"
                    }
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Add block button */}
        <div className="p-3 border-t border-[#e5e5e5]">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-100 hover:bg-gray-150 text-gray-600 rounded-lg text-[13px] font-medium transition-colors hover:bg-gray-200">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Block hinzufuegen
          </button>
        </div>
      </aside>

      {/* Toggle button when sidebar is collapsed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-[90] w-9 h-9 bg-white border border-[#e5e5e5] rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Sidebar oeffnen"
          style={{
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-500"
          >
            <path d="M13 17l5-5-5-5" />
            <path d="M6 17l5-5-5-5" />
          </svg>
        </button>
      )}
    </>
  );
}
