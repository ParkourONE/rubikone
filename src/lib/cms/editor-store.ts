/**
 * Editor store — admin-only.
 *
 * Holds the current editable content tree, the GitHub SHA (for 409
 * handling), a dirty flag, and a queue of ops applied since last save.
 *
 * Phase 4a wraps the store with `zundo` so history (content only) supports
 * undo/redo. Mutations go through `applyOpToStore(op)` which delegates to
 * the pure `applyOp` reducer in `operations.ts` and appends the op to
 * `pendingOps`. The legacy `applyPatch` (immer recipe) is preserved so
 * Phase 3 consumers keep working.
 *
 * IMPORTANT: this module must NOT be imported from public-page code.
 * Keep it under `src/lib/cms/` which is admin-only territory. It is loaded
 * dynamically from `admin-provider.tsx` (see Phase 3 summary).
 */
import { create } from "zustand";
import { temporal } from "zundo";
import type { TemporalState } from "zundo";
import { produce } from "immer";
import { applyOp, type Op } from "./operations";

export type ContentTree = Record<string, unknown>;

export interface EditorStoreState {
  content: ContentTree | null;
  sha: string | null;
  dirty: boolean;
  pendingOps: Op[];

  setContent: (content: ContentTree, sha: string | null) => void;
  applyPatch: (patch: (draft: ContentTree) => void) => void;
  applyOpToStore: (op: Op) => void;
  markClean: () => void;
  getValueAtPath: (path: string) => unknown;

  // PERS-07: optimistic UI rollback helpers.
  // `takeSnapshot` returns the current content reference for the caller to
  // stash before a risky PATCH; `restoreSnapshot` writes it back without
  // touching history (so an undo stack doesn't see the rollback).
  takeSnapshot: () => ContentTree | null;
  restoreSnapshot: (snap: ContentTree | null) => void;
}

function getNestedValue(obj: unknown, path: string): unknown {
  if (!path) return obj;
  const parts: string[] = [];
  const regex = /([^.[\]]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(path)) !== null) {
    parts.push((match[1] ?? match[2]) as string);
  }
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    const index = Number(part);
    if (!isNaN(index) && Array.isArray(current)) {
      current = (current as unknown[])[index];
    } else {
      current = (current as Record<string, unknown>)[part];
    }
  }
  return current;
}

export const useEditorStore = create<EditorStoreState>()(
  temporal(
    (set, get) => ({
      content: null,
      sha: null,
      dirty: false,
      pendingOps: [],

      setContent: (content, sha) =>
        set({ content, sha, dirty: false, pendingOps: [] }),

      applyPatch: (patch) =>
        set((state) => {
          if (!state.content) return state;
          const next = produce(state.content, (draft) => {
            patch(draft as ContentTree);
          });
          return { ...state, content: next, dirty: true };
        }),

      applyOpToStore: (op) =>
        set((state) => {
          if (!state.content) return state;
          const { next } = applyOp(state.content, op);
          return {
            ...state,
            content: next,
            dirty: true,
            pendingOps: [...state.pendingOps, op],
          };
        }),

      markClean: () => set({ dirty: false, pendingOps: [] }),

      getValueAtPath: (path) => {
        const content = get().content;
        if (!content) return undefined;
        return getNestedValue(content, path);
      },

      takeSnapshot: () => get().content,

      restoreSnapshot: (snap) => {
        // Pause history so the rollback doesn't land as an undo step.
        const temporalApi = (useEditorStore as unknown as {
          temporal: { getState: () => TemporalState<EditorStoreState> };
        }).temporal;
        temporalApi?.getState().pause();
        set((state) => ({ ...state, content: snap }));
        temporalApi?.getState().resume();
      },
    }),
    {
      // PERS-02: limit history depth and track only `content` so the undo
      // stack never accidentally rewinds sha / dirty / pendingOps.
      limit: 50,
      partialize: (state) => ({ content: state.content }),
      equality: (a, b) => a.content === b.content,
    }
  )
);

/**
 * Convenience hooks for undo/redo surfaces. Phase 4b's save bar will read
 * these. `canUndo` / `canRedo` are derived each call from the temporal
 * store's `pastStates` / `futureStates` arrays.
 */
export function undo(): void {
  (useEditorStore as unknown as {
    temporal: { getState: () => TemporalState<EditorStoreState> };
  }).temporal.getState().undo();
}

export function redo(): void {
  (useEditorStore as unknown as {
    temporal: { getState: () => TemporalState<EditorStoreState> };
  }).temporal.getState().redo();
}

export function canUndo(): boolean {
  return (
    (useEditorStore as unknown as {
      temporal: { getState: () => TemporalState<EditorStoreState> };
    }).temporal.getState().pastStates.length > 0
  );
}

export function canRedo(): boolean {
  return (
    (useEditorStore as unknown as {
      temporal: { getState: () => TemporalState<EditorStoreState> };
    }).temporal.getState().futureStates.length > 0
  );
}

export function clearHistory(): void {
  (useEditorStore as unknown as {
    temporal: { getState: () => TemporalState<EditorStoreState> };
  }).temporal.getState().clear();
}
