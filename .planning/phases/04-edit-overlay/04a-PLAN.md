# Phase 4a — Foundation Slice (PERS-01, PERS-02, PERS-03, PERS-07 partial)

Foundation for the edit-overlay milestone. 4a delivers the pure data
primitives that 4b (hover toolbar + inline editors) and 4c (save bar,
optimistic rollback, responsive preview) will consume.

## Scope

- PERS-01 — Pure operation reducer
- PERS-02 — Undo/redo via `zundo`
- PERS-03 — PATCH endpoint with SHA-safe conflict handling
- PERS-07 (partial) — Optimistic UI snapshot helpers on the store. The UI
  rollback wiring lives in 4c.

Out of scope for 4a: hover toolbar, inline editors, save bar, responsive
preview, selection chrome.

## Deliverables

### `src/lib/cms/operations.ts`

```ts
type Op =
  | { type: 'set'; path: string; value: unknown }
  | { type: 'insert'; path: string; value: unknown; index?: number }
  | { type: 'delete'; path: string }
  | { type: 'move'; path: string; toIndex: number }
  | { type: 'duplicate'; path: string };

applyOp<T>(tree: T, op: Op): { next: T; patches: Patch[]; inversePatches: Patch[] };
applyOps<T>(tree: T, ops: Op[]): { next: T; patches: Patch[]; inversePatches: Patch[] };
```

- Uses immer's `produceWithPatches` → forward + inverse JSON patches.
- Paths parsed via existing `src/lib/content-path.ts` helpers.
- `duplicate` deep-clones via `structuredClone` (unwrapping the draft with
  `current()` first) and assigns a fresh top-level `nanoid()` `_id`.
- `applyOps` concatenates forward patches in order and prepends each batch's
  inverse patches so the combined inverse list undoes last-first.

### `src/lib/cms/editor-store.ts`

- Wrapped with `temporal()` from `zundo`, limit 50, partialized to `content`
  only (so `sha`, `dirty`, `pendingOps` never round-trip through history).
- New state: `pendingOps: Op[]`.
- New methods:
  - `applyOpToStore(op)` — runs the pure reducer, updates content, appends op
    to `pendingOps`, sets `dirty: true`.
  - `takeSnapshot()` / `restoreSnapshot(snap)` — rollback helpers. The
    restore pauses the temporal store around the write so it doesn't land
    as an undo step.
- Legacy `applyPatch(recipe)` preserved for Phase 3 consumers.
- Module-level `undo()`, `redo()`, `canUndo()`, `canRedo()`, `clearHistory()`
  helpers delegate to the temporal store.

### `src/app/api/admin/content/patch/route.ts`

POST handler:

- Gate on `isAuthenticated()` → 401 otherwise.
- Body: `{ ops: Op[]; baseSha: string; message?: string }`.
- Fetch current content.json from GitHub via shared inline helper
  (mirrors `content/route.ts` PUT code).
- If `currentSha !== baseSha` → `409 { ok: false, conflict: true, currentSha, content }`.
- Apply ops via `applyOps`, then `migrateContent` + `validateContent`.
  Validation failure → `400 { ok: false, errors }`.
- Commit via GitHub API. If the PUT itself races (409 from GitHub), re-fetch
  and surface the fresh SHA/content to the client.
- Success → `200 { ok: true, sha, commitUrl }`.

## Tests

- `src/lib/cms/operations.test.ts` — 5 op types + patch round-trip +
  duplicate gets a fresh `_id`.
- `src/lib/cms/editor-store.test.ts` — `applyOpToStore` + undo/redo +
  snapshot/restore without history side-effect.
- `src/app/api/admin/content/patch/route.test.ts` — 401 / 409 / 400 / 200
  paths with GitHub `fetch` mocked and `@/lib/admin-auth` stubbed.

## Constraints respected

- TypeScript strict.
- No public-bundle regression: all 4a modules live under `src/lib/cms/**`
  or `src/app/api/admin/**` which are admin-only. Phase 3's dynamic import
  boundary from `admin-provider.tsx` is untouched.
- `zundo` added as a regular dep (it is pulled in only by the dynamically
  imported editor store — it never enters the public bundle).

## API shapes consumed by 4b / 4c

- 4b inline editors call `useEditorStore.getState().applyOpToStore(op)` for
  every change. The hover toolbar calls the same method for
  `insert`/`delete`/`move`/`duplicate`.
- 4c save bar reads `pendingOps`, sends `{ ops, baseSha: sha }` to
  `POST /api/admin/content/patch`. On 200 it calls
  `setContent(newContent, sha)` (or just updates sha + `markClean()`).
  On 409 it calls `takeSnapshot()` → rebase logic → `restoreSnapshot()`.
- 4c wires `undo()` / `redo()` / `canUndo()` / `canRedo()` to keyboard
  shortcuts + toolbar buttons.
