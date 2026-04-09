"use client";

/**
 * EDIT-12 — Keyboard shortcuts.
 *
 *   - Cmd/Ctrl + Z       → undo()
 *   - Cmd/Ctrl + Shift+Z → redo()
 *   - Cmd/Ctrl + S       → save() (preventDefault)
 *   - Esc                → clear selection
 *   - Delete / Backspace → delete the selected path (if deletable per
 *                          manifest via `resolvePathToField`)
 *
 * Only active when `editMode === true`. Ignored when focus is inside an
 * input / textarea / contenteditable so text editing stays usable.
 */
import { useEffect } from "react";
import { useEditMode, useSelection } from "@/components/cms/edit-mode-context";
import { useEditorStore, undo, redo } from "@/lib/cms/editor-store";
import { useSave } from "@/lib/cms/use-save";
import { resolvePathToField } from "@/lib/cms/path-to-field";
import { parsePath } from "@/lib/content-path";
import { validateTree } from "@/lib/cms/validate-tree";
import { toast } from "sonner";

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  if (target.getAttribute("contenteditable") === "true") return true;
  if (target.getAttribute("contenteditable") === "plaintext-only") return true;
  return false;
}

function isPathDeletable(path: string): boolean {
  const parts = parsePath(path);
  const lastIsIndex =
    parts.length > 0 && typeof parts[parts.length - 1] === "number";
  // Array items: always deletable.
  if (lastIsIndex) return true;
  const resolved = resolvePathToField(path);
  if (!resolved) return false;
  const required = resolved.field?.required === true && !resolved.insideList;
  return !required;
}

export function KeyboardShortcuts() {
  const { editMode } = useEditMode();
  const { selectedPath, setSelectedPath } = useSelection();
  const { save } = useSave();

  useEffect(() => {
    if (!editMode) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      // Esc always clears selection (even inside inputs — a common pattern).
      if (e.key === "Escape") {
        setSelectedPath(null);
        return;
      }

      // Skip the rest when typing into an editable surface.
      if (isEditableTarget(e.target)) return;

      if (mod && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if (mod && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        const tree = useEditorStore.getState().content;
        const map = validateTree(tree);
        let errorCount = 0;
        for (const k in map) errorCount += map[k].length;
        if (errorCount > 0) {
          toast.error(
            `Speichern blockiert: ${errorCount} Schema-Verletzung${errorCount === 1 ? "" : "en"}.`
          );
          return;
        }
        void save();
        return;
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (!selectedPath) return;
        if (!isPathDeletable(selectedPath)) return;
        e.preventDefault();
        useEditorStore
          .getState()
          .applyOpToStore({ type: "delete", path: selectedPath });
        setSelectedPath(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editMode, selectedPath, setSelectedPath, save]);

  return null;
}
