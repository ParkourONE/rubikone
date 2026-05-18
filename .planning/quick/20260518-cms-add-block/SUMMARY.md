---
quick_id: 20260518-cms-add-block
description: Fix R1-CMS "Block hinzufuegen" + Block-Loeschen
date: 2026-05-18
status: complete
commits:
  - a881559 feat(cms): block registry + DynamicBlocks renderer + useContent override
  - 23fd840 feat(cms): block-picker modal + admin provider integration
  - c51de06 feat(cms): wire add-block triggers + functional delete; mount blocks
mode: manual (gsd-sdk unavailable)
---

# Quick Task Summary

## Problem

Two dead admin-CMS controls reported by a customer:

1. Sidebar "Block hinzufuegen" button had no `onClick` (silent failure).
2. Sidebar delete-block button contained a `// TODO` and never deleted.
3. Floating "+" between sections (AddBlockGaps) only opened the sidebar.

## Outcome

End-to-end working add/delete flow:

| Trigger | Behaviour |
|---|---|
| Sidebar "Block hinzufuegen" button | Opens BlockPicker modal |
| AddBlockGaps "+" between sections | Opens BlockPicker modal |
| BlockPicker entry selected | Appends new block at end of `PAGE_BLOCKS[pageKey]` |
| Sidebar trash on dynamic block (with "Neu" badge) | Two-click delete via `applyOpToStore({type:"delete"})` |
| Sidebar trash on hardcoded section | Replaced with lock icon + "Fixe Sektion" tooltip |
| Sidebar click on dynamic block | Opens EditPanel with the block's content via nested-path resolution |

## Architecture

- **Data:** Additive `content.PAGE_BLOCKS: { [pageKey]: Array<{type, id, content}> }`. Optional — pages without it render zero extra blocks.
- **pageKey:** `/` -> `home`, otherwise pathname segments joined with `_`.
- **Registry:** `src/lib/cms/block-registry.ts` lists 14 standalone sections with `{type, label, category, Component, defaultContent}`. defaults sourced from existing exported constants in `@/lib/constants`.
- **Renderer:** `<DynamicBlocks pageKey>` reads `PAGE_BLOCKS[pageKey]`, registers each block with the sidebar (carrying `dynamic` metadata), and wraps each in a `BlockContentOverrideProvider` so the section's `useContent(KEY, DEFAULT)` resolves to per-block content without prop refactors.
- **Mount:** `<DynamicBlocksHost>` derives pageKey from `usePathname()` and is mounted once at the end of `<main>` in `app/layout.tsx`. Every page is covered automatically.
- **Picker:** Modal lists registry by category; on select scaffolds `PAGE_BLOCKS[pageKey]` (lazy create) then dispatches an `insert` op. Insertion is always append-only per locked decision.
- **Delete:** Sidebar checks `section.dynamic` — only dynamic blocks show the trash; hardcoded sections get a lock icon + tooltip.
- **EditPanel nested-path:** `getAt(content, editingSection)` resolves both legacy top-level keys (`HERO_CONTENT`) and dotted paths (`PAGE_BLOCKS.home.0.content`). Save flow unchanged.
- **Store sync:** `updateContent` (legacy admin-context path) now mirrors edits into the editor-store via a `set` op so the picker and other op-based features always read fresh content.

## Files changed

```
A src/lib/cms/block-registry.ts
A src/components/cms/DynamicBlocks.tsx
A src/components/cms/DynamicBlocksHost.tsx
A src/components/admin/block-picker.tsx
M src/hooks/useContent.ts                         (+ BlockContentOverrideContext/Provider)
M src/providers/admin-provider.tsx                (pickerOpen state, RegisteredSection.dynamic, updateContent mirror)
M src/components/admin/admin-sidebar.tsx          (button onClick, delete logic, lock icon for hardcoded)
M src/components/admin/edit-panel.tsx             (nested-path resolution via getAt)
M src/components/cms/overlay/AddBlockGaps.tsx     ("+" -> picker)
M src/app/layout.tsx                              (mount DynamicBlocksHost)
```

## Verification

- `npx tsc --noEmit` — 1 pre-existing error in `.next/dev/types/validator.ts` for a missing TINA route; all new files clean.
- `npx eslint` on all changed files — clean (pre-existing `any` types in admin-provider unchanged; pre-existing setState-in-effect in AddBlockGaps unchanged).
- `npm run build` (with dummy env vars) — successful, all 30 routes compile.
- `npx vitest run` — 78/78 tests pass across 12 files.
- In-browser smoke test — **deferred to user** (admin login + content.json roundtrip require live env).

## Known limitations / deferred

- **Inline edit overlay (`data-edit-path`) does not target dynamic blocks correctly.** A dynamic Hero's overlay still points at `HERO_CONTENT.headline` (global). Editing via the sidebar SectionCard popup works correctly via nested paths. Inline overlay support is deferred (would require threading a path prefix through `useEditPath`).
- **Only `<main>` mount point.** Hardcoded sections that live outside `<main>` (e.g. footer slots) are unaffected. Not in scope.
- **No drag-and-drop reorder.** Per locked decision (append-only).
- **No soft-delete for hardcoded sections.** Per locked decision.
- **PAGE_BLOCKS pageKey collisions.** Two pathnames that normalize to the same key (e.g. `/a/b` and `/a_b`) would share blocks. Acceptable for current 20-page site; revisit if pathnames grow.
- **Tests for the new code** were not added — vitest config in this project does not yet cover `src/components/admin/` or `src/components/cms/`. Existing 78 tests serve as regression coverage for the touched primitives (`operations.ts`, `editor-store.ts`).

## Deployment safety

- `PAGE_BLOCKS` is optional. Existing `content.json` requires no migration.
- `<DynamicBlocks>` is a no-op until an admin actually adds blocks.
- GitHub PUT flow (`/api/admin/content`) is unchanged.

## Commits

```
c51de06 feat(cms): wire add-block triggers + functional delete; mount blocks
23fd840 feat(cms): block-picker modal + admin provider integration
a881559 feat(cms): block registry + DynamicBlocks renderer + useContent override
```
