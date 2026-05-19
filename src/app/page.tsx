import { HeroSection } from "@/components/sections/hero-section";
import { WasWaereWennHook } from "@/components/sections/was-waere-wenn-hook";
import { VorherNachherTeaser } from "@/components/sections/vorher-nachher-teaser";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ImageGallery } from "@/components/sections/image-gallery";
import { ProzessTeaser } from "@/components/sections/prozess-teaser";
import { ConfiguratorCTASection } from "@/components/sections/configurator-cta-section";
import { CTASection } from "@/components/sections/cta-section";
import { EditableSection } from "@/components/admin/editable-section";

export default function HomePage() {
  return (
    <>
      {/* Hero: Split-Layout mit Video */}
      <EditableSection contentKey="HERO_CONTENT" label="Hero">
        <HeroSection />
      </EditableSection>

      {/* Emotionaler Hook */}
      <EditableSection contentKey="TEXTHOOK_CONTENT" label="Text-Hook">
        <WasWaereWennHook />
      </EditableSection>

      {/* Vorher/Nachher: Das Prinzip visualisiert */}
      <EditableSection contentKey="VORHER_NACHHER_CONTENT" label="Vorher/Nachher">
        <VorherNachherTeaser />
      </EditableSection>

      {/* Social Proof: Testimonials */}
      <EditableSection contentKey="TESTIMONIALS" label="Kundenstimmen">
        <TestimonialsSection />
      </EditableSection>

      {/* Image Gallery: Emotionale Bilder */}
      <EditableSection contentKey="GALLERY_CONTENT" label="Bildergalerie">
        <ImageGallery />
      </EditableSection>

      {/* Prozess-Teaser: Link zu Raumgestaltung */}
      <EditableSection contentKey="PROZESS_TEASER_CONTENT" label="Prozess-Teaser">
        <ProzessTeaser />
      </EditableSection>

      {/* Konfigurator CTA */}
      <EditableSection contentKey="CONFIGURATOR_CTA_CONTENT" label="Konfigurator CTA">
        <ConfiguratorCTASection />
      </EditableSection>

      {/* CTA: Naechster Schritt */}
      <EditableSection contentKey="CTA_CONTENT" label="Call-to-Action">
        <CTASection variant="dark" />
      </EditableSection>
    </>
  );
}
