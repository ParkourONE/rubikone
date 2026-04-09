# Phase 3 — Editor Primitives Refactor — Plan

Scope: pure refactor. Public rendering unchanged. Deliver the foundation
Phase 4 (hover toolbar + inline editors) will sit on top of.

## Requirement → Commit map (target)

| ID      | Requirement                                         | Commit |
|---------|-----------------------------------------------------|--------|
| PRIM-01 | Rewrite InlineText (IME/paste/race-safe) + tests    | 1      |
| PRIM-02 | `src/components/cms/primitives/*`                   | 2      |
| PRIM-03 | Migrate ~8 representative sections to primitives    | 3      |
| PRIM-04 | Edit-mode + selection contexts                      | 4      |
| PRIM-05 | Zustand + immer editor store                        | 5      |
| PRIM-06 | `data-edit-path` emission in edit mode              | 6      |
| bundle  | Editor code kept out of public bundle               | 7      |

## Key decisions

- **Compat with existing `useContent()`** — the primitives use `useContent()`
  semantics (public reads constants; admin reads live tree). PRIM-04's
  zustand store is hydrated from the admin provider on mount; in this
  phase the AdminProvider remains the single writer. Phase 4 will flip
  that around.
- **Primitives live at `src/components/cms/primitives/`** so they can
  share an admin context without forcing public code to import admin deps.
- **InlineText is pure DOM-level**: no admin context coupling. It
  accepts `value`, `onChange`, `editable`, `multiline`. The current
  `src/components/admin/inline-text.tsx` becomes a thin wrapper that
  keeps its old API (content-key/field) using the new component.
- **No HTTP changes** — `/api/admin/content` PUT still handles saves.
