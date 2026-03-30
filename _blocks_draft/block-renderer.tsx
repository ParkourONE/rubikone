"use client";

import { HeroSection } from "@/components/sections/hero-section";
import { PageHero } from "@/components/sections/hero-section";
import { WasWaereWennHook } from "@/components/sections/was-waere-wenn-hook";
import { VideoSection } from "@/components/sections/video-section";
import { VorherNachherTeaser } from "@/components/sections/vorher-nachher-teaser";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { ImageGallery } from "@/components/sections/image-gallery";
import { ProzessTeaser } from "@/components/sections/prozess-teaser";
import { ConfiguratorCTASection } from "@/components/sections/configurator-cta-section";
import { CTASection } from "@/components/sections/cta-section";
import { ComparisonSection } from "@/components/sections/comparison-table";
import { StatsSection } from "@/components/sections/stats-section";
import { ContactForm } from "@/components/sections/contact-form";
import { FaqSection } from "@/components/blocks/faq-block";
import { StakeholderGridBlock } from "@/components/blocks/stakeholder-grid-block";
import { QuoteHighlightBlock } from "@/components/blocks/quote-highlight-block";
import { KeyFactsBlock } from "@/components/blocks/key-facts-block";
import { TimelineBlock } from "@/components/blocks/timeline-block";
import { SafetyInfoBlock } from "@/components/blocks/safety-info-block";
import { LerndimensionenBlock } from "@/components/blocks/lerndimensionen-block";
import { RichTextBlock } from "@/components/blocks/rich-text-block";
import { ConfiguratorBlock } from "@/components/blocks/configurator-block";
import { tinaField } from "tinacms/dist/react";

// Map of block template names to React components
const blockComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroBlockWrapper,
  pageHero: PageHeroBlockWrapper,
  textHook: TextHookBlockWrapper,
  videoSection: VideoSectionBlockWrapper,
  vorherNachher: VorherNachherBlockWrapper,
  testimonials: TestimonialsBlockWrapper,
  imageGallery: ImageGalleryBlockWrapper,
  processSteps: ProcessStepsBlockWrapper,
  ctaSection: CTASectionBlockWrapper,
  comparisonTable: ComparisonTableBlockWrapper,
  lerndimensionen: LerndimensionenBlockWrapper,
  statsCounter: StatsCounterBlockWrapper,
  safetyInfo: SafetyInfoBlockWrapper,
  stakeholderGrid: StakeholderGridBlockWrapper,
  quoteHighlight: QuoteHighlightBlockWrapper,
  keyFacts: KeyFactsBlockWrapper,
  faq: FaqBlockWrapper,
  contactForm: ContactFormBlockWrapper,
  configurator: ConfiguratorBlockWrapper,
  configuratorCta: ConfiguratorCtaBlockWrapper,
  timeline: TimelineBlockWrapper,
  richText: RichTextBlockWrapper,
  spacer: SpacerBlockWrapper,
};

// Main block renderer – renders a list of blocks
export function BlockRenderer({ blocks }: { blocks: any[] }) {
  if (!blocks) return null;

  return (
    <>
      {blocks.map((block, i) => {
        const template = block.__typename?.split("PageBlocks").pop() || block._template;
        const Component = blockComponents[template];

        if (!Component) {
          if (process.env.NODE_ENV === "development") {
            return (
              <div key={i} className="py-8 text-center text-red-500 bg-red-50">
                Block &quot;{template}&quot; nicht gefunden
              </div>
            );
          }
          return null;
        }

        return <Component key={i} data={block} />;
      })}
    </>
  );
}

// ============================================================
// Block Wrappers – adapt Tina data to existing component props
// ============================================================

function HeroBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <HeroSection
        overrides={{
          headline: data.headline,
          subheadline: data.subheadline,
          tagline: data.tagline,
          videoUrl: data.videoUrl,
          image: data.image,
          ctaPrimary: data.ctaPrimary,
          ctaSecondary: data.ctaSecondary,
        }}
      />
    </div>
  );
}

function PageHeroBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <PageHero
        title={data.title || ""}
        description={data.description || ""}
        breadcrumb={data.breadcrumb || ""}
        image={data.image || ""}
        imageAlt={data.imageAlt || ""}
      />
    </div>
  );
}

function TextHookBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <WasWaereWennHook
        overrides={{
          headline: data.headline,
          lines: data.lines,
          description: data.description,
          variant: data.variant,
        }}
      />
    </div>
  );
}

function VideoSectionBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <VideoSection
        overrides={{
          headline: data.headline,
          description: data.description,
          videoUrl: data.videoUrl,
          poster: data.poster,
        }}
      />
    </div>
  );
}

function VorherNachherBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <VorherNachherTeaser
        overrides={{
          headline: data.headline,
          description: data.description,
        }}
      />
    </div>
  );
}

function TestimonialsBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <TestimonialsSection
        overrides={{
          headline: data.headline,
          quotes: data.quotes,
        }}
      />
    </div>
  );
}

function ImageGalleryBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <ImageGallery
        overrides={{
          headline: data.headline,
          images: data.images,
          layout: data.layout,
        }}
      />
    </div>
  );
}

function ProcessStepsBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <ProzessTeaser
        overrides={{
          headline: data.headline,
          subtitle: data.subtitle,
          description: data.description,
          steps: data.steps,
          variant: data.variant,
        }}
      />
    </div>
  );
}

function CTASectionBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <CTASection
        variant={data.variant || "primary"}
        overrides={{
          headline: data.headline,
          description: data.description,
          ctaText: data.ctaText,
          ctaUrl: data.ctaUrl,
          secondaryCtaText: data.secondaryCtaText,
          secondaryCtaUrl: data.secondaryCtaUrl,
        }}
      />
    </div>
  );
}

function ComparisonTableBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <ComparisonSection
        overrides={{
          headline: data.headline,
          subheadline: data.subheadline,
          features: data.features,
        }}
      />
    </div>
  );
}

function LerndimensionenBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <LerndimensionenBlock data={data} />
    </div>
  );
}

function StatsCounterBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <StatsSection
        overrides={{
          stats: data.stats,
          variant: data.variant,
        }}
      />
    </div>
  );
}

function SafetyInfoBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <SafetyInfoBlock data={data} />
    </div>
  );
}

function StakeholderGridBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <StakeholderGridBlock data={data} />
    </div>
  );
}

function QuoteHighlightBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <QuoteHighlightBlock data={data} />
    </div>
  );
}

function KeyFactsBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <KeyFactsBlock data={data} />
    </div>
  );
}

function FaqBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <FaqSection data={data} />
    </div>
  );
}

function ContactFormBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <ContactForm />
    </div>
  );
}

function ConfiguratorBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <ConfiguratorBlock data={data} />
    </div>
  );
}

function ConfiguratorCtaBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <ConfiguratorCTASection
        overrides={{
          headline: data.headline,
          description: data.description,
        }}
      />
    </div>
  );
}

function TimelineBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <TimelineBlock data={data} />
    </div>
  );
}

function RichTextBlockWrapper({ data }: { data: any }) {
  return (
    <div data-tina-field={tinaField(data)}>
      <RichTextBlock data={data} />
    </div>
  );
}

function SpacerBlockWrapper({ data }: { data: any }) {
  const sizes: Record<string, string> = {
    small: "py-4 lg:py-6",
    medium: "py-8 lg:py-12",
    large: "py-12 lg:py-20",
  };
  return <div className={sizes[data.size] || sizes.medium} />;
}
