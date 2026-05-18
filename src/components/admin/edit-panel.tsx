"use client";

import { useAdmin } from "@/providers/admin-provider";
import { FieldEditor } from "./field-editor";
import { getAt } from "@/lib/content-path";

export function EditPanel() {
  const {
    isAdmin,
    content,
    editingSection,
    editingSectionLabel,
    setEditingSection,
    updateContent,
    saveContent,
    saving,
    hasChanges,
  } = useAdmin();

  if (!isAdmin || !editingSection || !content) return null;

  // editingSection may be either a top-level key (legacy hardcoded sections
  // like "HERO_CONTENT") or a dotted nested path (dynamic blocks like
  // "PAGE_BLOCKS.home.0.content"). getAt handles both — top-level keys parse
  // to a single segment.
  const sectionContent = getAt(content, editingSection);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
        onClick={() => setEditingSection(null)}
      />

      {/* Centered Apple Sheet Card */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{
            maxHeight: "min(85vh, 800px)",
            animation: "sheetIn 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingSectionLabel || editingSection}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Block bearbeiten
              </p>
            </div>
            <button
              onClick={() => setEditingSection(null)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Schliessen"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" /><path d="M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body - scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {sectionContent === undefined ? (
              <p className="text-gray-400 text-sm text-center py-8">
                Kein Inhalt gefunden für &ldquo;{editingSection}&rdquo;.
              </p>
            ) : typeof sectionContent === "object" && sectionContent !== null && !Array.isArray(sectionContent) ? (
              Object.entries(sectionContent).map(([key, val]) => (
                <FieldEditor
                  key={key}
                  label={key}
                  value={val}
                  path={`${editingSection}.${key}`}
                  onChange={updateContent}
                  depth={0}
                />
              ))
            ) : (
              <FieldEditor
                label={editingSectionLabel || editingSection}
                value={sectionContent}
                path={editingSection}
                onChange={updateContent}
                depth={0}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
            <button
              onClick={() => setEditingSection(null)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={async () => {
                await saveContent();
                setEditingSection(null);
              }}
              disabled={saving || !hasChanges}
              className="px-5 py-2.5 bg-[#1D1D1F] text-white text-sm font-medium rounded-xl hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {saving ? "Speichert..." : "Speichern & Deployen"}
            </button>
          </div>
        </div>
      </div>

      {/* Animation keyframe */}
      <style jsx global>{`
        @keyframes sheetIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
