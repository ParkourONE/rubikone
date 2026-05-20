"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, Route, Calendar, Quote, ArrowRight, ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { VideoSection } from "@/components/sections/video-section";
import { EditableSection } from "@/components/admin/editable-section";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { appleTransition } from "@/lib/animations";
import {
  KOENIZ_CASE_STUDY,
  KOENIZ_DETAILS,
  KOENIZ_HERO,
  KOENIZ_DENKMALSCHUTZ,
  KOENIZ_FEEDBACK,
  KOENIZ_ANNINA,
  KOENIZ_GALLERY,
  KOENIZ_CTA,
} from "@/lib/constants";

export default function KoenizPage() {
  const feedbackScrollRef = useRef<HTMLDivElement>(null);

  const hero = useContent("KOENIZ_HERO", KOENIZ_HERO) as any;
  const denkmalschutz = useContent("KOENIZ_DENKMALSCHUTZ", KOENIZ_DENKMALSCHUTZ) as any;
  const feedback = useContent("KOENIZ_FEEDBACK", KOENIZ_FEEDBACK) as any;
  const annina = useContent("KOENIZ_ANNINA", KOENIZ_ANNINA) as any;
  const gallery = useContent("KOENIZ_GALLERY", KOENIZ_GALLERY) as any;
  const cta = useContent("KOENIZ_CTA", KOENIZ_CTA) as any;

  const denkmalLabelEdit = useEditPath("KOENIZ_DENKMALSCHUTZ.label");
  const fbTaglineEdit = useEditPath("KOENIZ_FEEDBACK.tagline");
  const fbHeadlineEdit = useEditPath("KOENIZ_FEEDBACK.headline");
  const anninaQuoteEdit = useEditPath("KOENIZ_ANNINA.quote");
  const anninaNameEdit = useEditPath("KOENIZ_ANNINA.name");
  const anninaRoleEdit = useEditPath("KOENIZ_ANNINA.role");
  const ctaHeadlineEdit = useEditPath("KOENIZ_CTA.headline");
  const ctaDescEdit = useEditPath("KOENIZ_CTA.description");
  const ctaPrimaryEdit = useEditPath("KOENIZ_CTA.ctaPrimary");
  const ctaSecondaryEdit = useEditPath("KOENIZ_CTA.ctaSecondary");

  const scrollFeedback = (direction: "left" | "right") => {
    if (feedbackScrollRef.current) {
      const scrollAmount = 340;
      feedbackScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <EditableSection contentKey="KOENIZ_HERO" label="Hero">
      <PageHero
        title={hero.title}
        description={hero.description}
        breadcrumb={hero.breadcrumb}
        image={hero.image}
        imageAlt={hero.imageAlt}
        titleEditPath="KOENIZ_HERO.title"
        descriptionEditPath="KOENIZ_HERO.description"
        breadcrumbEditPath="KOENIZ_HERO.breadcrumb"
        imageEditPath="KOENIZ_HERO.image"
      />
      </EditableSection>

      {/* 2. Selbst erleben - Praktische Infos */}
      <EditableSection contentKey="KOENIZ_DETAILS" label="Selbst erleben">
      <section id="selbst-erleben" className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <SectionHeader
            title="Selbst erleben"
            subtitle="RubikONE Köniz besuchen"
          />

          <div className="mt-12 grid lg:grid-cols-2 gap-12">
            {/* Map/Image */}
            <FadeUp>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/koeniz/schloss.jpg"
                  alt="Schlossareal Köniz"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-headline font-semibold">Start & Ziel</p>
                </div>
              </div>
            </FadeUp>

            {/* Info Cards */}
            <FadeUp delay={0.1}>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-apple">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <MapPin className="h-6 w-6 text-[var(--color-apple-blue)]" />
                      <div>
                        <p className="text-body font-semibold text-[var(--color-apple-dark)]">Standort</p>
                        <p className="text-body-sm text-[var(--color-apple-gray-600)]">{KOENIZ_DETAILS.location.address}</p>
                      </div>
                    </div>
                    <a
                      href={KOENIZ_DETAILS.location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-sm font-medium text-[var(--color-apple-blue)] hover:underline whitespace-nowrap"
                    >
                      In Google Maps öffnen
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-apple">
                  <div className="flex items-center gap-4">
                    <Route className="h-6 w-6 text-[var(--color-apple-blue)]" />
                    <div>
                      <p className="text-body font-semibold text-[var(--color-apple-dark)]">Route</p>
                      <p className="text-body-sm text-[var(--color-apple-gray-600)]">{KOENIZ_DETAILS.route.length} | {KOENIZ_DETAILS.route.posts} Posten | {KOENIZ_DETAILS.route.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-apple">
                  <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-[var(--color-apple-blue)]" />
                    <div>
                      <p className="text-body font-semibold text-[var(--color-apple-dark)]">Öffnungszeiten</p>
                      <p className="text-body-sm text-[var(--color-apple-gray-600)]">{KOENIZ_DETAILS.accessibility.hours}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-apple">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-6 w-6 text-[var(--color-apple-blue)] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-body font-semibold text-[var(--color-apple-dark)]">Anreise</p>
                      <p className="text-body-sm text-[var(--color-apple-gray-600)]">{KOENIZ_DETAILS.accessibility.publicTransport}</p>
                      <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{KOENIZ_DETAILS.accessibility.parking}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
      </EditableSection>

      {/* 3. Video: RubikONE in Aktion */}
      <EditableSection contentKey="VIDEO_CONTENT" label="Video">
        <VideoSection />
      </EditableSection>

      {/* 4. Denkmalschutz Highlight */}
      <EditableSection contentKey="KOENIZ_DENKMALSCHUTZ" label="Denkmalschutz">
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-content">
          <FadeUp>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-apple-gray-100)] rounded-full mb-6">
                <span className="text-body-sm font-medium text-[var(--color-apple-gray-600)]" {...denkmalLabelEdit}>{denkmalschutz.label}</span>
              </div>
              <p className="text-title-2 text-[var(--color-apple-dark)]">
                {KOENIZ_CASE_STUDY.denkmalpflege}
              </p>
            </div>
          </FadeUp>
        </div>
      </section>
      </EditableSection>

      {/* 5. Stimmen der Teilnehmenden - Slider wie Homepage */}
      <EditableSection contentKey="KOENIZ_FEEDBACK" label="Workshop-Feedback">
      <section className="py-16 lg:py-24 bg-white overflow-hidden">
        <div className="container-content mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2" {...fbTaglineEdit}>
              {feedback.tagline}
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]" {...fbHeadlineEdit}>
              {feedback.headline}
            </h2>
          </motion.div>
        </div>

        {/* Feedback Slider */}
        <div
          ref={feedbackScrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="slider-spacer" />

          {KOENIZ_CASE_STUDY.workshopFeedback.map((feedbackItem: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: index * 0.05 }}
              className="flex-shrink-0 w-[320px]"
              data-edit-path={`KOENIZ_CASE_STUDY.workshopFeedback.${index}`}
            >
              <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6 h-full">
                <Quote className="h-8 w-8 text-[var(--color-apple-gray-300)] mb-4" strokeWidth={1} />
                <p className="text-body text-[var(--color-apple-dark)] leading-relaxed">
                  &ldquo;{feedbackItem}&rdquo;
                </p>
                <p className="mt-4 text-body-sm text-[var(--color-apple-gray-500)]">
                  Workshop-Teilnehmer:in
                </p>
              </div>
            </motion.div>
          ))}

          <div className="slider-spacer" />
        </div>

        {/* Navigation */}
        <div className="container-content mt-6">
          <div className="flex justify-end gap-4">
            <button
              onClick={() => scrollFeedback("left")}
              className="p-2 rounded-full hover:bg-[var(--color-apple-gray-100)] transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
            </button>
            <button
              onClick={() => scrollFeedback("right")}
              className="p-2 rounded-full hover:bg-[var(--color-apple-gray-100)] transition-colors"
            >
              <ArrowRight className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
            </button>
          </div>
        </div>
      </section>
      </EditableSection>

      {/* 6. Statement Annina */}
      <EditableSection contentKey="KOENIZ_ANNINA" label="Statement Annina">
      <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <FadeUp>
            <div className="max-w-3xl mx-auto">
              <Quote className="h-10 w-10 text-[var(--color-apple-gray-300)] mb-6" strokeWidth={1} />
              <blockquote>
                <p className="text-title-3 text-[var(--color-apple-dark)] leading-relaxed" {...anninaQuoteEdit}>
                  &laquo;{annina.quote}&raquo;
                </p>
              </blockquote>
              <div className="mt-6">
                <p className="text-body font-semibold text-[var(--color-apple-dark)]" {...anninaNameEdit}>{annina.name}</p>
                <p className="text-body-sm text-[var(--color-apple-gray-600)]" {...anninaRoleEdit}>{annina.role}</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
      </EditableSection>

      {/* Gallery */}
      <EditableSection contentKey="KOENIZ_GALLERY" label="Galerie">
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-content">
          <SectionHeader
            title="Impressionen"
            subtitle="RubikONE in Aktion"
          />

          <StaggerContainer className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {(gallery.images as any[]).map((image: any, index: number) => (
              <StaggerItem key={index}>
                <div className="aspect-square rounded-xl overflow-hidden relative group">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
      </EditableSection>

      {/* 8. CTA */}
      <EditableSection contentKey="KOENIZ_CTA" label="Call-to-Action">
      <section className="py-16 lg:py-24 bg-[var(--color-apple-blue)]">
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
