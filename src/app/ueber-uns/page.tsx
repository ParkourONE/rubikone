import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { ParkourONEStoryFull } from "@/components/sections/parkourone-story";
import { FadeUp } from "@/components/shared/fade-up";

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
