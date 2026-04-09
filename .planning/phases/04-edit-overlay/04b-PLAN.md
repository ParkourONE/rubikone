# Phase 4b — UX Slice (Hover Overlay, Toolbar, Inline Editors)

Phase 4b layers the visual editing UI on top of the Phase 4a data
primitives. Every mutation still flows through `applyOpToStore` so the
save-bar work in 4c can consume `pendingOps` unchanged.

## Scope

- EDIT-01 / EDIT-02 — hover outline + innermost-wins detection
- EDIT-01 — floating toolbar pinned to the selection
- EDIT-03..07 — inline editors for text / image / button / link / icon
- EDIT-08 — list item ops (insert above/below, delete, move)
- EDIT-09 — Delete gated by manifest `required`
- EDIT-10 / EDIT-11 — Duplicate + Move Up/Down on array items
- EDIT-13 — Add-block reskin as floating "+" between sections
- UX-01 — Edit-mode toggle in the admin shell

Out of scope (deferred to 4c): save bar, dirty guard, responsive preview,
409 rollback UI, keyboard shortcuts.

## Architecture

- `CmsOverlayHost` is the single mount point. It lives inside
  `AdminProviderInner` so the entire stack is admin-only. On public pages
  the default EditMode context (`editMode: false`) keeps every overlay
  component rendering `null`.
- Hover detection uses `document.elementFromPoint` + walk-up to find the
  nearest `[data-edit-path]`. Phase 3's primitives already emit that
  attribute in edit mode — 4b just consumes it.
- Selection is a single string path stored in `SelectionContext`. Click
  selects, click on empty space clears.
- The hover toolbar and popover editors are rendered via `createPortal` to
  `document.body` with astronomical `z-index` and `data-cms-overlay` guards
  so our own chrome never re-enters the selection.
- Text edits: clicking Edit on a text field promotes the hovered element
  to `contenteditable="plaintext-only"` and selects all. The
  `TextCommitBridge` listens for blur/Enter/Escape at the document level,
  reads the new text, and dispatches `{type: 'set', path, value}` via
  `applyOpToStore`. The primitives themselves stay untouched — no store
  coupling leaks into the public bundle.
- Non-text kinds open popovers via a tiny `editor-dispatch` registry. The
  `InlineEditors` host registers a dispatcher on mount; the toolbar calls
  it with `(kind, path, anchor)` and the host renders the matching
  editor (Image / Button / Link / Icon).
- `path-to-field.ts` resolves a fully-qualified content path back to the
  manifest `FieldSpec` for the Delete gating. List-item paths get
  normalised via `listPath + [index] + itemRelative` matching.

## Trade-offs

- **No new deps**: `@floating-ui/react` and `react-dropzone` were skipped
  in favour of plain `getBoundingClientRect` + vanilla drag/drop on a
  file input. This keeps the public bundle untouched and avoids adding
  install weight for features 4c may still iterate on.
- **No shadcn Popover/Command**: popovers are ~30 LOC vanilla divs because
  the project doesn't ship those shadcn primitives yet.
- **Text edit uses global blur listener** instead of replacing the
  primitive with `InlineText`. Swapping the render path would have
  dropped the `data-edit-path` attribute and broken the hover scanner,
  so the bridge reads the contenteditable directly.
- **Icon catalog is hand-curated** (~40 icons) to keep the Command picker
  snappy. Expand when sections start importing more.

## Requirement → Commit

Filled in once commits land (see 04-SUMMARY.md Phase 4b section).
