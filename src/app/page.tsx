import { HeroSection } from "@/components/sections/hero-section";
import { WasWaereWennHook } from "@/components/sections/was-waere-wenn-hook";
import { VideoSection } from "@/components/sections/video-section";
import { VorherNachherTeaser } from "@/components/sections/vorher-nachher-teaser";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ImageGallery } from "@/components/sections/image-gallery";
import { ProzessTeaser } from "@/components/sections/prozess-teaser";
import { ConfiguratorCTASection } from "@/components/sections/configurator-cta-section";
import { CTASection } from "@/components/sections/cta-section";

export default function HomePage() {
  return (
    <>
      {/* Hero: Split-Layout mit Video */}
      <HeroSection />

      {/* Emotionaler Hook */}
      <WasWaereWennHook />

      {/* Video: RubikONE in Aktion */}
      <VideoSection />

      {/* Vorher/Nachher: Das Prinzip visualisiert */}
      <VorherNachherTeaser />

      {/* Social Proof: Testimonials */}
      <TestimonialsSection />

      {/* Image Gallery: Emotionale Bilder */}
      <ImageGallery />

      {/* Prozess-Teaser: Link zu Raumgestaltung */}
      <ProzessTeaser />

      {/* Konfigurator CTA */}
      <ConfiguratorCTASection />

      {/* CTA: Nächster Schritt */}
      <CTASection variant="dark" />
    </>
  );
}
