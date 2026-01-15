# RubikONE Website - Struktur & Dokumentation

> Dieses Dokument dient als Referenz für KI-Assistenten und Entwickler, um schnell die richtige Datei für Änderungen zu finden.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS mit CSS-Variablen
- **Animationen:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** Vercel
- **E-Mail:** Resend

---

## Projektstruktur

```
rubikone-website/
├── src/
│   ├── app/                    # Seiten (Next.js App Router)
│   ├── components/             # React-Komponenten
│   │   ├── layout/             # Header, Footer, Navigation
│   │   ├── sections/           # Seitenabschnitte
│   │   ├── shared/             # Wiederverwendbare Komponenten
│   │   └── ui/                 # UI-Primitives (Button, Input, etc.)
│   ├── lib/                    # Utilities & Konstanten
│   └── providers/              # React Context Provider
├── public/
│   ├── images/                 # Alle Bilder
│   ├── videos/                 # Videos
│   └── downloads/              # PDFs
└── KONZEPT-STAEDTESEITE.md     # Entwurf für Städte-Seite
```

---

## Seiten (Routes)

| Route | Datei | Beschreibung |
|-------|-------|--------------|
| `/` | `src/app/page.tsx` | **Startseite** |
| `/konzept` | `src/app/konzept/page.tsx` | Was ist RubikONE, Vorher/Nachher, Lerndimensionen |
| `/fuer-gemeinden` | `src/app/fuer-gemeinden/page.tsx` | Infos für Gemeinden, Prozess, FAQ |
| `/koeniz` | `src/app/koeniz/page.tsx` | Referenz/Fallstudie Köniz |
| `/impulsworkshop` | `src/app/impulsworkshop/page.tsx` | Workshop-Angebot |
| `/ueber-uns` | `src/app/ueber-uns/page.tsx` | ParkourONE Story, Team |
| `/kontakt` | `src/app/kontakt/page.tsx` | Kontaktformular |
| `/konfigurator` | `src/app/konfigurator/page.tsx` | Preis-Konfigurator (Vollseite) |
| `/impressum` | `src/app/impressum/page.tsx` | Impressum |
| `/datenschutz` | `src/app/datenschutz/page.tsx` | Datenschutzerklärung |

---

## Startseite - Sektionen (Reihenfolge)

Die Startseite (`src/app/page.tsx`) besteht aus folgenden Sektionen:

1. **HeroSection** - Split-Layout mit Video (`hero-section.tsx`)
2. **WasWaereWennHook** - Emotionaler Einstieg (`was-waere-wenn-hook.tsx`)
3. **VideoSection** - YouTube Video "So funktioniert es" (`video-section.tsx`)
4. **ProblemSection** - "40% bewegen sich zu wenig" (`problem-section.tsx`)
5. **VorherNachherTeaser** - Interaktiver Slider (`vorher-nachher-teaser.tsx`)
6. **ComparisonSection** - USP "Was RubikONE auszeichnet" (`comparison-table.tsx`)
7. **TestimonialsSection** - Zitate/Social Proof (`testimonials.tsx`)
8. **StatsSection** - Zahlen aus Köniz (`stats-section.tsx`)
9. **MovementsGrid** - Die 9 Bewegungen (`movements-grid.tsx`)
10. **SolutionSection** - "Die Erlaubnis" (`solution-section.tsx`)
11. **ImageGallery** - Bildergalerie (`image-gallery.tsx`)
12. **ProzessTeaser** - Link zu Für Gemeinden (`prozess-teaser.tsx`)
13. **PricingSection** - Preisübersicht (`pricing-section.tsx`)
14. **ConfiguratorCTASection** - Konfigurator-CTA (`configurator-cta-section.tsx`)
15. **CTASection** - Abschluss-CTA (`cta-section.tsx`)

---

## Wichtige Komponenten

### Layout
| Datei | Beschreibung |
|-------|--------------|
| `components/layout/navigation.tsx` | Header/Navigation (Desktop + Mobile) |
| `components/layout/footer.tsx` | Footer |
| `components/layout/floating-configurator.tsx` | Schwebender Konfigurator-Button |

### Sektionen (sections/)
| Datei | Beschreibung |
|-------|--------------|
| `hero-section.tsx` | Hero für Startseite + `PageHero` für Unterseiten |
| `video-section.tsx` | YouTube Video Sektion |
| `was-waere-wenn-hook.tsx` | "Was wäre wenn..." emotionaler Hook |
| `vorher-nachher-teaser.tsx` | Vorher/Nachher mit interaktivem Slider |
| `problem-section.tsx` | Statistik "40% bewegen sich zu wenig" |
| `solution-section.tsx` | "RubikONE gibt die Erlaubnis" |
| `comparison-table.tsx` | USP-Übersicht "Was RubikONE auszeichnet" |
| `testimonials.tsx` | Zitate von BASPO, Köniz, etc. |
| `stats-section.tsx` | Zahlen (531 Teilnehmende, 94%, etc.) |
| `movements-grid.tsx` | Die 9 Bewegungen als Karten |
| `pricing-section.tsx` | Preispakete (Kompakt, Standard, Premium) |
| `process-section.tsx` | 4-Phasen-Prozess (ausführlich) |
| `prozess-teaser.tsx` | Kompakter Prozess-Teaser mit Link |
| `configurator-overlay.tsx` | Konfigurator als Overlay |
| `configurator-cta-section.tsx` | CTA zum Konfigurator |
| `cta-section.tsx` | Generische CTA-Sektion |
| `parkourone-story.tsx` | ParkourONE Geschichte (Über uns) |
| `contact-form.tsx` | Kontaktformular |
| `faq-section.tsx` | FAQ Akkordeon |
| `image-gallery.tsx` | Bildergalerie |

### Shared (shared/)
| Datei | Beschreibung |
|-------|--------------|
| `vorher-nachher-slider.tsx` | Interaktiver Vorher/Nachher Slider (wiederverwendbar) |
| `section-header.tsx` | Standard-Sektions-Header |
| `fade-up.tsx` | Fade-In Animation Wrapper |

---

## Zentrale Daten (constants.ts)

**Datei:** `src/lib/constants.ts`

Alle Texte, Daten und Konfigurationen sind hier zentral gespeichert:

| Konstante | Beschreibung |
|-----------|--------------|
| `SITE_CONFIG` | Name, URL, Tagline |
| `NAVIGATION_ITEMS` | Hauptnavigation |
| `HERO_CONTENT` | Hero-Texte und CTAs |
| `TRUST_STATS` | Statistik-Zahlen |
| `PROBLEM_CONTENT` | "40% bewegen sich zu wenig" |
| `SOLUTION_CONTENT` | "Die Erlaubnis" |
| `NINE_MOVEMENTS` | Die 9 Posten/Bewegungen |
| `COMPARISON_TABLE` | USP-Features |
| `TESTIMONIALS` | Zitate |
| `PROCESS_PHASES` | 4-Phasen-Prozess |
| `PRICING_PACKAGES` | Preispakete |
| `IMPULSWORKSHOP` | Workshop-Details |
| `KOENIZ_CASE_STUDY` | Köniz Fallstudie Daten |
| `KOENIZ_DETAILS` | Köniz Standort, Route, Zitate |
| `PARKOURONE_STORY` | Geschichte, Team, Expertise |
| `FAQ_ITEMS` | Häufige Fragen |
| `FOOTER_LINKS` | Footer-Navigation |
| `CONTACT_INFO` | Kontaktdaten |
| `CONFIGURATOR` | Konfigurator-Pakete und Services |

---

## Wo finde ich was?

### Text ändern
| Was | Wo |
|-----|-----|
| Navigation Labels | `src/lib/constants.ts` → `NAVIGATION_ITEMS` |
| Hero Text | `src/lib/constants.ts` → `HERO_CONTENT` |
| Statistiken | `src/lib/constants.ts` → `TRUST_STATS` |
| Preise | `src/lib/constants.ts` → `PRICING_PACKAGES` |
| FAQ | `src/lib/constants.ts` → `FAQ_ITEMS` |
| Testimonials | `src/lib/constants.ts` → `TESTIMONIALS` |
| Köniz Daten | `src/lib/constants.ts` → `KOENIZ_CASE_STUDY` |
| Kontaktdaten | `src/lib/constants.ts` → `CONTACT_INFO` |

### Sektion ändern
| Was | Wo |
|-----|-----|
| Reihenfolge Startseite | `src/app/page.tsx` |
| Hero-Design | `src/components/sections/hero-section.tsx` |
| Preistabelle | `src/components/sections/pricing-section.tsx` |
| Konfigurator | `src/components/sections/configurator-overlay.tsx` |

### Styling
| Was | Wo |
|-----|-----|
| Farben | `src/app/globals.css` (CSS-Variablen) |
| Tailwind Config | `tailwind.config.ts` |
| Animationen | `src/lib/animations.ts` |

### Bilder
| Was | Wo |
|-----|-----|
| Hero Bilder | `public/images/hero/` |
| Köniz Bilder | `public/images/koeniz/` |
| Posten Bilder | `public/images/posten/` |
| Team Bilder | `public/images/team/` |
| Konzept Bilder | `public/images/konzept/` |
| Videos | `public/videos/` |

---

## API Endpunkte

| Route | Datei | Beschreibung |
|-------|-------|--------------|
| `/api/contact` | `src/app/api/contact/route.ts` | Kontaktformular (Resend) |
| `/api/configurator` | `src/app/api/configurator/route.ts` | Konfigurator-Anfrage |

---

## Häufige Aufgaben

### Neue Sektion auf Startseite hinzufügen
1. Komponente erstellen in `src/components/sections/`
2. In `src/app/page.tsx` importieren und an gewünschter Stelle einfügen

### Text auf Website ändern
1. In `src/lib/constants.ts` die entsprechende Konstante finden
2. Text ändern
3. Build testen: `npm run build`

### Neue Seite erstellen
1. Ordner in `src/app/` erstellen (z.B. `src/app/neue-seite/`)
2. `page.tsx` darin erstellen
3. Optional: In Navigation eintragen (`constants.ts` → `NAVIGATION_ITEMS`)

### Bild ersetzen
1. Neues Bild in `public/images/` ablegen
2. Pfad in der entsprechenden Komponente oder `constants.ts` aktualisieren

---

## Deployment

- **Host:** Vercel
- **Branch:** `main` → automatisches Deployment
- **Preview URL:** `rubikone.vercel.app`
- **Produktions-URL:** `rubikone.ch` (wenn konfiguriert)

---

## Befehle

```bash
# Entwicklung starten
npm run dev

# Build erstellen
npm run build

# Build lokal testen
npm run start

# Linting
npm run lint
```

---

## Kontakt

Bei Fragen zur Website-Struktur:
- **Entwicklung:** ParkourONE / IT
- **E-Mail:** info@rubikone.ch
