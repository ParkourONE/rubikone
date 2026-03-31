"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FieldEditor } from "./components/field-editor";
import {
  BlockPreview,
  BLOCK_TYPE_LABELS,
  AVAILABLE_BLOCK_TYPES,
} from "./components/block-preview";

// =============================================================
// Types
// =============================================================

interface BlockDef {
  type: string;
  contentKey: string;
}

type PageBlocks = Record<string, BlockDef[]>;
type ContentData = Record<string, unknown>;

// =============================================================
// Page tabs (order & labels)
// =============================================================

const PAGE_TABS = [
  { id: "startseite", label: "Startseite" },
  { id: "konzept", label: "Konzept" },
  { id: "raumgestaltung", label: "Raumgestaltung" },
  { id: "koeniz", label: "Koeniz" },
  { id: "impulsworkshop", label: "Impulsworkshop" },
  { id: "preise", label: "Preise & Konfigurator" },
  { id: "faq", label: "FAQ" },
  { id: "ueber-uns", label: "Ueber uns" },
  { id: "allgemein", label: "Allgemein" },
];

// =============================================================
// Main Admin Page
// =============================================================

export default function AdminPage() {
  const [content, setContent] = useState<ContentData | null>(null);
  const [sha, setSha] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>(PAGE_TABS[0].id);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Edit panel state
  const [editingBlock, setEditingBlock] = useState<{
    index: number;
    block: BlockDef;
  } | null>(null);

  // Add-block dropdown state
  const [addMenuIndex, setAddMenuIndex] = useState<number | null>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------------
  // Load content
  // ----------------------------------------------------------

  const loadContent = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/content");
      if (!res.ok) throw new Error("Laden fehlgeschlagen");
      const data = await res.json();
      setContent(data.content);
      setSha(data.sha);
      setHasChanges(false);
    } catch {
      setError(
        "Content konnte nicht geladen werden. Pruefe die GitHub-Konfiguration."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Close add menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        addMenuRef.current &&
        !addMenuRef.current.contains(e.target as Node)
      ) {
        setAddMenuIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ----------------------------------------------------------
  // Content change handler
  // ----------------------------------------------------------

  const handleChange = (path: string, value: unknown) => {
    if (!content) return;
    const newContent = JSON.parse(JSON.stringify(content));
    setNestedValue(newContent, path, value);
    setContent(newContent);
    setHasChanges(true);
    setSuccess("");
  };

  // ----------------------------------------------------------
  // Save
  // ----------------------------------------------------------

  const handleSave = async () => {
    if (!content) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const currentTab = PAGE_TABS.find((p) => p.id === activeTab);
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          sha,
          message: `content: Update ${currentTab?.label || "Inhalte"} via Admin-Panel`,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Speichern fehlgeschlagen");
      }

      const data = await res.json();
      setSha(data.sha);
      setHasChanges(false);
      setSuccess(
        "Gespeichert! Vercel deployed automatisch in ca. 30-60 Sekunden."
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Speichern fehlgeschlagen."
      );
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------------------------
  // Block management helpers
  // ----------------------------------------------------------

  const getPageBlocks = (): BlockDef[] => {
    if (!content) return [];
    const pb = content.PAGE_BLOCKS as PageBlocks | undefined;
    if (!pb || !pb[activeTab]) return [];
    return pb[activeTab];
  };

  const updatePageBlocks = (newBlocks: BlockDef[]) => {
    if (!content) return;
    const newContent = JSON.parse(JSON.stringify(content));
    if (!newContent.PAGE_BLOCKS) newContent.PAGE_BLOCKS = {};
    newContent.PAGE_BLOCKS[activeTab] = newBlocks;
    setContent(newContent);
    setHasChanges(true);
    setSuccess("");
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const blocks = [...getPageBlocks()];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= blocks.length) return;
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    updatePageBlocks(blocks);
    // Update editing state if needed
    if (editingBlock) {
      if (editingBlock.index === index) {
        setEditingBlock({ ...editingBlock, index: target });
      } else if (editingBlock.index === target) {
        setEditingBlock({ ...editingBlock, index: index });
      }
    }
  };

  const duplicateBlock = (index: number) => {
    const blocks = [...getPageBlocks()];
    const clone = JSON.parse(JSON.stringify(blocks[index]));
    blocks.splice(index + 1, 0, clone);
    updatePageBlocks(blocks);
  };

  const deleteBlock = (index: number) => {
    if (!confirm("Block wirklich entfernen?")) return;
    const blocks = getPageBlocks().filter((_, i) => i !== index);
    updatePageBlocks(blocks);
    if (editingBlock?.index === index) {
      setEditingBlock(null);
    }
  };

  const addBlock = (afterIndex: number, type: string, contentKey: string) => {
    const blocks = [...getPageBlocks()];
    blocks.splice(afterIndex, 0, { type, contentKey });
    updatePageBlocks(blocks);
    setAddMenuIndex(null);
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-4">
            Content wird geladen...
          </p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">
            {error || "Content konnte nicht geladen werden."}
          </p>
          <button
            onClick={loadContent}
            className="mt-3 text-sm text-red-700 underline hover:no-underline"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  const blocks = getPageBlocks();
  const currentTab = PAGE_TABS.find((p) => p.id === activeTab);

  return (
    <div className="min-h-screen">
      {/* Tab Navigation - sticky below header */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-0">
            {PAGE_TABS.map((page) => (
              <button
                key={page.id}
                onClick={() => {
                  setActiveTab(page.id);
                  setSuccess("");
                  setEditingBlock(null);
                  setAddMenuIndex(null);
                }}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === page.id
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {page.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Status Messages */}
      {(error || success) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}
        </div>
      )}

      {/* Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <h2 className="text-base font-semibold text-gray-800">
          {currentTab?.label}
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          {blocks.length} {blocks.length === 1 ? "Block" : "Bloecke"} &middot;
          Hover fuer Block-Aktionen
        </p>
      </div>

      {/* =======================================================
          VISUAL BLOCK EDITOR
          ======================================================= */}
      <div className="pb-24">
        {/* Add block button BEFORE first block */}
        <AddBlockButton
          index={0}
          isOpen={addMenuIndex === 0}
          onToggle={() => setAddMenuIndex(addMenuIndex === 0 ? null : 0)}
          onAdd={(type, key) => addBlock(0, type, key)}
          menuRef={addMenuIndex === 0 ? addMenuRef : undefined}
        />

        {blocks.map((block, index) => {
          const blockContent = content[block.contentKey];
          const isEditing =
            editingBlock?.index === index;

          return (
            <div key={`${block.type}-${block.contentKey}-${index}`}>
              {/* Block wrapper */}
              <div className="group relative">
                {/* Hover border overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none border-2 border-transparent group-hover:border-blue-400 group-hover:border-dashed transition-colors" />

                {/* Floating toolbar */}
                <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-2 py-1.5">
                    {/* Label */}
                    <span className="text-xs font-medium text-gray-500 px-2 border-r border-gray-200 mr-1">
                      {BLOCK_TYPE_LABELS[block.type] || block.type}
                    </span>

                    {/* Move up */}
                    <button
                      onClick={() => moveBlock(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-gray-100 transition-colors"
                      title="Nach oben"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                    </button>

                    {/* Move down */}
                    <button
                      onClick={() => moveBlock(index, "down")}
                      disabled={index === blocks.length - 1}
                      className="p-1.5 text-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-gray-100 transition-colors"
                      title="Nach unten"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => duplicateBlock(index)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 rounded hover:bg-gray-100 transition-colors"
                      title="Duplizieren"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteBlock(index)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100 transition-colors"
                      title="Loeschen"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/><path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>

                    {/* Separator */}
                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    {/* Edit */}
                    <button
                      onClick={() =>
                        isEditing
                          ? setEditingBlock(null)
                          : setEditingBlock({ index, block })
                      }
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        isEditing
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {isEditing ? "Schliessen" : "Bearbeiten"}
                    </button>
                  </div>
                </div>

                {/* Active editing indicator */}
                {isEditing && (
                  <div className="absolute inset-0 z-10 pointer-events-none border-2 border-blue-500 ring-2 ring-blue-200" />
                )}

                {/* Block preview */}
                <BlockPreview type={block.type} content={blockContent} />
              </div>

              {/* Add block button AFTER this block */}
              <AddBlockButton
                index={index + 1}
                isOpen={addMenuIndex === index + 1}
                onToggle={() =>
                  setAddMenuIndex(
                    addMenuIndex === index + 1 ? null : index + 1
                  )
                }
                onAdd={(type, key) => addBlock(index + 1, type, key)}
                menuRef={addMenuIndex === index + 1 ? addMenuRef : undefined}
              />
            </div>
          );
        })}

        {blocks.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Keine Bloecke auf dieser Seite.
            </p>
            <AddBlockButton
              index={0}
              isOpen={addMenuIndex === 0}
              onToggle={() => setAddMenuIndex(addMenuIndex === 0 ? null : 0)}
              onAdd={(type, key) => addBlock(0, type, key)}
              menuRef={addMenuIndex === 0 ? addMenuRef : undefined}
            />
          </div>
        )}
      </div>

      {/* =======================================================
          SLIDE-OVER EDIT PANEL
          ======================================================= */}
      {editingBlock && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setEditingBlock(null)}
          />
          {/* Panel */}
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-[480px] bg-white shadow-2xl z-50 flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {BLOCK_TYPE_LABELS[editingBlock.block.type] ||
                    editingBlock.block.type}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editingBlock.block.contentKey}
                </p>
              </div>
              <button
                onClick={() => setEditingBlock(null)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Schliessen
              </button>
            </div>

            {/* Panel body – scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="space-y-4">
                <EditPanelContent
                  contentKey={editingBlock.block.contentKey}
                  content={content[editingBlock.block.contentKey]}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {/* =======================================================
          SAVE BAR
          ======================================================= */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {hasChanges ? (
                <span className="text-amber-600 font-medium">
                  Ungespeicherte Aenderungen
                </span>
              ) : (
                "Keine Aenderungen"
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadContent}
                disabled={saving}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                Verwerfen
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? "Wird gespeichert..." : "Speichern & Deployen"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// Edit Panel Content – delegates to FieldEditor
// =============================================================

function EditPanelContent({
  contentKey,
  content,
  onChange,
}: {
  contentKey: string;
  content: unknown;
  onChange: (path: string, value: unknown) => void;
}) {
  if (content === undefined || content === null) {
    return (
      <p className="text-sm text-gray-400">Kein Content fuer diesen Block.</p>
    );
  }

  if (Array.isArray(content)) {
    return (
      <FieldEditor
        label={contentKey}
        value={content}
        path={contentKey}
        onChange={onChange}
        depth={0}
      />
    );
  }

  if (typeof content === "object") {
    return (
      <>
        {Object.entries(content as Record<string, unknown>).map(
          ([fieldKey, fieldValue]) => (
            <FieldEditor
              key={fieldKey}
              label={fieldKey}
              value={fieldValue}
              path={`${contentKey}.${fieldKey}`}
              onChange={onChange}
              depth={0}
            />
          )
        )}
      </>
    );
  }

  return (
    <FieldEditor
      label={contentKey}
      value={content}
      path={contentKey}
      onChange={onChange}
      depth={0}
    />
  );
}

// =============================================================
// Add Block Button (between blocks)
// =============================================================

function AddBlockButton({
  index,
  isOpen,
  onToggle,
  onAdd,
  menuRef,
}: {
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  onAdd: (type: string, contentKey: string) => void;
  menuRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative flex items-center justify-center py-2 group/add">
      {/* Line */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-transparent group-hover/add:bg-blue-200 transition-colors" />

      {/* + Button */}
      <button
        onClick={onToggle}
        className="relative z-10 w-7 h-7 rounded-full bg-white border-2 border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all opacity-0 group-hover/add:opacity-100 flex items-center justify-center text-lg leading-none"
        title="Block hinzufuegen"
      >
        +
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full mt-1 z-50 w-64 max-h-80 overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-200 py-2"
        >
          <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Block hinzufuegen
          </p>
          {AVAILABLE_BLOCK_TYPES.map((bt) => (
            <button
              key={bt.type + bt.defaultKey}
              onClick={() => onAdd(bt.type, bt.defaultKey)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              {bt.label}
              <span className="block text-[10px] text-gray-400">
                {bt.defaultKey}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================
// Utility: Set nested value by dot-notation path
// =============================================================

function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
) {
  const parts = path.split(/\.|\[(\d+)\]/).filter(Boolean);
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const isIndex = /^\d+$/.test(key);

    if (isIndex) {
      current = (current as unknown as unknown[])[parseInt(key)] as Record<
        string,
        unknown
      >;
    } else {
      current = current[key] as Record<string, unknown>;
    }
  }

  const lastKey = parts[parts.length - 1];
  const isIndex = /^\d+$/.test(lastKey);

  if (isIndex) {
    (current as unknown as unknown[])[parseInt(lastKey)] = value;
  } else {
    current[lastKey] = value;
  }
}
