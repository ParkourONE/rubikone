"use client";

/**
 * HoverOverlay — EDIT-01 / EDIT-02.
 *
 * Tracks the mouse and highlights the innermost `[data-edit-path]` element
 * under the cursor with a 2px outline box rendered via a portal. Clicking a
 * hovered element updates the selection; clicking empty space clears it.
 *
 * Only active when `useEditMode().editMode === true`. Outside an
 * EditModeProvider the default context value keeps `editMode: false`, so
 * mounting this on public pages is a no-op (nothing renders).
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  useEditMode,
  useSelection,
} from "@/components/cms/edit-mode-context";

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

function findEditPathElement(
  start: Element | null
): { el: HTMLElement; path: string } | null {
  let node: Element | null = start;
  while (node && node !== document.body) {
    if (node instanceof HTMLElement) {
      const path = node.getAttribute("data-edit-path");
      if (path) return { el: node, path };
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * Pick the first *visible* element matching a data-edit-path value. Sections
 * often render the same logical field twice (mobile + desktop variants) with
 * one hidden via `display: none`. A hidden node's getBoundingClientRect()
 * collapses to all-zero, which would otherwise pin selections/toolbars to the
 * top-left corner.
 */
export function queryVisibleEditPath(path: string): HTMLElement | null {
  const all = document.querySelectorAll<HTMLElement>(
    `[data-edit-path="${CSS.escape(path)}"]`
  );
  for (const el of all) {
    if (el.offsetParent !== null) return el; // not display:none
    const r = el.getBoundingClientRect();
    if (r.width > 0 || r.height > 0) return el; // fallback (fixed/absolute cases)
  }
  return all[0] ?? null;
}

export function HoverOverlay() {
  const { editMode } = useEditMode();
  const { selectedPath, setSelectedPath } = useSelection();
  const [hoverRect, setHoverRect] = useState<Rect | null>(null);
  const [selectedRect, setSelectedRect] = useState<Rect | null>(null);

  // Mouse tracking (rAF-throttled).
  useEffect(() => {
    if (!editMode) {
      setHoverRect(null);
      return;
    }
    let rafId = 0;
    let lastEvent: { x: number; y: number } | null = null;

    function tick() {
      rafId = 0;
      if (!lastEvent) return;
      const under = document.elementFromPoint(lastEvent.x, lastEvent.y);
      const match = findEditPathElement(under);
      if (!match) {
        setHoverRect(null);
        return;
      }
      setHoverRect(rectOf(match.el));
    }

    function onMove(e: MouseEvent) {
      lastEvent = { x: e.clientX, y: e.clientY };
      if (!rafId) rafId = requestAnimationFrame(tick);
    }

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [editMode]);

  // Click → select. Capture phase so our handler runs before click handlers
  // on the underlying interactive elements (links, buttons).
  useEffect(() => {
    if (!editMode) return;
    function onClick(e: MouseEvent) {
      const match = findEditPathElement(e.target as Element);
      if (match) {
        e.preventDefault();
        e.stopPropagation();
        setSelectedPath(match.path);
      } else {
        // Click outside any data-edit-path: clear selection only if the click
        // isn't on the hover toolbar itself (which lives in a portal with
        // data-cms-overlay).
        const tgt = e.target as HTMLElement | null;
        if (tgt && tgt.closest("[data-cms-overlay]")) return;
        setSelectedPath(null);
      }
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [editMode, setSelectedPath]);

  // Track the selected rect — re-measure on scroll / resize / DOM changes.
  useEffect(() => {
    if (!editMode || !selectedPath) {
      setSelectedRect(null);
      return;
    }
    function measure() {
      const el = queryVisibleEditPath(selectedPath!);
      if (!el) {
        setSelectedRect((prev) => (prev === null ? prev : null));
        return;
      }
      const next = rectOf(el);
      setSelectedRect((prev) => (prev && rectsEqual(prev, next) ? prev : next));
    }
    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    const observeTarget = document.querySelector("main") ?? document.body;
    const ro = new ResizeObserver(measure);
    ro.observe(observeTarget);
    const mo = new MutationObserver(measure);
    mo.observe(observeTarget, { subtree: true, childList: true, attributes: false });
    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
      ro.disconnect();
      mo.disconnect();
    };
  }, [editMode, selectedPath]);

  if (!editMode || typeof document === "undefined") return null;

  return createPortal(
    <div
      data-cms-overlay="hover-root"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 2147483000,
      }}
    >
      {hoverRect && (!selectedRect || !rectsEqual(hoverRect, selectedRect)) && (
        <div
          style={{
            position: "fixed",
            top: hoverRect.top,
            left: hoverRect.left,
            width: hoverRect.width,
            height: hoverRect.height,
            border: "2px solid rgba(0, 168, 171, 0.55)",
            borderRadius: 4,
            boxSizing: "border-box",
            pointerEvents: "none",
            transition: "top 60ms linear, left 60ms linear, width 60ms linear, height 60ms linear",
          }}
        />
      )}
      {selectedRect && (
        <div
          style={{
            position: "fixed",
            top: selectedRect.top,
            left: selectedRect.left,
            width: selectedRect.width,
            height: selectedRect.height,
            border: "2px solid #00a8ab",
            borderRadius: 4,
            boxSizing: "border-box",
            pointerEvents: "none",
            boxShadow: "0 0 0 1px rgba(0,168,171,0.25)",
          }}
        />
      )}
    </div>,
    document.body
  );
}

function rectsEqual(a: Rect, b: Rect): boolean {
  return (
    Math.abs(a.top - b.top) < 0.5 &&
    Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5
  );
}
