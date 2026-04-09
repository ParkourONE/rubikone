# Coding Conventions

**Analysis Date:** 2026-04-09

## Language Policy

**Code (English):**
- Variable names, function names, component names, types, file names
- Example: `HeroSection`, `useContent`, `appleTransition`

**Content (German):**
- All user-facing strings live in `src/content/content.json`
- Swiss-German marketing copy (Gemeinden, Schulen, Immobilienentwickler)
- Never hardcode German text inside components — import from `@/lib/constants` or fetch via `useContent()` hook

## Naming Patterns

**Files:**
- Components: `kebab-case.tsx` (e.g., `hero-section.tsx`, `contact-form.tsx`, `vorher-nachher-slider.tsx`)
- Lib/utilities: `kebab-case.ts` (e.g., `animations.ts`, `constants.ts`, `utils.ts`)
- App Router pages: `page.tsx`, `layout.tsx`, `route.ts` (Next.js convention)
- German domain terms allowed in file names when they describe German content (`lerndimensionen-section.tsx`, `prozess-teaser.tsx`)

**Components:**
- `PascalCase` React components exported as named exports: `export function HeroSection()`
- Multiple related components per file allowed (e.g., `HeroSection` + `PageHero` in `hero-section.tsx`)

**Functions / Variables:**
- `camelCase`: `useContent`, `appleTransition`, `withDelay`
- Constants from content: `SCREAMING_SNAKE_CASE` (e.g., `HERO_CONTENT`, `PROBLEM_CONTENT`)

**Types / Interfaces:**
- `PascalCase`: `PageHeroProps`
- Props interfaces co-located with component and named `{Component}Props`

## Path Alias

Configured in `tsconfig.json`:
```
"@/*": ["./src/*"]
```

**Always use `@/` imports** — never relative paths that climb (`../../`).

Common alias entries (from `components.json`):
- `@/components` — all components
- `@/components/ui` — shadcn/ui primitives
- `@/lib` — utilities, constants, animations
- `@/lib/utils` — the `cn()` helper
- `@/hooks` — custom hooks

## Component Organization

Three-tier split under `src/components/`:

**`src/components/ui/` — shadcn/ui primitives**
- Low-level, reusable, unopinionated primitives
- Generated via shadcn CLI (`new-york` style, neutral baseColor, CSS variables)
- Examples: `button.tsx`, `card.tsx`, `accordion.tsx`, `input.tsx`, `bottom-sheet.tsx`
- Do NOT embed content here

**`src/components/shared/` — reusable project components**
- Wrap `ui/` primitives with project-specific behavior
- Used across multiple pages/sections
- Examples: `fade-up.tsx`, `section-header.tsx`, `placeholder-image.tsx`, `vorher-nachher-slider.tsx`

**`src/components/sections/` — page-level sections**
- Large, opinionated, single-use-per-page blocks
- Import content from `@/lib/constants` and wrap in `useContent()` for admin-editability
- Examples: `hero-section.tsx`, `pricing-section.tsx`, `testimonials.tsx`, `faq-section.tsx`
- All 25+ homepage/subpage sections live here

**`src/components/layout/` — app chrome**
- Navigation, Footer, FloatingConfigurator — rendered in root layout

## Content Rule (Single Source of Truth)

**All content lives in `src/content/content.json`.**

Flow:
1. JSON is imported/shaped in `src/lib/constants.ts` (where Lucide icons are attached to content objects)
2. Sections import the constant: `import { HERO_CONTENT } from "@/lib/constants"`
3. Sections wrap via hook for live admin edits: `const heroContent = useContent("HERO_CONTENT", HERO_CONTENT)`
4. Admin panel (`/admin`) writes back to JSON via GitHub API (`src/app/api/admin/content/`)

**Never hardcode marketing copy inside a component.** If new content is needed, add a key to `content.json`, export it from `lib/constants.ts`, and consume via `useContent`.

## Client vs Server Components

- Components using hooks, state, framer-motion, or browser APIs: `"use client";` directive at top
- Pages (`app/*/page.tsx`) are Server Components by default
- API routes under `src/app/api/` are route handlers (`route.ts`)
- Admin routes protected via `src/middleware.ts` (session cookie)

## Styling Conventions

**Tailwind CSS 4** with design tokens in `src/app/globals.css`.

**Design system docs:** `DESIGN-SYSTEM.md` at repo root.

**Custom utility classes (defined in `globals.css`) — prefer these over ad-hoc Tailwind:**
- Containers: `.container-content` (980px), `.container-wide` (1200px), `.container-narrow` (680px)
- Section spacing: `.section-spacing` (`py-16 lg:py-24`)
- Typography: `.text-hero`, `.text-display`, `.text-title-1`, `.text-title-2`, `.text-title-3`, `.text-body-lg`, `.text-body`, `.text-body-sm` (all clamp() based)
- Buttons: `.btn-primary`

**Color tokens — access via CSS variables, not hex:**
- Primary: `var(--color-apple-dark)` (#1D1D1F)
- Brand teal: `#00a8ab` (defined as CSS variable)
- Grays: `var(--color-apple-gray-100)` through `var(--color-apple-gray-600)`
- Shadows: `shadow-apple-xl` and related utilities

**Class merging:** Always use `cn()` from `@/lib/utils` when conditionally composing classes (`clsx` + `tailwind-merge`).

**Responsive:** Mobile-first. Separate mobile/desktop markup blocks with `lg:hidden` / `hidden lg:block` is an accepted pattern (see `hero-section.tsx`) when layouts diverge structurally.

**Dark mode:** Supported via CSS variables in `globals.css`. Use tokens, not literal colors, so dark mode works automatically.

## Animation Conventions

All animation primitives live in `src/lib/animations.ts`. **Do not inline custom easings or durations in components** — import a variant.

**Standard easing:**
```typescript
export const appleEasing = [0.25, 0.1, 0.25, 1.0] as const;
```

**Standard transitions:**
- `appleTransition` — 0.6s, appleEasing (default)
- `fastTransition` — 0.3s, appleEasing
- `springTransition` — spring, stiffness 300, damping 30

**Reusable variants (import from `@/lib/animations`):**
- `fadeUp`, `fadeIn`, `scaleIn`, `slideInLeft`, `slideInRight`
- `staggerContainer` / `staggerContainerSlow` + `staggerItem` — for orchestrating child fade-ups
- `scrollReveal` — for `whileInView`
- `cardHover`, `buttonTap` — interaction primitives
- `menuAnimation`, `pageTransition`, `accordionAnimation`
- `counterAnimation` — for animated stats numbers

**Viewport defaults:** Use `viewportSettings` (`{ once: true, margin: "-100px" }`) with `whileInView`.

**Usage pattern (from `hero-section.tsx`):**
```tsx
<motion.div
  initial="initial"
  animate="animate"
  variants={staggerContainer}
>
  <motion.h1 variants={staggerItem} className="text-hero">
    {content.headline}
  </motion.h1>
</motion.div>
```

**Smooth scroll:** Handled globally via `LenisProvider` in `src/providers/` — do not reimplement.

## Import Organization

Order observed across codebase:
1. Client directive (`"use client";`) if needed
2. Next.js imports (`next/link`, `next/image`)
3. Third-party (`framer-motion`, `lucide-react`)
4. Internal `@/lib/*` (constants, animations, utils)
5. Internal `@/hooks/*`
6. Internal `@/components/*`
7. Relative imports (rare — avoid)

## Error Handling

- API routes (`src/app/api/*/route.ts`) return `NextResponse.json({ error }, { status })` on failure
- Client fetch calls check `response.ok` and surface error strings to forms
- No global error boundary framework — Next.js `error.tsx` conventions used where needed

## Function Design

- Prefer named function declarations for React components: `export function HeroSection()`
- Arrow functions for small helpers and hooks
- Props destructured in parameter list with inline `interface {Name}Props`
- Keep sections focused — split responsive layouts inside one file is acceptable, but extract shared logic to `shared/`

## Comments

- Sparse inline comments — only where layout blocks need labels (e.g., `{/* Desktop: Clean Split Layout */}`)
- No JSDoc enforcement
- Section dividers via `//` comments acceptable (`// Main Hero Section - Split Layout`)

## Linting & Formatting

**ESLint:** `eslint.config.mjs` using flat config, extending:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

Run: `npm run lint`

**Prettier:** No `.prettierrc` present — rely on ESLint + editor defaults. 2-space indentation, double quotes, semicolons observed consistently.

**TypeScript:** `strict: true` in `tsconfig.json`. Target ES2017, module esnext, bundler resolution, `jsx: react-jsx`.

## Module Design

- **Named exports only** — no default exports for components (except Next.js `page.tsx` / `layout.tsx` which require default exports)
- **No barrel files** (`index.ts`) in component directories — import directly from the component file
- Constants centralized in `src/lib/constants.ts` — do not scatter content across files

## Where to Add New Things

| Need | Location |
|---|---|
| New page section (single use) | `src/components/sections/{name}-section.tsx` |
| Reusable visual component | `src/components/shared/{name}.tsx` |
| New shadcn primitive | `src/components/ui/` (via shadcn CLI) |
| New content block | Add to `src/content/content.json` + export in `src/lib/constants.ts` |
| New animation variant | `src/lib/animations.ts` |
| New route | `src/app/{route}/page.tsx` |
| New API endpoint | `src/app/api/{name}/route.ts` |
| New design token | CSS variable in `src/app/globals.css` |

---

*Convention analysis: 2026-04-09*
