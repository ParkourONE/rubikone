# Architecture

**Analysis Date:** 2026-04-09

## Pattern Overview

**Overall:** Next.js 16 App Router marketing site with a custom inline visual CMS. Content is stored as JSON in the repo, edited live on the rendered page by an authenticated admin, and persisted back via the GitHub Contents API (which triggers Vercel redeploys).

**Key Characteristics:**
- Single source of truth: `src/content/content.json` (~1846 lines), imported at build time via `src/lib/constants.ts`.
- Per-section inline editing: sections on the real page are wrapped in `EditableSection` and fields use `InlineText` / `FieldEditor` — there is no separate "admin dashboard" UI. `src/app/admin/page.tsx` just redirects to `/`.
- Static-first runtime: non-admin visitors get zero CMS overhead (providers short-circuit when `isAdmin` is false).
- Auth model: session-cookie + middleware gate for `/admin/*`; `AdminProvider` is conditionally activated by the root layout reading cookies server-side.
- Write-through-Git: all content + image uploads commit directly to the configured GitHub repo; Vercel redeploys on push.

## Layers

**Content Layer (`src/content/content.json`):**
- Purpose: Single source of truth for all editable copy (hero text, testimonials, nine movements, FAQs, comparison tables, contact labels, etc.).
- Location: `src/content/content.json`
- Contains: Plain JSON keyed by SECTION name (e.g. `HERO_CONTENT`, `TESTIMONIALS`, `NINE_MOVEMENTS`, `COMPARISON_TABLE`).
- Depends on: Nothing.
- Used by: `src/lib/constants.ts` (build-time import) and the admin GitHub API route (runtime read/write via GitHub Contents API, NOT the local file).

**Constants Layer (`src/lib/constants.ts`):**
- Purpose: Bridges raw JSON to typed exports consumed by React sections. Re-exports JSON keys as named constants and merges in non-editable concerns (icon names, image paths, coordinates, difficulty color codes).
- Location: `src/lib/constants.ts`
- Pattern: `export const HERO_CONTENT = content.HERO_CONTENT;` plus `.map()` enrichments for arrays that mix text (JSON) with assets (hardcoded paths), e.g. `NINE_MOVEMENTS` and `COMPARISON_TABLE`.
- Depends on: `@/content/content.json`.
- Used by: All section components under `src/components/sections/`.

**Section Components (`src/components/sections/`):**
- Purpose: 25+ seitenspezifische Blocks that render a portion of a page. Each is a React component that imports its constant and renders.
- Location: `src/components/sections/*.tsx`
- Examples: `hero-section.tsx`, `testimonials.tsx`, `movements-grid.tsx`, `configurator-overlay.tsx`, `contact-form.tsx`.
- Depends on: `@/lib/constants`, `@/lib/animations`, shared components, `useContent` hook (when live-editing is needed).
- Used by: Page files under `src/app/*/page.tsx`.

**Page Layer (`src/app/*/page.tsx`):**
- Purpose: Compose sections into routes. Wraps each section in `<EditableSection contentKey="..." label="...">` so the CMS can register/target it.
- Location: `src/app/page.tsx` (homepage) and `src/app/[route]/page.tsx` (20+ subpages).
- Pattern: Sections listed top-to-bottom, each wrapped with an `EditableSection` registering its content key with the `AdminProvider`.

**Admin Layer (`src/components/admin/`, `src/providers/admin-provider.tsx`):**
- Purpose: Overlay UI that turns the rendered public page into an editor when `isAdmin` is true.
- Key files:
  - `src/providers/admin-provider.tsx` — Context holding loaded `content`, `sha`, dirty state, registered sections, editing target, save handler.
  - `src/components/admin/editable-section.tsx` — Wrapper that registers a block, renders a hover dashed outline + edit button, and sets the editing target.
  - `src/components/admin/inline-text.tsx` — `contentEditable` span/heading that reads `content[path]` and writes back via `updateContent(path, value)`.
  - `src/components/admin/field-editor.tsx` — Structured form renderer for the modal edit panel (handles nested objects and arrays).
  - `src/components/admin/edit-panel.tsx` — Modal "Apple Sheet" that opens when a section is selected and renders a form via `FieldEditor`.
  - `src/components/admin/admin-sidebar.tsx` — Left sidebar listing all registered sections on the current page; click to scroll + open editor.
  - `src/components/admin/admin-toolbar.tsx` — Bottom floating pill with save/logout.
  - `src/components/admin/admin-content-wrapper.tsx` — Shifts the page content right by 260px when the sidebar is open.

**API Layer (`src/app/api/`):**
- `src/app/api/admin/login/route.ts` — POST (password check + session cookie), DELETE (logout).
- `src/app/api/admin/content/route.ts` — GET (pull `content.json` from GitHub), PUT (commit back with SHA).
- `src/app/api/admin/upload/route.ts` — POST (image upload to `public/images/uploads/` via GitHub Contents API, gated by session cookie).
- `src/app/api/contact/route.ts` — Kontaktformular via Resend.
- `src/app/api/configurator/route.ts` — Preisrechner endpoint.

**Middleware (`src/middleware.ts`):**
- Purpose: Route guard — redirects unauthenticated requests for `/admin/*` (except `/admin/login`) to `/admin/login`.
- Matcher: `/admin/:path*`.

## Data Flow

**Public render (non-admin):**

1. Build time: `src/content/content.json` is imported by `src/lib/constants.ts`.
2. Sections import typed constants (`HERO_CONTENT`, `TESTIMONIALS`, …) and render.
3. Root layout reads cookies in `src/app/layout.tsx`; with no admin cookies, `AdminProvider` renders children unchanged. `EditableSection`, `InlineText`, `AdminSidebar`, `AdminToolbar`, `EditPanel` all short-circuit to no-ops.
4. Users see a static Next.js site; zero CMS overhead.

**Admin edit (CMS flow):**

1. Admin visits `/admin/login`, submits password → `POST /api/admin/login` validates against `ADMIN_PASSWORD`, sets two httpOnly cookies (`admin_session`, `admin_token_hash`), 8h lifetime.
2. Admin visits `/` (or any page). `src/app/layout.tsx` reads cookies server-side, passes `isAdmin={true}` to `<AdminProvider>`.
3. `AdminProviderInner` mounts and `fetch("/api/admin/content")` pulls the latest `content.json` + `sha` from GitHub. State: `content`, `sha`, `originalContentRef`.
4. Each `<EditableSection>` on the page calls `registerSection(key, label)` on mount so `AdminSidebar` can list all blocks present on the current page.
5. Admin clicks either (a) an inline text, (b) the hover edit button on a section, or (c) a row in the sidebar. This calls `setEditingSection(key, label)`.
6. For inline text: `InlineText` flips its span to `contentEditable`, on blur it calls `updateContent(path, newValue)` which deep-clones `content`, writes via `setNestedValue`, and sets `hasChanges`.
7. For structured edits: `<EditPanel>` renders, spawning a `<FieldEditor>` per key in the selected section; each field calls `updateContent(path, val)`.
8. Admin clicks "Speichern" (toolbar or panel) → `saveContent()` calls `PUT /api/admin/content` with `{content, sha, message: "content: Update <section> via Admin-Panel"}`.
9. API route base64-encodes JSON and calls GitHub `PUT /repos/{repo}/contents/src/content/content.json` with the SHA. On success it returns the new SHA, which is stored locally.
10. GitHub commit triggers Vercel redeploy. User sees updated content on next load.

**Image upload flow:**

1. `FieldEditor` image field → `POST /api/admin/upload` with multipart form.
2. Route validates auth via cookies (`isAuthenticated()`), validates file type (jpeg/png/gif/svg/webp/avif) and size (<5 MB).
3. Either replaces an existing file at the same path (fetches SHA first) or writes new `public/images/uploads/<slug>-<hash>.<ext>`.
4. Commits via GitHub Contents API with message `media: Upload <filename> via Admin-Panel`.
5. Returns the public-facing path (without `public/` prefix) so the content field can store the URL.

**State Management:**

- Global admin state: `AdminContext` (React context) — single provider, no external state lib.
- Content is held in-memory as a `Record<string, any>` mirror of `content.json`; `sha` is tracked to detect 409 conflicts; `originalContentRef` is used to compute `hasChanges`.
- Path syntax: dot + bracket (e.g. `HERO_CONTENT.ctaPrimary.label`, `TESTIMONIALS[0].quote`). Parser lives in `setNestedValue` / `getNestedValue` in `admin-provider.tsx` and `inline-text.tsx`.

## Key Abstractions

**`EditableSection`:**
- Purpose: Declarative wrapper that registers a page block with the CMS.
- Files: `src/components/admin/editable-section.tsx`
- Pattern: `<EditableSection contentKey="HERO_CONTENT" label="Hero">…</EditableSection>`. Assigns DOM id `section-${contentKey}` so the sidebar can scroll to it.

**`InlineText`:**
- Purpose: Render a string from `content.json` that becomes `contentEditable` when `isAdmin`.
- Files: `src/components/admin/inline-text.tsx`
- Pattern: `<InlineText contentKey="HERO_CONTENT" field="headline" as="h1" className="…">Default fallback</InlineText>`. In public mode renders children with zero overhead.

**`FieldEditor`:**
- Purpose: Recursive form renderer for the modal panel. Handles strings, numbers, booleans, nested objects, arrays, and image fields.
- Files: `src/components/admin/field-editor.tsx` (~452 lines)
- Called by: `src/components/admin/edit-panel.tsx`.

**`useContent` hook:**
- Purpose: Lightweight read-only adapter for sections that want to reflect live CMS edits without using `InlineText`. Falls back to the compiled static constant when not in admin mode.
- Files: `src/hooks/useContent.ts`
- Pattern: `const hero = useContent("HERO_CONTENT", HERO_CONTENT);`

**`AdminProvider`:**
- Purpose: Root of the CMS subsystem. Conditionally activates — if `isAdmin` is false it renders `{children}` without any context, so zero cost for public visitors.
- Files: `src/providers/admin-provider.tsx`

## Entry Points

**Root layout (`src/app/layout.tsx`):**
- Reads `admin_session` + `admin_token_hash` cookies server-side.
- Wraps children in `AdminProvider`, `ConsentProvider`, `LenisProvider`.
- Mounts `AdminSidebar`, `AdminContentWrapper`, `AdminToolbar`, `EditPanel` so the CMS overlay is available on every route.

**Homepage (`src/app/page.tsx`):**
- Composes 9 sections, each wrapped in `<EditableSection>`.

**Admin login (`src/app/admin/login/page.tsx`):**
- Password form → `POST /api/admin/login` → redirects to `/`.

**Admin "dashboard" (`src/app/admin/page.tsx`):**
- Trivial redirect to `/`. Editing always happens inline on the real site.

**Middleware (`src/middleware.ts`):**
- Gates `/admin/*` routes. Note: `/api/admin/*` routes are NOT gated by middleware — they self-check cookies (`upload`) or trust absence of SSO because GET/PUT content is only reachable after login via the UI. The content PUT/GET routes currently do NOT re-verify the session cookie — worth auditing in the concerns phase.

## Error Handling

**Strategy:**
- API routes return `NextResponse.json({ error }, { status })` with German messages.
- Client shows `alert()` on save failure (intentional, simple).
- GitHub 409 (SHA conflict) is caught explicitly and surfaces "Bitte Seite neu laden."

**Patterns:**
- Env vars validated at the top of each GitHub-touching route (`GITHUB_TOKEN`, `GITHUB_REPO`).
- All fetches use `cache: "no-store"` for reads so the admin always sees the latest file.

## Cross-Cutting Concerns

**Logging:** `console.error` only (no structured logger).
**Validation:** Ad-hoc in API routes (file type, file size, presence of `content`/`sha`). No schema validation of `content.json` (no Zod/Yup).
**Authentication:** httpOnly cookies (`admin_session` + sha256-hashed mirror `admin_token_hash`), 8h lifetime, `sameSite: strict`, `secure` in production. No DB — the presence of both cookies is treated as proof of login. This means sessions cannot be individually revoked server-side.
**Analytics:** Vercel Analytics + Speed Insights via `src/components/analytics.tsx`, gated by `ConsentProvider` (GDPR).
**Smooth scroll:** `LenisProvider` (`src/providers/lenis-provider.tsx`).

---

*Architecture analysis: 2026-04-09*
