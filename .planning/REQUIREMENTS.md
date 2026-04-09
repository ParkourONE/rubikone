# Requirements: RubikONE CMS — Visual Editor v2

**Defined:** 2026-04-09
**Core Value:** Jedes sichtbare Element auf jeder Seite ist direkt dort editier-, lösch- und duplizierbar — ohne Modal.

## v1 Requirements (v2 des CMS = v1 dieses Projekts)

### Security (Blocker)

- [ ] **SEC-01**: Alle `/api/admin/*` Routes prüfen `isAuthenticated()` im Handler (nicht nur Middleware)
- [ ] **SEC-02**: Middleware verifiziert Session-Cookie per `sha256(admin_session) === admin_token_hash`, nicht nur Präsenz
- [ ] **SEC-03**: `/api/admin/upload` normalisiert `currentPath` gegen Path-Traversal
- [ ] **SEC-04**: `/api/admin/upload` blockiert oder sanitized SVG-Uploads (DOMPurify server-side)
- [ ] **SEC-05**: Login-Endpoint rate-limited (min. per-IP)

### Foundations

- [ ] **FND-01**: Utility `src/lib/content-path.ts` mit parse/get/set/insert/delete/move + Vitest-Coverage
- [ ] **FND-02**: Vitest + @testing-library/react im Projekt eingerichtet (`npm test`)
- [ ] **FND-03**: Sonner Toast-Provider im Admin-Shell
- [ ] **FND-04**: Stabile `_id` (nanoid) auf jedem Block in `content.json` via Migration
- [ ] **FND-05**: Root-Key `__schemaVersion` in `content.json` mit Migration-Chain

### Block Manifest & Schema

- [ ] **MAN-01**: Block-Manifest-System unter `src/lib/blocks/` mit Valibot/Zod discriminated union pro Section
- [ ] **MAN-02**: Jede der 30 Sections hat ein Manifest: editierbare Felder (Typ, Pfad, optional/required, defaults)
- [ ] **MAN-03**: Build-time Validator in CI: `content.json` muss gegen alle Manifeste validieren (Build bricht sonst)
- [ ] **MAN-04**: Save-Pfad validiert gegen Manifest bevor Commit — Reject bei Schema-Verletzung
- [ ] **MAN-05**: `NINE_MOVEMENTS` in `src/lib/constants.ts:30-48` entkoppelt — Bilder in JSON per `_id`, nicht positional gezippt

### Editor Primitives Refactor

- [ ] **PRIM-01**: `InlineText` refactored — uncontrolled während Edit, IME-safe (compositionstart/end), paste-as-plain-text via DOMPurify
- [ ] **PRIM-02**: 30 Sections dekomponiert in wiederverwendbare Primitive (SectionHeader, SectionBody, CTAButton, SectionImage, SectionList, IconBlock)
- [ ] **PRIM-03**: `EditModeContext` + `SelectionContext` Provider im Admin-Shell
- [ ] **PRIM-04**: Zustand-Store ersetzt AdminProvider-Content-State, nutzt immer für Patches
- [ ] **PRIM-05**: Primitive emittieren `data-edit-path` Attribute im Edit-Mode
- [ ] **PRIM-06**: Public-Render lädt keinen Editor-Code (dynamic import unter AdminShell, Bundle-Analyzer-Check)

### Inline Editor (Core Value)

- [ ] **EDIT-01**: Per-Element Hover-Outline mit Portal-basierter Toolbar (Edit / Delete / Duplicate / Move Up / Move Down)
- [ ] **EDIT-02**: Innermost-wins Hover-Detection bei verschachtelten Elementen
- [ ] **EDIT-03**: Inline Text-Editor (plain-text, keine Bold/Italic) für alle Text-Elemente
- [ ] **EDIT-04**: Inline Image-Swap in-place via react-dropzone + browser-image-compression
- [ ] **EDIT-05**: Inline Button-Editor (Label inline + Href in Popover)
- [ ] **EDIT-06**: Inline Link-Editor (Label + Target)
- [ ] **EDIT-07**: Inline Icon-Picker (Lucide via shadcn Command)
- [ ] **EDIT-08**: List-Item Add / Delete / Reorder innerhalb List-Primitiven
- [ ] **EDIT-09**: Delete ist Manifest-gated: required Felder zeigen kein Delete, optional Felder schon
- [ ] **EDIT-10**: Duplicate kopiert Element inkl. neuer `_id` und fügt direkt danach ein
- [ ] **EDIT-11**: Move Up/Down innerhalb Parent-Array
- [ ] **EDIT-12**: Keyboard Shortcuts: Cmd-Z Undo, Cmd-Shift-Z Redo, Cmd-S Save, Esc Deselect, Delete löscht selected
- [ ] **EDIT-13**: Add-Block-Flow über dasselbe Overlay erreichbar (nicht mehr separates Menü)

### State, Persistence & Safety

- [ ] **PERS-01**: Pure Operation Reducer `(tree, op) → {tree, inverse, patches}` via immer, Op-Sum-Typ
- [ ] **PERS-02**: zundo-basiertes Undo/Redo, ≥ 20 Steps
- [ ] **PERS-03**: Neuer Endpoint `PATCH /api/admin/content/patch` mit fetch → apply → validate → commit (sha)
- [ ] **PERS-04**: 3-way merge / 409-Konflikt-Handling: klarer Error-Toast + Reload-Option
- [ ] **PERS-05**: Expliziter Save-Button + Dirty-Pill + `beforeunload`-Warning
- [ ] **PERS-06**: Debounced Persistierung der Patches (Autosave optional, Explicit Save required)
- [ ] **PERS-07**: Optimistic UI für alle Edit-Ops mit Rollback bei Server-Error

### UX Polish

- [ ] **UX-01**: Edit-Mode Toggle (ein/aus) sichtbar im AdminShell
- [ ] **UX-02**: Responsive Preview Desktop / Tablet / Mobile via CSS-Wrapper
- [ ] **UX-03**: Validation-Badges auf Blocks mit Schema-Verletzungen
- [ ] **UX-04**: Reset-Element auf Manifest-Default

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

Wird beim Roadmap-Step befüllt.

---
*Requirements defined: 2026-04-09*
