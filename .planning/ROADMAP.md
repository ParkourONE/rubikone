# Roadmap: RubikONE CMS — Visual Editor v2

**Milestone:** v1
**Created:** 2026-04-09
**Granularity:** standard
**Core Value:** Jedes sichtbare Element auf jeder Seite ist direkt dort editier-, loesch- und duplizierbar — ohne Modal.

## Phases

- [ ] **Phase 1: Security + Foundations** — Admin-API haerten und Utility-Infra (path helpers, tests, ids, schema version) anlegen
- [ ] **Phase 2: Block Manifest + Schema** — Discriminated schemas pro Section inkl. Build-Validator und NINE_MOVEMENTS-Fix
- [ ] **Phase 3: Editor Primitives Refactor** — InlineText sanieren, 30 Sections in Primitive zerlegen, Editor-Store und Contexts
- [ ] **Phase 4: Edit Overlay + Inline Editors (Core Value)** — Hover-Toolbar, Inline-Editoren, Operation Reducer, Undo/Redo, PATCH-Persistenz
- [ ] **Phase 5: Polish — Validation + Reset + Responsive Preview** — UX-03/UX-04 Badges und Reset, finaler Bundle-Check

## Phase Details

### Phase 1: Security + Foundations
**Goal**: Admin-API ist nicht mehr oeffentlich und die Editor-Arbeit hat eine getestete Basis (path helpers, stabile block-ids, schema version, toast infra).
**Depends on**: Nothing
**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, FND-01, FND-02, FND-03, FND-04, FND-05
**Success Criteria** (what must be TRUE):
  1. Unauthentifizierte Requests auf `/api/admin/*` bekommen 401, auch wenn Cookies manuell gesetzt werden (hash-verify).
  2. `/api/admin/upload` lehnt Path-Traversal und unsanitized SVGs ab; Login-Endpoint rate-limited.
  3. `src/lib/content-path.ts` existiert mit parse/get/set/insert/delete/move und gruener Vitest-Suite (`npm test`).
  4. `content.json` hat `__schemaVersion` und jeder Block eine stabile `_id` (nanoid) via Migration.
  5. Sonner-Toasts sind im Admin-Shell verfuegbar.
**Plans**: TBD

### Phase 2: Block Manifest + Schema
**Goal**: Jede Section ist durch ein Manifest mit Valibot/Zod discriminated union beschrieben und der Save-Pfad validiert gegen das Manifest.
**Depends on**: Phase 1
**Requirements**: MAN-01, MAN-02, MAN-03, MAN-04, MAN-05
**Success Criteria** (what must be TRUE):
  1. Unter `src/lib/blocks/` existiert ein Registry mit Manifest + Schema fuer alle 30 Sections.
  2. `content.json` validiert gegen `PageSchema`; CI bricht bei Schema-Verletzung.
  3. `PUT`/`PATCH /api/admin/content` weist Writes zurueck, die nicht gegen das Manifest valide sind.
  4. `NINE_MOVEMENTS` ist entkoppelt: Bilder leben in der JSON-Entry pro `_id`, nicht positional in `constants.ts`.
**Plans**: TBD

### Phase 3: Editor Primitives Refactor
**Goal**: Saubere, IME-sichere Editor-Primitive und ein zustand-basiertes Editor-Store ersetzen die bestehende Modal-first Architektur auf Code-Ebene (ohne UX-Regression).
**Depends on**: Phase 2
**Requirements**: PRIM-01, PRIM-02, PRIM-03, PRIM-04, PRIM-05, PRIM-06
**Success Criteria** (what must be TRUE):
  1. `InlineText` ist uncontrolled waehrend Edit, IME-safe und sanitized paste — oeffentliche Seite rendert identisch.
  2. Die 30 Sections bestehen aus wiederverwendbaren Primitiven (Header/Body/CTA/Image/List/Icon).
  3. `EditModeContext` + `SelectionContext` sind aktiv; Primitive emittieren `data-edit-path` nur im Admin.
  4. Editor-State lebt im zustand-Store mit immer-Patches statt tiefen JSON-Clones.
  5. Bundle-Analyzer zeigt: public chunks enthalten keinen Editor-Code.
**UI hint**: yes
**Plans**: TBD

### Phase 4: Edit Overlay + Inline Editors (Core Value)
**Goal**: Jedes sichtbare Element ist direkt dort per Hover-Toolbar editier-, loesch-, duplizier- und umsortierbar — inline, ohne Modal. Aenderungen persistieren live via PATCH mit Undo/Redo und optimistic UI.
**Depends on**: Phase 3
**Requirements**: EDIT-01, EDIT-02, EDIT-03, EDIT-04, EDIT-05, EDIT-06, EDIT-07, EDIT-08, EDIT-09, EDIT-10, EDIT-11, EDIT-12, EDIT-13, PERS-01, PERS-02, PERS-03, PERS-04, PERS-05, PERS-06, PERS-07, UX-01, UX-02
**Success Criteria** (what must be TRUE):
  1. Hover auf jedem Element zeigt Outline + Portal-Toolbar mit Edit/Delete/Duplicate/Move Up/Down; innermost wins.
  2. Text, Image, Button, Link, Icon und List-Items sind inline editierbar; Delete ist manifest-gated.
  3. Cmd-Z / Cmd-Shift-Z / Cmd-S / Esc / Delete funktionieren; Undo-Historie >= 20 Steps.
  4. `PATCH /api/admin/content/patch` committed validierte Patches mit sha; 409 zeigt einen klaren Conflict-Toast mit Reload-Option.
  5. Edit-Mode-Toggle und Responsive-Preview (Desktop/Tablet/Mobile) sind im AdminShell erreichbar.
  6. Add-Block-Flow laeuft ueber dasselbe Overlay wie die Per-Element-Controls.
**UI hint**: yes
**Plans**: TBD

### Phase 5: Polish — Validation + Reset + Responsive Preview
**Goal**: Editoren sehen sofort, wenn Bloecke Schema-Verletzungen haben, koennen Elemente auf Manifest-Defaults zuruecksetzen, und der Build bleibt sauber fuer Production.
**Depends on**: Phase 4
**Requirements**: UX-03, UX-04
**Success Criteria** (what must be TRUE):
  1. Bloecke mit Schema-Verletzungen zeigen ein sichtbares Validation-Badge mit Detail-Tooltip.
  2. Jedes Element hat eine Reset-Aktion, die den Manifest-Default wiederherstellt.
  3. Vitest-Suite deckt path helpers, reducer, manifest validation und auth ab; `npm test` ist in CI gruen.
  4. Bundle-Analyzer-Report dokumentiert, dass Editor-Code ausschliesslich unter Admin geladen wird.
**UI hint**: yes
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Security + Foundations | 0/0 | Not started | - |
| 2. Block Manifest + Schema | 0/0 | Not started | - |
| 3. Editor Primitives Refactor | 0/0 | Not started | - |
| 4. Edit Overlay + Inline Editors | 0/0 | Not started | - |
| 5. Polish — Validation + Reset | 0/0 | Not started | - |

## Coverage

All 45 v1 requirements mapped to exactly one phase. No orphans.

---
*Roadmap created: 2026-04-09*
