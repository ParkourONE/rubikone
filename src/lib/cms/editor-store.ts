/**
 * Editor store — admin-only.
 *
 * Holds the current editable content tree, the GitHub SHA (for 409
 * handling in Phase 4), and a dirty flag. Mutations go through `applyPatch`
 * which uses `immer` so patch functions can be written as direct mutations.
 *
 * In Phase 3 this store is hydrated from AdminProvider as a compat layer —
 * the provider remains the authoritative writer, and the store mirrors its
 * state so primitives can read by path without touching the provider.
 * Phase 4 will flip the ownership.
 *
 * IMPORTANT: this module must NOT be imported from public-page code.
 * Keep it under `src/lib/cms/` which is admin-only territory.
 */
import { create } from "zustand";
import { produce } from "immer";

export type ContentTree = Record<string, unknown>;

export interface EditorStoreState {
  content: ContentTree | null;
  sha: string | null;
  dirty: boolean;

  setContent: (content: ContentTree, sha: string | null) => void;
  applyPatch: (patch: (draft: ContentTree) => void) => void;
  markClean: () => void;
  getValueAtPath: (path: string) => unknown;
}

function getNestedValue(obj: unknown, path: string): unknown {
  if (!path) return obj;
  const parts: string[] = [];
  const regex = /([^.\[\]]+)|\[(\d+)\]/g;
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

export const useEditorStore = create<EditorStoreState>((set, get) => ({
  content: null,
  sha: null,
  dirty: false,

  setContent: (content, sha) => set({ content, sha, dirty: false }),

  applyPatch: (patch) =>
    set((state) => {
      if (!state.content) return state;
      const next = produce(state.content, (draft) => {
        patch(draft as ContentTree);
      });
      return { ...state, content: next, dirty: true };
    }),

  markClean: () => set({ dirty: false }),

  getValueAtPath: (path) => {
    const content = get().content;
    if (!content) return undefined;
    return getNestedValue(content, path);
  },
}));
