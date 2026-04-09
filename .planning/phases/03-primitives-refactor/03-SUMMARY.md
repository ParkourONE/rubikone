# Phase 3 — Editor Primitives Refactor — Summary

All 6 requirements shipped. `npm run build` passes. `npm test` green: 45/45
across 4 files (includes 7 new InlineText tests).

## Requirement → Commit

| ID      | Requirement                                                      | Commit   |
|---------|------------------------------------------------------------------|----------|
| PRIM-01 | Rewrite InlineText (IME/paste/race-safe) + tests                 | `d438b29` |
| PRIM-02 | Primitives (Text, Heading, Image, Button, Link, Icon, List)      | `7650c05` |
| PRIM-03 | Edit-mode + Selection contexts                                   | `7650c05` |
| PRIM-04 | Zustand + immer editor store                                     | `7650c05` |
| PRIM-05 | `data-edit-path` emission across 8 sections                      | `376bc9c` |
| PRIM-06 | Editor code kept out of public bundle                            | `8e1c51f` |

(`7650c05` bundles PRIM-02/03/04 because they are three small co-located
modules introduced in one logical step.)

## Key decisions

- **InlineText is a standalone primitive** — zero admin-provider coupling.
  Lives at `src/components/cms/InlineText.tsx`. The legacy
  `src/components/admin/inline-text.tsx` is now a thin compat shim that
  delegates to the new primitive so any future call sites using the old
  `contentKey/field` API keep working.
- **Primitives read values as props** (not via content paths). This keeps
  public-page render one pure pass-through with zero overhead. Admin
  wiring for path-based reads will happen in Phase 4 when primitives are
  swapped into more sections.
- **`useEditPath()` helper** — rather than forcing 8 sections to wrap
  every leaf in `<CmsText>`/`<CmsHeading>` (which would require teaching
  primitives to accept `motion.*` as `as`), we exposed a tiny hook that
  returns `{'data-edit-path': path}` in edit mode and `{}` in public.
  Sections spread it onto existing elements — guaranteed pixel-identical
  public render.
- **Admin store hydration via compat layer**: AdminProvider still owns
  content writes in Phase 3. It additionally mirrors loaded content into
  the new zustand store via dynamic `import()`. Phase 4 will flip
  ownership — primitives will read through the store and PATCHes will
  write through it.
- **Bundle isolation via dynamic import**: the single static import of
  `@/lib/cms/editor-store` would have leaked zustand + immer into the
  public bundle (because `admin-provider.tsx` is imported at the root
  layout even when public). The dynamic `import()` inside the admin-only
  loadContent effect solves it. Verified: `.next/server/app/page.js`
  contains zero `editor-store|immer|zustand` references; a dedicated
  `src_lib_cms_editor-store_ts_*.js` split chunk is produced.

## Sections migrated (8)

| Section            | Paths emitted                                     |
|--------------------|----------------------------------------------------|
| hero-section       | HERO_CONTENT.headline, .subheadline, .ctaPrimary   |
| cta-section        | CTA_CONTENT.headline, .subheadline                 |
| problem-section    | PROBLEM_CONTENT.statistic/.statisticLabel/.headline/.subheadline/.source |
| stats-section      | STATS_CONTENT.tagline, .headline                   |
| testimonials       | TESTIMONIALS (list root)                           |
| trust-signals      | TRUST_STATS (list root)                            |
| image-gallery      | GALLERY_CONTENT.tagline, .headline                 |
| faq-section        | FAQ_ITEMS (list root)                              |

## Sections remaining (~22)

bento-grid, comparison-table, configurator-cta-section, configurator-overlay,
contact-form, lerndimensionen-section, movements-grid, parkourone-story,
posten-page, pricing-section, process-section, prozess-teaser,
solution-section, usp-section, video-section, vorher-nachher-teaser,
was-waere-wenn-hook, and a few more. Phase 4 will migrate these as needed
by the hover toolbar + inline editor UI — the mechanics (useEditPath
helper, primitives, contexts) are already in place.

## Bundle verification

- `.next/server/app/page.js` — zero matches for `editor-store|immer|zustand`.
- `.next/server/chunks/ssr/src_lib_cms_editor-store_ts_*.js` — dedicated
  split chunk confirms dynamic code-splitting worked.
- `edit-mode-context` ships on public pages but is intentional and tiny
  (pure React contexts, no runtime deps). Its default values mean public
  pages need no provider.

## For Phase 4

- **Primitives public API**: `CmsText`, `CmsHeading`, `CmsImage`,
  `CmsButton`, `CmsLink`, `CmsIcon`, `CmsList` from
  `@/components/cms/primitives`. Each accepts `editPath?: string`. Plus
  `useEditPath(editPath?)` for sections that prefer spreading attrs onto
  existing DOM (e.g. `motion.*`) instead of swapping the tag.
- **Store shape** (`@/lib/cms/editor-store`):
  ```ts
  { content: ContentTree | null, sha: string | null, dirty: boolean,
    setContent(content, sha), applyPatch((draft) => void), markClean(),
    getValueAtPath(path) }
  ```
  `applyPatch` uses immer; wrap it with `zundo` in Phase 4 for undo/redo.
- **Selection**: `useSelection()` returns `{selectedPath, setSelectedPath}`.
  Nothing reads it yet — Phase 4's hover toolbar + click-to-select flow
  should consume it.
- **Edit mode**: `useEditMode()` → `{editMode, setEditMode}`. Currently
  initialised to `true` inside `AdminProviderInner`; a future toggle
  button can flip it to preview the public look.
- **Ownership flip**: Phase 3 left AdminProvider as the single writer.
  Phase 4 should route writes through `applyPatch` and wire the PATCH
  endpoint for granular saves (EDIT-05 from REQUIREMENTS).
- **Bundle boundary**: any new editor-only module (manifest consumers,
  patch clients, undo stack) MUST be dynamically imported from
  `admin-provider.tsx` OR placed behind `next/dynamic({ssr:false})`.
- **InlineText is reusable**: the real inline editor UI in Phase 4 can
  mount `<InlineText value={...} editable onChange={...} multiline>`
  directly; it handles IME, paste sanitisation and cursor preservation.
