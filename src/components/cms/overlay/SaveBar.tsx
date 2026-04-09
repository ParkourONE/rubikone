"use client";

/**
 * PERS-05 — SaveBar.
 *
 * Floating bottom bar visible only in editMode. Renders:
 *   - "Unsaved changes" pill when dirty
 *   - Save button (disabled when pendingOps.length === 0)
 *   - Discard button (confirm prompt → restoreSnapshot last-clean state)
 *   - Inline spinner while saving
 *
 * Also registers a `beforeunload` listener whenever `dirty && editMode`.
 */
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Loader2, Save, Undo2 } from "lucide-react";
import { useEditMode } from "@/components/cms/edit-mode-context";
import { useEditorStore, clearHistory } from "@/lib/cms/editor-store";
import { useSave } from "@/lib/cms/use-save";
import { useAutosave } from "@/lib/cms/use-autosave";

export function SaveBar() {
  const { editMode } = useEditMode();
  const dirty = useEditorStore((s) => s.dirty);
  const pendingCount = useEditorStore((s) => s.pendingOps.length);
  const content = useEditorStore((s) => s.content);
  const sha = useEditorStore((s) => s.sha);
  const saveApi = useSave();
  const { save, saving } = saveApi;

  // Remember the last known "clean" snapshot (= content as of last save /
  // initial load) for the Discard action. Updated whenever dirty flips false.
  const cleanSnapshotRef = useRef<typeof content>(null);
  useEffect(() => {
    if (!dirty) {
      cleanSnapshotRef.current = content;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, sha]);

  // PERS-05 — beforeunload guard.
  useEffect(() => {
    if (!editMode || !dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [editMode, dirty]);

  // Autosave scaffold — no-op unless cms:autosave flag is set.
  useAutosave(saveApi);

  if (!editMode || typeof document === "undefined") return null;

  const canSave = pendingCount > 0 && !saving;

  const onDiscard = () => {
    if (pendingCount === 0) return;
    if (
      !window.confirm(
        "Alle ungespeicherten Änderungen verwerfen? Diese Aktion kann nicht rückgängig gemacht werden."
      )
    ) {
      return;
    }
    const snap = cleanSnapshotRef.current;
    useEditorStore.getState().restoreSnapshot(snap);
    useEditorStore.setState((s) => ({
      ...s,
      pendingOps: [],
      dirty: false,
    }));
    clearHistory();
  };

  return createPortal(
    <div
      data-cms-overlay="savebar"
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 2147483000,
      }}
      className="flex items-center gap-2 rounded-full bg-[#1D1D1F]/95 backdrop-blur-xl text-white shadow-2xl px-3 py-2 text-xs"
    >
      {dirty ? (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          Ungespeicherte Änderungen
          {pendingCount > 0 ? ` (${pendingCount})` : ""}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 text-white/60 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Alles gespeichert
        </span>
      )}
      <button
        type="button"
        onClick={onDiscard}
        disabled={pendingCount === 0 || saving}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-full hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
        title="Änderungen verwerfen"
      >
        <Undo2 size={12} />
        Verwerfen
      </button>
      <button
        type="button"
        onClick={() => void save()}
        disabled={!canSave}
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00a8ab] hover:bg-[#00c0c4] disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
        title="Speichern (Cmd+S)"
      >
        {saving ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Save size={12} />
        )}
        Speichern
      </button>
    </div>,
    document.body
  );
}
