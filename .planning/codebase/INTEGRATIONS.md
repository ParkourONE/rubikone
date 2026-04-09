# External Integrations

**Analysis Date:** 2026-04-09

## APIs & External Services

**Email (Transactional):**
- Resend (`resend.dev`) — SDK `resend` ^6.6.0
  - Client init: `new Resend(process.env.RESEND_API_KEY)`
  - Used in: `src/app/api/contact/route.ts`, `src/app/api/configurator/route.ts`
  - From address: `info@rubikone.ch`
  - Contact form: single notification email to `info@rubikone.ch` with `replyTo` set to submitter
  - Configurator: dual send — team notification + customer confirmation email with pricing breakdown

**Content CMS (GitHub as backend):**
- GitHub REST API v3 (`https://api.github.com`) — called via native `fetch`
  - Read/write `src/content/content.json` from repo at `${GITHUB_REPO}`
  - Used in: `src/app/api/admin/content/route.ts` (GET + PUT)
    - GET: fetches file, base64-decodes, returns `{ content, sha }`
    - PUT: base64-encodes JSON, commits with message "content: Update via Admin-Panel", handles 409 conflict on stale SHA
  - Media uploads: `src/app/api/admin/upload/route.ts` (POST) — uploads images to `public/images/uploads/<safe-name>-<hash>.<ext>` or replaces existing asset at same path
    - Accepts: JPG, PNG, GIF, SVG, WebP, AVIF; max 5 MB
    - Auth gate: checks `admin_session` + `admin_token_hash` cookies before any GitHub call
  - Headers: `Authorization: Bearer ${GITHUB_TOKEN}`, `Accept: application/vnd.github.v3+json`

**Analytics:**
- Vercel Analytics — `@vercel/analytics` ^1.6.1, mounted in `src/app/layout.tsx`
- Vercel Speed Insights — `@vercel/speed-insights` ^1.3.1, mounted in `src/app/layout.tsx`
- CSP allowlist: `https://va.vercel-scripts.com` (scripts), `https://vitals.vercel-insights.com` (connect)

**Fonts:**
- Google Fonts (Inter) — loaded via CSP allowlist for `fonts.googleapis.com` + `fonts.gstatic.com`

**Embedded Media:**
- YouTube embeds — CSP `frame-src` and `media-src` allow `youtube.com`, `youtube-nocookie.com`

## Data Storage

**Databases:**
- None. Content is stored as `src/content/content.json` in the Git repository. The admin panel persists edits by committing to GitHub via the REST API.

**File Storage:**
- Git repository (`public/images/uploads/`) — media uploaded through admin panel lands in the repo and is served statically by Next.js
- No S3, Supabase, Cloudinary, or other blob store

**Caching:**
- None application-level. GitHub reads use `cache: "no-store"` in `src/app/api/admin/content/route.ts` to always pull the latest.

## Authentication & Identity

**Admin Auth:**
- Custom password-based login — `src/app/api/admin/login/route.ts`
  - Compares submitted password against `process.env.ADMIN_PASSWORD`
  - On success: generates `crypto.randomBytes(32).toString("hex")` session token
  - Stores two cookies (httpOnly, sameSite=strict, secure in production, 8h maxAge):
    - `admin_session` — raw token
    - `admin_token_hash` — SHA-256 of token
  - DELETE handler clears both cookies (logout)
- Middleware gate: `src/middleware.ts` — matcher `/admin/:path*`, redirects to `/admin/login` if either cookie is missing (except for `/admin/login` itself)
- Upload endpoint re-verifies cookies via `isAuthenticated()` helper

**Public Auth:**
- None. Marketing site has no end-user accounts.

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, Bugsnag, etc.)
- Errors logged via `console.error` in API routes (captured by Vercel runtime logs)

**Performance:**
- Vercel Speed Insights (Core Web Vitals)

**Logs:**
- Vercel platform logs only

## CI/CD & Deployment

**Hosting:**
- Vercel (production domain: rubikone.ch)

**CI Pipeline:**
- Vercel Git integration (auto-deploy on push); no GitHub Actions workflows detected in repo

## Environment Variables

Required for full functionality (consumed in listed files):

| Variable | Purpose | Used In |
|---|---|---|
| `RESEND_API_KEY` | Resend SDK auth for transactional email | `src/app/api/contact/route.ts`, `src/app/api/configurator/route.ts` |
| `GITHUB_TOKEN` | Bearer token for GitHub Contents API (read/write `content.json`, upload media) | `src/app/api/admin/content/route.ts`, `src/app/api/admin/upload/route.ts` |
| `GITHUB_REPO` | Target repo in `owner/name` format (e.g. `monkeyspk/rubikone`) | `src/app/api/admin/content/route.ts`, `src/app/api/admin/upload/route.ts` |
| `ADMIN_PASSWORD` | Plaintext password for admin login comparison | `src/app/api/admin/login/route.ts` |
| `NODE_ENV` | Toggles `secure` cookie flag for admin session | `src/app/api/admin/login/route.ts` |

**Secrets location:**
- Managed via Vercel project env var UI. Local `.env*` file existence not inspected.

## API Routes (Next.js Route Handlers)

All under `src/app/api/`:

| Route | Method(s) | File | Purpose |
|---|---|---|---|
| `/api/contact` | POST | `src/app/api/contact/route.ts` | Send contact form to `info@rubikone.ch` via Resend |
| `/api/configurator` | POST | `src/app/api/configurator/route.ts` | Send pricing configurator submission (team notification + customer confirmation) via Resend |
| `/api/admin/login` | POST, DELETE | `src/app/api/admin/login/route.ts` | Admin login / logout, manages `admin_session` + `admin_token_hash` cookies |
| `/api/admin/content` | GET, PUT | `src/app/api/admin/content/route.ts` | Read/write `src/content/content.json` via GitHub Contents API |
| `/api/admin/upload` | POST | `src/app/api/admin/upload/route.ts` | Upload images to `public/images/uploads/` via GitHub Contents API (auth-gated) |

## Webhooks & Callbacks

**Incoming:** None
**Outgoing:** None (all third-party calls are request/response; Resend delivery reports not wired up)

## Security Headers

Configured in `next.config.ts`:
- `Content-Security-Policy` — restrictive, explicit allowlists for Vercel Analytics, Google Fonts, YouTube
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — disables camera, microphone, geolocation, interest-cohort
- `poweredByHeader: false`

---

*Integration audit: 2026-04-09*
