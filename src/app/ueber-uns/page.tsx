import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { ParkourONEStoryFull } from "@/components/sections/parkourone-story";
import { FadeUp } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Über uns | RubikONE",
  description: "ParkourONE: Die Pioniere hinter RubikONE. Seit 2007 bringen wir Menschen in Bewegung. Über 20 Jahre Erfahrung, 1'500+ Schüler, die TRuST-Methode.",
};

export default function UeberUnsPage() {
  return (
    <>
      <PageHero
        title="Die Pioniere hinter RubikONE."
        description="ParkourONE. Seit 2007 bringen wir Menschen in Bewegung. Jetzt bringen wir Bewegung zu den Menschen."
        breadcrumb="Über uns"
        image="/images/parkour/mann-parkour.jpg"
        imageAlt="Parkour Athlet in Aktion"
      />

      <ParkourONEStoryFull />

      {/* SRF Einstein Section */}
      <section id="srf-einstein" className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeUp>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-apple-lg">
                <Image
                  src="/images/about/srf-einstein.jpg"
                  alt="SRF Einstein Reportage über ParkourONE"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <a
                    href="https://www.srf.ch/play/tv/einstein/video/parkour---die-hohe-kunst-des-springens?urn=urn:srf:video:12345"
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
                  Bekannt aus SRF Einstein
                </p>
                <h2 className="text-title-2 text-[var(--color-apple-dark)]">
                  Ein Traum wird Realität.
                </h2>
                <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]">
                  Mit RubikONE geht ein Traum in Erfüllung: Parkour wird sichtbar und frei zugänglich – unabhängig von Alter und Fitnesslevel.
                </p>
                <p className="mt-4 text-body text-[var(--color-apple-gray-600)]">
                  Das Schweizer Fernsehen besuchte uns in einem Training und zeigt, was damit gemeint ist.
                </p>
                <a
                  href="https://www.srf.ch/play/tv/einstein/video/parkour---die-hohe-kunst-des-springens?urn=urn:srf:video:12345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary mt-8 inline-flex"
                >
                  SRF Einstein Beitrag ansehen
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
              Lernen Sie uns kennen.
            </h2>
            <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto">
              Buchen Sie einen Impulsworkshop und erleben Sie, was 20 Jahre Parkour-Expertise für Ihre Gemeinde bedeuten können.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/impulsworkshop" className="btn-primary bg-white text-[var(--color-apple-blue)] hover:bg-white/90">
                Impulsworkshop anfragen
              </Link>
              <Link href="/kontakt" className="btn-secondary text-white hover:text-white/80">
                Kontakt aufnehmen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
