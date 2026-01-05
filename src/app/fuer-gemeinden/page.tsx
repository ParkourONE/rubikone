import { Metadata } from "next";
import { Building2, GraduationCap, Users, CheckCircle, Download } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { TrustStats } from "@/components/sections/trust-signals";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta-section";
import { STAKEHOLDER_BENEFITS } from "@/lib/constants";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Für Gemeinden | RubikONE",
  description: "RubikONE für Gemeinden: Bewegungsförderung ohne Bauaufwand. Erfahren Sie, wie Ihre Gemeinde vom Konzept profitiert.",
};

const iconMap = {
  Building2,
  GraduationCap,
  Users,
};

const stakeholderSections = [
  {
    id: "gemeinden",
    data: STAKEHOLDER_BENEFITS.gemeinden,
  },
  {
    id: "bildung",
    data: STAKEHOLDER_BENEFITS.bildung,
  },
  {
    id: "bevoelkerung",
    data: STAKEHOLDER_BENEFITS.bevoelkerung,
  },
];

const prozessSchritte = [
  { nummer: "1", titel: "Kennenlernen", beschreibung: "Impulsworkshop vor Ort oder Beratungsgespräch" },
  { nummer: "2", titel: "Planen", beschreibung: "Standortanalyse und Baugesuchsunterstützung" },
  { nummer: "3", titel: "Umsetzen", beschreibung: "Produktion und Installation der Schilder" },
  { nummer: "4", titel: "Eröffnen", beschreibung: "Einweihungsevent mit der Bevölkerung" },
];

const downloads = [
  { name: "Verkaufsbroschüre RubikONE", typ: "PDF", href: "/downloads/rubikone-verkaufsbroschuere.pdf" },
];

export default function FuerGemeindenPage() {
  return (
    <>
      <PageHero
        title="RubikONE für Ihre Gemeinde"
        description="Verwandeln Sie bestehende Orte in Bewegungsräume – ohne neue Geräte, ohne Tiefbau. Bewiesen in Köniz, bereit für Ihre Gemeinde."
        breadcrumb="Für Gemeinden"
      />

      <TrustStats />

      {/* Stakeholder Sections */}
      {stakeholderSections.map((section, sectionIndex) => {
        const Icon = iconMap[section.data.icon as keyof typeof iconMap];
        return (
          <section
            key={section.id}
            id={section.id}
            className={`section-spacing ${sectionIndex % 2 === 1 ? "bg-[var(--color-apple-gray-100)]" : ""}`}
          >
            <div className="container-content">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <FadeUp>
                  <div>
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-apple-blue)] text-white mb-6">
                      <Icon className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-title-1">{section.data.title}</h2>
                  </div>
                </FadeUp>

                <FadeUp delay={0.1}>
                  <ul className="space-y-4">
                    {section.data.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-[var(--color-apple-blue)] flex-shrink-0 mt-0.5" />
                        <span className="text-body">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </FadeUp>
              </div>
            </div>
          </section>
        );
      })}

      {/* Prozess */}
      <section className="section-spacing bg-[var(--color-apple-dark)] text-white">
        <div className="container-content">
          <SectionHeader
            title="Von der Idee zur Eröffnung"
            subtitle="Unser Prozess"
            description="In vier Schritten zu Ihrem RubikONE – wir übernehmen alles oder nur das, was Sie brauchen."
            className="mb-12 [&_h2]:text-white [&_p]:text-white/70"
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {prozessSchritte.map((schritt, index) => (
              <StaggerItem key={index}>
                <div className="bg-white/5 rounded-[var(--radius-apple-lg)] p-6">
                  <div className="text-display text-[var(--color-apple-blue)]">
                    {schritt.nummer}
                  </div>
                  <h3 className="mt-2 text-headline">{schritt.titel}</h3>
                  <p className="mt-2 text-body-sm text-white/70">
                    {schritt.beschreibung}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Downloads */}
      <section className="section-spacing">
        <div className="container-content">
          <SectionHeader
            title="Downloads"
            subtitle="Ressourcen"
            description="Unterlagen für Ihre Entscheidungsträger."
            className="mb-12"
          />

          <StaggerContainer className="max-w-md mx-auto">
            {downloads.map((download, index) => (
              <StaggerItem key={index}>
                <a
                  href={download.href}
                  download
                  className="w-full card-apple text-left group flex items-center gap-4"
                >
                  <Download className="h-8 w-8 text-[var(--color-apple-blue)]" />
                  <div>
                    <h3 className="text-headline group-hover:text-[var(--color-apple-blue)] transition-colors">
                      {download.name}
                    </h3>
                    <p className="mt-1 text-body-sm text-[var(--color-apple-gray-600)]">
                      {download.typ}
                    </p>
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <FAQSection />

      <CTASection variant="dark" />
    </>
  );
}
