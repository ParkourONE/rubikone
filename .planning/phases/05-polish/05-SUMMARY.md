# Phase 5 — Polish: Validation + Reset — Summary

Status: shipped. `npm test` green: 78/78 across 12 files (72 from Phase 4 +
3 validate-tree + 3 reset-default). `tsc --noEmit` clean for Phase 5
surface (pre-existing `.next/dev/types/validator.ts` stub error unrelated).

## Requirement → Commit

| ID     | Requirement                                          | Commit    |
|--------|------------------------------------------------------|-----------|
| UX-03  | Validation badges on blocks with schema violations   | `7f7aed9` (badges) + `6bf906e` (save gate) |
| UX-04  | Reset element to manifest default                    | `ffadfbe` |
| Tests  | validate-tree + reset-default field visibility       | `512a29a` |

## Key decisions

- **Debounced validation, single source.** `useValidationMap()` runs a
  200ms debounce on `editorStore.content`. Both the overlay badges and
  the SaveBar summary pill consume the same hook so the count never
  diverges between them. `KeyboardShortcuts` re-runs `validateTree`
  synchronously on Cmd-S so the gate is authoritative regardless of
  React render state.
- **One badge per block.** The scanner walks every `[data-edit-path]`
  whose first segment is a flagged block id and renders a single red
  dot at the top-right of the outermost match. Tooltip lists
  `${path}: ${message}` lines for every offending field. This keeps the
  overlay readable even when a block has many issues.
- **Save gating is layered.** (a) the Save button is `disabled` when
  `validationErrors > 0`; (b) the button's `onClick` short-circuits to
  a `toast.error` for keyboard or accessibility users who bypass the
  disabled state; (c) `KeyboardShortcuts` intercepts Cmd-S before it
  reaches `useSave`. Belt and suspenders.
- **Defaults on every FieldSpec builder.** `helpers.ts` now seeds every
  kind (`text=""`, `image=""`, `button={label:"",href:""}`,
  `icon="HelpCircle"`, …). This means Reset is universally available
  without touching any per-block manifest. Manifests can still override
  via `{ default: ... }` when they need a richer seed.
- **Reset is scoped to non-list scalar paths.** Array items already
  have Duplicate/Delete — the Reset button is hidden when
  `isArrayItem` to avoid ambiguity with "reset to empty item". If a
  future request surfaces, list items can be reset by resolving the
  list's `itemFields` defaults — the plumbing is in place.
- **No public-bundle regression.** All Phase 5 modules live under
  `src/lib/cms/**` and `src/components/cms/overlay/**`, both already
  admin-only per Phase 3. Nothing is statically imported from public
  components.

## What ships

- `src/lib/cms/validate-tree.ts` — `validateTree(tree)` + `countIssues(map)`.
- `src/components/cms/overlay/ValidationBadges.tsx` — `useValidationMap`,
  `useValidationErrorCount`, `ValidationBadges` portal.
- `src/components/cms/overlay/SaveBar.tsx` — red pill, disabled Save,
  toast-on-click when blocked.
- `src/components/cms/overlay/KeyboardShortcuts.tsx` — Cmd-S toast gate.
- `src/components/cms/overlay/HoverToolbar.tsx` — RotateCcw button.
- `src/lib/blocks/helpers.ts` — FieldSpec defaults for all kinds.
- Tests: `validate-tree.test.ts`, `reset-default.test.ts`.
