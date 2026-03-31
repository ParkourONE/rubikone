"use client";

/* eslint-disable @next/next/no-img-element */

// =============================================================
// Block Preview Renderers
// Each renderer mimics the real frontend section using the same
// CSS classes from globals.css (section-spacing, container-content,
// text-hero, btn-primary, etc.)
//
// All blocks are now editable via content.json.
// =============================================================

interface BlockDef {
  type: string;
  contentKey: string;
  label?: string;
}

// --- LABEL MAP ---
export const BLOCK_TYPE_LABELS: Record<string, string> = {
  hero: "Hero",
  texthook: "Text-Hook",
  video: "Video",
  "vorher-nachher": "Vorher / Nachher",
  testimonials: "Kundenstimmen",
  gallery: "Galerie",
  "prozess-teaser": "Prozess-Teaser",
  "configurator-cta": "Konfigurator CTA",
  "cta-dark": "CTA (Dunkel)",
  "cta-blue": "CTA (Blau)",
  "konzept-hero": "Konzept Hero",
  "vorher-nachher-slider": "Vorher/Nachher Slider",
  comparison: "Vorteile-Vergleich",
  "posten-slider": "Posten-Slider",
  lerndimensionen: "Lerndimensionen",
  "stats-slider": "Stats-Slider",
  safety: "Sicherheit & Normen",
  "page-hero": "Seiten-Hero",
  stakeholder: "Stakeholder-Vorteile",
  "usp-kompakt": "USP Kompakt",
  "testimonial-single": "Einzelnes Testimonial",
  "prozess-4-schritte": "4-Schritte-Prozess",
  "referenz-koeniz": "Referenz Koeniz",
  faq: "Haeufig gestellte Fragen",
  "configurator-trigger": "Konfigurator-Trigger",
  lab7x1: "Lab 7x1",
  "challenge-solution": "Herausforderung & Loesung",
  denkmalschutz: "Denkmalschutz",
  erkenntnisse: "Erkenntnisse",
  "workshop-feedback": "Workshop-Feedback",
  "offizielle-stimmen": "Offizielle Stimmen",
  "statement-annina": "Statement Annina",
  "gallery-koeniz": "Galerie Koeniz",
  "selbst-erleben": "Selbst erleben",
  "key-facts": "Key Facts",
  programm: "Programm",
  "workshop-images": "Workshop-Bilder",
  mitnehmen: "Was Sie mitnehmen",
  "fuer-wen": "Fuer wen?",
  "preis-box": "Preis-Box",
  "workshop-faq": "Workshop FAQ",
  ansprechpartnerin: "Ansprechpartnerin",
  "contact-info": "Kontaktinfos",
  "contact-form": "Kontaktformular",
  "contact-image": "Kontakt-Bild",
  story: "Unsere Geschichte",
  "srf-einstein": "SRF Einstein",
  siteconfig: "Website-Einstellungen",
  navigation: "Navigation",
  contact: "Kontaktdaten",
  contactperson: "Ansprechpartnerin",
  footer: "Footer",
};

// --- SIDEBAR BLOCK CATEGORIES ---
export interface BlockCategoryDef {
  category: string;
  blocks: { type: string; label: string; defaultKey: string; icon: string }[];
}

export const BLOCK_LIBRARY: BlockCategoryDef[] = [
  {
    category: "Hero-Bloecke",
    blocks: [
      { type: "hero", label: "Hero", defaultKey: "HERO_CONTENT", icon: "sparkles" },
      { type: "page-hero", label: "Seiten-Hero", defaultKey: "RAUMGESTALTUNG_HERO", icon: "layout" },
      { type: "konzept-hero", label: "Konzept Hero", defaultKey: "KONZEPT_HERO", icon: "lightbulb" },
    ],
  },
  {
    category: "Inhalt",
    blocks: [
      { type: "texthook", label: "Text-Hook", defaultKey: "TEXTHOOK_CONTENT", icon: "type" },
      { type: "video", label: "Video", defaultKey: "VIDEO_CONTENT", icon: "play" },
      { type: "vorher-nachher", label: "Vorher / Nachher", defaultKey: "VORHER_NACHHER_CONTENT", icon: "arrows" },
      { type: "vorher-nachher-slider", label: "Vorher/Nachher Slider", defaultKey: "KONZEPT_PRINZIP", icon: "sliders" },
      { type: "comparison", label: "Vergleich", defaultKey: "COMPARISON_TABLE", icon: "columns" },
      { type: "lerndimensionen", label: "Lerndimensionen", defaultKey: "KONZEPT_LERNDIMENSIONEN", icon: "brain" },
      { type: "stats-slider", label: "Stats-Slider", defaultKey: "STATS_CONTENT", icon: "barchart" },
      { type: "posten-slider", label: "Posten-Slider", defaultKey: "KONZEPT_POSTEN_SLIDER", icon: "grid" },
    ],
  },
  {
    category: "Social Proof",
    blocks: [
      { type: "testimonials", label: "Kundenstimmen", defaultKey: "TESTIMONIALS", icon: "quote" },
      { type: "testimonial-single", label: "Einzelnes Testimonial", defaultKey: "RAUMGESTALTUNG_TESTIMONIAL", icon: "user" },
      { type: "offizielle-stimmen", label: "Offizielle Stimmen", defaultKey: "KOENIZ_DETAILS", icon: "megaphone" },
      { type: "workshop-feedback", label: "Workshop-Feedback", defaultKey: "KOENIZ_CASE_STUDY", icon: "message" },
      { type: "statement-annina", label: "Statement", defaultKey: "KOENIZ_ANNINA", icon: "usercheck" },
    ],
  },
  {
    category: "Prozess",
    blocks: [
      { type: "prozess-4-schritte", label: "4-Schritte", defaultKey: "RAUMGESTALTUNG_PROZESS", icon: "list" },
      { type: "prozess-teaser", label: "Prozess-Teaser", defaultKey: "PROZESS_TEASER_CONTENT", icon: "rocket" },
      { type: "programm", label: "Programm", defaultKey: "IMPULSWORKSHOP", icon: "calendar" },
      { type: "key-facts", label: "Key Facts", defaultKey: "WORKSHOP_KEY_FACTS", icon: "info" },
    ],
  },
  {
    category: "Call-to-Action",
    blocks: [
      { type: "cta-dark", label: "CTA (Dunkel)", defaultKey: "CTA_CONTENT", icon: "zap" },
      { type: "cta-blue", label: "CTA (Blau)", defaultKey: "KONZEPT_CTA", icon: "arrowright" },
      { type: "configurator-cta", label: "Konfigurator-CTA", defaultKey: "CONFIGURATOR_CTA_CONTENT", icon: "settings" },
      { type: "configurator-trigger", label: "Konfigurator-Trigger", defaultKey: "CONFIGURATOR_CTA_CONTENT", icon: "sliders" },
    ],
  },
  {
    category: "Kontakt",
    blocks: [
      { type: "contact-form", label: "Kontaktformular", defaultKey: "KONTAKT_FORM", icon: "mail" },
      { type: "contact-info", label: "Kontaktinfo", defaultKey: "CONTACT_INFO", icon: "mappin" },
      { type: "ansprechpartnerin", label: "Ansprechpartnerin", defaultKey: "CONTACT_PERSON", icon: "user" },
    ],
  },
  {
    category: "Sonstiges",
    blocks: [
      { type: "faq", label: "FAQ", defaultKey: "FAQ_ITEMS", icon: "help" },
      { type: "gallery", label: "Galerie", defaultKey: "GALLERY_CONTENT", icon: "image" },
      { type: "gallery-koeniz", label: "Galerie Koeniz", defaultKey: "KOENIZ_GALLERY", icon: "image" },
      { type: "preis-box", label: "Preis-Box", defaultKey: "WORKSHOP_DETAILS", icon: "tag" },
      { type: "safety", label: "Sicherheit", defaultKey: "SAFETY_INFO", icon: "shield" },
      { type: "workshop-images", label: "Workshop-Bilder", defaultKey: "WORKSHOP_IMAGES", icon: "camera" },
      { type: "story", label: "Geschichte", defaultKey: "PARKOURONE_STORY", icon: "book" },
      { type: "srf-einstein", label: "SRF Einstein", defaultKey: "UEBER_UNS_SRF", icon: "tv" },
    ],
  },
];

// Flattened for the old AVAILABLE_BLOCK_TYPES API
export const AVAILABLE_BLOCK_TYPES = BLOCK_LIBRARY.flatMap((cat) =>
  cat.blocks.map((b) => ({ type: b.type, label: b.label, defaultKey: b.defaultKey }))
);

// HardcodedOverlay removed - all blocks are now editable via content.json

// =============================================================
// Main dispatcher
// =============================================================

export function BlockPreview({
  type,
  content,
  block,
}: {
  type: string;
  content: unknown;
  block?: BlockDef;
}) {
  const label = block?.label;
  return renderPreview(type, content, label);
}

function renderPreview(type: string, content: unknown, label?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = content as any;

  switch (type) {
    // ===================== STARTSEITE =====================
    case "hero":
      return <HeroPreview content={c} />;
    case "texthook":
      return <TextHookPreview />;
    case "video":
      return <VideoPreview />;
    case "vorher-nachher":
      return <VorherNachherPreview />;
    case "testimonials":
      return <TestimonialsPreview content={c} />;
    case "gallery":
      return <GalleryPreview />;
    case "prozess-teaser":
      return <ProzessTeaserPreview />;
    case "configurator-cta":
      return <ConfiguratorCTAPreview />;
    case "cta-dark":
      return <CTADarkPreview content={c} />;

    // ===================== KONZEPT =====================
    case "konzept-hero":
      return <KonzeptHeroPreview />;
    case "vorher-nachher-slider":
      return <VorherNachherSliderPreview />;
    case "comparison":
      return <ComparisonPreview content={c} />;
    case "posten-slider":
      return <PostenSliderPreview />;
    case "lerndimensionen":
      return <LerndimensionenPreview />;
    case "stats-slider":
      return <StatsSliderPreview />;
    case "safety":
      return <SafetyPreview content={c} />;
    case "cta-blue":
      return <CTABluePreview label={label} />;

    // ===================== RAUMGESTALTUNG =====================
    case "page-hero":
      return <PageHeroPreview label={label} />;
    case "stakeholder":
      return <StakeholderPreview content={c} />;
    case "usp-kompakt":
      return <USPKompaktPreview />;
    case "testimonial-single":
      return <TestimonialSinglePreview />;
    case "prozess-4-schritte":
      return <Prozess4SchrittePreview content={c} />;
    case "referenz-koeniz":
      return <ReferenzKoenizPreview />;
    case "faq":
      return <FAQPreview content={c} label={label} />;
    case "configurator-trigger":
      return <ConfiguratorTriggerPreview />;

    // ===================== KOENIZ =====================
    case "lab7x1":
      return <Lab7x1Preview content={c} />;
    case "challenge-solution":
      return <ChallengeSolutionPreview content={c} />;
    case "denkmalschutz":
      return <DenkmalschutzPreview content={c} />;
    case "erkenntnisse":
      return <ErkenntnissePreview content={c} />;
    case "workshop-feedback":
      return <WorkshopFeedbackPreview content={c} />;
    case "offizielle-stimmen":
      return <OffizieleStimmenPreview />;
    case "statement-annina":
      return <StatementAnninaPreview />;
    case "gallery-koeniz":
      return <GalleryKoenizPreview />;
    case "selbst-erleben":
      return <SelbstErlebenPreview content={c} />;

    // ===================== IMPULSWORKSHOP =====================
    case "key-facts":
      return <KeyFactsPreview content={c} />;
    case "programm":
      return <ProgrammPreview content={c} />;
    case "workshop-images":
      return <WorkshopImagesPreview />;
    case "mitnehmen":
      return <MitnehmenPreview />;
    case "fuer-wen":
      return <FuerWenPreview content={c} />;
    case "preis-box":
      return <PreisBoxPreview content={c} />;
    case "workshop-faq":
      return <WorkshopFAQPreview content={c} />;
    case "ansprechpartnerin":
      return <AnsprechpartnerinPreview content={c} />;

    // ===================== KONTAKT =====================
    case "contact-info":
      return <ContactInfoPreview content={c} />;
    case "contact-form":
      return <ContactFormPreview />;
    case "contact-image":
      return <ContactImagePreview />;

    // ===================== UEBER UNS =====================
    case "story":
      return <StoryPreview content={c} />;
    case "srf-einstein":
      return <SRFEinsteinPreview />;

    // ===================== ALLGEMEIN =====================
    case "siteconfig":
      return <SiteConfigPreview content={c} />;
    case "navigation":
      return <NavigationPreview content={c} />;
    case "contact":
      return <ContactPreview content={c} />;
    case "contactperson":
      return <ContactPersonPreview content={c} />;
    case "footer":
      return <FooterPreview content={c} />;

    default:
      return (
        <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
          <div className="container-content text-center">
            <p className="text-body text-[var(--color-apple-gray-400)]">
              Unbekannter Block-Typ: {type}
            </p>
          </div>
        </section>
      );
  }
}

// =============================================================
// STARTSEITE PREVIEWS
// =============================================================

function HeroPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Hero" />;
  return (
    <section className="relative py-20 lg:py-32 bg-white overflow-hidden">
      <div className="container-content">
        <div className="max-w-3xl">
          <span className="inline-block px-4 py-2 bg-[var(--color-apple-gray-100)] rounded-full text-[var(--color-apple-gray-600)] text-sm font-medium mb-6">
            RubikONE - Der Fitnessparkour
          </span>
          <h1 className="text-hero text-[var(--color-apple-dark)]">
            {content.headline || "Headline"}
          </h1>
          <p className="mt-6 text-body-lg text-[var(--color-apple-gray-600)]">
            {content.subheadline || ""}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            {content.ctaPrimary && (
              <span className="btn-primary pointer-events-none">
                {content.ctaPrimary.label}
              </span>
            )}
            {content.ctaSecondary && (
              <span className="btn-secondary pointer-events-none">
                {content.ctaSecondary.label}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20">
        <img src="/images/hero/hero-main.jpg" alt="" className="w-full h-full object-cover" />
      </div>
    </section>
  );
}

function TextHookPreview() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-narrow text-center">
        <p className="text-body-sm text-[var(--color-apple-gray-500)] uppercase tracking-wider mb-4">Was ist RubikONE?</p>
        <h2 className="text-title-1 text-[var(--color-apple-dark)]">
          Raum und Gesundheit kombiniert.
        </h2>
        <p className="mt-6 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl mx-auto">
          RubikONE macht sichtbar, was schon da ist: Treppen werden zu Trainingsgeraeten. Mauern zu Balancierbalken. Gelaender zu Kletterstangen.
        </p>
      </div>
    </section>
  );
}

function VideoPreview() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content text-center">
        <h2 className="text-title-2 text-[var(--color-apple-dark)] mb-8">RubikONE in Aktion</h2>
        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden max-w-4xl mx-auto">
          <img src="/images/hero/parkour-action.jpg" alt="Video placeholder" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900 ml-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function VorherNachherPreview() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content text-center">
        <p className="text-body-sm text-[var(--color-apple-gray-500)] uppercase tracking-wider mb-4">Der Unterschied</p>
        <h2 className="text-title-1 text-[var(--color-apple-dark)] mb-10">
          Keine neuen Geraete. Nur ein neuer Blick.
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img src="/images/konzept/vorher.jpg" alt="Vorher" className="w-full h-full object-cover" />
            <span className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 text-white text-sm rounded-full">Vorher</span>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img src="/images/konzept/nachher.jpg" alt="Nachher" className="w-full h-full object-cover" />
            <span className="absolute bottom-4 left-4 px-4 py-2 bg-[#00a8ab]/90 text-white text-sm rounded-full">Nachher</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsPreview({ content }: { content: any }) {
  const items = Array.isArray(content) ? content : [];
  if (items.length === 0) return <EmptyBlock label="Kundenstimmen" />;
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <div className="text-center mb-12">
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">Stimmen zum Projekt</p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">Das sagen unsere Partner.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {items.map((t: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl p-6">
              <p className="text-body text-[var(--color-apple-dark)] leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-[var(--color-apple-gray-200)]">
                <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">{t.author}</p>
                <p className="text-body-sm text-[var(--color-apple-gray-600)]">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPreview() {
  const images = [
    "/images/hero/generationen.jpg",
    "/images/hero/oma-enkelin.jpg",
    "/images/hero/generationen-kraft.jpg",
    "/images/workshop/frauen-balancieren.jpg",
    "/images/hero/springen.jpg",
    "/images/workshop/balancieren-helfen.jpg",
  ];
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content text-center">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] mb-10">
          Bewegung verbindet Generationen.
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {images.map((src, i) => (
            <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProzessTeaserPreview() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content text-center">
        <p className="text-body-sm text-[var(--color-apple-gray-500)] uppercase tracking-wider mb-4">Ihr Weg zum RubikONE</p>
        <h2 className="text-title-1 text-[var(--color-apple-dark)]">Wir gestalten mit Ihnen.</h2>
        <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl mx-auto">
          Von der Idee bis zur Eroeffnung – wir begleiten den gesamten Prozess.
        </p>
        <div className="mt-10 grid grid-cols-4 gap-4">
          {["Kennenlernen", "Planen", "Umsetzen", "Eroeffnen"].map((step, i) => (
            <div key={i} className="bg-white rounded-2xl p-5">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#00a8ab] text-white font-bold text-sm mb-3">{i + 1}</span>
              <p className="text-body font-medium text-[var(--color-apple-dark)]">{step}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <span className="btn-primary pointer-events-none">Raumgestaltung entdecken</span>
        </div>
      </div>
    </section>
  );
}

function ConfiguratorCTAPreview() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="bg-[var(--color-apple-gray-100)] rounded-3xl p-10 text-center">
          <p className="text-body-sm text-[var(--color-apple-gray-500)] uppercase tracking-wider mb-4">Konfigurator</p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">Ihr individuelles Leistungspaket</h2>
          <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl mx-auto">
            Konfigurieren Sie Ihr Projekt und erhalten Sie eine persoenliche Uebersicht per E-Mail.
          </p>
          <div className="mt-8">
            <span className="btn-primary pointer-events-none">Konfigurator starten</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTADarkPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="CTA (Dunkel)" />;
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-dark)]">
      <div className="container-content text-center">
        <h2 className="text-title-1 text-white">{content.headline}</h2>
        <p className="mt-4 text-body-lg text-white/70">{content.subheadline}</p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          {content.ctaPrimary && (
            <span className="btn-primary bg-white text-[var(--color-apple-dark)] pointer-events-none">
              {content.ctaPrimary.label}
            </span>
          )}
          {content.ctaSecondary && (
            <span className="btn-secondary text-white border-white/30 pointer-events-none">
              {content.ctaSecondary.label}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// KONZEPT PREVIEWS
// =============================================================

function KonzeptHeroPreview() {
  return (
    <section className="relative py-20 lg:py-32 bg-[var(--color-apple-dark)] text-white">
      <div className="container-content">
        <div className="max-w-3xl">
          <h1 className="text-hero">Was waere, wenn...</h1>
          <p className="mt-6 text-body-lg text-white/70">
            ...jede Treppe ein Trainingsgeraet waere? Jede Mauer ein Balancierbalken? Jedes Gelaender eine Klimmzugstange?
          </p>
        </div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30">
        <img src="/images/konzept/bewegung-stadt.jpg" alt="" className="w-full h-full object-cover" />
      </div>
    </section>
  );
}

function VorherNachherSliderPreview() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content text-center">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] mb-10">
          Keine neuen Geraete. Nur ein neuer Blick.
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img src="/images/konzept/vorher.jpg" alt="Vorher" className="w-full h-full object-cover" />
            <span className="absolute bottom-4 left-4 px-4 py-2 bg-black/70 text-white text-sm rounded-full">Vorher</span>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <img src="/images/konzept/nachher.jpg" alt="Nachher" className="w-full h-full object-cover" />
            <span className="absolute bottom-4 left-4 px-4 py-2 bg-[#00a8ab]/90 text-white text-sm rounded-full">Nachher</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Vergleich" />;
  const features = content.features || [];
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">{content.headline}</h2>
          <p className="text-body-lg text-[var(--color-apple-gray-600)] mt-4">{content.subheadline}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f: any, i: number) => (
            <div key={i} className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-2">{f.label}</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PostenSliderPreview() {
  const images = [
    { src: "/images/posten/schild-overview.jpg", label: "Postenuebersicht" },
    { src: "/images/posten/balance-detail.jpg", label: "Balance" },
    { src: "/images/posten/ausdehnen.jpg", label: "Ausdehnen" },
  ];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content text-center">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] mb-4">
          Natuerliche Bewegungen, klar erklaert.
        </h2>
        <p className="text-body-lg text-[var(--color-apple-gray-600)] mb-10 max-w-2xl mx-auto">
          Jeder Posten hat ein Schild mit einfachen Anleitungen und QR-Code fuer Video-Tutorials.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden aspect-[3/4]">
              <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
              <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 text-white text-xs rounded-full">{img.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LerndimensionenPreview() {
  const dims = [
    { name: "Motorisch", src: "/images/lerndimensionen/motorisch.jpg" },
    { name: "Kognitiv", src: "/images/lerndimensionen/kognitiv.jpg" },
    { name: "Emotional", src: "/images/lerndimensionen/emotional.jpg" },
    { name: "Sensorisch", src: "/images/lerndimensionen/sensorisch.jpg" },
    { name: "Sozial", src: "/images/lerndimensionen/sozial.jpg" },
  ];
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content text-center">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] mb-4">
          Mehr als Bewegung. Ganzheitliches Lernen.
        </h2>
        <p className="text-body-lg text-[var(--color-apple-gray-600)] mb-10">
          Fuenf Lerndimensionen machen RubikONE zu mehr als einem Fitnessparcours.
        </p>
        <div className="grid grid-cols-5 gap-4">
          {dims.map((d, i) => (
            <div key={i} className="text-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                <img src={d.src} alt={d.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-body-sm font-medium text-[var(--color-apple-dark)]">{d.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSliderPreview() {
  const stats = [
    { value: "531", label: "Teilnehmende in Koeniz" },
    { value: "94%", label: "verstehen sofort" },
    { value: "84%", label: "schaetzen den Gratiszugang" },
    { value: "0 CHF", label: "Wartung in 8 Monaten" },
  ];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content text-center">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] mb-10">RubikONE funktioniert.</h2>
        <div className="grid grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-6">
              <p className="text-title-1 text-[#00a8ab] font-bold">{s.value}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SafetyPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Sicherheit" />;
  const norms = content.norms || [];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center">{content.headline}</h2>
        <p className="text-body-lg text-[var(--color-apple-gray-600)] text-center mt-4 max-w-2xl mx-auto">{content.description}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {norms.map((n: any, i: number) => (
            <div key={i} className="bg-white rounded-xl px-5 py-3 border border-[var(--color-apple-gray-200)]">
              <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">{n.code}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{n.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABluePreview({ label }: { label?: string }) {
  return (
    <section className="py-16 lg:py-24 bg-[#00a8ab]">
      <div className="container-content text-center">
        <h2 className="text-title-1 text-white">{label || "Ueberzeugt? Erleben Sie es selbst."}</h2>
        <p className="mt-4 text-body-lg text-white/80">
          Starten Sie mit einem Impulsworkshop und erleben Sie die Multiperspektive des Parkours.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className="px-6 py-3 bg-white text-[#00a8ab] rounded-xl font-medium text-sm pointer-events-none">
            Impulsworkshop buchen
          </span>
          <span className="px-6 py-3 bg-transparent border border-white/30 text-white rounded-xl font-medium text-sm pointer-events-none">
            Kontakt aufnehmen
          </span>
        </div>
      </div>
    </section>
  );
}

// =============================================================
// RAUMGESTALTUNG PREVIEWS
// =============================================================

function PageHeroPreview({ label }: { label?: string }) {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container-content">
        <div className="max-w-3xl">
          <h1 className="text-hero text-[var(--color-apple-dark)]">{label || "Seitentitel"}</h1>
          <p className="mt-6 text-body-lg text-[var(--color-apple-gray-600)]">
            Beschreibungstext fuer diese Seite.
          </p>
        </div>
      </div>
    </section>
  );
}

function StakeholderPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Stakeholder" />;
  const groups = ["gemeinden", "bildung", "bevoelkerung"].map(k => content[k]).filter(Boolean);
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">Mehrwert fuer alle</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {groups.map((g: any, i: number) => (
            <div key={i} className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-4">{g.title}</h3>
              <ul className="space-y-2">
                {(g.benefits || []).map((b: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-body-sm text-[var(--color-apple-gray-600)]">
                    <span className="text-[#00a8ab] mt-0.5 flex-shrink-0">&#10003;</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function USPKompaktPreview() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content text-center">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] mb-8">Das macht RubikONE einzigartig</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {["Keine neue Flaeche noetig", "Minimaler baulicher Eingriff", "Fuer alle Generationen"].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6">
              <p className="text-body font-semibold text-[var(--color-apple-dark)]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSinglePreview() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="max-w-3xl mx-auto flex items-start gap-8">
          <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
            <img src="/images/gemeinden/bernadette.jpg" alt="Bernadette" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-body-lg text-[var(--color-apple-dark)] italic leading-relaxed">
              &ldquo;Als Anwohnerin des Schlossareals beobachte ich taeglich, wie Menschen die Posten nutzen. Es ist schoen zu sehen.&rdquo;
            </p>
            <p className="mt-4 text-body-sm font-semibold text-[var(--color-apple-dark)]">Bernadette</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">Anwohnerin Schlossareal Koeniz</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Prozess4SchrittePreview({ content }: { content: any }) {
  const items = Array.isArray(content) ? content : [];
  if (items.length === 0) return <EmptyBlock label="4-Schritte-Prozess" />;
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">In vier Schritten zu Ihrem RubikONE</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {items.map((p: any, i: number) => (
            <div key={i} className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#00a8ab] text-white font-bold text-body-sm mb-4">
                {p.number}
              </span>
              <h3 className="text-title-3 text-[var(--color-apple-dark)]">{p.title}</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{p.subtitle}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-3">{p.description}</p>
              <p className="text-body-sm font-medium text-[#00a8ab] mt-3">{p.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReferenzKoenizPreview() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]">Koeniz war die erste Gemeinde.</h2>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]">
              9 Posten. 2.5 km Route. Mitten im denkmalgeschuetzten Schlossareal.
            </p>
            <span className="mt-6 inline-block btn-primary pointer-events-none">Referenz Koeniz ansehen</span>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3]">
            <img src="/images/gemeinden/koeniz-ref.jpg" alt="Koeniz Referenz" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQPreview({ content, label }: { content: any; label?: string }) {
  const items = Array.isArray(content) ? content : [];
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-narrow">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-12">
          {label || "Haeufig gestellte Fragen"}
        </h2>
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((q: any, i: number) => (
              <div key={i} className="border-b border-[var(--color-apple-gray-200)] pb-4">
                <h3 className="text-title-3 text-[var(--color-apple-dark)]">{q.question}</h3>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-2 line-clamp-2">{q.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-body text-[var(--color-apple-gray-400)]">FAQ-Eintraege werden angezeigt</p>
        )}
      </div>
    </section>
  );
}

function ConfiguratorTriggerPreview() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content text-center">
        <div className="bg-white rounded-3xl p-10 max-w-2xl mx-auto">
          <h2 className="text-title-2 text-[var(--color-apple-dark)]">Konfigurator</h2>
          <p className="mt-4 text-body text-[var(--color-apple-gray-600)]">
            Stellen Sie Ihr individuelles Leistungspaket zusammen.
          </p>
          <span className="mt-6 inline-block btn-primary pointer-events-none">Konfigurator starten</span>
        </div>
      </div>
    </section>
  );
}

// =============================================================
// KOENIZ PREVIEWS
// =============================================================

function Lab7x1Preview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Lab 7x1" />;
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content text-center">
        <div className="flex justify-center mb-6">
          <img src="/images/logos/baspo-logo.gif" alt="BASPO" className="h-12 object-contain" />
        </div>
        <h2 className="text-title-1 text-[var(--color-apple-dark)]">Ein Innovationsprojekt des Bundes</h2>
        <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl mx-auto">{content.intro}</p>
      </div>
    </section>
  );
}

function ChallengeSolutionPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Herausforderung & Loesung" />;
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <div className="grid md:grid-cols-2 gap-8">
          {content.challenge && (
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-4">{content.challenge.title}</h3>
              <ul className="space-y-2">
                {(content.challenge.points || []).map((p: string, i: number) => (
                  <li key={i} className="text-body-sm text-[var(--color-apple-gray-600)]">&#8226; {p}</li>
                ))}
              </ul>
            </div>
          )}
          {content.solution && (
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-4">{content.solution.title}</h3>
              <ul className="space-y-2">
                {(content.solution.points || []).map((p: string, i: number) => (
                  <li key={i} className="text-body-sm text-[var(--color-apple-gray-600)]">&#8226; {p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DenkmalschutzPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Denkmalschutz" />;
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-8">Denkmalschutz</h2>
          <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8">
            <p className="text-body text-[var(--color-apple-gray-600)] leading-relaxed">{content.denkmalpflege}</p>
          </div>
          <div className="mt-6 rounded-2xl overflow-hidden aspect-[16/9]">
            <img src="/images/koeniz/schloss.jpg" alt="Schlossareal Koeniz" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ErkenntnissePreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Erkenntnisse" />;
  const insights = content.insights || [];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-10">Die Erkenntnisse</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {insights.slice(0, 6).map((ins: any, i: number) => (
            <div key={i} className="bg-white rounded-xl p-5">
              <h4 className="text-body font-semibold text-[var(--color-apple-dark)]">{ins.title}</h4>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{ins.shortDesc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkshopFeedbackPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Workshop-Feedback" />;
  const feedback = content.workshopFeedback || [];
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-10">Workshop-Feedback</h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {feedback.slice(0, 6).map((f: string, i: number) => (
            <div key={i} className="bg-[var(--color-apple-gray-100)] rounded-xl p-5">
              <p className="text-body-sm text-[var(--color-apple-gray-600)] italic">&ldquo;{f}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OffizieleStimmenPreview() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-10">Stimmen zum Projekt</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6">
            <p className="text-body text-[var(--color-apple-dark)] italic">&ldquo;Nach einem halben Jahr Arbeit...hat es geklappt.&rdquo;</p>
            <p className="mt-4 text-body-sm font-semibold text-[var(--color-apple-dark)]">Stephan Baeriswyl</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">Fachstelle Sport, Gemeinde Koeniz</p>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <p className="text-body text-[var(--color-apple-dark)] italic">&ldquo;Es ist perfekt. Was super waere: Wenn er noch 100 Jahre bestehen bleibt.&rdquo;</p>
            <p className="mt-4 text-body-sm font-semibold text-[var(--color-apple-dark)]">Christoph Conz</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">BASPO lab7x1</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatementAnninaPreview() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-body-lg text-[var(--color-apple-dark)] italic leading-relaxed">
            &ldquo;Es freut mich sehr, dass dieses Projekt in meiner Gemeinde umgesetzt wird.&rdquo;
          </p>
          <p className="mt-4 text-body-sm font-semibold text-[var(--color-apple-dark)]">Annina Jael Menzi</p>
          <p className="text-body-sm text-[var(--color-apple-gray-600)]">Gemeinderaetin Koeniz</p>
        </div>
      </div>
    </section>
  );
}

function GalleryKoenizPreview() {
  const images = [
    "/images/koeniz/eroeffnung-1.jpg",
    "/images/koeniz/eroeffnung-2.jpg",
    "/images/koeniz/eroeffnung-3.jpg",
    "/images/koeniz/eroeffnung-4.jpg",
    "/images/koeniz/kinder-springen.jpg",
  ];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-10">Impressionen</h2>
        <div className="grid grid-cols-3 gap-3">
          {images.slice(0, 3).map((src, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3]">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3">
          {images.slice(3, 5).map((src, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-[16/9]">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SelbstErlebenPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Selbst erleben" />;
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-10">Selbst erleben</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.location && (
            <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-3">Standort</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.location.name}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.location.address}</p>
            </div>
          )}
          {content.route && (
            <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-3">Route</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.route.length} &middot; {content.route.posts} Posten</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.route.duration}</p>
            </div>
          )}
          {content.accessibility && (
            <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-3">Zugang</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.accessibility.hours}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.accessibility.cost}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// IMPULSWORKSHOP PREVIEWS
// =============================================================

function KeyFactsPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Key Facts" />;
  return (
    <section className="py-12 bg-white border-b border-[var(--color-apple-gray-200)]">
      <div className="container-content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-title-2 text-[#00a8ab] font-bold">120 Min</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">Dauer</p>
          </div>
          <div className="text-center">
            <p className="text-title-2 text-[#00a8ab] font-bold">12</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">Max. Teilnehmende</p>
          </div>
          <div className="text-center">
            <p className="text-title-2 text-[#00a8ab] font-bold">Draussen</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">Bei Ihnen vor Ort</p>
          </div>
          <div className="text-center">
            <p className="text-title-2 text-[#00a8ab] font-bold">Jedes Wetter</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">Findet immer statt</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgrammPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Programm" />;
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">Was Sie erwartet</h2>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {(content.program || []).map((step: any, i: number) => (
            <div key={i} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-[#00a8ab] text-white flex items-center justify-center font-bold text-sm">
                {i + 1}
              </span>
              <div className="pt-2">
                <h4 className="text-body font-semibold text-[var(--color-apple-dark)]">{step.title}</h4>
                <p className="text-body-sm text-[var(--color-apple-gray-600)]">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WorkshopImagesPreview() {
  const images = [
    "/images/workshop/training-1.jpg",
    "/images/workshop/training-2.jpg",
    "/images/workshop/training-3.jpg",
  ];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-wide">
        <div className="grid grid-cols-3 gap-4">
          {images.map((src, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden aspect-[4/3]">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MitnehmenPreview() {
  const items = [
    "Sie betrachten Ihre Umgebung aus der Multiperspektive",
    "Sie erkennen das ungenutzte Potenzial fuer Gesundheitsfoerderung",
    "Sie verstehen, wie RubikONE funktioniert",
    "Sie wissen, was die naechsten Schritte sind",
  ];
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-10">Was Sie mitnehmen</h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[#00a8ab] mt-0.5 flex-shrink-0">&#10003;</span>
              <p className="text-body text-[var(--color-apple-gray-600)]">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FuerWenPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Fuer wen?" />;
  const groups = content.forWhom?.groups || [];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <h2 className="text-title-2 text-[var(--color-apple-dark)] text-center mb-8">
          {content.forWhom?.headline || "Fuer wen ist der Workshop?"}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {groups.map((g: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-3">{g.title}</h3>
              <div className="flex flex-wrap gap-2">
                {(g.roles || []).map((r: string, j: number) => (
                  <span key={j} className="px-3 py-1 bg-[var(--color-apple-gray-100)] rounded-full text-body-sm text-[var(--color-apple-gray-600)]">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PreisBoxPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Preis" />;
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content text-center">
        <div className="bg-[var(--color-apple-gray-100)] rounded-3xl p-10 max-w-lg mx-auto">
          <h2 className="text-title-2 text-[var(--color-apple-dark)]">Preis</h2>
          <p className="text-display text-[#00a8ab] font-bold mt-4">CHF 1&apos;990.&ndash;</p>
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-2">zzgl. Spesen</p>
          <span className="mt-6 inline-block btn-primary pointer-events-none">Workshop buchen</span>
        </div>
      </div>
    </section>
  );
}

function WorkshopFAQPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Workshop FAQ" />;
  const faq = content.faq || [];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-narrow">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-10">Haeufige Fragen</h2>
        <div className="space-y-4">
          {faq.map((q: any, i: number) => (
            <div key={i} className="bg-white rounded-xl p-5">
              <h4 className="text-body font-semibold text-[var(--color-apple-dark)]">{q.question}</h4>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{q.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnsprechpartnerinPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Ansprechpartnerin" />;
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-10">Ihre Ansprechpartnerin</h2>
        <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8 max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-[#00a8ab] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {(content.name || "?")[0]}
          </div>
          <p className="text-body font-semibold text-[var(--color-apple-dark)]">{content.name}</p>
          <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.role}</p>
          <div className="mt-4 pt-4 border-t border-[var(--color-apple-gray-200)]">
            <p className="text-body-sm text-[#00a8ab]">{content.email}</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================
// KONTAKT PREVIEWS
// =============================================================

function ContactInfoPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Kontaktinfo" />;
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8">
            <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-4">Kontakt</h3>
            <p className="text-body font-semibold text-[var(--color-apple-dark)]">{content.company}</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{content.street}</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.city}</p>
            <p className="text-body-sm text-[#00a8ab] mt-3">{content.email}</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.phone}</p>
          </div>
          <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8">
            <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-4">Oeffnungszeiten</h3>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">Montag - Freitag: 08:00 - 17:00</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-4">Oder schreiben Sie uns jederzeit eine E-Mail.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactFormPreview() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8">
          <h3 className="text-title-2 text-[var(--color-apple-dark)] mb-6">Nachricht senden</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-[var(--color-apple-gray-100)] rounded-lg" />
              <div className="h-12 bg-[var(--color-apple-gray-100)] rounded-lg" />
            </div>
            <div className="h-12 bg-[var(--color-apple-gray-100)] rounded-lg" />
            <div className="h-12 bg-[var(--color-apple-gray-100)] rounded-lg" />
            <div className="h-32 bg-[var(--color-apple-gray-100)] rounded-lg" />
            <span className="btn-primary pointer-events-none inline-block">Absenden</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactImagePreview() {
  return (
    <section className="py-0 bg-white">
      <div className="container-wide">
        <div className="rounded-2xl overflow-hidden aspect-[21/9]">
          <img src="/images/workshop/parkour-training.jpg" alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}

// =============================================================
// UEBER UNS PREVIEWS
// =============================================================

function StoryPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Story" />;
  const milestones = content.history?.milestones || [];
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">{content.headline}</h2>
          <p className="text-body-lg text-[var(--color-apple-gray-600)] mt-4">{content.subheadline}</p>
        </div>
        <p className="text-body text-[var(--color-apple-gray-600)] max-w-2xl mx-auto text-center">{content.intro}</p>
        {milestones.length > 0 && (
          <div className="mt-12 space-y-6 max-w-2xl mx-auto">
            {milestones.map((m: any, i: number) => (
              <div key={i} className="flex gap-6">
                <span className="text-title-3 text-[#00a8ab] font-bold flex-shrink-0 w-16">{m.year}</span>
                <div>
                  <h4 className="text-body font-semibold text-[var(--color-apple-dark)]">{m.title}</h4>
                  <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {content.quote && (
          <div className="mt-12 bg-[var(--color-apple-gray-100)] rounded-2xl p-8 max-w-2xl mx-auto text-center">
            <p className="text-body-lg text-[var(--color-apple-dark)] italic">&ldquo;{content.quote.text}&rdquo;</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-4">&mdash; {content.quote.author}, {content.quote.role}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function SRFEinsteinPreview() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content text-center">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] mb-4">Bekannt aus SRF Einstein</h2>
        <p className="text-body-lg text-[var(--color-apple-gray-600)] mb-8">ParkourONE im Schweizer Fernsehen.</p>
        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden max-w-3xl mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-900 ml-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================
// ALLGEMEIN PREVIEWS
// =============================================================

function SiteConfigPreview({ content }: { content: any }) {
  if (!content || typeof content !== "object") return null;
  const entries = Object.entries(content as Record<string, string>);
  return (
    <section className="py-12 bg-white">
      <div className="container-content">
        <h2 className="text-title-2 text-[var(--color-apple-dark)] mb-6">Website-Einstellungen</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {entries.map(([k, v]) => (
            <div key={k} className="bg-[var(--color-apple-gray-100)] rounded-xl px-5 py-3">
              <p className="text-body-sm text-[var(--color-apple-gray-500)] uppercase tracking-wide">{k}</p>
              <p className="text-body text-[var(--color-apple-dark)] mt-1">{String(v)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function NavigationPreview({ content }: { content: any }) {
  const items = Array.isArray(content) ? content : [];
  return (
    <section className="py-12 bg-white">
      <div className="container-content">
        <h2 className="text-title-2 text-[var(--color-apple-dark)] mb-6">Navigation</h2>
        <div className="flex flex-wrap gap-3">
          {items.map((item: any, i: number) => (
            <span key={i} className="px-4 py-2 bg-[var(--color-apple-gray-100)] rounded-full text-body-sm text-[var(--color-apple-dark)]">
              {item.label} <span className="text-[var(--color-apple-gray-400)]">{item.href}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Kontaktdaten" />;
  return (
    <section className="py-12 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <h2 className="text-title-2 text-[var(--color-apple-dark)] mb-6">Kontaktdaten</h2>
        <div className="bg-white rounded-2xl p-6 max-w-md">
          <p className="text-body font-semibold text-[var(--color-apple-dark)]">{content.company}</p>
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{content.street}</p>
          <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.city}</p>
          <p className="text-body-sm text-[#00a8ab] mt-3">{content.email}</p>
          <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.phone}</p>
        </div>
      </div>
    </section>
  );
}

function ContactPersonPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Ansprechpartnerin" />;
  return (
    <section className="py-12 bg-white">
      <div className="container-content">
        <h2 className="text-title-2 text-[var(--color-apple-dark)] mb-6">Ansprechpartnerin</h2>
        <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6 max-w-md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#00a8ab] flex items-center justify-center text-white text-title-3 font-bold">
              {(content.name || "?")[0]}
            </div>
            <div>
              <p className="text-body font-semibold text-[var(--color-apple-dark)]">{content.name}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.role}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-apple-gray-200)]">
            <p className="text-body-sm text-[#00a8ab]">{content.email}</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterPreview({ content }: { content: any }) {
  if (!content) return <EmptyBlock label="Footer" />;
  const sections = Object.entries(content || {}).filter(([, v]) => Array.isArray(v));
  return (
    <section className="py-12 bg-[var(--color-apple-dark)]">
      <div className="container-content">
        <h2 className="text-title-2 text-white mb-8">Footer Links</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {sections.map(([key, items]) => (
            <div key={key}>
              <h3 className="text-body-sm text-white/60 uppercase tracking-wide mb-3">{key}</h3>
              <ul className="space-y-2">
                {(items as any[]).map((link: any, i: number) => (
                  <li key={i} className="text-body-sm text-white/80">{link.label}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// Empty block placeholder
// =============================================================
function EmptyBlock({ label }: { label: string }) {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content text-center">
        <p className="text-body text-[var(--color-apple-gray-400)]">
          {label}: Kein Content vorhanden
        </p>
      </div>
    </section>
  );
}
