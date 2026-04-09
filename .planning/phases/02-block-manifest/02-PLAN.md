# Phase 2 — Block Manifest + Schema Migration — Plan

## Scope

Requirements MAN-01 through MAN-05 from `.planning/REQUIREMENTS.md`. Build
the admin-only block manifest registry, author a manifest for every section
in content.json, hook validators into build + save paths, and fix the
NINE_MOVEMENTS positional-zip bug with a schema v2 migration.

## Decisions

- **Zod, not Valibot.** Research suggested Valibot for bundle size; the
  manifests are admin/tooling-only and Phase 3 will enforce lazy loading so
  bytes don't matter. Zod is more ergonomic and we get v4 with `.loose()`
  for passthrough objects.
- **Loose object schemas everywhere.** Migrations will keep adding fields;
  rejecting unknown keys would make every migration a breaking change.
- **Field paths are block-relative**, not content-root-relative. A field
  on HERO_CONTENT is `"headline"`, not `"HERO_CONTENT.headline"`. Makes
  list-item rendering much cleaner in the Phase 3 editor.
- **One manifests.ts file, not one-per-section.** 70 tiny files is noise;
  the single file is 600 lines and greppable. `registerAllManifests()` is
  idempotent so tests can clear and repopulate.
- **tsx for the build validator** instead of writing a bundled .mjs copy.
  Dev-dep only; production build runs the script once then discards.
- **Migration writes content.json in place.** Not a "lazy" runtime-only
  migration: we run the v1→v2 transform as a one-shot script against the
  checked-in file so the repo always reflects the current schema.

## Approach

1. Scaffold `src/lib/blocks/` (types, registry, schemas, helpers).
2. Dump every top-level key shape from content.json and author a manifest
   per key in `manifests.ts`. Check `constants.ts` for any fields that are
   injected post-load (images/icons) — those become manifest fields too
   after the data-move in MAN-05.
3. Write `scripts/validate-content.mjs` (tsx-powered), wire `prebuild` to
   run it.
4. Add validation guard to `/api/admin/content` PUT before the GitHub write.
5. Register migration v1→v2: lift NINE_MOVEMENTS images into the entries,
   update `constants.ts` to passthrough, migrate the checked-in JSON.
6. Vitest coverage for registry, validator, manifests, and the migration.

## Out of Scope

- Primitive refactor (PRIM-*) — Phase 3.
- Any UI wiring of the manifests — Phase 3/4.
- Migrating existing text/image callsites to use paths — Phase 3.
