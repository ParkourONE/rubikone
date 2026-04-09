# RubikONE CMS — Visual Editor v2

## What This Is

Ein Divi-artiger, nativer Visual Page Builder für die RubikONE Marketing-Website (rubikone.ch). Admins bearbeiten alle Seiten direkt inline auf der gerenderten Seite — kein Modal-Zwang, Elemente per Hover editieren, löschen, duplizieren, umsortieren — und speichern live via GitHub API zurück in `content.json`. Zielgruppe: ParkourONE-Team (1-3 Editoren, nicht-technisch).

## Core Value

**Jedes sichtbare Element auf jeder Seite ist direkt dort, wo es steht, editier-, lösch- und duplizierbar — ohne Modal, ohne Umweg über ein separates Form.**

Wenn alles andere schiefgeht: Inline-Editing mit Per-Element-Hover-Controls muss funktionieren.

## Requirements

### Validated

<!-- Aus bestehender Codebase (siehe .planning/codebase/ARCHITECTURE.md) -->

- ✓ Next.js 16 / React 19 App Router Marketing-Site mit 20+ Unterseiten — existing
- ✓ Admin-Panel mit Passwort-Login + Session-Cookie — existing (aber unsicher, siehe Active)
- ✓ Admin-UI zum Hinzufügen von Section-Blöcken — existing (commit 3fe5231)
- ✓ Rudimentäres Inline Text-Editing (`InlineText` contentEditable) — existing (commit 7bb6d41, 7f4adc5)
- ✓ `content.json` als Single Source of Truth, importiert via `lib/constants.ts` — existing
- ✓ GitHub-API-Sync: `/api/admin/content` PUT schreibt Änderungen zurück ins Repo — existing
- ✓ 30 Section-Komponenten unter `src/components/sections/` — existing

### Active

**Sicherheits-Fixes (Blocker, müssen zuerst):**

- [ ] `/api/admin/*` Routes hinter echter Auth-Prüfung (`isAuthenticated()` im Handler, nicht nur Middleware)
- [ ] Middleware verifiziert Session-Token per `sha256(admin_session) === admin_token_hash` statt nur Cookie-Präsenz
- [ ] `/api/admin/upload` härten: SVG blockieren oder sanitizen, `currentPath` normalisieren gegen Path-Traversal

**CMS v2 — Visual Editor:**

- [ ] Block-Manifest-System: jede Section deklariert ihre editierbaren Elemente (Typ, Pfad, optional/required) — ermöglicht Element-Delete ohne Runtime-Crashes
- [ ] Refactor: 30 Sections in kleinere Module splitten (Header, Body, CTA, Image, List usw.) als wiederverwendbare Primitive
- [ ] Per-Element Hover-Toolbar auf jeder Seite im Edit-Mode: Edit / Delete / Duplicate / Move Up/Down
- [ ] Inline-Editing für alle Element-Typen: Text (contentEditable), Image (Upload-Dropzone), Button (Label + Href inline), Icon (Picker), Link, List-Items
- [ ] Live-Persistenz: Änderungen werden debounced via `/api/admin/content` PATCH gespeichert (optimistic UI + error toast)
- [ ] Undo/Redo mindestens innerhalb einer Session
- [ ] Block-Add-Flow beibehalten, aber aus demselben Overlay wie Per-Element-Controls zugänglich
- [ ] `content.json` Schema-Migration: flexibles, discriminated Schema statt fixer Shapes (Vorbereitung für Element-Delete)

**Latente Bugs auf dem Weg:**

- [ ] `NINE_MOVEMENTS` in `src/lib/constants.ts:30-48` entkoppeln — Bilder nicht mehr positional zippen

### Out of Scope

- Multi-User-Editing / Realtime-Kollaboration — 1-3 Editoren, kein Bedarf
- Versionierung/Rollback-UI innerhalb des CMS — Git-History reicht als Audit-Trail
- Custom-Block-Builder im Browser (User bauen neue Block-Typen aus Code, nicht im UI) — Scope-Explosion
- Page-Routing/neue Seiten erstellen im CMS — Routes bleiben code-defined (Next App Router)
- Drag-and-Drop auf Element-Ebene — Up/Down-Buttons reichen für v2 (später evtl. Erweiterung)
- Internationalisierung des Editors — Inhalte sind Deutsch, Editor kann Deutsch sein
- WYSIWYG Rich-Text (Bold/Italic/Links im Text) — v2 = Plain-Text inline; Rich-Text v3

## Context

- **Bestehende CMS-Architektur** (siehe `.planning/codebase/ARCHITECTURE.md`, `CONCERNS.md`): Modal-first via `EditPanel`, separater `InlineText`-Primitiv, kein Block-Manifest, kein Element-Tree. Der Refactor ist substantiell — kein reines Add-on.
- **Security-Debt**: Admin-API aktuell praktisch offen. Muss VOR jedem neuen Feature geschlossen werden, sonst erweitert man eine unsichere Oberfläche.
- **Content-Schema-Risiko**: `content.json` hat fixe TS-Typen (z.B. `HERO_CONTENT.ctaPrimary`). Element-Delete ohne Schema-Migration crasht rendering components. Block-Manifest ist der zentrale Enabler für alles andere.
- **User-Vergleichspunkt**: Divi Theme (WordPress). Erwartung ist ein nativer, direkter Visual-Builder-Feel — nicht ein Form-basiertes CMS.
- **Team**: ParkourONE, Schweiz. Nicht-technische Editoren. Fehler dürfen nicht die Live-Seite killen — Schema-Validation + optimistic UI mit Rollback wichtig.

## Constraints

- **Tech stack**: Next.js 16.1.1 / React 19.2 / TS strict / Tailwind 4 / shadcn/ui — festgelegt, kein Framework-Wechsel
- **Storage**: `content.json` im Repo, Sync via GitHub API — keine DB
- **Deployment**: Vercel — Builds müssen nach Content-Änderung automatisch triggern (ist bereits so)
- **Dependencies**: GitHub Token für Content-PUT, Resend für Kontaktform, ADMIN_PASSWORD — bestehend
- **Security**: Admin-Routes dürfen nach Phase 1 keine ungeschützten Endpoints mehr haben
- **Kompatibilität**: Öffentliche Seiten dürfen während Refactor nicht brechen — Schema-Migration rückwärtskompatibel oder mit Migration-Script
- **Performance**: Edit-Mode-Overlay darf Public-Render nicht beeinflussen (nur im `/admin`-Kontext laden)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Security-Fixes zuerst, vor Editor-Arbeit | API ist offen — jede neue Feature vergrößert Angriffsfläche | — Pending |
| Block-Manifest-System vor Element-Delete | Ohne Schema crasht Delete die Seite | — Pending |
| Divi-Theme als UX-Vergleichsmaßstab | User hat es explizit gefordert | — Pending |
| Keine Realtime-Kollaboration in v2 | 1-3 Editoren, kein Bedarf — spart massiv Komplexität | — Pending |
| Sections in kleinere Primitive splitten | Ermöglicht Element-Level-Operations und Wiederverwendung | — Pending |
| `content.json` bleibt Single Source of Truth (keine DB) | Git-History = kostenloses Audit-Log, kein Infra-Aufbau | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-09 after initialization*
