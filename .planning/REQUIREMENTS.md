# Requirements: RubikONE CMS — Visual Editor v2

**Defined:** 2026-04-09
**Core Value:** Jedes sichtbare Element auf jeder Seite ist direkt dort editier-, lösch- und duplizierbar — ohne Modal.

## v1 Requirements (v2 des CMS = v1 dieses Projekts)

### Security (Blocker)

- [x] **SEC-01**: Alle `/api/admin/*` Routes prüfen `isAuthenticated()` im Handler (nicht nur Middleware)
- [x] **SEC-02**: Middleware verifiziert Session-Cookie per `sha256(admin_session) === admin_token_hash`, nicht nur Präsenz
- [x] **SEC-03**: `/api/admin/upload` normalisiert `currentPath` gegen Path-Traversal
- [x] **SEC-04**: `/api/admin/upload` blockiert oder sanitized SVG-Uploads (DOMPurify server-side)
- [x] **SEC-05**: Login-Endpoint rate-limited (min. per-IP)

### Foundations

- [x] **FND-01**: Utility `src/lib/content-path.ts` mit parse/get/set/insert/delete/move + Vitest-Coverage
- [x] **FND-02**: Vitest + @testing-library/react im Projekt eingerichtet (`npm test`)
- [x] **FND-03**: Sonner Toast-Provider im Admin-Shell
- [x] **FND-04**: Stabile `_id` (nanoid) auf jedem Block in `content.json` via Migration
- [x] **FND-05**: Root-Key `__schemaVersion` in `content.json` mit Migration-Chain

### Block Manifest & Schema

- [x] **MAN-01**: Block-Manifest-System unter `src/lib/blocks/` mit Valibot/Zod discriminated union pro Section
- [x] **MAN-02**: Jede der 30 Sections hat ein Manifest: editierbare Felder (Typ, Pfad, optional/required, defaults)
- [x] **MAN-03**: Build-time Validator in CI: `content.json` muss gegen alle Manifeste validieren (Build bricht sonst)
- [x] **MAN-04**: Save-Pfad validiert gegen Manifest bevor Commit — Reject bei Schema-Verletzung
- [x] **MAN-05**: `NINE_MOVEMENTS` in `src/lib/constants.ts:30-48` entkoppelt — Bilder in JSON per `_id`, nicht positional gezippt

### Editor Primitives Refactor

- [x] **PRIM-01**: `InlineText` refactored — uncontrolled während Edit, IME-safe (compositionstart/end), paste-as-plain-text via DOMPurify
- [x] **PRIM-02**: 30 Sections dekomponiert in wiederverwendbare Primitive (SectionHeader, SectionBody, CTAButton, SectionImage, SectionList, IconBlock)
- [x] **PRIM-03**: `EditModeContext` + `SelectionContext` Provider im Admin-Shell
- [x] **PRIM-04**: Zustand-Store ersetzt AdminProvider-Content-State, nutzt immer für Patches
- [x] **PRIM-05**: Primitive emittieren `data-edit-path` Attribute im Edit-Mode
- [x] **PRIM-06**: Public-Render lädt keinen Editor-Code (dynamic import unter AdminShell, Bundle-Analyzer-Check)

### Inline Editor (Core Value)

- [x] **EDIT-01**: Per-Element Hover-Outline mit Portal-basierter Toolbar (Edit / Delete / Duplicate / Move Up / Move Down)
- [x] **EDIT-02**: Innermost-wins Hover-Detection bei verschachtelten Elementen
- [x] **EDIT-03**: Inline Text-Editor (plain-text, keine Bold/Italic) für alle Text-Elemente
- [x] **EDIT-04**: Inline Image-Swap in-place via react-dropzone + browser-image-compression
- [x] **EDIT-05**: Inline Button-Editor (Label inline + Href in Popover)
- [x] **EDIT-06**: Inline Link-Editor (Label + Target)
- [x] **EDIT-07**: Inline Icon-Picker (Lucide via shadcn Command)
- [x] **EDIT-08**: List-Item Add / Delete / Reorder innerhalb List-Primitiven
- [x] **EDIT-09**: Delete ist Manifest-gated: required Felder zeigen kein Delete, optional Felder schon
- [x] **EDIT-10**: Duplicate kopiert Element inkl. neuer `_id` und fügt direkt danach ein
- [x] **EDIT-11**: Move Up/Down innerhalb Parent-Array
- [x] **EDIT-12**: Keyboard Shortcuts: Cmd-Z Undo, Cmd-Shift-Z Redo, Cmd-S Save, Esc Deselect, Delete löscht selected
- [x] **EDIT-13**: Add-Block-Flow über dasselbe Overlay erreichbar (nicht mehr separates Menü)

### State, Persistence & Safety

- [x] **PERS-01**: Pure Operation Reducer `(tree, op) → {tree, inverse, patches}` via immer, Op-Sum-Typ
- [x] **PERS-02**: zundo-basiertes Undo/Redo, ≥ 20 Steps
- [x] **PERS-03**: Neuer Endpoint `PATCH /api/admin/content/patch` mit fetch → apply → validate → commit (sha)
- [x] **PERS-04**: 3-way merge / 409-Konflikt-Handling: klarer Error-Toast + Reload-Option
- [x] **PERS-05**: Expliziter Save-Button + Dirty-Pill + `beforeunload`-Warning
- [x] **PERS-06**: Debounced Persistierung der Patches (Autosave optional, Explicit Save required)
- [x] **PERS-07**: Optimistic UI für alle Edit-Ops mit Rollback bei Server-Error

### UX Polish

- [x] **UX-01**: Edit-Mode Toggle (ein/aus) sichtbar im AdminShell
- [x] **UX-02**: Responsive Preview Desktop / Tablet / Mobile via CSS-Wrapper
- [x] **UX-03**: Validation-Badges auf Blocks mit Schema-Verletzungen
- [x] **UX-04**: Reset-Element auf Manifest-Default

## v2 Requirements (später)

### Differentiators

- **DIFF-01**: Diff-Preview vor Save (welche Felder ändern sich)
- **DIFF-02**: Git-Blame on hover (wer hat dieses Element zuletzt geändert, wann)
- **DIFF-03**: Wireframe-Mode (Layout ohne Content)
- **DIFF-04**: Element-TOC Sidebar (alle Elemente einer Seite als Liste)
- **DIFF-05**: Alt-Text-Popover für Bilder
- **DIFF-06**: Element-level Drag-and-Drop (statt nur Up/Down)
- **DIFF-07**: Rich-Text-Editor (Tiptap) für Text-Elemente
- **DIFF-08**: KV-Draft-Store (speichern ohne Deploy)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Realtime-Kollaboration (CRDT/Yjs) | 1-3 Editoren, hoher Komplexitätsaufwand |
| In-Browser-Block-Builder | Blocks bleiben code-defined, kein UI-Generator |
| Page-Routing/neue Seiten im CMS | Routes bleiben Next App Router, nicht Content-driven |
| Internationalisierung des Editors | Content Deutsch, Editor Deutsch |
| Style/Color-Picker | Design-System hart definiert, kein Freistil |
| Multi-User-Permissions / Rollen | 1 Rolle (Admin) reicht |
| Mobile-Editor (Editing auf Handy) | Editoren arbeiten am Desktop |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEC-01 | Phase 1 | Complete |
| SEC-02 | Phase 1 | Complete |
| SEC-03 | Phase 1 | Complete |
| SEC-04 | Phase 1 | Complete |
| SEC-05 | Phase 1 | Complete |
| FND-01 | Phase 1 | Complete |
| FND-02 | Phase 1 | Complete |
| FND-03 | Phase 1 | Complete |
| FND-04 | Phase 1 | Complete |
| FND-05 | Phase 1 | Complete |
| MAN-01 | Phase 2 | Complete |
| MAN-02 | Phase 2 | Complete |
| MAN-03 | Phase 2 | Complete |
| MAN-04 | Phase 2 | Complete |
| MAN-05 | Phase 2 | Complete |
| PRIM-01 | Phase 3 | Complete |
| PRIM-02 | Phase 3 | Complete |
| PRIM-03 | Phase 3 | Complete |
| PRIM-04 | Phase 3 | Complete |
| PRIM-05 | Phase 3 | Complete |
| PRIM-06 | Phase 3 | Complete |
| EDIT-01 | Phase 4 | Complete |
| EDIT-02 | Phase 4 | Complete |
| EDIT-03 | Phase 4 | Complete |
| EDIT-04 | Phase 4 | Complete |
| EDIT-05 | Phase 4 | Complete |
| EDIT-06 | Phase 4 | Complete |
| EDIT-07 | Phase 4 | Complete |
| EDIT-08 | Phase 4 | Complete |
| EDIT-09 | Phase 4 | Complete |
| EDIT-10 | Phase 4 | Complete |
| EDIT-11 | Phase 4 | Complete |
| EDIT-12 | Phase 4 | Complete |
| EDIT-13 | Phase 4 | Complete |
| PERS-01 | Phase 4 | Complete |
| PERS-02 | Phase 4 | Complete |
| PERS-03 | Phase 4 | Complete |
| PERS-04 | Phase 4 | Complete |
| PERS-05 | Phase 4 | Complete |
| PERS-06 | Phase 4 | Complete |
| PERS-07 | Phase 4 | Complete |
| UX-01 | Phase 4 | Complete |
| UX-02 | Phase 4 | Complete |
| UX-03 | Phase 5 | Complete |
| UX-04 | Phase 5 | Complete |

**Coverage:** 45/45 v1 requirements mapped.

---
*Requirements defined: 2026-04-09; traceability added 2026-04-09*
