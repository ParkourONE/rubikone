# Milestone v1 — CMS Visual Editor — Summary

**Shipped:** 2026-04-09
**Scope:** 45 requirements across 5 phases.
**Tests:** 78/78 green across 12 files.
**Final commit (pre-close-out):** `18019e7` (docs(cms): phase 5 summary).

## Core value delivered

> Jedes sichtbare Element auf jeder Seite ist direkt dort editier-,
> loesch- und duplizierbar — ohne Modal.

Editors hover any element in the admin shell, see a floating toolbar
with Edit / Duplicate / Move / Delete / Reset, commit changes inline,
undo/redo via Cmd-Z / Cmd-Shift-Z, and save via Cmd-S with optimistic
rollback and 409 conflict handling.

## Phase rollup

| Phase | Scope                                               | Requirements | Summary                                  |
|-------|-----------------------------------------------------|--------------|------------------------------------------|
| 1     | Security + Foundations                              | 10 (SEC + FND)| `.planning/phases/01-security-foundations/` |
| 2     | Block Manifest + Schema                             | 5 (MAN)      | `.planning/phases/02-block-manifest/`    |
| 3     | Editor Primitives Refactor                          | 6 (PRIM)     | `.planning/phases/03-primitives-refactor/` |
| 4     | Edit Overlay + Inline Editors (core value)         | 22 (EDIT + PERS + UX-01/02) | `.planning/phases/04-edit-overlay/04-SUMMARY.md` |
| 5     | Polish — Validation + Reset                         | 2 (UX-03/04) | `.planning/phases/05-polish/05-SUMMARY.md` |

## Key architectural guarantees

- **Admin-only bundle boundary.** Every editor module lives under
  `src/lib/cms/**` or `src/components/cms/**` and is only reachable
  through the dynamically-imported admin provider. Public chunks
  contain zero editor code.
- **`content.json` is the source of truth.** All edits round-trip via
  `POST /api/admin/content/patch` with SHA conflict handling and
  manifest-gated validation on the server.
- **Manifest-first.** Every section has a zod-backed manifest with
  FieldSpecs; delete gating, reset defaults, and save-side validation
  all read from the same registry.
- **Operation reducer + undo.** Pure `applyOp` returns immer patches;
  `zundo` wraps the editor store with a 50-step history that tracks
  only `content` so sha/dirty/pendingOps never desync.
- **Optimistic UI + rollback.** `takeSnapshot` / `restoreSnapshot`
  wrap the PATCH round-trip; failures toast + rollback without losing
  the user's ops queue.

## Known caveats / deferred

- 3-way rebase on 409 is explicitly a v2.1 call — v1 discards local
  edits and reloads. A `window.confirm` guards the discard.
- Autosave scaffold ships OFF by default (`cms:autosave` flag); flip
  to default-on is v2.1.
- Reset is currently scoped to non-list scalars; list items still
  rely on Duplicate/Delete. Plumbing is in place for list-item reset.
- Badges show one dot per block (outermost match). Per-field badges
  are deferred.
- The pre-existing `.next/dev/types/validator.ts` stub error from the
  old Tina route is unrelated to this milestone.

See `.planning/REQUIREMENTS.md` for the 45-row traceability table and
each phase's SUMMARY.md for detailed decisions and commit hashes.
