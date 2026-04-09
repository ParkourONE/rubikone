# Phase 4 — Edit Overlay — Summary

This milestone is delivered in three slices: 4a (foundation), 4b (hover
toolbar + inline editors), 4c (save bar + optimistic rollback + responsive
preview). Each slice appends its own section below.

## Phase 4a — Foundation

Status: shipped. `npm test` green: 58/58 across 7 files (45 baseline +
6 operations + 3 editor-store + 4 patch-endpoint).

### Requirement → Commit

| ID       | Requirement                                                            | Commit    |
|----------|------------------------------------------------------------------------|-----------|
| PERS-01  | Pure operation reducer (`src/lib/cms/operations.ts`)                   | `8142bb7` |
| PERS-02  | `zundo` undo/redo + op queue + snapshot helpers on the editor store   | `e76061f` |
| PERS-03  | `POST /api/admin/content/patch` with SHA-safe conflict handling        | `b916700` |
| PERS-07* | Store snapshot helpers (`takeSnapshot`/`restoreSnapshot`) — UI wiring owned by 4c | `e76061f` |
| Tests    | operations / editor-store / patch-endpoint                             | `9a6eaba` |

\*PERS-07 partial: only the store-level helpers. UI rollback wiring lands in 4c.

### Key decisions

- **`produceWithPatches` for ops**: every `applyOp` returns `{next, patches, inversePatches}`
  so the caller gets forward + RFC-6902 JSON patches for free. `applyOps`
  concatenates forward patches in order and prepends each batch's inverse
  patches so the combined inverse list undoes the batch last-first.
- **Immer draft unwrap for duplicate**: `structuredClone` chokes on immer
  draft proxies, so `deepCloneWithFreshIds` calls `current()` when
  `isDraft(value)` before cloning. Only the top-level `_id` is rewritten
  (Phase 4b/4c can revisit for nested arrays if needed).
- **Temporal partialize to `content` only**: the undo stack would otherwise
  rewind `sha`, `dirty`, and `pendingOps` — which would desync the save
  bar and the GitHub round-trip. Limit set to 50.
- **`restoreSnapshot` pauses temporal**: the rollback write wraps
  `temporal.pause()` / `resume()` so it never lands as an undo step.
  This is what lets 4c implement optimistic updates cleanly: take snapshot
  → apply ops → PATCH → on failure, restore snapshot (history intact).
- **Backwards-compatible store API**: legacy `applyPatch(recipe)` kept so
  Phase 3's AdminProvider compat layer keeps working while 4b/4c flip
  ownership to the op-based path.
- **PATCH race handling**: the endpoint handles two separate conflict
  windows — (a) `baseSha !== currentSha` before applying ops, and (b)
  GitHub PUT returning 409 because someone wrote between our GET and
  PUT. Both surface identical `409 { conflict, currentSha, content }`
  shapes so the client rebase path is uniform.
- **Bundle boundary untouched**: no new static imports of admin modules
  from public code paths. `operations.ts` lives under `src/lib/cms/**`
  which is already admin-only territory; the editor store continues to be
  dynamically imported from `admin-provider.tsx` per Phase 3.

### API shapes for Phase 4b / 4c

**Store (from `@/lib/cms/editor-store`)**:

```ts
interface EditorStoreState {
  content: ContentTree | null;
  sha: string | null;
  dirty: boolean;
  pendingOps: Op[];

  setContent(content, sha): void;       // resets pendingOps + dirty
  applyOpToStore(op: Op): void;         // 4b hover toolbar + inline editors
  applyPatch(recipe): void;             // legacy; prefer applyOpToStore
  markClean(): void;                    // after successful save
  takeSnapshot(): ContentTree | null;   // 4c optimistic update
  restoreSnapshot(snap): void;          // 4c rollback
  getValueAtPath(path): unknown;
}

// Module helpers
undo(); redo(); canUndo(); canRedo(); clearHistory();
```

**PATCH endpoint** — `POST /api/admin/content/patch`:

```ts
// Request
{ ops: Op[]; baseSha: string; message?: string }

// 200
{ ok: true; sha: string; commitUrl: string }

// 409 conflict (either the initial SHA check or the GitHub PUT race)
{ ok: false; conflict: true; currentSha: string; content: Record<string, unknown> }

// 400 validation
{ ok: false; error: string; errors: Array<{ blockId: string; path: string; message: string }> }

// 401
{ ok: false; error: string }
```

### Remaining for 4b / 4c

- 4b: overlay scanner, hover toolbar, inline editors, selection chrome.
- 4c: save bar (consumes `pendingOps` + PATCH), optimistic rollback
  (consumes snapshot helpers), keyboard shortcuts for undo/redo,
  responsive preview toggle.
