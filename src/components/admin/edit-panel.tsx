"use client";

import { useAdmin } from "@/providers/admin-provider";
import { FieldEditor } from "./field-editor";

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

  const sectionContent = content[editingSection];

  if (sectionContent === undefined) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-sm"
          onClick={() => setEditingSection(null)}
        />
        {/* Panel */}
        <div className="fixed top-0 right-0 bottom-0 z-[201] w-full max-w-[480px] bg-white shadow-2xl flex flex-col">
          <div className="p-6">
            <p className="text-gray-500">
              Kein Inhalt gefunden fuer &ldquo;{editingSection}&rdquo;.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-sm"
        onClick={() => setEditingSection(null)}
      />

      {/* Slide-over panel */}
      <div className="fixed top-0 right-0 bottom-0 z-[201] w-full max-w-[480px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Bearbeiten
            </p>
            <h2 className="text-lg font-semibold text-gray-900">
              {editingSectionLabel || editingSection}
            </h2>
          </div>
          <button
            onClick={() => setEditingSection(null)}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
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
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body - scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {typeof sectionContent === "object" && sectionContent !== null ? (
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
              label={editingSection}
              value={sectionContent}
              path={editingSection}
              onChange={updateContent}
              depth={0}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={() => setEditingSection(null)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Schliessen
          </button>
          <button
            onClick={saveContent}
            disabled={saving || !hasChanges}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Speichert..." : "Speichern & Deployen"}
          </button>
        </div>
      </div>
    </>
  );
}
