# RubikONE Design System

Gestaltungsanleitung basierend auf der Homepage. Alle weiteren Seiten orientieren sich an diesen Regeln.

---

## 1. Grundprinzipien

### Stil
- **Apple-inspiriert**: Minimalistisch, viel Weissraum, klare Typografie
- **Reduziert**: Nur das Nötigste, keine überflüssigen Elemente
- **Professionell**: B2G-Zielgruppe (Gemeinden), keine verspielten Elemente

### Farben

```css
/* Primärfarben */
--color-apple-blue: #0066CC;        /* Links, CTAs, Akzente */
--color-apple-dark: #1D1D1F;        /* Headlines, wichtiger Text */

/* Grautöne */
--color-apple-gray-100: #F5F5F7;    /* Hintergrund Sections (alternierend) */
--color-apple-gray-600: #666666;    /* Subtitles, Beschreibungen */
--color-apple-gray-700: #505050;    /* Body Text */

/* Hintergründe */
bg-white                             /* Standard Section */
bg-[var(--color-apple-gray-100)]    /* Alternierend für Kontrast */
bg-[var(--color-apple-dark)]        /* Dunkle Sections (sparsam) */
```

---

## 2. Layout

### Container

```tsx
// Standard Content Container (max-width: 980px)
<div className="container-content">

// Padding: 1.5rem (mobile), 2rem (desktop)
```

### Section Spacing

```tsx
// Standard Section
<section className="py-16 lg:py-24 bg-white">
  <div className="container-content">
    {/* Inhalt */}
  </div>
</section>
```

### Hintergrund-Wechsel
Sections alternieren zwischen `bg-white` und `bg-[var(--color-apple-gray-100)]` für visuellen Rhythmus.

---

## 3. Typografie

### Headlines

```tsx
// Section Title (H2)
<h2 className="text-title-1 text-[var(--color-apple-dark)]">
  Kurz. Prägnant. Punkt.
</h2>

// Untertitel (optional, VOR dem Titel)
<p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
  Kategoriebezeichnung
</p>
```

### Body Text

```tsx
// Grosser Fliesstext (Lead)
<p className="text-body-lg text-[var(--color-apple-gray-600)]">

// Standard Fliesstext
<p className="text-body text-[var(--color-apple-gray-700)]">

// Kleiner Text (Cards, Details)
<p className="text-body-sm text-[var(--color-apple-gray-600)]">
```

### Textlängen
- Headlines: Max 2 Zeilen, `max-w-2xl` oder `max-w-3xl`
- Body: `max-w-2xl` für bessere Lesbarkeit

---

## 4. Section Header Pattern

**Immer linksbündig**, ausser bei zentrierten Layouts.

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={appleTransition}
  className="mb-12"
>
  <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
    Untertitel/Kategorie
  </p>
  <h2 className="text-title-1 text-[var(--color-apple-dark)]">
    Hauptaussage.
  </h2>
  {/* Optional: Beschreibung */}
  <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl">
    Kurze Erklärung in 1-2 Sätzen.
  </p>
</motion.div>
```

---

## 5. Slider Pattern

Slider gehen über den Container hinaus bis zum Bildschirmrand.

### Struktur

```tsx
<section className="py-16 lg:py-24 bg-white overflow-hidden">
  {/* Header - IM Container */}
  <div className="container-content mb-12">
    <motion.div>
      <p className="text-body-sm ...">Untertitel</p>
      <h2 className="text-title-1 ...">Titel</h2>
    </motion.div>
  </div>

  {/* Slider - AUSSERHALB Container, volle Breite */}
  <div
    ref={scrollRef}
    className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
  >
    {/* Linker Spacer - richtet erste Karte am Container aus */}
    <div className="slider-spacer" />

    {/* Cards */}
    {items.map((item, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ...appleTransition, delay: index * 0.1 }}
        className="flex-shrink-0 w-[320px]"  // Feste Breite!
      >
        {/* Card Content */}
      </motion.div>
    ))}

    {/* Rechter Spacer */}
    <div className="slider-spacer" />
  </div>

  {/* Navigation - IM Container, rechts */}
  <div className="container-content mt-6">
    <div className="flex justify-end gap-4">
      <button onClick={() => scroll("left")}>
        <ArrowLeft className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
      </button>
      <button onClick={() => scroll("right")}>
        <ArrowRight className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
      </button>
    </div>
  </div>
</section>
```

### Scroll-Funktion

```tsx
const scrollRef = useRef<HTMLDivElement>(null);

const scroll = (direction: "left" | "right") => {
  if (scrollRef.current) {
    const scrollAmount = 340; // Etwas mehr als Card-Breite
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }
};
```

---

## 6. Card Patterns

### Stats Card (Bild + Zahl + Text)

```tsx
<div className="bg-[var(--color-apple-gray-100)] rounded-2xl overflow-hidden h-full">
  {/* Bild mit Overlay */}
  <div className="relative aspect-[4/3]">
    <Image src={...} alt={...} fill className="object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    <div className="absolute bottom-4 left-4">
      <span className="text-display text-white font-bold">531</span>
    </div>
  </div>
  {/* Content */}
  <div className="p-6">
    <h3 className="text-headline text-[var(--color-apple-dark)] mb-2">
      Titel
    </h3>
    <p className="text-body-sm text-[var(--color-apple-gray-600)]">
      Beschreibung
    </p>
  </div>
</div>
```

### Portrait Card (für Prozesse, Click-to-expand)

```tsx
<div className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[3/4]">
  <Image src={...} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
  <div className="absolute bottom-4 left-4 right-14">
    <p className="text-body-sm text-white/70">Untertitel</p>
    <h3 className="text-headline text-white font-semibold">Titel</h3>
  </div>
  {/* Plus Icon */}
  <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
    <Plus className="h-5 w-5 text-white" />
  </button>
</div>
```

### Info Card (Text only)

```tsx
<div className="bg-white rounded-2xl p-6 shadow-apple">
  <h3 className="text-headline text-[var(--color-apple-dark)]">Titel</h3>
  <p className="mt-2 text-body-sm text-[var(--color-apple-gray-600)]">
    Beschreibung
  </p>
</div>
```

---

## 7. Buttons

### Primary (für Haupt-CTAs)

```tsx
<Link href="/kontakt" className="btn-primary">
  Jetzt anfragen
</Link>
```

### Secondary (für sekundäre Aktionen)

```tsx
<Link href="/konzept" className="btn-secondary">
  Mehr erfahren
  <ArrowRight className="h-4 w-4" />
</Link>
```

### Button-Platzierung
- Primary + Secondary nebeneinander: `flex flex-col sm:flex-row gap-4`
- Einzelner Button in Card: `self-start`

---

## 8. Bilder

### Aspect Ratios
- **4:3** - Standard für Cards
- **3:4** - Portrait Cards (Slider)
- **16:9 (video)** - Video-Thumbnails
- **square** - Icons, kleine Thumbnails

### Bildbehandlung

```tsx
<div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
  <Image
    src="/images/..."
    alt="Beschreibung"
    fill
    className="object-cover"
  />
</div>
```

### Gradient Overlays
- Von unten: `bg-gradient-to-t from-black/60 to-transparent`
- Von unten stark: `bg-gradient-to-t from-black/80 via-black/20 to-transparent`

---

## 9. Animationen

### Standard Fade-Up (für alle Elemente)

```tsx
import { appleTransition } from "@/lib/animations";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={appleTransition}
>
```

### Staggered Animation (für Listen)

```tsx
import { staggerContainer, staggerItem } from "@/lib/animations";

<motion.div
  initial="initial"
  animate="animate"
  variants={staggerContainer}
>
  {items.map((item) => (
    <motion.div key={item} variants={staggerItem}>
      {/* Content */}
    </motion.div>
  ))}
</motion.div>
```

### Delay für Elemente in Slider

```tsx
transition={{ ...appleTransition, delay: index * 0.1 }}
```

---

## 10. Modals

### Struktur

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 pb-4 overflow-y-auto"
      onClick={() => setIsOpen(false)}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={appleTransition}
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full">
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Image Header */}
        <div className="relative aspect-video">
          <Image src={...} fill className="object-cover rounded-t-3xl" />
        </div>

        {/* Content */}
        <div className="p-8">
          {/* ... */}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

---

## 11. Grid Layouts

### 2-Spalten (Text + Bild)

```tsx
<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
  <div>{/* Text */}</div>
  <div>{/* Bild */}</div>
</div>
```

### 3-Spalten Grid

```tsx
<div className="grid md:grid-cols-3 gap-8">
```

### 4-Spalten Grid

```tsx
<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
```

---

## 12. Abstände

### Zwischen Sections
- Automatisch durch `py-16 lg:py-24`

### Section Header zu Content
- `mb-12`

### Innerhalb Cards
- Padding: `p-6` oder `p-8`
- Gap zwischen Elementen: `mb-2`, `mb-4`, `mt-4`

### Zwischen Grid Items
- `gap-4` (eng)
- `gap-6` (normal)
- `gap-8` (weit)

---

## 13. Responsive Breakpoints

```
sm: 640px   - Kleine Tablets
md: 768px   - Tablets
lg: 1024px  - Desktop
xl: 1280px  - Grosse Screens
```

### Typische Patterns

```tsx
// Text
className="text-body-sm lg:text-body"

// Padding
className="p-6 lg:p-8"

// Grid
className="grid md:grid-cols-2 lg:grid-cols-3"

// Verstecken
className="hidden lg:block"
className="lg:hidden"
```

---

## 14. Icons

### Verwendung
- **Lucide React** als Icon-Library
- Grösse: `h-4 w-4` (klein), `h-5 w-5` (normal), `h-6 w-6` (gross)
- Farbe: `text-[var(--color-apple-blue)]` oder `text-[var(--color-apple-gray-500)]`

### Import

```tsx
import { ArrowRight, ArrowLeft, Plus, X, Check } from "lucide-react";
```

---

## 15. Schatten

```css
shadow-apple      /* Standard: 0 4px 12px rgba(0,0,0,0.08) */
shadow-apple-lg   /* Grösser: 0 8px 24px rgba(0,0,0,0.12) */
shadow-apple-xl   /* Prominent: 0 12px 40px rgba(0,0,0,0.16) */
```

---

## 16. Border Radius

```
rounded-xl    /* 12px - Buttons, kleine Cards */
rounded-2xl   /* 16px - Cards, Bilder */
rounded-3xl   /* 24px - Grosse Cards, Modals */
rounded-full  /* Pills, Icon-Buttons */
```

---

## 17. Checkliste für neue Sections

1. [ ] Hintergrund alterniert (white/gray-100)?
2. [ ] Section spacing: `py-16 lg:py-24`?
3. [ ] Content in `container-content`?
4. [ ] Header linksbündig mit Untertitel + Titel?
5. [ ] Animations mit `appleTransition`?
6. [ ] Slider pattern korrekt (spacer, overflow-hidden)?
7. [ ] Responsive breakpoints definiert?
8. [ ] Farben aus dem System verwendet?
9. [ ] Keine überflüssigen Elemente?
