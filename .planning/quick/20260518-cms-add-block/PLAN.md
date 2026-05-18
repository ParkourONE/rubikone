---
quick_id: 20260518-cms-add-block
description: Fix R1-CMS "Block hinzufuegen" + Block-Loeschen — Picker + DynamicBlocks + Delete-Wiring
date: 2026-05-18
status: in-progress
mode: manual (gsd-sdk unavailable)
---

# Quick Task: CMS Add-Block + Delete-Block

## Problem

Two dead buttons in the admin sidebar:

1. **`src/components/admin/admin-sidebar.tsx:250-266`** — "Block hinzufuegen" button has no `onClick`. Clicking does nothing.
2. **`src/components/admin/admin-sidebar.tsx:62-71`** — Delete-block button confirms a dialog but contains `// TODO: Implement actual block deletion logic`. Never deletes.
3. **`src/components/cms/overlay/AddBlockGaps.tsx:90`** — Floating "+" between sections only opens the sidebar; no picker.

## Locked Decisions (from user)

- **All section types in picker:** every component in `src/components/sections/` that uses `useContent(KEY, DEFAULT)` is eligible.
- **Append-only:** new blocks always added at the end of the page; no insertion between hardcoded sections (for this fix).
- **Architecture-agnostic:** "muss einfach funktionieren" — pragmatic, not pretty.
- **Hardcoded sections non-deletable:** delete button disabled on `<EditableSection>`-registered keys with a tooltip; only dynamic blocks can be removed.

## Architecture

### Data shape (additive to `content.json`)

```json
{
  "PAGE_BLOCKS": {
    "home": [
      { "type": "CTA_CONTENT", "id": "abc123", "content": { "headline": "...", ... } }
    ],
    "konzept": []
  }
}
```

- `pageKey` derived from pathname: `pathname === "/" ? "home" : pathname.slice(1).replace(/\//g, "_")`.
- `PAGE_BLOCKS` is **optional** — pages without it render zero dynamic blocks. Backwards-compatible.

### Block registry (`src/lib/cms/block-registry.ts`)

```ts
interface BlockDef {
  type: string;              // canonical content key (e.g. "HERO_CONTENT")
  label: string;             // human-readable picker label
  category?: string;         // optional grouping
  Component: ComponentType;  // section component to render
  defaultContent: unknown;   // sourced from existing exported constant
}
```

Registry entries cover all `useContent`-based sections from `grep -h "useContent("`:
HERO_CONTENT, CTA_CONTENT, TESTIMONIALS, BENTO_GRID_DEFAULTS, COMPARISON_TABLE, VIDEO_CONTENT,
VORHER_NACHHER_CONTENT, GALLERY_CONTENT, PROZESS_TEASER_CONTENT, CONFIGURATOR_CTA_CONTENT,
STATS_CONTENT, TEXTHOOK_CONTENT, PARKOURONE_STORY, FAQ_ITEMS (faq-section reads from constants).
Skipped: configurator-overlay (global UI), contact-form (page-specific, expects API integration),
legal-page-client / posten-page-client (route-specific dispatchers), movements-grid (positional-dependent).

### Render layer (`src/components/cms/DynamicBlocks.tsx`)

```tsx
<DynamicBlocks pageKey={pageKey} />
```

- Reads `content.PAGE_BLOCKS[pageKey]` (gracefully no-ops if missing).
- For each entry: renders `<DynamicBlockWrapper>` which:
  - Wraps in `<BlockContentOverride value={{[block.type]: block.content}}>` so `useContent(block.type, ...)` returns block-scoped content.
  - Registers with admin sidebar via `registerSection({key: "PAGE_BLOCKS." + pageKey + "." + i + ".content", label, dynamic: {pageKey, index}})`.
  - Renders the section component from the registry.

### `useContent` extension (`src/hooks/useContent.ts`)

```tsx
export function useContent<T>(key: string, staticValue: T): T {
  const override = useContext(BlockContentOverrideContext);
  if (override && key in override) return override[key] as T;
  // existing admin/content fallback unchanged
  ...
}
```

This is the minimal change that makes existing section components work inside dynamic blocks without prop refactors.

### Picker (`src/components/admin/block-picker.tsx`)

- Modal/sheet (style matches `EditPanel`).
- Lists all registry entries (optionally grouped by category).
- On select:
  1. If `content.PAGE_BLOCKS?.[pageKey]` is undefined → dispatch `applyOpToStore({type:"set", path:"PAGE_BLOCKS", value: {...existing, [pageKey]: []}})` (or two ops).
  2. Dispatch `applyOpToStore({type:"insert", path:"PAGE_BLOCKS." + pageKey, value: {type, id: nanoid(), content: structuredClone(defaultContent)}})`.

### Wiring

- **Sidebar "Block hinzufuegen":** `onClick={() => setPickerOpen(true)}`.
- **AddBlockGaps "+":** same — opens picker instead of just opening sidebar.
- **Picker open/close state:** centralized in `admin-provider.tsx` (`pickerOpen`, `setPickerOpen`) so any trigger can open it.
- **Delete button:** check `section.dynamic` — if present, dispatch `applyOpToStore({type:"delete", path:"PAGE_BLOCKS." + dynamic.pageKey + "." + dynamic.index})`. Otherwise: render disabled with tooltip "Fixe Sektion".

### Mount

- Add `<DynamicBlocks pageKey={...} />` at the end of `src/app/page.tsx`. Other pages mount it later if needed; out-of-scope here.

### EditPanel nested-path support

- Today `EditPanel` does `content[editingSection]` (top-level only).
- Change to walk nested paths via existing `getAt` helper from `content-path.ts`.

## Tasks

1. **`feat(cms): add useContent override context for dynamic blocks`**
   - Edit `src/hooks/useContent.ts` to consult a `BlockContentOverrideContext`.
   - Export the context provider from same file.

2. **`feat(cms): block registry`**
   - New file `src/lib/cms/block-registry.ts`.
   - Imports defaults from `@/lib/constants`.
   - Imports section components.

3. **`feat(cms): DynamicBlocks renderer + per-block sidebar registration`**
   - New file `src/components/cms/DynamicBlocks.tsx`.
   - Extends `RegisteredSection` type in `admin-provider.tsx` with optional `dynamic` metadata.

4. **`feat(cms): block-picker modal`**
   - New file `src/components/admin/block-picker.tsx`.
   - Renders globally; controlled by `pickerOpen` state in `admin-provider.tsx`.

5. **`feat(cms): wire add-block triggers + functional delete-block`**
   - Edit `src/components/admin/admin-sidebar.tsx`: button onClick, delete logic.
   - Edit `src/components/cms/overlay/AddBlockGaps.tsx`: "+" opens picker.
   - Mount `<BlockPicker />` from `admin-provider.tsx`.

6. **`feat(cms): EditPanel nested-path resolution`**
   - Edit `src/components/admin/edit-panel.tsx`: use `getAt` for `sectionContent`.

7. **`feat(cms): mount DynamicBlocks on homepage`**
   - Edit `src/app/page.tsx`: add `<DynamicBlocks pageKey="home" />` at end.

## Out of scope

- Drag&drop reorder
- Insertion between hardcoded blocks
- Per-block-type custom editor (uses generic FieldEditor)
- Soft-deleting hardcoded sections
- Mounting `<DynamicBlocks>` on every page (only homepage in this fix)
- Inline edit overlay (`data-edit-path`) for dynamic blocks — known deferred

## Verification

- `npm run build` clean (no TS errors)
- Manual smoke test in dev server:
  - Add a CTA block via sidebar button → renders at bottom of `/`
  - Edit its headline via sidebar click → SectionCard popup works on nested path
  - Save → PUT to `/api/admin/content` succeeds
  - Reload → block persists
  - Delete via sidebar trash → removed from sidebar + page
  - Hardcoded section delete button → disabled with tooltip

## Deployment safety

- `PAGE_BLOCKS` is optional. Existing content.json unchanged; no migration required.
- Live sites do not yet render `<DynamicBlocks>` (only homepage), so no risk to other pages.
- GitHub content-sync flow (`/api/admin/content` PUT) is unchanged.
