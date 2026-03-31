import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { ParkourONEStoryFull } from "@/components/sections/parkourone-story";
import { FadeUp } from "@/components/shared/fade-up";
import { UEBER_UNS_PAGE } from "@/lib/constants";
import { EditableSection } from "@/components/admin/editable-section";

export const metadata: Metadata = {
  title: "Über uns | RubikONE",
  description: "ParkourONE: Die Pioniere hinter RubikONE. Seit 2007 bringen wir Menschen in Bewegung. Über 20 Jahre Erfahrung, 1'500+ Schüler, die TRuST-Methode.",
};

export default function UeberUnsPage() {
  return (
    <>
      <EditableSection contentKey="UEBER_UNS_PAGE" label="Ueber uns">
      <PageHero
        title={UEBER_UNS_PAGE.hero.title}
        description={UEBER_UNS_PAGE.hero.description}
        breadcrumb={UEBER_UNS_PAGE.hero.breadcrumb}
        image={UEBER_UNS_PAGE.hero.image}
        imageAlt={UEBER_UNS_PAGE.hero.imageAlt}
      />

      <ParkourONEStoryFull />

      {/* SRF Einstein Section */}
      <section id="srf-einstein" className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeUp>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-apple-lg">
                <Image
                  src={UEBER_UNS_PAGE.srfEinstein.image}
                  alt="SRF Einstein Reportage über ParkourONE"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <a
                    href={UEBER_UNS_PAGE.srfEinstein.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <Play className="h-8 w-8 text-[var(--color-apple-blue)] ml-1" fill="currentColor" />
                  </a>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
                  {UEBER_UNS_PAGE.srfEinstein.tagline}
                </p>
                <h2 className="text-title-2 text-[var(--color-apple-dark)]">
                  {UEBER_UNS_PAGE.srfEinstein.headline}
                </h2>
                <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]">
                  {UEBER_UNS_PAGE.srfEinstein.description1}
                </p>
                <p className="mt-4 text-body text-[var(--color-apple-gray-600)]">
                  {UEBER_UNS_PAGE.srfEinstein.description2}
                </p>
                <a
                  href={UEBER_UNS_PAGE.srfEinstein.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary mt-8 inline-flex"
                >
                  {UEBER_UNS_PAGE.srfEinstein.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-[var(--color-apple-blue)]">
        <div className="container-content text-center">
          <FadeUp>
            <h2 className="text-title-1 text-white">
              {UEBER_UNS_PAGE.cta.headline}
            </h2>
            <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto">
              {UEBER_UNS_PAGE.cta.description}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={UEBER_UNS_PAGE.cta.ctaPrimary.href} className="btn-primary bg-white text-[var(--color-apple-blue)] hover:bg-white/90">
                {UEBER_UNS_PAGE.cta.ctaPrimary.label}
              </Link>
              <Link href={UEBER_UNS_PAGE.cta.ctaSecondary.href} className="btn-secondary text-white hover:text-white/80">
                {UEBER_UNS_PAGE.cta.ctaSecondary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
      </EditableSection>
    </>
  );
}
