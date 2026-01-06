import { HeroSection } from "@/components/sections/hero-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { StatsSection } from "@/components/sections/stats-section";
import { MovementsGrid } from "@/components/sections/movements-grid";
import { ComparisonSection } from "@/components/sections/comparison-table";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ImageGallery } from "@/components/sections/image-gallery";
import { ProcessSection } from "@/components/sections/process-section";
import { PricingSection } from "@/components/sections/pricing-section";
import { ConfiguratorCTASection } from "@/components/sections/configurator-cta-section";
import { CTASection } from "@/components/sections/cta-section";
import { ParkourONEStoryCompact } from "@/components/sections/parkourone-story";

export default function HomePage() {
  return (
    <>
      {/* Hero: Split-Layout mit Video */}
      <HeroSection />

      {/* Problem: 40% bewegen sich zu wenig */}
      <ProblemSection />

      {/* Lösung: Die Erlaubnis - RubikONE erklärt */}
      <SolutionSection />

      {/* Produkt: Die 9 Bewegungen */}
      <MovementsGrid />

      {/* Zahlen aus Köniz */}
      <StatsSection />

      {/* Vergleich: Warum RubikONE? */}
      <ComparisonSection />

      {/* Social Proof: Testimonials */}
      <TestimonialsSection />

      {/* Image Gallery: Emotionale Bilder */}
      <ImageGallery />

      {/* ParkourONE: Die Pioniere */}
      <ParkourONEStoryCompact />

      {/* Prozess: Von der Idee zur Eröffnung */}
      <ProcessSection />

      {/* Pricing: Transparente Preise */}
      <PricingSection />

      {/* Konfigurator CTA */}
      <ConfiguratorCTASection />

      {/* CTA: Nächster Schritt */}
      <CTASection variant="dark" />
    </>
  );
}
