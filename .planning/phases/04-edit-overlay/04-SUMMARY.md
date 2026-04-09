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

## Phase 4b — UX Slice (hover overlay + toolbar + inline editors)

Status: shipped. `npm test` green: 64/64 across 8 files (58 from 4a +
6 path-to-field).

### Requirement → Commit

| ID       | Requirement                                                         | Commit    |
|----------|---------------------------------------------------------------------|-----------|
| EDIT-01  | Per-element hover outline + floating toolbar                        | `4131557`, `777ac31` |
| EDIT-02  | Innermost-wins hover detection (`elementFromPoint` + walk-up)       | `4131557` |
| EDIT-03  | Inline text editor (contenteditable + TextCommitBridge)             | `de79b2b` |
| EDIT-04  | Inline image editor (drag-drop + /api/admin/upload)                 | `de79b2b` |
| EDIT-05  | Inline button editor (label + href popover)                         | `de79b2b` |
| EDIT-06  | Inline link editor (label + href + target popover)                  | `de79b2b` |
| EDIT-07  | Inline icon editor (Lucide catalog picker)                          | `de79b2b` |
| EDIT-08  | List item ops (insert above, delete, move)                          | `777ac31` |
| EDIT-09  | Delete gated by manifest `required` (via `path-to-field`)           | `8b6f3ef`, `777ac31` |
| EDIT-10  | Duplicate (array items only)                                        | `777ac31` |
| EDIT-11  | Move Up / Move Down                                                 | `777ac31` |
| EDIT-13  | Add-block reskin as floating "+" between sections                   | `d845897` |
| UX-01    | Edit-mode toggle in admin shell (localStorage-persisted)            | `d845897` |
| Tests    | `path-to-field` resolution (6 cases)                                | `8b6f3ef` |

### Key decisions

- **Single overlay host mounted inside `AdminProviderInner`.** The whole
  stack (HoverOverlay, HoverToolbar, InlineEditors, AddBlockGaps,
  TextCommitBridge) lives under `src/components/cms/overlay/**` and is
  only mounted when `AdminProvider` is active. On public pages the
  default EditMode context value (`editMode: false`) keeps every
  component rendering `null` — zero public-bundle impact.
- **Text edit via global blur bridge** instead of swapping the primitive
  for `InlineText`. Swapping would have dropped the `data-edit-path`
  attribute and broken the hover scanner. The toolbar promotes the
  hovered element to `contenteditable="plaintext-only"`; a
  document-level capture listener in `TextCommitBridge` reads the new
  text on blur/Enter/Escape and dispatches `set` via `applyOpToStore`.
- **Popovers are vanilla React.** No new deps (`@floating-ui/react`,
  `react-dropzone`, shadcn Popover/Command) — plain
  `getBoundingClientRect` + native file input drag-drop. Keeps the admin
  bundle lean and avoids committing to APIs 4c may still iterate on.
- **`path-to-field` resolver** walks the manifest for the root-level
  block id and does longest-match resolution with list-aware
  normalisation (`FAQ_ITEMS[0].question` → itemField.path `"question"`).
  This is the single source of truth for delete gating.
- **`editor-dispatch` registry** decouples the toolbar from the
  `InlineEditors` host. The host registers a dispatcher on mount; the
  toolbar calls it with `(kind, path, anchor)`. Future 4c work can swap
  the host implementation without touching the toolbar.
- **AddBlockGaps is additive.** The existing sidebar "Block hinzufuegen"
  button is untouched; the floating "+" simply opens the sidebar so the
  user picks the block there. The underlying add logic stays where it
  was — 4c can wire a proper menu here if needed.

### Remaining for 4c

- Wire `pendingOps` + `sha` + save bar UI (PATCH endpoint already exists).
- Optimistic rollback via `takeSnapshot`/`restoreSnapshot`.
- Keyboard shortcuts for undo/redo/save.
- Responsive-preview toggle.
- Dirty guard / beforeunload.
- 409 conflict rebase UI.
