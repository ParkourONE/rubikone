# RubikONE Website

## Projekt

Marketing-Website fuer die RubikONE Fitness-Parkour-Loesung von ParkourONE (Schweiz). Zielgruppe: Schweizer Gemeinden, Schulen, Immobilienentwickler. Ziel: Leads generieren via Kontaktformular und Konfigurator.

**Domain:** rubikone.ch
**Betreiber:** ParkourONE / laeuft.ch

## Tech Stack

- **Framework:** Next.js 16.1.1 (App Router)
- **Sprache:** TypeScript 5 (strict)
- **UI:** React 19.2, Tailwind CSS 4, shadcn/ui (new-york style)
- **Animationen:** Framer Motion 12, Lenis (smooth scroll)
- **Icons:** Lucide React
- **Email:** Resend (resend.dev)
- **Analytics:** Vercel Analytics + Speed Insights
- **Deployment:** Vercel

## Projektstruktur

```
src/
├── app/                    # Pages & API Routes (App Router)
│   ├── page.tsx            # Homepage (10+ Sections)
│   ├── layout.tsx          # Root Layout mit Providers
│   ├── globals.css         # Design System (CSS Variables)
│   ├── api/
│   │   ├── admin/login/    # Session-Auth (httpOnly cookie)
│   │   ├── admin/content/  # GitHub-basiertes CMS (GET/PUT)
│   │   ├── contact/        # Kontaktformular -> Resend
│   │   └── configurator/   # Preisrechner
│   ├── admin/              # CMS Dashboard (passwortgeschuetzt)
│   └── [route]/            # 20+ Unterseiten
├── components/
│   ├── layout/             # Navigation, Footer, Floating Configurator
│   ├── sections/           # 30 Page Sections
│   ├── shared/             # FadeUp, SectionHeader, Slider
│   └── ui/                 # shadcn/ui Basis-Komponenten
├── providers/              # ConsentProvider (GDPR), LenisProvider
├── hooks/                  # useScrollLock
├── lib/
│   ├── constants.ts        # Content-Import aus JSON + Icons
│   ├── animations.ts       # Framer Motion Varianten
│   └── utils.ts            # cn() Tailwind Merge
├── content/
│   └── content.json        # Single Source of Truth fuer alle Inhalte
└── middleware.ts            # Admin-Route-Schutz
```

## Architektur-Prinzipien

- **Content:** Zentralisiert in `src/content/content.json`, importiert via `lib/constants.ts`. Aenderungen ueber Admin-Panel -> GitHub API Sync.
- **Styling:** Apple-inspiriertes Minimaldesign. Primaerfarbe `#00a8ab` (Teal). Font: Inter. Responsive mobile-first.
- **Animationen:** `appleEasing` [0.25, 0.1, 0.25, 1.0]. fadeUp/fadeIn/scaleIn Varianten in `lib/animations.ts`.
- **Layout-Klassen:** `.container-content` (980px), `.container-wide` (1200px), `.container-narrow` (680px), `.section-spacing` (py-16 lg:py-24).
- **Typografie:** Responsive clamp()-basiert: `.text-hero`, `.text-display`, `.text-title-1/2/3`, `.text-body-lg/body/body-sm`.

## Wichtige Routen

| Route | Zweck |
|---|---|
| `/` | Homepage |
| `/konzept` | RubikONE Erklaerung, Lerndimensionen |
| `/raumgestaltung` | Gestaltungsprozess |
| `/koeniz` | Referenzprojekt Koeniz |
| `/impulsworkshop` | Workshop-Details |
| `/ueber-uns` | ParkourONE Story & Team |
| `/kontakt` | Kontaktformular |
| `/konfigurator` | Dynamischer Preisrechner |
| `/abc`, `/balance`, `/sprungkraft` ... | Einzelne Bewegungsstationen |
| `/admin` | CMS (geschuetzt) |

## Environment Variables

```
RESEND_API_KEY         # Email-Versand
GITHUB_TOKEN           # Content-Sync mit Repo
GITHUB_REPO            # z.B. "monkeyspk/rubikone"
ADMIN_PASSWORD         # Admin-Login
NODE_ENV               # production / development
```

## Commands

```bash
npm run dev      # Dev-Server :3000
npm run build    # Production Build
npm start        # Production Server
npm run lint     # ESLint
```

## Design System

Definiert in `globals.css` und dokumentiert in `DESIGN-SYSTEM.md`:
- **Farben:** Primary #00a8ab, Dark #1D1D1F, 6 Graustufen
- **Radii/Shadows:** Via CSS Custom Properties
- **Dark Mode:** Unterstuetzt via CSS Variables
- **Komponenten:** shadcn/ui Basis, erweitert mit Framer Motion

## Doku im Repo

- `DESIGN-SYSTEM.md` - Design-Leitfaden
- `WEBSITE-STRUKTUR.md` - Komplette Routenmap
- `KONZEPT-STAEDTESEITE.md` - Konzept fuer Staedte-Varianten
- `ARBEIT-LOG-2026-01-07.md` - Aenderungsprotokoll

## Konventionen

- Sprache im Code: Englisch (Variablen, Komponenten). Sprache im Content: Deutsch.
- Alle Inhaltsaenderungen in `content.json`, nicht hartcodiert in Komponenten.
- Komponenten in `sections/` sind seitenspezifisch, `shared/` ist wiederverwendbar.
- Path-Alias: `@/*` -> `./src/*`
