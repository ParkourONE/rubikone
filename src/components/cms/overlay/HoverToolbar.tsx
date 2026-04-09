"use client";

/**
 * HoverToolbar — EDIT-01, EDIT-09, EDIT-10, EDIT-11, EDIT-08.
 *
 * Floating action bar pinned above the currently selected editable element.
 * Reads `selectedPath` from SelectionContext, resolves it to a FieldSpec via
 * `resolvePathToField`, and exposes:
 *   - Edit (kind-aware: text focuses the InlineText; other kinds open a
 *     popover editor anchored to the selection)
 *   - Duplicate (array items only)
 *   - Move Up / Move Down (array items only)
 *   - Delete (gated by FieldSpec.required; list items allowed)
 *   - List-only: insert above / insert below
 */

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Pencil,
  Copy,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { useEditMode, useSelection } from "@/components/cms/edit-mode-context";
import { useEditorStore } from "@/lib/cms/editor-store";
import { resolvePathToField, type ResolvedField } from "@/lib/cms/path-to-field";
import { parsePath } from "@/lib/content-path";
import { getInlineEditorDispatcher } from "@/components/cms/inline-editors/editor-dispatch";
import { queryVisibleEditPath } from "@/components/cms/overlay/HoverOverlay";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function rectOf(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

function getLastIndex(path: string): number | null {
  const parts = parsePath(path);
  const last = parts[parts.length - 1];
  return typeof last === "number" ? last : null;
}

function getParentArrayPath(path: string): string | null {
  const parts = parsePath(path);
  if (parts.length === 0) return null;
  if (typeof parts[parts.length - 1] !== "number") return null;
  return toPathString(parts.slice(0, -1));
}

function toPathString(parts: ReturnType<typeof parsePath>): string {
  let out = "";
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (typeof p === "number") {
      out += `[${p}]`;
    } else {
      if (i > 0) out += ".";
      out += p;
    }
  }
  return out;
}

function defaultForField(kind: string): unknown {
  switch (kind) {
    case "text":
    case "richtext":
      return "";
    case "image":
      return "";
    case "button":
    case "link":
      return { label: "", href: "" };
    case "icon":
      return "HelpCircle";
    default:
      return "";
  }
}

function cloneItemDefault(resolved: ResolvedField): Record<string, unknown> {
  const item: Record<string, unknown> = {};
  if (resolved.parentList?.itemFields) {
    for (const f of resolved.parentList.itemFields) {
      if (!f.path) continue;
      item[f.path] = defaultForField(f.kind);
    }
  }
  return item;
}

export function HoverToolbar() {
  const { editMode } = useEditMode();
  const { selectedPath, setSelectedPath } = useSelection();
  const [rect, setRect] = useState<Rect | null>(null);
  const applyOpToStore = useEditorStore((s) => s.applyOpToStore);
  const content = useEditorStore((s) => s.content);

  useEffect(() => {
    if (!editMode || !selectedPath) {
      setRect(null);
      return;
    }
    function measure() {
      const el = queryVisibleEditPath(selectedPath!);
      if (!el) {
        setRect(null);
        return;
      }
      setRect(rectOf(el));
    }
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    const mo = new MutationObserver(measure);
    mo.observe(document.body, { subtree: true, childList: true, attributes: true });
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
      mo.disconnect();
    };
  }, [editMode, selectedPath, content]);

  const resolved = useMemo<ResolvedField | null>(() => {
    if (!selectedPath) return null;
    return resolvePathToField(selectedPath);
  }, [selectedPath]);

  if (!editMode || !selectedPath || !rect || typeof document === "undefined") {
    return null;
  }

  const lastIdx = getLastIndex(selectedPath);
  const parentArrayPath = getParentArrayPath(selectedPath);
  const parentArray = parentArrayPath
    ? (readAtPath(content, parentArrayPath) as unknown[] | undefined)
    : lastIdx !== null
      ? (readAtPath(content, parsePath(selectedPath).slice(0, -1).join(".")) as unknown[] | undefined)
      : undefined;
  const isArrayItem = lastIdx !== null && Array.isArray(parentArray);
  const canMoveUp = isArrayItem && lastIdx! > 0;
  const canMoveDown =
    isArrayItem && parentArray ? lastIdx! < parentArray.length - 1 : false;
  const fieldRequired = resolved?.field?.required === true && !resolved?.insideList;
  const canDelete = isArrayItem || !fieldRequired;

  // Compute anchor position: above the selected rect, clamped to viewport.
  const toolbarTop = Math.max(8, rect.top - 44);
  const toolbarLeft = Math.max(
    8,
    Math.min(window.innerWidth - 320, rect.left)
  );

  const onEdit = () => {
    if (!resolved) return;
    const kind = resolved.field.kind;
    if (kind === "text" || kind === "richtext") {
      // Focus the underlying contenteditable / text node.
      const el = queryVisibleEditPath(selectedPath);
      if (el) {
        el.setAttribute("contenteditable", "plaintext-only");
        el.focus();
        // select-all
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
      return;
    }
    // Dispatch to kind-specific popover editor.
    getInlineEditorDispatcher()?.(kind, selectedPath, rect);
  };

  const onDuplicate = () => {
    if (!isArrayItem) return;
    applyOpToStore({ type: "duplicate", path: selectedPath });
    // Move selection to the new item (inserted at lastIdx+1).
    const parts = parsePath(selectedPath);
    parts[parts.length - 1] = (lastIdx as number) + 1;
    setSelectedPath(toPathString(parts));
  };

  const onMove = (delta: -1 | 1) => {
    if (!isArrayItem) return;
    const toIndex = (lastIdx as number) + delta;
    if (toIndex < 0) return;
    if (parentArray && toIndex >= parentArray.length) return;
    applyOpToStore({ type: "move", path: selectedPath, toIndex });
    const parts = parsePath(selectedPath);
    parts[parts.length - 1] = toIndex;
    setSelectedPath(toPathString(parts));
  };

  const resetDefault =
    resolved && !resolved.insideList
      ? resolved.field.default
      : resolved?.field.default;
  const canReset =
    resolved !== null && resetDefault !== undefined && !isArrayItem;

  const onReset = () => {
    if (!canReset || !resolved) return;
    applyOpToStore({
      type: "set",
      path: selectedPath,
      value: resetDefault,
    });
    toast.success("Reset to default");
  };

  const onDelete = () => {
    if (!canDelete) return;
    applyOpToStore({ type: "delete", path: selectedPath });
    setSelectedPath(null);
  };

  const onInsertItem = (position: "above" | "below") => {
    if (!resolved || !resolved.parentList || !resolved.listPath || lastIdx === null) {
      return;
    }
    const blockId = resolved.blockId;
    const listAbs =
      resolved.listPath === ""
        ? blockId
        : `${blockId}.${resolved.listPath}`;
    const insertIndex = position === "above" ? lastIdx : lastIdx + 1;
    const item = cloneItemDefault(resolved);
    applyOpToStore({
      type: "insert",
      path: listAbs,
      value: item,
      index: insertIndex,
    });
  };

  const btnBase =
    "h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";

  return createPortal(
    <div
      data-cms-overlay="toolbar"
      style={{
        position: "fixed",
        top: toolbarTop,
        left: toolbarLeft,
        zIndex: 2147483001,
        pointerEvents: "auto",
      }}
      className="flex items-center gap-0.5 rounded-lg bg-[#1D1D1F] text-white shadow-2xl px-1 py-1 text-sm"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className={btnBase}
        title="Bearbeiten"
        onClick={onEdit}
      >
        <Pencil size={14} />
      </button>
      {isArrayItem && (
        <>
          <button
            type="button"
            className={btnBase}
            title="Duplizieren"
            onClick={onDuplicate}
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            className={btnBase}
            title="Nach oben"
            disabled={!canMoveUp}
            onClick={() => onMove(-1)}
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            className={btnBase}
            title="Nach unten"
            disabled={!canMoveDown}
            onClick={() => onMove(1)}
          >
            <ChevronDown size={14} />
          </button>
          {resolved?.insideList && (
            <>
              <button
                type="button"
                className={btnBase}
                title="Neu oberhalb"
                onClick={() => onInsertItem("above")}
              >
                <Plus size={14} />
              </button>
            </>
          )}
        </>
      )}
      {canReset && (
        <button
          type="button"
          className={btnBase}
          title="Reset to default"
          onClick={onReset}
        >
          <RotateCcw size={14} />
        </button>
      )}
      <div className="w-px h-5 bg-white/20 mx-1" />
      <button
        type="button"
        className={btnBase}
        title={canDelete ? "Löschen" : "Required element"}
        disabled={!canDelete}
        onClick={onDelete}
      >
        <Trash2 size={14} />
      </button>
    </div>,
    document.body
  );
}

function readAtPath(tree: unknown, path: string): unknown {
  if (!tree || typeof tree !== "object") return undefined;
  const parts = parsePath(path);
  let cur: unknown = tree;
  for (const p of parts) {
    if (cur == null) return undefined;
    if (typeof p === "number") {
      if (!Array.isArray(cur)) return undefined;
      cur = cur[p];
    } else {
      if (typeof cur !== "object") return undefined;
      cur = (cur as Record<string, unknown>)[p];
    }
  }
  return cur;
}
