"use client";

/* eslint-disable @next/next/no-img-element */

// =============================================================
// Block Preview Renderers
// Each renderer mimics the real frontend section using the same
// CSS classes from globals.css (section-spacing, container-content,
// text-hero, btn-primary, etc.)
// =============================================================

interface PreviewProps {
  content: any;
}

// --- LABEL MAP ---
export const BLOCK_TYPE_LABELS: Record<string, string> = {
  hero: "Hero",
  stats: "Vertrauens-Zahlen",
  problem: "Problem-Statement",
  solution: "Loesung",
  testimonials: "Kundenstimmen",
  process: "4-Phasen-Prozess",
  cta: "Call-to-Action",
  comparison: "Vorteile-Vergleich",
  movements: "Die 9 Bewegungen",
  safety: "Sicherheit & Normen",
  stakeholder: "Stakeholder-Vorteile",
  flexibility: "Flexible Leistungen",
  faq: "Fragen & Antworten",
  casestudy: "Case Study",
  koenizdetails: "Standort-Details",
  workshop: "Workshop-Inhalt",
  workshopdetails: "Details & FAQ",
  pricing: "Preis-Pakete",
  configurator: "Konfigurator",
  story: "Unsere Geschichte",
  partners: "Partner",
  siteconfig: "Website-Einstellungen",
  navigation: "Navigation",
  contact: "Kontaktdaten",
  contactperson: "Ansprechpartnerin",
  footer: "Footer",
};

// --- AVAILABLE BLOCK TYPES for "add block" dropdown ---
export const AVAILABLE_BLOCK_TYPES = [
  { type: "hero", label: "Hero", defaultKey: "HERO_CONTENT" },
  { type: "stats", label: "Vertrauens-Zahlen", defaultKey: "TRUST_STATS" },
  { type: "problem", label: "Problem-Statement", defaultKey: "PROBLEM_CONTENT" },
  { type: "solution", label: "Loesung", defaultKey: "SOLUTION_CONTENT" },
  { type: "testimonials", label: "Kundenstimmen", defaultKey: "TESTIMONIALS" },
  { type: "process", label: "4-Phasen-Prozess", defaultKey: "PROCESS_PHASES" },
  { type: "cta", label: "Call-to-Action", defaultKey: "CTA_CONTENT" },
  { type: "comparison", label: "Vorteile-Vergleich", defaultKey: "COMPARISON_TABLE" },
  { type: "movements", label: "Die 9 Bewegungen", defaultKey: "NINE_MOVEMENTS" },
  { type: "safety", label: "Sicherheit & Normen", defaultKey: "SAFETY_INFO" },
  { type: "stakeholder", label: "Stakeholder-Vorteile", defaultKey: "STAKEHOLDER_BENEFITS" },
  { type: "flexibility", label: "Flexible Leistungen", defaultKey: "FLEXIBILITY_INFO" },
  { type: "faq", label: "Fragen & Antworten", defaultKey: "FAQ_ITEMS" },
  { type: "casestudy", label: "Case Study", defaultKey: "KOENIZ_CASE_STUDY" },
  { type: "koenizdetails", label: "Standort-Details", defaultKey: "KOENIZ_DETAILS" },
  { type: "workshop", label: "Workshop-Inhalt", defaultKey: "IMPULSWORKSHOP" },
  { type: "workshopdetails", label: "Details & FAQ", defaultKey: "WORKSHOP_DETAILS" },
  { type: "pricing", label: "Preis-Pakete", defaultKey: "PRICING_PACKAGES" },
  { type: "configurator", label: "Konfigurator", defaultKey: "CONFIGURATOR" },
  { type: "story", label: "Unsere Geschichte", defaultKey: "PARKOURONE_STORY" },
  { type: "partners", label: "Partner", defaultKey: "PARTNERS" },
  { type: "siteconfig", label: "Website-Einstellungen", defaultKey: "SITE_CONFIG" },
  { type: "navigation", label: "Navigation", defaultKey: "NAVIGATION_ITEMS" },
  { type: "contact", label: "Kontaktdaten", defaultKey: "CONTACT_INFO" },
  { type: "contactperson", label: "Ansprechpartnerin", defaultKey: "CONTACT_PERSON" },
  { type: "footer", label: "Footer", defaultKey: "FOOTER_LINKS" },
];

// =============================================================
// Main dispatcher
// =============================================================

export function BlockPreview({ type, content }: { type: string; content: any }) {
  if (!content) {
    return (
      <div className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content text-center">
          <p className="text-body text-[var(--color-apple-gray-400)]">Kein Content vorhanden</p>
        </div>
      </div>
    );
  }

  switch (type) {
    case "hero": return <HeroPreview content={content} />;
    case "stats": return <StatsPreview content={content} />;
    case "problem": return <ProblemPreview content={content} />;
    case "solution": return <SolutionPreview content={content} />;
    case "testimonials": return <TestimonialsPreview content={content} />;
    case "process": return <ProcessPreview content={content} />;
    case "cta": return <CTAPreview content={content} />;
    case "comparison": return <ComparisonPreview content={content} />;
    case "movements": return <MovementsPreview content={content} />;
    case "safety": return <SafetyPreview content={content} />;
    case "stakeholder": return <StakeholderPreview content={content} />;
    case "flexibility": return <FlexibilityPreview content={content} />;
    case "faq": return <FAQPreview content={content} />;
    case "casestudy": return <CaseStudyPreview content={content} />;
    case "koenizdetails": return <KoenizDetailsPreview content={content} />;
    case "workshop": return <WorkshopPreview content={content} />;
    case "workshopdetails": return <WorkshopDetailsPreview content={content} />;
    case "pricing": return <PricingPreview content={content} />;
    case "configurator": return <ConfiguratorPreview content={content} />;
    case "story": return <StoryPreview content={content} />;
    case "partners": return <PartnersPreview content={content} />;
    case "siteconfig": return <SiteConfigPreview content={content} />;
    case "navigation": return <NavigationPreview content={content} />;
    case "contact": return <ContactPreview content={content} />;
    case "contactperson": return <ContactPersonPreview content={content} />;
    case "footer": return <FooterPreview content={content} />;
    default:
      return (
        <div className="section-spacing bg-[var(--color-apple-gray-100)]">
          <div className="container-content text-center">
            <p className="text-body text-[var(--color-apple-gray-400)]">
              Unbekannter Block-Typ: {type}
            </p>
          </div>
        </div>
      );
  }
}

// =============================================================
// 1. HERO
// =============================================================
function HeroPreview({ content }: PreviewProps) {
  return (
    <section className="py-16 lg:py-24 bg-white">
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
    </section>
  );
}

// =============================================================
// 2. STATS
// =============================================================
function StatsPreview({ content }: PreviewProps) {
  const items = Array.isArray(content) ? content : [];
  return (
    <section className="py-12 bg-white border-y border-[var(--color-apple-gray-200)]">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {items.map((s: any, i: number) => (
            <div key={i} className="text-center">
              <p className="text-title-1 text-[var(--color-apple-blue)] font-bold">{s.value}</p>
              <p className="text-body-sm text-[var(--color-apple-dark)] font-medium mt-1">{s.label}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-500)]">{s.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 3. PROBLEM
// =============================================================
function ProblemPreview({ content }: PreviewProps) {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content text-center">
        <p className="text-[clamp(4rem,10vw,8rem)] font-bold text-[var(--color-apple-blue)] leading-none">
          {content.statistic}
        </p>
        <p className="text-body-lg text-[var(--color-apple-gray-600)] mt-2">
          {content.statisticLabel}
        </p>
        <h2 className="text-title-1 text-[var(--color-apple-dark)] mt-8">
          {content.headline}
        </h2>
        <p className="text-body-lg text-[var(--color-apple-gray-600)] mt-4">
          {content.subheadline}
        </p>
        {content.source && (
          <p className="text-body-sm text-[var(--color-apple-gray-400)] mt-6">
            Quelle: {content.source}
          </p>
        )}
      </div>
    </section>
  );
}

// =============================================================
// 4. SOLUTION
// =============================================================
function SolutionPreview({ content }: PreviewProps) {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content text-center">
        <h2 className="text-title-1 text-[var(--color-apple-dark)]">
          {content.headline}
        </h2>
        {content.features && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {content.features.map((f: string, i: number) => (
              <span key={i} className="px-5 py-2 bg-white rounded-full text-body-sm font-medium text-[var(--color-apple-dark)] shadow-sm">
                {f}
              </span>
            ))}
          </div>
        )}
        <p className="mt-8 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl mx-auto">
          {content.description}
        </p>
      </div>
    </section>
  );
}

// =============================================================
// 5. TESTIMONIALS
// =============================================================
function TestimonialsPreview({ content }: PreviewProps) {
  const items = Array.isArray(content) ? content : [];
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="text-center mb-12">
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">Stimmen zum Projekt</p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">Das sagen unsere Partner.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {items.map((t: any, i: number) => (
            <div key={i} className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
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

// =============================================================
// 6. PROCESS
// =============================================================
function ProcessPreview({ content }: PreviewProps) {
  const items = Array.isArray(content) ? content : [];
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">So entsteht Ihr RubikONE</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {items.map((p: any, i: number) => (
            <div key={i} className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-apple-blue)] text-white font-bold text-body-sm mb-4">
                {p.number}
              </span>
              <h3 className="text-title-3 text-[var(--color-apple-dark)]">{p.title}</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{p.subtitle}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-3">{p.description}</p>
              <p className="text-body-sm font-medium text-[var(--color-apple-blue)] mt-3">{p.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 7. CTA
// =============================================================
function CTAPreview({ content }: PreviewProps) {
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
            <span className="btn-secondary text-white pointer-events-none">
              {content.ctaSecondary.label}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 8. COMPARISON
// =============================================================
function ComparisonPreview({ content }: PreviewProps) {
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

// =============================================================
// 9. MOVEMENTS
// =============================================================
function MovementsPreview({ content }: PreviewProps) {
  const items = Array.isArray(content) ? content : [];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">Die 9 Bewegungen</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
          {items.map((m: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl p-5 text-center">
              <h3 className="text-title-3 text-[var(--color-apple-dark)]">{m.name}</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{m.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 10. SAFETY
// =============================================================
function SafetyPreview({ content }: PreviewProps) {
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

// =============================================================
// 11. STAKEHOLDER
// =============================================================
function StakeholderPreview({ content }: PreviewProps) {
  const groups = ["gemeinden", "bildung", "bevoelkerung"].map(k => content[k]).filter(Boolean);
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="grid md:grid-cols-3 gap-6">
          {groups.map((g: any, i: number) => (
            <div key={i} className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-4">{g.title}</h3>
              <ul className="space-y-2">
                {(g.benefits || []).map((b: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-body-sm text-[var(--color-apple-gray-600)]">
                    <span className="text-[var(--color-apple-blue)] mt-0.5 flex-shrink-0">&#10003;</span>
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

// =============================================================
// 12. FLEXIBILITY
// =============================================================
function FlexibilityPreview({ content }: PreviewProps) {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content text-center">
        <h2 className="text-title-1 text-[var(--color-apple-dark)]">{content.headline}</h2>
        <p className="text-body-lg text-[var(--color-apple-gray-600)] mt-4 max-w-2xl mx-auto">{content.description}</p>
        {content.examples && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {content.examples.map((e: string, i: number) => (
              <span key={i} className="px-4 py-2 bg-white rounded-full text-body-sm text-[var(--color-apple-dark)] shadow-sm">
                {e}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// =============================================================
// 13. FAQ
// =============================================================
function FAQPreview({ content }: PreviewProps) {
  const items = Array.isArray(content) ? content : [];
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-narrow">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-12">Haeufige Fragen</h2>
        <div className="space-y-4">
          {items.map((q: any, i: number) => (
            <div key={i} className="border-b border-[var(--color-apple-gray-200)] pb-4">
              <h3 className="text-title-3 text-[var(--color-apple-dark)]">{q.question}</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-2 line-clamp-2">{q.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 14. CASE STUDY
// =============================================================
function CaseStudyPreview({ content }: PreviewProps) {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">{content.headline}</h2>
          <p className="text-body-lg text-[var(--color-apple-gray-600)] mt-4">{content.subheadline}</p>
          <p className="text-body text-[var(--color-apple-gray-600)] mt-2">{content.intro}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {content.challenge && (
            <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-4">{content.challenge.title}</h3>
              <ul className="space-y-2">
                {(content.challenge.points || []).map((p: string, i: number) => (
                  <li key={i} className="text-body-sm text-[var(--color-apple-gray-600)]">&#8226; {p}</li>
                ))}
              </ul>
            </div>
          )}
          {content.solution && (
            <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-4">{content.solution.title}</h3>
              <ul className="space-y-2">
                {(content.solution.points || []).map((p: string, i: number) => (
                  <li key={i} className="text-body-sm text-[var(--color-apple-gray-600)]">&#8226; {p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {content.insights && content.insights.length > 0 && (
          <div className="mt-12 grid md:grid-cols-3 gap-4">
            {content.insights.slice(0, 6).map((ins: any, i: number) => (
              <div key={i} className="bg-[var(--color-apple-gray-100)] rounded-xl p-5">
                <h4 className="text-body font-semibold text-[var(--color-apple-dark)]">{ins.title}</h4>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{ins.shortDesc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// =============================================================
// 15. KOENIZ DETAILS
// =============================================================
function KoenizDetailsPreview({ content }: PreviewProps) {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <div className="grid md:grid-cols-3 gap-6">
          {content.location && (
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-3">Standort</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.location.name}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.location.address}</p>
            </div>
          )}
          {content.route && (
            <div className="bg-white rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-3">Route</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.route.length} &middot; {content.route.posts} Posten</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.route.duration}</p>
            </div>
          )}
          {content.accessibility && (
            <div className="bg-white rounded-2xl p-6">
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
// 16. WORKSHOP
// =============================================================
function WorkshopPreview({ content }: PreviewProps) {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <div className="text-center mb-12">
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">{content.headline}</h2>
          <p className="text-body-lg text-[var(--color-apple-gray-600)] mt-4">{content.subheadline}</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <p className="text-body text-[var(--color-apple-gray-600)]">{content.description}</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-[var(--color-apple-gray-100)] rounded-xl p-4 text-center">
              <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">{content.duration}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-500)]">Dauer</p>
            </div>
            <div className="bg-[var(--color-apple-gray-100)] rounded-xl p-4 text-center">
              <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">{content.participants}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-500)]">Teilnehmende</p>
            </div>
          </div>
          {content.program && (
            <div className="mt-8 space-y-3">
              {content.program.map((step: any, i: number) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-apple-blue)] text-white flex items-center justify-center text-body-sm font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h4 className="text-body font-semibold text-[var(--color-apple-dark)]">{step.title}</h4>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)]">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 17. WORKSHOP DETAILS
// =============================================================
function WorkshopDetailsPreview({ content }: PreviewProps) {
  const groups = content.forWhom?.groups || [];
  const faq = content.faq || [];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        {content.forWhom && (
          <>
            <h2 className="text-title-2 text-[var(--color-apple-dark)] text-center mb-8">{content.forWhom.headline}</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
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
          </>
        )}
        {faq.length > 0 && (
          <div className="max-w-2xl mx-auto space-y-4">
            {faq.map((q: any, i: number) => (
              <div key={i} className="bg-white rounded-xl p-5">
                <h4 className="text-body font-semibold text-[var(--color-apple-dark)]">{q.question}</h4>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{q.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// =============================================================
// 18. PRICING
// =============================================================
function PricingPreview({ content }: PreviewProps) {
  const packages = Array.isArray(content) ? content : [];
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-12">Unsere Pakete</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg: any, i: number) => (
            <div
              key={i}
              className={`rounded-2xl p-6 border-2 ${
                pkg.highlighted
                  ? "border-[var(--color-apple-blue)] bg-white shadow-lg"
                  : "border-[var(--color-apple-gray-200)] bg-[var(--color-apple-gray-100)]"
              }`}
            >
              {pkg.badge && (
                <span className="inline-block px-3 py-1 bg-[var(--color-apple-blue)] text-white rounded-full text-body-sm font-medium mb-3">
                  {pkg.badge}
                </span>
              )}
              <h3 className="text-title-2 text-[var(--color-apple-dark)]">{pkg.name}</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{pkg.posts}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-500)] mt-1">{pkg.idealFor}</p>
              <p className="text-title-3 text-[var(--color-apple-dark)] mt-4">{pkg.price}</p>
              <ul className="mt-4 space-y-2">
                {(pkg.features || []).slice(0, 5).map((f: any, j: number) => (
                  <li key={j} className="flex items-center gap-2 text-body-sm text-[var(--color-apple-gray-600)]">
                    <span className={f.included ? "text-[var(--color-apple-blue)]" : "text-[var(--color-apple-gray-400)]"}>
                      {f.included ? "✓" : "—"}
                    </span>
                    {f.name}
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

// =============================================================
// 19. CONFIGURATOR
// =============================================================
function ConfiguratorPreview({ content }: PreviewProps) {
  const packages = content.packages || [];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center">{content.headline}</h2>
        <p className="text-body-lg text-[var(--color-apple-gray-600)] text-center mt-4">{content.subheadline}</p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {packages.map((p: any, i: number) => (
            <div key={i} className={`bg-white rounded-2xl p-6 ${p.recommended ? "ring-2 ring-[var(--color-apple-blue)]" : ""}`}>
              <h3 className="text-title-3 text-[var(--color-apple-dark)]">{p.name}</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{p.posts} Posten</p>
              <p className="text-body-sm text-[var(--color-apple-gray-500)] mt-1">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 20. STORY
// =============================================================
function StoryPreview({ content }: PreviewProps) {
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
                <span className="text-title-3 text-[var(--color-apple-blue)] font-bold flex-shrink-0 w-16">{m.year}</span>
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
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-4">— {content.quote.author}, {content.quote.role}</p>
          </div>
        )}
      </div>
    </section>
  );
}

// =============================================================
// 21. PARTNERS
// =============================================================
function PartnersPreview({ content }: PreviewProps) {
  const items = Array.isArray(content) ? content : [];
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <h2 className="text-title-1 text-[var(--color-apple-dark)] text-center mb-12">Unsere Partner</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {items.map((p: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl p-6">
              <h3 className="text-title-3 text-[var(--color-apple-dark)]">{p.name}</h3>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-2">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 22. SITE CONFIG
// =============================================================
function SiteConfigPreview({ content }: PreviewProps) {
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

// =============================================================
// 23. NAVIGATION
// =============================================================
function NavigationPreview({ content }: PreviewProps) {
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

// =============================================================
// 24. CONTACT
// =============================================================
function ContactPreview({ content }: PreviewProps) {
  return (
    <section className="py-12 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <h2 className="text-title-2 text-[var(--color-apple-dark)] mb-6">Kontaktdaten</h2>
        <div className="bg-white rounded-2xl p-6 max-w-md">
          <p className="text-body font-semibold text-[var(--color-apple-dark)]">{content.company}</p>
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{content.street}</p>
          <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.city}</p>
          <p className="text-body-sm text-[var(--color-apple-blue)] mt-3">{content.email}</p>
          <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.phone}</p>
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 25. CONTACT PERSON
// =============================================================
function ContactPersonPreview({ content }: PreviewProps) {
  return (
    <section className="py-12 bg-white">
      <div className="container-content">
        <h2 className="text-title-2 text-[var(--color-apple-dark)] mb-6">Ansprechpartnerin</h2>
        <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6 max-w-md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[var(--color-apple-blue)] flex items-center justify-center text-white text-title-3 font-bold">
              {(content.name || "?")[0]}
            </div>
            <div>
              <p className="text-body font-semibold text-[var(--color-apple-dark)]">{content.name}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.role}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--color-apple-gray-200)]">
            <p className="text-body-sm text-[var(--color-apple-blue)]">{content.email}</p>
            <p className="text-body-sm text-[var(--color-apple-gray-600)]">{content.phone}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// =============================================================
// 26. FOOTER
// =============================================================
function FooterPreview({ content }: PreviewProps) {
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
