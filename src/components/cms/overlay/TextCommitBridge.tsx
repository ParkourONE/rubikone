"use client";

/**
 * Global bridge that commits inline text edits to the editor store.
 *
 * When the HoverToolbar's Edit action promotes a `[data-edit-path]` element
 * into contenteditable, this bridge captures the blur event, reads the
 * element's text content, and dispatches a `set` op. The element is
 * demoted back to non-editable after the commit.
 */

import { useEffect } from "react";
import { useEditMode } from "@/components/cms/edit-mode-context";
import { useEditorStore } from "@/lib/cms/editor-store";

export function TextCommitBridge() {
  const { editMode } = useEditMode();

  useEffect(() => {
    if (!editMode) return;

    function onBlur(e: FocusEvent) {
      const el = e.target as HTMLElement | null;
      if (!el || !(el instanceof HTMLElement)) return;
      const path = el.getAttribute("data-edit-path");
      if (!path) return;
      if (el.getAttribute("contenteditable") == null) return;
      const next = el.textContent ?? "";
      const prev = useEditorStore.getState().getValueAtPath(path);
      if (typeof prev === "string" && prev !== next) {
        useEditorStore
          .getState()
          .applyOpToStore({ type: "set", path, value: next });
      }
      el.removeAttribute("contenteditable");
    }

    function onKey(e: KeyboardEvent) {
      if (e.key !== "Enter" && e.key !== "Escape") return;
      const el = e.target as HTMLElement | null;
      if (!el || !(el instanceof HTMLElement)) return;
      if (!el.hasAttribute("data-edit-path")) return;
      if (el.getAttribute("contenteditable") == null) return;
      e.preventDefault();
      el.blur();
    }

    document.addEventListener("blur", onBlur, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("blur", onBlur, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [editMode]);

  return null;
}
