# Codebase Structure

**Analysis Date:** 2026-04-09

## Directory Layout

```
rubikone/
├── src/
│   ├── app/                          # Next.js App Router (pages + API routes)
│   │   ├── layout.tsx                # Root layout, mounts AdminProvider + overlay
│   │   ├── page.tsx                  # Homepage (9 EditableSections)
│   │   ├── globals.css               # Design system tokens + utility classes
│   │   ├── sitemap.ts                # Dynamic sitemap
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Pass-through layout
│   │   │   ├── page.tsx              # Redirect → "/"
│   │   │   ├── login/page.tsx        # Password form
│   │   │   └── components/           # Legacy admin-dashboard bits (section-card, field-editor, block-preview) — superseded by inline editor in src/components/admin/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── login/route.ts    # POST/DELETE session cookie
│   │   │   │   ├── content/route.ts  # GET/PUT content.json via GitHub API
│   │   │   │   └── upload/route.ts   # POST image upload to public/images/uploads
│   │   │   ├── contact/route.ts      # Kontaktformular → Resend
│   │   │   └── configurator/route.ts # Preisrechner
│   │   └── [20+ routes]/             # konzept, raumgestaltung, koeniz, impulsworkshop, ueber-uns, kontakt, konfigurator, abc, balance, sprungkraft, stabilitaet, passement, quadrupedie, check-in, check-out, fokus, fuer-gemeinden, datenschutz, impressum
│   ├── components/
│   │   ├── admin/                    # Inline visual editor subsystem
│   │   │   ├── editable-section.tsx  # Registers + outlines a block
│   │   │   ├── inline-text.tsx       # contentEditable text field
│   │   │   ├── field-editor.tsx      # Recursive form renderer (modal)
│   │   │   ├── edit-panel.tsx        # Modal sheet opened for a section
│   │   │   ├── admin-sidebar.tsx     # Left 260px sidebar, lists blocks
│   │   │   ├── admin-toolbar.tsx     # Bottom floating save/logout pill
│   │   │   └── admin-content-wrapper.tsx  # Shifts page content when sidebar open
│   │   ├── layout/
│   │   │   ├── navigation.tsx        # Site header
│   │   │   ├── footer.tsx
│   │   │   └── floating-configurator.tsx
│   │   ├── sections/                 # 25 page-specific section blocks
│   │   │   ├── hero-section.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── movements-grid.tsx
│   │   │   ├── comparison-table.tsx
│   │   │   ├── lerndimensionen-section.tsx
│   │   │   ├── configurator-overlay.tsx
│   │   │   ├── contact-form.tsx
│   │   │   └── …                     # (see components/sections directory listing)
│   │   ├── shared/                   # Reusable visual primitives
│   │   │   ├── fade-up.tsx
│   │   │   ├── section-header.tsx
│   │   │   ├── placeholder-image.tsx
│   │   │   └── vorher-nachher-slider.tsx
│   │   ├── ui/                       # shadcn/ui base components (button, card, input, …)
│   │   ├── cookie-banner.tsx
│   │   ├── analytics.tsx             # Vercel Analytics/Speed Insights (consent-gated)
│   │   └── structured-data.tsx       # JSON-LD for SEO
│   ├── content/
│   │   └── content.json              # Single source of truth (~1846 lines)
│   ├── lib/
│   │   ├── constants.ts              # Imports content.json, merges in icons/images
│   │   ├── animations.ts             # Framer Motion variants + appleEasing
│   │   └── utils.ts                  # cn() Tailwind merge
│   ├── providers/
│   │   ├── admin-provider.tsx        # CMS context (content, sha, dirty state, save)
│   │   ├── consent-provider.tsx      # GDPR consent state
│   │   └── lenis-provider.tsx        # Smooth-scroll
│   ├── hooks/
│   │   ├── useContent.ts             # Static-constant → live-content adapter
│   │   └── useScrollLock.ts
│   └── middleware.ts                 # Redirect /admin/* without session → /admin/login
├── public/
│   └── images/
│       ├── posten/                   # Hardcoded asset paths referenced by constants.ts
│       └── uploads/                  # Admin-uploaded images (committed via GitHub API)
├── CLAUDE.md                         # Project overview for AI
├── DESIGN-SYSTEM.md
├── WEBSITE-STRUKTUR.md
├── KONZEPT-STAEDTESEITE.md
├── ARBEIT-LOG-2026-01-07.md
├── package.json
├── tsconfig.json
└── next.config.*
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router — every page + API route.
- Contains: Route segments (`page.tsx`, `layout.tsx`), API handlers (`route.ts`).
- Key files: `layout.tsx` (admin cookie read, provider wiring), `page.tsx` (homepage composition).

**`src/app/admin/`:**
- Purpose: Formal `/admin/*` route tree. Currently minimal — `admin/page.tsx` redirects to `/` because editing happens inline on the real site. `admin/login/page.tsx` is the only functional page.
- Note: `src/app/admin/components/` contains legacy dashboard components (`section-card`, `field-editor`, `block-preview`) that predate the inline visual editor. The active CMS components live in `src/components/admin/`. When extending the CMS, prefer `src/components/admin/`.

**`src/app/api/admin/`:**
- Purpose: Backend for the CMS.
- Contains: `login/` (auth), `content/` (GitHub-backed JSON read/write), `upload/` (GitHub-backed image upload).
- Notes: `content` route does NOT currently verify the admin cookie itself — it relies on the UI being gated. `upload` DOES re-check the cookie. Consistency gap worth flagging.

**`src/components/admin/`:**
- Purpose: Active inline visual editor UI. All new CMS UI goes here.
- Contains: Context-driven components (`EditableSection`, `InlineText`, `FieldEditor`, `EditPanel`, `AdminSidebar`, `AdminToolbar`, `AdminContentWrapper`).

**`src/components/sections/`:**
- Purpose: 25 seitenspezifische "blocks" that render portions of a page. Each imports its slice of `constants.ts` and renders.
- Contains: One `.tsx` per block (`hero-section.tsx`, `testimonials.tsx`, …).
- Used by: `src/app/**/page.tsx` files, typically wrapped in `<EditableSection>`.

**`src/components/shared/`:**
- Purpose: Reusable, page-agnostic visual primitives (animation wrapper, section header, sliders, placeholders).

**`src/components/ui/`:**
- Purpose: shadcn/ui base primitives. Do not modify directly without running through shadcn flow.

**`src/content/`:**
- Purpose: Holds `content.json`. This file is the edited artifact — it is simultaneously (a) imported at build time by `constants.ts` and (b) read/written at runtime by the admin API via GitHub.

**`src/lib/`:**
- Purpose: Framework-agnostic helpers.
- `constants.ts`: Bridge between JSON content and typed React constants. Adds non-editable concerns (icon names, image paths, color codes).
- `animations.ts`: Framer Motion variants + `appleEasing`.
- `utils.ts`: `cn()` helper.

**`src/providers/`:**
- Purpose: React context providers mounted in root layout.
- `admin-provider.tsx` is the heart of the CMS; the other two (`consent`, `lenis`) are orthogonal.

**`src/hooks/`:**
- Purpose: Small reusable hooks.
- `useContent.ts`: Preferred read-adapter when a section needs to reflect live CMS edits without using `InlineText`.

**`public/images/uploads/`:**
- Purpose: Destination for admin image uploads. Populated via the upload API committing to GitHub. Filename pattern: `<slug>-<4-byte-hash>.<ext>`.

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx` — Root layout, AdminProvider wiring.
- `src/app/page.tsx` — Homepage with 9 editable sections.
- `src/middleware.ts` — `/admin/*` route guard.

**Configuration:**
- `package.json` — scripts + deps.
- `tsconfig.json` — path alias `@/*` → `src/*`.
- `.env` (not committed) — `RESEND_API_KEY`, `GITHUB_TOKEN`, `GITHUB_REPO`, `ADMIN_PASSWORD`.

**Core Logic:**
- `src/content/content.json` — editable content.
- `src/lib/constants.ts` — content import + asset merge.
- `src/providers/admin-provider.tsx` — CMS state machine.
- `src/app/api/admin/content/route.ts` — GitHub read/write.
- `src/app/api/admin/upload/route.ts` — GitHub image upload.
- `src/app/api/admin/login/route.ts` — session cookies.
- `src/components/admin/editable-section.tsx` — block wrapper.
- `src/components/admin/inline-text.tsx` — inline contentEditable.
- `src/components/admin/field-editor.tsx` — recursive form renderer.
- `src/components/admin/edit-panel.tsx` — modal sheet.

**Testing:**
- None. No test files or test runner are configured in the project.

## Naming Conventions

**Files:**
- kebab-case for components and routes: `hero-section.tsx`, `admin-sidebar.tsx`, `fuer-gemeinden/page.tsx`.
- Next.js special files: `page.tsx`, `layout.tsx`, `route.ts`, `middleware.ts`.

**Directories:**
- kebab-case route segments; German slugs for public pages (`ueber-uns`, `raumgestaltung`, `fuer-gemeinden`).

**Content keys in JSON:**
- SCREAMING_SNAKE_CASE top-level: `HERO_CONTENT`, `TESTIMONIALS`, `NINE_MOVEMENTS`, `COMPARISON_TABLE`, `CTA_CONTENT`.
- camelCase inside objects: `ctaPrimary.label`, `headline`, `subheadline`.

**Component names:**
- PascalCase React components exported from kebab-case files: `export function HeroSection() {}` in `hero-section.tsx`.

## Where to Add New Code

**New public page/route:**
- Create `src/app/<slug>/page.tsx` (German slug).
- Optionally `src/app/<slug>/layout.tsx` for route-specific metadata.
- Compose existing `src/components/sections/*` inside `<EditableSection contentKey="..." label="...">` wrappers.
- Add page name to `PAGE_NAMES` in `src/components/admin/admin-sidebar.tsx` and `src/components/admin/admin-toolbar.tsx` so the admin UI labels it.
- Add route to `src/app/sitemap.ts`.

**New section block:**
- Create `src/components/sections/<block-name>.tsx`.
- Add its content schema as a new top-level key in `src/content/content.json`.
- Re-export from `src/lib/constants.ts` (plus any static asset merging).
- Use the constant in the component. For inline editability, use `<InlineText contentKey="..." field="..." />` or `useContent()`.
- Wrap in `<EditableSection contentKey="..." label="...">` when placed on a page.

**New CMS / editor feature:**
- Admin UI → `src/components/admin/`.
- Admin state → extend `AdminContextType` in `src/providers/admin-provider.tsx`.
- Admin API → `src/app/api/admin/<name>/route.ts`. Guard with the same `isAuthenticated()` cookie check pattern used in `upload/route.ts`.
- Do NOT put new admin UI in `src/app/admin/components/` (legacy).

**New API endpoint:**
- Create `src/app/api/<name>/route.ts` exporting HTTP method handlers.
- Admin-only endpoints: check `admin_session` + `admin_token_hash` cookies at the top of the handler.

**Shared utility:**
- Framework-agnostic helpers → `src/lib/utils.ts` (or a new file in `src/lib/`).
- React hooks → `src/hooks/`.
- Reusable visual primitives → `src/components/shared/`.

**Static assets:**
- Public images → `public/images/<category>/` (for hardcoded references from `constants.ts`).
- Admin-uploaded images land in `public/images/uploads/` automatically.

## Special Directories

**`src/app/admin/components/`:**
- Purpose: Legacy dashboard components from an earlier CMS iteration. Superseded by the inline visual editor in `src/components/admin/`.
- Generated: No.
- Committed: Yes.
- Guidance: Do NOT add new code here. Audit candidate for deletion once the inline editor reaches feature parity.

**`public/images/uploads/`:**
- Purpose: Destination for admin-uploaded images, written via GitHub Contents API.
- Generated: Yes, via `/api/admin/upload` commits.
- Committed: Yes (the whole point of the write-through-Git model).

**`src/content/`:**
- Purpose: Single-file content database (`content.json`).
- Generated: Yes, but only via the admin panel committing through GitHub API.
- Committed: Yes.
- Guidance: Hand-edits are valid but will conflict with admin saves (SHA mismatch). Prefer editing via the admin UI.

---

*Structure analysis: 2026-04-09*
