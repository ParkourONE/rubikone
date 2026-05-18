"use client";

/**
 * EDIT-13 — Add-block reskin as floating "+" between top-level sections.
 *
 * The existing add-block trigger lives in the admin sidebar. Phase 4b adds
 * a floating affordance between sections that simply opens the sidebar so
 * the user can pick a block. (The underlying add logic is untouched — 4c
 * will wire a proper menu here if needed.)
 *
 * Detects top-level sections on the current page as any `<section>` element
 * with an `id` starting with `section-` (the Phase 3 editable-section
 * wrapper emits these). Renders a small "+" button at each gap; visible on
 * gap hover.
 */

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";
import { useEditMode } from "@/components/cms/edit-mode-context";
import { useAdmin } from "@/providers/admin-provider";

interface Gap {
  top: number;
  left: number;
  width: number;
}

export function AddBlockGaps() {
  const { editMode } = useEditMode();
  const { setPickerOpen } = useAdmin();
  const [gaps, setGaps] = useState<Gap[]>([]);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!editMode) {
      setGaps([]);
      return;
    }
    function measure() {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>(
          'section[id^="section-"], [data-edit-path][data-cms-section="true"]'
        )
      );
      const next: Gap[] = [];
      for (let i = 0; i < sections.length - 1; i++) {
        const a = sections[i].getBoundingClientRect();
        const b = sections[i + 1].getBoundingClientRect();
        const top = (a.bottom + b.top) / 2 + window.scrollY;
        next.push({
          top,
          left: Math.min(a.left, b.left),
          width: Math.max(a.width, b.width),
        });
      }
      setGaps(next);
    }
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      ro.disconnect();
    };
  }, [editMode]);

  if (!editMode || typeof document === "undefined") return null;

  return createPortal(
    <div data-cms-overlay="add-gaps" className="pointer-events-none">
      {gaps.map((g, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center pointer-events-auto"
          style={{
            top: g.top - 14,
            left: g.left,
            width: g.width,
            height: 28,
          }}
          onMouseEnter={() => setHoverIdx(i)}
          onMouseLeave={() => setHoverIdx((v) => (v === i ? null : v))}
        >
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            title="Block hinzufügen (wird am Ende der Seite eingefügt)"
            className="h-7 w-7 rounded-full bg-[#00a8ab] text-white shadow-lg flex items-center justify-center transition-opacity"
            style={{ opacity: hoverIdx === i ? 1 : 0 }}
          >
            <Plus size={14} />
          </button>
          <div
            className="absolute left-0 right-0 h-px bg-[#00a8ab]/30"
            style={{ opacity: hoverIdx === i ? 1 : 0 }}
          />
        </div>
      ))}
    </div>,
    document.body
  );
}
