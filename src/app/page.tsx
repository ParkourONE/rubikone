import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { WasWaereWennHook } from "@/components/sections/was-waere-wenn-hook";
import { VorherNachherTeaser } from "@/components/sections/vorher-nachher-teaser";
import { ComparisonSection } from "@/components/sections/comparison-table";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { StatsSection } from "@/components/sections/stats-section";
import { MovementsGrid } from "@/components/sections/movements-grid";
import { SolutionSection } from "@/components/sections/solution-section";
import { ImageGallery } from "@/components/sections/image-gallery";
import { ProzessTeaser } from "@/components/sections/prozess-teaser";
import { PricingSection } from "@/components/sections/pricing-section";
import { ConfiguratorCTASection } from "@/components/sections/configurator-cta-section";
import { CTASection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      {/* Hero: Split-Layout mit Video */}
      <HeroSection />

      {/* Problem: 40% bewegen sich zu wenig */}
      <ProblemSection />

      {/* Emotionaler Hook: Was wäre wenn... */}
      <WasWaereWennHook />

      {/* Vorher/Nachher: Das Prinzip visualisiert */}
      <VorherNachherTeaser />

      {/* USP: Was RubikONE auszeichnet */}
      <ComparisonSection />

      {/* Social Proof: Testimonials */}
      <TestimonialsSection />

      {/* Zahlen aus Köniz */}
      <StatsSection />

      {/* Produkt: Die 9 Bewegungen */}
      <MovementsGrid />

      {/* Lösung: Die Erlaubnis - RubikONE erklärt */}
      <SolutionSection />

      {/* Image Gallery: Emotionale Bilder */}
      <ImageGallery />

      {/* Prozess-Teaser: Link zu Für Gemeinden */}
      <ProzessTeaser />

      {/* Pricing: Transparente Preise */}
      <PricingSection />

      {/* Konfigurator CTA */}
      <ConfiguratorCTASection />

      {/* CTA: Nächster Schritt */}
      <CTASection variant="dark" />
    </>
  );
}
