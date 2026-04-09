"use client";

/**
 * UX-01 — Edit-mode toggle in the admin shell.
 *
 * Persists the last mode in localStorage. Hydrates on mount so reloads
 * restore the previous state. Rendered only inside the admin shell.
 */

import { useEffect } from "react";
import { Eye, Pencil } from "lucide-react";
import { useEditMode } from "@/components/cms/edit-mode-context";

const LS_KEY = "cms:editMode";

export function EditModeToggle() {
  const { editMode, setEditMode } = useEditMode();

  // Hydrate once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw === "1") setEditMode(true);
      else if (raw === "0") setEditMode(false);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change.
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, editMode ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [editMode]);

  return (
    <button
      type="button"
      onClick={() => setEditMode((v) => !v)}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border border-white/20 bg-white/10 hover:bg-white/20 text-white"
      title={editMode ? "Edit-Mode aus" : "Edit-Mode an"}
    >
      {editMode ? <Pencil size={12} /> : <Eye size={12} />}
      {editMode ? "Editiert" : "Ansicht"}
    </button>
  );
}
