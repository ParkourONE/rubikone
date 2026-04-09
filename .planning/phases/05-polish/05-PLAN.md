# Phase 5 — Polish: Validation Badges + Reset

**Scope:** UX-03, UX-04. Final phase of the CMS v1 milestone.

## Requirement → Deliverable

| ID     | Requirement                                       | Deliverable                                             |
|--------|---------------------------------------------------|---------------------------------------------------------|
| UX-03  | Validation badges on blocks with schema errors    | `validate-tree.ts`, `ValidationBadges.tsx`, SaveBar gate|
| UX-04  | Reset element to manifest default                 | `RotateCcw` button in `HoverToolbar`, `helpers.ts` defaults |

## Commit plan

1. `feat(cms): validate tree helper + validation badges` — `validate-tree.ts`, `ValidationBadges.tsx`, mount in `CmsOverlayHost`.
2. `feat(cms): gate save button on validation errors` — SaveBar shows red pill, disables Save, `KeyboardShortcuts` blocks Cmd-S when `validateTree` has errors.
3. `feat(cms): add reset-element action to hover toolbar` — `helpers.ts` adds defaults to every FieldSpec kind; `HoverToolbar` renders `RotateCcw` button dispatching `set` op with the FieldSpec `default`.
4. `test(cms): cover validation and reset` — `validate-tree.test.ts` (valid tree empty, invalid populated, null → {}), `reset-default.test.ts` (field defaults exposed).
5. `docs(cms): phase 5 summary` — this file + `05-SUMMARY.md`.

## Milestone close-out

- Update `.planning/STATE.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md` (45 rows → Complete).
- Write `.planning/MILESTONE-SUMMARY.md`.
- Final commit: `docs(milestone): complete v1.0 — CMS visual editor`.
