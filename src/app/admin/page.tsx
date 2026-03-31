"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FieldEditor } from "./components/field-editor";
import {
  BlockPreview,
  BLOCK_TYPE_LABELS,
  BLOCK_LIBRARY,
} from "./components/block-preview";

// =============================================================
// Types
// =============================================================

interface BlockDef {
  type: string;
  contentKey: string;
  label?: string;
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
  { id: "kontakt", label: "Kontakt" },
  { id: "ueber-uns", label: "Ueber uns" },
  { id: "allgemein", label: "Allgemein" },
];

// =============================================================
// Sidebar Icon Component
// =============================================================

function BlockIcon({ icon }: { icon: string }) {
  const size = 16;
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "sparkles":
      return <svg {...props}><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/></svg>;
    case "layout":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>;
    case "lightbulb":
      return <svg {...props}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z"/></svg>;
    case "type":
      return <svg {...props}><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>;
    case "play":
      return <svg {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
    case "arrows":
      return <svg {...props}><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>;
    case "sliders":
      return <svg {...props}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>;
    case "columns":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>;
    case "brain":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20"/><path d="M2 12h20"/></svg>;
    case "barchart":
      return <svg {...props}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>;
    case "grid":
      return <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
    case "quote":
      return <svg {...props}><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3z"/></svg>;
    case "user":
      return <svg {...props}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "megaphone":
      return <svg {...props}><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 11-5.8-1.6"/></svg>;
    case "message":
      return <svg {...props}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>;
    case "usercheck":
      return <svg {...props}><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>;
    case "list":
      return <svg {...props}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
    case "rocket":
      return <svg {...props}><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/></svg>;
    case "calendar":
      return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
    case "info":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    case "zap":
      return <svg {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
    case "arrowright":
      return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case "settings":
      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>;
    case "mail":
      return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case "mappin":
      return <svg {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "help":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case "image":
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
    case "tag":
      return <svg {...props}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
    case "shield":
      return <svg {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    case "camera":
      return <svg {...props}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
    case "book":
      return <svg {...props}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>;
    case "tv":
      return <svg {...props}><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>;
    default:
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>;
  }
}

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

  // Sidebar collapsed state
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const addBlock = (afterIndex: number, type: string, contentKey: string, label?: string) => {
    const blocks = [...getPageBlocks()];
    blocks.splice(afterIndex, 0, { type, contentKey, label: label || type });
    updatePageBlocks(blocks);
    setAddMenuIndex(null);
  };

  const addBlockFromSidebar = (type: string, defaultKey: string, label: string) => {
    const blocks = [...getPageBlocks()];
    blocks.push({ type, contentKey: defaultKey, label });
    updatePageBlocks(blocks);
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
        <div className="max-w-[1920px] mx-auto px-4">
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
        <div className="max-w-[1920px] mx-auto px-4 pt-4">
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

      {/* =======================================================
          3-COLUMN LAYOUT: Sidebar | Blocks | Edit Panel
          ======================================================= */}
      <div className="flex pb-24">
        {/* =====================================================
            LEFT SIDEBAR – Block Library (280px)
            ===================================================== */}
        <div
          className={`flex-shrink-0 transition-all duration-300 ${
            sidebarOpen ? "w-[280px]" : "w-12"
          }`}
        >
          <div className="sticky top-[120px] h-[calc(100vh-180px)] bg-white border-r border-gray-200">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute -right-3 top-4 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm"
              title={sidebarOpen ? "Sidebar schliessen" : "Sidebar oeffnen"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {sidebarOpen ? (
                  <polyline points="15 18 9 12 15 6" />
                ) : (
                  <polyline points="9 18 15 12 9 6" />
                )}
              </svg>
            </button>

            {sidebarOpen && (
              <div className="h-full overflow-y-auto p-4">
                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Block-Bibliothek
                </h3>
                <div className="space-y-4">
                  {BLOCK_LIBRARY.map((cat) => (
                    <div key={cat.category}>
                      <h4 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        {cat.category}
                      </h4>
                      <div className="space-y-1">
                        {cat.blocks.map((block) => (
                          <button
                            key={block.type + block.defaultKey}
                            onClick={() =>
                              addBlockFromSidebar(block.type, block.defaultKey, block.label)
                            }
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors group"
                          >
                            <span className="text-gray-400 group-hover:text-gray-600 flex-shrink-0">
                              <BlockIcon icon={block.icon} />
                            </span>
                            <span className="truncate">{block.label}</span>
                            <span className="ml-auto opacity-0 group-hover:opacity-100 text-gray-400 flex-shrink-0">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            CENTER – Block Previews
            ===================================================== */}
        <div className="flex-1 min-w-0">
          {/* Page header */}
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-base font-semibold text-gray-800">
              {currentTab?.label}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {blocks.length} {blocks.length === 1 ? "Block" : "Bloecke"} &middot;
              Hover fuer Block-Aktionen
            </p>
          </div>

          {/* Block list */}
          <div>
            {/* Add block button BEFORE first block */}
            <AddBlockButton
              index={0}
              isOpen={addMenuIndex === 0}
              onToggle={() => setAddMenuIndex(addMenuIndex === 0 ? null : 0)}
              onAdd={(type, key, label) => addBlock(0, type, key, label)}
              menuRef={addMenuIndex === 0 ? addMenuRef : undefined}
            />

            {blocks.map((block, index) => {
              const isHardcoded = block.contentKey?.startsWith("_HARDCODED_");
              const blockContent = isHardcoded ? null : content[block.contentKey];
              const isEditing = editingBlock?.index === index;

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
                          {block.label || BLOCK_TYPE_LABELS[block.type] || block.type}
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

                        {/* Edit button (only for non-hardcoded) */}
                        {!isHardcoded ? (
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
                        ) : (
                          <span className="px-3 py-1 text-xs font-medium text-gray-400 bg-gray-50 rounded flex items-center gap-1">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                            In Code
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Active editing indicator */}
                    {isEditing && (
                      <div className="absolute inset-0 z-10 pointer-events-none border-2 border-blue-500 ring-2 ring-blue-200" />
                    )}

                    {/* Block preview */}
                    <BlockPreview
                      type={block.type}
                      content={blockContent}
                      block={block}
                    />
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
                    onAdd={(type, key, label) => addBlock(index + 1, type, key, label)}
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
                <p className="text-gray-400 text-xs mb-4">
                  Klicken Sie links in der Block-Bibliothek um Bloecke hinzuzufuegen.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =======================================================
          SLIDE-OVER EDIT PANEL (480px)
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
                  {editingBlock.block.label || BLOCK_TYPE_LABELS[editingBlock.block.type] || editingBlock.block.type}
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

            {/* Panel body - scrollable */}
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
        <div className="max-w-[1920px] mx-auto px-4 py-3">
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
// Edit Panel Content - delegates to FieldEditor
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
  onAdd: (type: string, contentKey: string, label?: string) => void;
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
          className="absolute top-full mt-1 z-50 w-72 max-h-96 overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-200 py-2"
        >
          {BLOCK_LIBRARY.map((cat) => (
            <div key={cat.category}>
              <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {cat.category}
              </p>
              {cat.blocks.map((bt) => (
                <button
                  key={bt.type + bt.defaultKey}
                  onClick={() => onAdd(bt.type, bt.defaultKey, bt.label)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center gap-2.5"
                >
                  <span className="text-gray-400 flex-shrink-0">
                    <BlockIcon icon={bt.icon} />
                  </span>
                  <span>{bt.label}</span>
                </button>
              ))}
            </div>
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
