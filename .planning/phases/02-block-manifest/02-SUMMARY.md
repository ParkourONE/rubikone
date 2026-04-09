# Phase 2 — Block Manifest + Schema Migration — Summary

All 5 requirements shipped. `npm run build` passes (validator + next build).
`npm test` green: 38/38 tests across 3 files.

## Requirement → Commit

| ID     | Requirement                                                       | Commit    |
|--------|-------------------------------------------------------------------|-----------|
| MAN-01 | Block manifest registry + types under `src/lib/blocks/`           | `83cb641` |
| MAN-02 | Manifest for every section (70 blocks) in `manifests.ts`          | `4ee4e15` |
| MAN-03 | Build-time validator wired via `prebuild`                         | `119e136` |
| MAN-04 | Save-path validation in `/api/admin/content` PUT                  | `39bd04a` |
| MAN-05 | NINE_MOVEMENTS image decoupling + schema v2 migration             | `f894d92` |
| tests  | Registry, validator, manifest, migration coverage                 | `beb9041` |

## Key Decisions

- **Zod v4** (loose objects) chosen over Valibot. Admin/tooling-only, so
  public bundle is unaffected; ergonomics won.
- **Single `manifests.ts`** with 70 blocks instead of 70 files, plus
  `registerAllManifests()` so tests can re-seed the registry after
  `clearRegistry()`.
- **tsx** is a new dev-dep, used only by `scripts/validate-content.mjs`.
- **`npm test`** now runs `vitest run` (non-interactive). Prior default
  was `vitest` (watch), which blocked CI.
- **`prebuild`** hook runs the validator so `next build` fails fast on
  bad content.
- **Field paths are block-relative** (e.g. `"ctaPrimary.label"`), not
  content-root-relative. Phase 3 primitives will compose the full path.
- **Schema v2 migration** runs via the existing chain AND we eagerly
  wrote the migrated JSON into the repo so the source of truth always
  matches the current version.

## Discoveries / Deviations

- The build failed once on a missing `RESEND_API_KEY`; this is Phase 1
  legacy (Resend constructor runs at module eval) and not a Phase 2
  regression. Build passes when env is set.
- `PAGE_BLOCKS` and `IMAGE_CONCEPTS` got manifests with empty `fields: []`
  because they aren't directly rendered as editable user content —
  PAGE_BLOCKS is the admin page-block register, IMAGE_CONCEPTS is internal
  brief notes. They still have schemas to guard shape on save.
- `STAKEHOLDER_BENEFITS` and `PARKOURONE_STORY` have deeply-nested shapes
  where not every leaf is marked as a field yet — followups can enrich
  `fields` without schema changes. Phase 3 primitive refactor will call
  out any gaps.

## For Phase 3 (primitives refactor)

- **Import boundary**: `src/lib/blocks/**` is admin-only. When you wire
  primitives, pull manifest data via dynamic import inside the
  EditModeProvider — never statically from a `components/sections/*.tsx`.
- **Registry contract**: `listBlocks()` returns manifests; iterate
  `manifest.fields` to render per-field hover targets. FieldSpec `path`
  is block-relative — prepend the block id (= content.json top-level key)
  to build a `content-path.ts` path.
- **List fields**: `kind: "list"` has `itemFields`; use path `""` for
  item-root when the list items are primitives themselves (e.g.
  `NAVIGATION_ITEMS`, `TRUST_STATS`).
- **required flag**: drives whether Delete is exposed in the hover
  toolbar (EDIT-09). Currently most sibling text fields are marked
  required because the render code crashes without them; images and
  CTAs are optional. Phase 3 may want to relax more of these after
  auditing render fallbacks.
- **Zod schemas are `loose()`**: adding a new field in a later phase is
  a non-breaking change; you just add it to the manifest when it should
  become editable.
- **Migration chain** is at v2. To add another, push into
  `migrations[2]` in `src/lib/content-migrations.ts` and bump
  `CURRENT_SCHEMA_VERSION`.
