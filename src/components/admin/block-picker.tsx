"use client";

/**
 * Block-Picker — admin modal that lists every entry in BLOCK_REGISTRY and,
 * on select, appends a fresh block to `PAGE_BLOCKS[pageKey]` via the editor
 * store's `applyOpToStore` reducer. Insertion is always at the end of the
 * current page's block list (append-only, per locked decision).
 *
 * If `PAGE_BLOCKS` or `PAGE_BLOCKS[pageKey]` doesn't exist yet, the picker
 * dispatches a `set` op to scaffold it first, then the `insert` op.
 */

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { nanoid } from "nanoid";
import { useAdmin } from "@/providers/admin-provider";
import { useEditorStore } from "@/lib/cms/editor-store";
import { BLOCK_REGISTRY, pathnameToPageKey, type BlockDef } from "@/lib/cms/block-registry";

export function BlockPicker() {
  const { isAdmin, pickerOpen, setPickerOpen } = useAdmin();
  const pathname = usePathname() ?? "/";
  const pageKey = pathnameToPageKey(pathname);

  const grouped = useMemo(() => {
    const map = new Map<string, BlockDef[]>();
    for (const def of BLOCK_REGISTRY) {
      const cat = def.category ?? "Allgemein";
      const list = map.get(cat) ?? [];
      list.push(def);
      map.set(cat, list);
    }
    return Array.from(map.entries());
  }, []);

  if (!isAdmin || !pickerOpen) return null;

  function handleSelect(def: BlockDef) {
    const store = useEditorStore.getState();
    const root = store.content as Record<string, unknown> | null;
    if (!root) return;

    const pageBlocks = (root.PAGE_BLOCKS ?? {}) as Record<string, unknown>;
    const list = pageBlocks[pageKey];

    // Ensure PAGE_BLOCKS and PAGE_BLOCKS[pageKey] exist as objects/arrays
    // before the insert op (which requires the target to already be an array).
    if (!root.PAGE_BLOCKS || typeof root.PAGE_BLOCKS !== "object") {
      store.applyOpToStore({ type: "set", path: "PAGE_BLOCKS", value: {} });
    }
    if (!Array.isArray(list)) {
      store.applyOpToStore({
        type: "set",
        path: `PAGE_BLOCKS.${pageKey}`,
        value: [],
      });
    }

    store.applyOpToStore({
      type: "insert",
      path: `PAGE_BLOCKS.${pageKey}`,
      value: {
        type: def.type,
        id: nanoid(),
        content: structuredClone(def.defaultContent),
      },
    });

    setPickerOpen(false);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
        onClick={() => setPickerOpen(false)}
      />

      {/* Centered modal */}
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
                Block hinzufuegen
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Wird am Ende der Seite eingefuegt &middot; Seite:{" "}
                <span className="font-mono">{pageKey}</span>
              </p>
            </div>
            <button
              onClick={() => setPickerOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="Schliessen"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" /><path d="M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body — grouped grid */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {grouped.map(([category, defs]) => (
              <section key={category} className="space-y-2">
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {defs.map((def) => (
                    <button
                      key={def.type}
                      onClick={() => handleSelect(def)}
                      className="text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-[#00a8ab] hover:bg-[#f0fafa] transition-all"
                    >
                      <div className="text-sm font-semibold text-gray-900">
                        {def.label}
                      </div>
                      {def.description && (
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {def.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
            <button
              onClick={() => setPickerOpen(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
