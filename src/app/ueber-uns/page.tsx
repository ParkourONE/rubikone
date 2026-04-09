"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { ParkourONEStoryFull } from "@/components/sections/parkourone-story";
import { FadeUp } from "@/components/shared/fade-up";
import { EditableSection } from "@/components/admin/editable-section";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";
import {
  UEBER_UNS_HERO,
  UEBER_UNS_SRF,
  UEBER_UNS_CTA,
} from "@/lib/constants";

export default function UeberUnsPage() {
  const hero = useContent("UEBER_UNS_HERO", UEBER_UNS_HERO) as any;
  const srf = useContent("UEBER_UNS_SRF", UEBER_UNS_SRF) as any;
  const cta = useContent("UEBER_UNS_CTA", UEBER_UNS_CTA) as any;

  const srfTaglineEdit = useEditPath("UEBER_UNS_SRF.tagline");
  const srfHeadlineEdit = useEditPath("UEBER_UNS_SRF.headline");
  const srfDesc1Edit = useEditPath("UEBER_UNS_SRF.description1");
  const srfDesc2Edit = useEditPath("UEBER_UNS_SRF.description2");
  const srfCtaEdit = useEditPath("UEBER_UNS_SRF.ctaText");
  const srfImageEdit = useEditPath("UEBER_UNS_SRF.image");
  const ctaHeadlineEdit = useEditPath("UEBER_UNS_CTA.headline");
  const ctaDescEdit = useEditPath("UEBER_UNS_CTA.description");
  const ctaPrimaryEdit = useEditPath("UEBER_UNS_CTA.ctaPrimary");
  const ctaSecondaryEdit = useEditPath("UEBER_UNS_CTA.ctaSecondary");

  return (
    <>
      <EditableSection contentKey="UEBER_UNS_HERO" label="Hero">
      <PageHero
        title={hero.title}
        description={hero.description}
        breadcrumb={hero.breadcrumb}
        image={hero.image}
        imageAlt={hero.imageAlt}
      />
      </EditableSection>

      <ParkourONEStoryFull />

      {/* SRF Einstein Section */}
      <EditableSection contentKey="UEBER_UNS_SRF" label="SRF Einstein">
      <section id="srf-einstein" className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeUp>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-apple-lg" {...srfImageEdit}>
                <Image
                  src={srf.image}
                  alt="SRF Einstein Reportage über ParkourONE"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <a
                    href={srf.videoUrl}
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
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2" {...srfTaglineEdit}>
                  {srf.tagline}
                </p>
                <h2 className="text-title-2 text-[var(--color-apple-dark)]" {...srfHeadlineEdit}>
                  {srf.headline}
                </h2>
                <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]" {...srfDesc1Edit}>
                  {srf.description1}
                </p>
                <p className="mt-4 text-body text-[var(--color-apple-gray-600)]" {...srfDesc2Edit}>
                  {srf.description2}
                </p>
                <a
                  href={srf.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary mt-8 inline-flex"
                  {...srfCtaEdit}
                >
                  {srf.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
      </EditableSection>

      {/* CTA */}
      <EditableSection contentKey="UEBER_UNS_CTA" label="Call-to-Action">
      <section className="section-spacing bg-[var(--color-apple-blue)]">
        <div className="container-content text-center">
          <FadeUp>
            <h2 className="text-title-1 text-white" {...ctaHeadlineEdit}>
              {cta.headline}
            </h2>
            <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto" {...ctaDescEdit}>
              {cta.description}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={cta.ctaPrimary.href} className="btn-primary bg-white text-[var(--color-apple-blue)] hover:bg-white/90" {...ctaPrimaryEdit}>
                {cta.ctaPrimary.label}
              </Link>
              <Link href={cta.ctaSecondary.href} className="btn-secondary text-white hover:text-white/80" {...ctaSecondaryEdit}>
                {cta.ctaSecondary.label}
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
