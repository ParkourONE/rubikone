"use client";

/**
 * PERS-06 / PERS-07 — Save flow hook.
 *
 * `useSave()` returns `{ save, saving, lastError }`. `save()` drives the
 * optimistic PATCH round-trip:
 *
 *   1. snapshot current content (for rollback)
 *   2. POST /api/admin/content/patch with {ops, baseSha}
 *   3. on 200 → clear pendingOps, update sha, markClean, clearHistory, toast
 *   4. on 409 → toast.error with a Reload action that refetches and resets
 *   5. on 400 → toast.error with validation summary, restoreSnapshot, keep ops
 *   6. on 401 / network → toast.error, restoreSnapshot, keep ops
 *
 * Admin-only module — must not be imported by public code.
 */
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  useEditorStore,
  clearHistory,
  type ContentTree,
} from "./editor-store";

export interface SaveResult {
  ok: boolean;
  status?: number;
}

export interface UseSaveReturn {
  save: () => Promise<SaveResult>;
  saving: boolean;
  lastError: string | null;
}

interface PatchOkResponse {
  ok: true;
  sha: string;
  commitUrl?: string;
}

interface PatchConflictResponse {
  ok: false;
  conflict: true;
  currentSha: string;
  content: Record<string, unknown>;
}

interface PatchValidationResponse {
  ok: false;
  error: string;
  errors?: Array<{ blockId: string; path: string; message: string }>;
}

type PatchResponse =
  | PatchOkResponse
  | PatchConflictResponse
  | PatchValidationResponse;

async function reloadContent(): Promise<void> {
  try {
    const res = await fetch("/api/admin/content", { cache: "no-store" });
    if (!res.ok) {
      toast.error("Reload fehlgeschlagen.");
      return;
    }
    const data = (await res.json()) as {
      content: ContentTree;
      sha: string;
    };
    useEditorStore.getState().setContent(data.content, data.sha);
    clearHistory();
    toast.success("Inhalt neu geladen.");
  } catch (err) {
    toast.error(
      "Reload fehlgeschlagen: " +
        (err instanceof Error ? err.message : "unbekannter Fehler")
    );
  }
}

export function useSave(): UseSaveReturn {
  const [saving, setSaving] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const save = useCallback(async (): Promise<SaveResult> => {
    const state = useEditorStore.getState();
    const { pendingOps, sha, content } = state;

    if (!content || !sha) {
      return { ok: false };
    }
    if (pendingOps.length === 0) {
      return { ok: true };
    }

    const snapshot = state.takeSnapshot();
    setSaving(true);
    setLastError(null);

    try {
      const res = await fetch("/api/admin/content/patch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ops: pendingOps, baseSha: sha }),
      });

      let body: PatchResponse | null = null;
      try {
        body = (await res.json()) as PatchResponse;
      } catch {
        body = null;
      }

      if (res.ok && body && "ok" in body && body.ok) {
        // Success — clear ops, update sha, mark clean, clear history.
        useEditorStore.setState((s) => ({
          ...s,
          sha: (body as PatchOkResponse).sha,
          pendingOps: [],
          dirty: false,
        }));
        clearHistory();
        toast.success("Gespeichert.");
        setSaving(false);
        return { ok: true, status: 200 };
      }

      if (res.status === 409) {
        setLastError("Conflict");
        toast.error(
          "Ein anderer Editor hat den Inhalt geändert. Änderungen neu laden?",
          {
            duration: 15000,
            action: {
              label: "Reload",
              onClick: () => {
                // PERS-04: discard local edits (safer) and refetch.
                if (
                  typeof window !== "undefined" &&
                  !window.confirm(
                    "Deine lokalen Änderungen werden verworfen. Fortfahren?"
                  )
                ) {
                  return;
                }
                useEditorStore.setState((s) => ({
                  ...s,
                  pendingOps: [],
                  dirty: false,
                }));
                void reloadContent();
              },
            },
          }
        );
        setSaving(false);
        return { ok: false, status: 409 };
      }

      if (res.status === 400) {
        // Validation — rollback optimistic tree but keep ops so the user can undo.
        state.restoreSnapshot(snapshot);
        const validation = body as PatchValidationResponse;
        const summary =
          validation?.errors && validation.errors.length > 0
            ? validation.errors
                .slice(0, 2)
                .map((e) => `${e.path}: ${e.message}`)
                .join("; ")
            : validation?.error || "Validierung fehlgeschlagen.";
        setLastError(summary);
        toast.error("Speichern fehlgeschlagen: " + summary);
        setSaving(false);
        return { ok: false, status: 400 };
      }

      if (res.status === 401) {
        state.restoreSnapshot(snapshot);
        setLastError("Unauthorized");
        toast.error("Nicht autorisiert. Bitte neu anmelden.");
        setSaving(false);
        return { ok: false, status: 401 };
      }

      // Other error
      state.restoreSnapshot(snapshot);
      const msg =
        (body as PatchValidationResponse | null)?.error ||
        `Unerwarteter Fehler (${res.status}).`;
      setLastError(msg);
      toast.error("Speichern fehlgeschlagen: " + msg);
      setSaving(false);
      return { ok: false, status: res.status };
    } catch (err) {
      // Network error
      state.restoreSnapshot(snapshot);
      const msg = err instanceof Error ? err.message : "Netzwerkfehler";
      setLastError(msg);
      toast.error("Speichern fehlgeschlagen: " + msg);
      setSaving(false);
      return { ok: false };
    }
  }, []);

  return { save, saving, lastError };
}
