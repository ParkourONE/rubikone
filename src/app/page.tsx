import { HeroSection } from "@/components/sections/hero-section";
import { WasWaereWennHook } from "@/components/sections/was-waere-wenn-hook";
import { PrinzipSection } from "@/components/sections/prinzip-section";
import { VorherNachherTeaser } from "@/components/sections/vorher-nachher-teaser";
import { PostenTeaserSection } from "@/components/sections/posten-teaser-section";
import { ImageGallery } from "@/components/sections/image-gallery";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ProzessTeaser } from "@/components/sections/prozess-teaser";
import { ConfiguratorCTASection } from "@/components/sections/configurator-cta-section";
import { EditableSection } from "@/components/admin/editable-section";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero: Split-Layout mit Video */}
      <EditableSection contentKey="HERO_CONTENT" label="Hero">
        <HeroSection />
      </EditableSection>

      {/* 2. Emotionaler Hook */}
      <EditableSection contentKey="TEXTHOOK_CONTENT" label="Text-Hook">
        <WasWaereWennHook />
      </EditableSection>

      {/* 3. Das Prinzip: 2-Spalten Text + Bild */}
      <EditableSection contentKey="PRINZIP_CONTENT" label="Das Prinzip">
        <PrinzipSection />
      </EditableSection>

      {/* 4. Vorher/Nachher: Das Prinzip visualisiert */}
      <EditableSection contentKey="VORHER_NACHHER_CONTENT" label="Vorher/Nachher">
        <VorherNachherTeaser />
      </EditableSection>

      {/* 5. Ein RubikONE Posten: Beschreibung + 3-Bilder-Grid */}
      <EditableSection contentKey="POSTEN_TEASER_CONTENT" label="Ein RubikONE Posten">
        <PostenTeaserSection />
      </EditableSection>

      {/* 6. Bildergalerie */}
      <EditableSection contentKey="GALLERY_CONTENT" label="Bildergalerie">
        <ImageGallery />
      </EditableSection>

      {/* 7. Social Proof: Testimonials */}
      <EditableSection contentKey="TESTIMONIALS" label="Kundenstimmen">
        <TestimonialsSection />
      </EditableSection>

      {/* 8. Prozess-Teaser + Schluss-CTA (kombiniert) */}
      <EditableSection contentKey="PROZESS_TEASER_CONTENT" label="Bereit für den nächsten Schritt">
        <ProzessTeaser />
      </EditableSection>

      {/* 9. Konfigurator CTA */}
      <EditableSection contentKey="CONFIGURATOR_CTA_CONTENT" label="Konfigurator CTA">
        <ConfiguratorCTASection />
      </EditableSection>
    </>
  );
}
