"use client";

/**
 * UX-03 — Validation badges.
 *
 * Listens to editMode + editorStore.content, runs a debounced (200ms)
 * validateTree pass, and portals a small red badge over every DOM node
 * whose `data-edit-path` belongs to a block with schema errors. Tooltip
 * lists the offending fields.
 *
 * The `useValidationMap` hook is exported so the SaveBar can read the
 * same debounced state for the summary pill + save gating.
 */
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useEditMode } from "@/components/cms/edit-mode-context";
import { useEditorStore } from "@/lib/cms/editor-store";
import {
  validateTree,
  type ValidationMap,
  countIssues,
} from "@/lib/cms/validate-tree";

export function useValidationMap(): ValidationMap {
  const content = useEditorStore((s) => s.content);
  const [map, setMap] = useState<ValidationMap>({});

  useEffect(() => {
    const handle = setTimeout(() => {
      setMap(validateTree(content));
    }, 200);
    return () => clearTimeout(handle);
  }, [content]);

  return map;
}

export function useValidationErrorCount(): number {
  const map = useValidationMap();
  return useMemo(() => countIssues(map), [map]);
}

interface BadgeRect {
  id: string;
  blockId: string;
  top: number;
  left: number;
  issues: { path: string; message: string }[];
}

export function ValidationBadges() {
  const { editMode } = useEditMode();
  const map = useValidationMap();
  const [rects, setRects] = useState<BadgeRect[]>([]);

  useEffect(() => {
    if (!editMode || typeof document === "undefined") {
      setRects([]);
      return;
    }
    const badBlocks = Object.keys(map);
    if (badBlocks.length === 0) {
      setRects([]);
      return;
    }

    function measure() {
      const seen = new Set<string>();
      const next: BadgeRect[] = [];
      for (const blockId of badBlocks) {
        // Find the outermost data-edit-path whose first segment is blockId.
        const nodes = document.querySelectorAll<HTMLElement>(
          `[data-edit-path^="${CSS.escape(blockId)}"]`
        );
        for (const el of Array.from(nodes)) {
          const p = el.getAttribute("data-edit-path") || "";
          // Accept paths that begin with "BLOCK_ID" followed by "." or "["
          if (
            p !== blockId &&
            !p.startsWith(blockId + ".") &&
            !p.startsWith(blockId + "[")
          ) {
            continue;
          }
          if (seen.has(p)) continue;
          seen.add(p);
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) continue;
          next.push({
            id: p,
            blockId,
            top: r.top + window.scrollY,
            left: r.left + window.scrollX + r.width - 10,
            issues: map[blockId],
          });
          // One badge per block is enough.
          break;
        }
      }
      setRects(next);
    }

    measure();
    const onScroll = () => measure();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    const mo = new MutationObserver(() => measure());
    mo.observe(document.body, { subtree: true, childList: true });
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      mo.disconnect();
    };
  }, [editMode, map]);

  if (!editMode || typeof document === "undefined" || rects.length === 0) {
    return null;
  }

  return createPortal(
    <div
      data-cms-overlay="validation-badges"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 2147482900,
      }}
    >
      {rects.map((r) => (
        <div
          key={r.id}
          style={{
            position: "absolute",
            top: r.top - 6,
            left: r.left,
            pointerEvents: "auto",
          }}
          title={r.issues.map((i) => `${i.path}: ${i.message}`).join("\n")}
          className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-md ring-2 ring-white cursor-help"
        >
          {r.issues.length > 9 ? "9+" : r.issues.length}
        </div>
      ))}
    </div>,
    document.body
  );
}
