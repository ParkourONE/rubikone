# Technology Stack

**Analysis Date:** 2026-04-09

## Languages

**Primary:**
- TypeScript 5 (strict mode) — all application code in `src/`
- TSX/JSX — React components under `src/components/` and `src/app/`

**Secondary:**
- CSS — Tailwind 4 + custom design tokens in `src/app/globals.css`
- JSON — content source of truth in `src/content/content.json`

## Runtime

**Environment:**
- Node.js (version pinned via Next.js 16 requirements; no `.nvmrc` detected)
- Next.js 16.1.1 App Router runtime (React Server Components + API Route Handlers)

**Package Manager:**
- npm (lockfile present: `package-lock.json`)
- No `pnpm-lock.yaml` or `yarn.lock`

## Frameworks

**Core:**
- `next` 16.1.1 — App Router, Route Handlers, middleware (`src/middleware.ts`), security headers configured in `next.config.ts`
- `react` 19.2.3 / `react-dom` 19.2.3 — React 19 with strict mode enabled

**UI / Styling:**
- `tailwindcss` ^4 with `@tailwindcss/postcss` ^4 — PostCSS pipeline via `postcss.config.mjs`
- `tw-animate-css` ^1.4.0 — animation utilities
- shadcn/ui (new-york style) — config in `components.json`, base components in `src/components/ui/`
- `@radix-ui/react-accordion` ^1.2.12, `@radix-ui/react-label` ^2.1.8, `@radix-ui/react-separator` ^1.1.8, `@radix-ui/react-slot` ^1.2.4 — headless primitives used by shadcn/ui wrappers
- `class-variance-authority` ^0.7.1, `clsx` ^2.1.1, `tailwind-merge` ^3.4.0 — class composition (`src/lib/utils.ts` exports `cn()`)
- `lucide-react` ^0.562.0 — icon set, imported via `src/lib/constants.ts`

**Animation / Scroll:**
- `framer-motion` ^12.23.26 — motion variants defined in `src/lib/animations.ts` (`appleEasing`, `fadeUp`, `fadeIn`, `scaleIn`)
- `lenis` ^1.3.17 — smooth scroll via `src/providers/` (`LenisProvider`)

**Testing:**
- Not detected — no Jest, Vitest, Playwright, or test files present

**Build/Dev:**
- Next.js build system (Turbopack/webpack via `next build`)
- ESLint 9 with `eslint-config-next` 16.1.1 — config in `eslint.config.mjs`
- TypeScript 5 — config in `tsconfig.json`, path alias `@/* -> ./src/*`

## Key Dependencies

**Critical:**
- `resend` ^6.6.0 — transactional email for `src/app/api/contact/route.ts` and `src/app/api/configurator/route.ts`
- `@vercel/analytics` ^1.6.1 — web analytics, mounted in `src/app/layout.tsx`
- `@vercel/speed-insights` ^1.3.1 — Core Web Vitals reporting
- `framer-motion` — foundational for all section animations
- `lenis` — global smooth-scroll UX

**Infrastructure:**
- Native `crypto` (Node built-in) — session token generation and SHA-256 hashing in `src/app/api/admin/login/route.ts` and `src/app/api/admin/upload/route.ts`
- `next/headers` `cookies()` API — admin session management

## Configuration

**Environment:**
- Env vars consumed at runtime via `process.env.*` (see INTEGRATIONS.md for full list)
- No `.env*` files read; existence not assumed in repo

**Build:**
- `next.config.ts` — security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy), `poweredByHeader: false`, `reactStrictMode: true`
- `tsconfig.json` — strict TS, `@/*` path alias
- `eslint.config.mjs` — flat config extending `next/core-web-vitals`
- `postcss.config.mjs` — Tailwind 4 plugin
- `components.json` — shadcn/ui registry config (new-york style)

## Platform Requirements

**Development:**
- Node.js compatible with Next 16 + React 19
- npm install; `npm run dev` starts dev server on :3000

**Production:**
- Vercel deployment (Vercel Analytics + Speed Insights integration, CSP whitelists `va.vercel-scripts.com` and `vitals.vercel-insights.com`)
- Domain: rubikone.ch

## Scripts (`package.json`)

```
npm run dev      # next dev
npm run build    # next build
npm start        # next start
npm run lint     # eslint
```

---

*Stack analysis: 2026-04-09*
