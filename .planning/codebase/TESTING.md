# Testing Patterns

**Analysis Date:** 2026-04-09

## Test Framework

**None.**

There is no application test framework installed or configured in this repository. `package.json` has no `test` script, and no Jest, Vitest, Playwright, Cypress, or React Testing Library dependencies are present in `dependencies` or `devDependencies`.

No test files exist under `src/`. The only `*.test.*` files in the repo are under `get-shit-done/tests/` (unrelated tooling/scratchpad — not part of the Next.js app).

**Implication for planners/executors:** When adding a feature, do NOT assume a test harness exists. If tests are needed, introducing one is a phase-level decision (recommend Vitest + React Testing Library for Next.js 16 / React 19).

## Quality Gates That DO Exist

The project relies on static analysis and the Next.js build as its quality floor.

### 1. TypeScript (strict)

**Config:** `tsconfig.json`
- `"strict": true`
- `"target": "ES2017"`
- `"moduleResolution": "bundler"`
- `"jsx": "react-jsx"`
- `"noEmit": true` (type-check only; Next.js handles emit)
- Path alias `@/*` → `./src/*`
- Excludes: `node_modules`, `_blocks_draft`, `wordpress-local`, `rubikone-theme`, `parkourone-theme`

**Run type check:**
```bash
npx tsc --noEmit
```

This is the primary correctness gate. Every PR-ready change should type-check cleanly.

### 2. ESLint (flat config)

**Config:** `eslint.config.mjs`
```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
```

**Extends:**
- `eslint-config-next/core-web-vitals` — Next.js recommended + web vitals rules
- `eslint-config-next/typescript` — TypeScript rules for Next.js

**Run:**
```bash
npm run lint
```

Script: `"lint": "eslint"` (package.json).

### 3. Next.js Build

The production build is the de-facto integration test:
```bash
npm run build
```
Catches type errors, missing modules, invalid imports, failed static generation, and route handler issues.

## Recommended Verification Flow

Before considering a change done, run:
```bash
npm run lint            # ESLint
npx tsc --noEmit        # TypeScript strict check
npm run build           # Next.js production build
```

Also smoke-test via `npm run dev` at `http://localhost:3000` for visual/interactive changes — this codebase is animation- and layout-heavy, and there is no automated coverage for regressions.

## Test File Organization

Not applicable — no tests exist.

**If adding tests in the future:**
- Co-locate unit tests next to source (`foo.tsx` + `foo.test.tsx`)
- Place E2E tests in a top-level `e2e/` or `tests/` directory
- Update `package.json` scripts and add the runner to `devDependencies`

## Mocking

Not applicable.

**If adding:** Consider `vi.mock` (Vitest) for `@/lib/constants`, `useContent`, `next/image`, `framer-motion` (which ships a `framer-motion/dom` mock pattern).

## Fixtures and Factories

Not applicable. Content fixtures already exist implicitly in `src/content/content.json` and can be imported directly in future tests.

## Coverage

Not tracked. No coverage thresholds enforced.

## Test Types

| Type | Status |
|---|---|
| Unit | Not present |
| Integration | Not present |
| E2E | Not present |
| Visual regression | Not present |
| Type checking | Present (TS strict) |
| Lint | Present (ESLint + next) |

## Manual QA Surfaces

High-risk areas that need manual verification on changes because there is no automation:

- **Admin panel auth flow** (`src/app/admin/*`, `src/app/api/admin/*`, `src/middleware.ts`) — session cookie handling
- **Content editing → GitHub sync** (`src/app/api/admin/content/`) — uses `GITHUB_TOKEN`, writes to `content.json`
- **Contact form → Resend** (`src/app/api/contact/`) — email delivery
- **Configurator pricing math** (`src/app/api/configurator/`, `src/app/konfigurator/`)
- **Responsive breakpoints** — mobile/desktop layouts are often forked (see `hero-section.tsx` `lg:hidden` / `hidden lg:block` blocks)
- **Framer Motion animations** + Lenis smooth scroll interaction
- **GDPR consent** (`src/providers/` ConsentProvider) — analytics gating

## Common Patterns

Not applicable — no test code to model patterns from.

---

*Testing analysis: 2026-04-09*
