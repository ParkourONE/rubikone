"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, GraduationCap, Users, CheckCircle, ArrowRight, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/sections/hero-section";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { ConfiguratorTrigger } from "@/components/sections/configurator-overlay";
import { EditableSection } from "@/components/admin/editable-section";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";
import {
  RAUMGESTALTUNG_HERO,
  RAUMGESTALTUNG_MEHRWERT,
  RAUMGESTALTUNG_USP,
  RAUMGESTALTUNG_TESTIMONIAL,
  RAUMGESTALTUNG_PROZESS,
  RAUMGESTALTUNG_REFERENZ,
  RAUMGESTALTUNG_FAQ,
  RAUMGESTALTUNG_CTA,
  PROCESS_PHASES,
} from "@/lib/constants";

const iconMap: Record<number, any> = {
  0: Building2,
  1: GraduationCap,
  2: Users,
};

function StakeholderCard({ stakeholder, index }: { stakeholder: any; index: number }) {
  const path = `RAUMGESTALTUNG_MEHRWERT.stakeholders[${index}]`;
  const itemEdit = useEditPath(path);
  const titleEdit = useEditPath(`${path}.title`);
  const Icon = iconMap[index] || Users;
  return (
    <StaggerItem>
      <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8 h-full" {...itemEdit}>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-apple-blue)] text-white mb-6">
          <Icon className="h-7 w-7" strokeWidth={1.5} />
        </div>
        <h3 className="text-headline text-[var(--color-apple-dark)] mb-4" {...titleEdit}>
          {stakeholder.title}
        </h3>
        <ul className="space-y-3">
          {stakeholder.benefits.map((benefit: string, benefitIndex: number) => (
            <li key={benefitIndex} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-[var(--color-apple-blue)] flex-shrink-0 mt-0.5" />
              <span className="text-body-sm text-[var(--color-apple-gray-700)]">
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </StaggerItem>
  );
}

function UspItem({ item, index }: { item: any; index: number }) {
  const path = `RAUMGESTALTUNG_USP[${index}]`;
  const itemEdit = useEditPath(path);
  const titleEdit = useEditPath(`${path}.title`);
  const descEdit = useEditPath(`${path}.description`);
  return (
    <div className="flex items-center gap-3" {...itemEdit}>
      <CheckCircle className="h-6 w-6 text-[var(--color-apple-blue)] flex-shrink-0" />
      <div>
        <p className="text-body font-semibold text-[var(--color-apple-dark)]" {...titleEdit}>
          {item.title}
        </p>
        <p className="text-body-sm text-[var(--color-apple-gray-600)]" {...descEdit}>
          {item.description}
        </p>
      </div>
    </div>
  );
}

function ProzessSchrittCard({ schritt, index }: { schritt: any; index: number }) {
  const path = `RAUMGESTALTUNG_PROZESS.schritte[${index}]`;
  const itemEdit = useEditPath(path);
  const nummerEdit = useEditPath(`${path}.nummer`);
  const titelEdit = useEditPath(`${path}.titel`);
  const beschrEdit = useEditPath(`${path}.beschreibung`);
  const imageEdit = useEditPath(`${path}.image`);
  return (
    <StaggerItem>
      <div className="bg-white/5 rounded-[var(--radius-apple-lg)] overflow-hidden" {...itemEdit}>
        <div className="relative aspect-[4/3]" {...imageEdit}>
          <Image
            src={schritt.image}
            alt={schritt.titel}
            fill
            className="object-cover"
          />
          <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-[var(--color-apple-blue)] flex items-center justify-center text-white font-bold" {...nummerEdit}>
            {schritt.nummer}
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-headline" {...titelEdit}>{schritt.titel}</h3>
          <p className="mt-2 text-body-sm text-white/70" {...beschrEdit}>
            {schritt.beschreibung}
          </p>
        </div>
      </div>
    </StaggerItem>
  );
}

function FAQItemCard({ item, index, isOpen, onToggle }: { item: any; index: number; isOpen: boolean; onToggle: () => void }) {
  const path = `RAUMGESTALTUNG_FAQ[${index}]`;
  const itemEdit = useEditPath(path);
  const qEdit = useEditPath(`${path}.question`);
  const aEdit = useEditPath(`${path}.answer`);
  return (
    <div className="border-b border-[var(--color-apple-gray-200)]" {...itemEdit}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-body font-semibold text-[var(--color-apple-dark)] pr-4" {...qEdit}>
          {item.question}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-[var(--color-apple-gray-500)] flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[var(--color-apple-gray-500)] flex-shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-body text-[var(--color-apple-gray-600)] pb-5" {...aEdit}>
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RaumgestaltungPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const hero = useContent("RAUMGESTALTUNG_HERO", RAUMGESTALTUNG_HERO) as any;
  const mehrwert = useContent("RAUMGESTALTUNG_MEHRWERT", RAUMGESTALTUNG_MEHRWERT) as any;
  const uspKompakt = useContent("RAUMGESTALTUNG_USP", RAUMGESTALTUNG_USP) as any;
  const testimonial = useContent("RAUMGESTALTUNG_TESTIMONIAL", RAUMGESTALTUNG_TESTIMONIAL) as any;
  const prozess = useContent("RAUMGESTALTUNG_PROZESS", RAUMGESTALTUNG_PROZESS) as any;
  const referenz = useContent("RAUMGESTALTUNG_REFERENZ", RAUMGESTALTUNG_REFERENZ) as any;
  const faq = useContent("RAUMGESTALTUNG_FAQ", RAUMGESTALTUNG_FAQ) as any;
  const cta = useContent("RAUMGESTALTUNG_CTA", RAUMGESTALTUNG_CTA) as any;

  const mehrwertTitleEdit = useEditPath("RAUMGESTALTUNG_MEHRWERT.title");
  const mehrwertSubtitleEdit = useEditPath("RAUMGESTALTUNG_MEHRWERT.subtitle");
  const mehrwertDescEdit = useEditPath("RAUMGESTALTUNG_MEHRWERT.description");
  const testimonialQuoteEdit = useEditPath("RAUMGESTALTUNG_TESTIMONIAL.quote");
  const testimonialNameEdit = useEditPath("RAUMGESTALTUNG_TESTIMONIAL.name");
  const testimonialDetailEdit = useEditPath("RAUMGESTALTUNG_TESTIMONIAL.detail");
  const testimonialImageEdit = useEditPath("RAUMGESTALTUNG_TESTIMONIAL.image");
  const prozessTitleEdit = useEditPath("RAUMGESTALTUNG_PROZESS.title");
  const prozessSubtitleEdit = useEditPath("RAUMGESTALTUNG_PROZESS.subtitle");
  const prozessDescEdit = useEditPath("RAUMGESTALTUNG_PROZESS.description");
  const referenzTaglineEdit = useEditPath("RAUMGESTALTUNG_REFERENZ.tagline");
  const referenzHeadlineEdit = useEditPath("RAUMGESTALTUNG_REFERENZ.headline");
  const referenzDescEdit = useEditPath("RAUMGESTALTUNG_REFERENZ.description");
  const referenzImageEdit = useEditPath("RAUMGESTALTUNG_REFERENZ.image");
  const referenzCtaEdit = useEditPath("RAUMGESTALTUNG_REFERENZ.ctaText");
  const ctaHeadlineEdit = useEditPath("RAUMGESTALTUNG_CTA.headline");
  const ctaDescEdit = useEditPath("RAUMGESTALTUNG_CTA.description");
  const ctaPrimaryEdit = useEditPath("RAUMGESTALTUNG_CTA.ctaPrimary");
  const ctaSecondaryEdit = useEditPath("RAUMGESTALTUNG_CTA.ctaSecondary");

  return (
    <>
      {/* Hero */}
      <EditableSection contentKey="RAUMGESTALTUNG_HERO" label="Hero">
      <PageHero
        title={hero.title}
        description={hero.description}
        breadcrumb={hero.breadcrumb}
        image={hero.image}
        imageAlt={hero.imageAlt}
        titleEditPath="RAUMGESTALTUNG_HERO.title"
        descriptionEditPath="RAUMGESTALTUNG_HERO.description"
        breadcrumbEditPath="RAUMGESTALTUNG_HERO.breadcrumb"
        imageEditPath="RAUMGESTALTUNG_HERO.image"
      />
      </EditableSection>

      {/* Mehrwert für alle - 3 Columns */}
      <EditableSection contentKey="RAUMGESTALTUNG_MEHRWERT" label="Mehrwert für alle">
      <section className="section-spacing">
        <div className="container-content">
          <SectionHeader
            title={mehrwert.title}
            subtitle={mehrwert.subtitle}
            description={mehrwert.description}
            className="mb-12"
            titleProps={mehrwertTitleEdit}
            subtitleProps={mehrwertSubtitleEdit}
            descriptionProps={mehrwertDescEdit}
          />

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {(mehrwert.stakeholders as any[]).map((stakeholder: any, index: number) => (
              <StakeholderCard key={index} stakeholder={stakeholder} index={index} />
            ))}
          </StaggerContainer>
        </div>
      </section>
      </EditableSection>

      {/* Das macht RubikONE einzigartig - Kompakt */}
      <EditableSection contentKey="RAUMGESTALTUNG_USP" label="USP kompakt">
      <section className="py-12 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {(uspKompakt as any[]).map((item: any, index: number) => (
                <UspItem key={index} item={item} index={index} />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
      </EditableSection>

      {/* Testimonial Bernadette */}
      <EditableSection contentKey="RAUMGESTALTUNG_TESTIMONIAL" label="Testimonial Bernadette">
      <section className="section-spacing">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeUp>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden" {...testimonialImageEdit}>
                <Image
                  src={testimonial.image}
                  alt="Bernadette bei RubikONE"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div>
                <Quote className="h-10 w-10 text-[var(--color-apple-gray-300)] mb-6" strokeWidth={1} />
                <blockquote>
                  <p className="text-title-3 text-[var(--color-apple-dark)] leading-relaxed" {...testimonialQuoteEdit}>
                    &laquo;{testimonial.quote}&raquo;
                  </p>
                </blockquote>
                <div className="mt-6">
                  <p className="text-body font-semibold text-[var(--color-apple-dark)]" {...testimonialNameEdit}>{testimonial.name}</p>
                  <p className="text-body-sm text-[var(--color-apple-gray-600)]" {...testimonialDetailEdit}>{testimonial.detail}</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
      </EditableSection>

      {/* Prozess */}
      <EditableSection contentKey="RAUMGESTALTUNG_PROZESS" label="Prozess">
      <section className="section-spacing bg-[var(--color-apple-dark)] text-white">
        <div className="container-content">
          <SectionHeader
            title={prozess.title}
            subtitle={prozess.subtitle}
            description={prozess.description}
            className="mb-12 [&_h2]:text-white [&_p]:text-white/70"
            titleProps={prozessTitleEdit}
            subtitleProps={prozessSubtitleEdit}
            descriptionProps={prozessDescEdit}
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(prozess.schritte as any[]).map((schritt: any, index: number) => (
              <ProzessSchrittCard key={index} schritt={schritt} index={index} />
            ))}
          </StaggerContainer>
        </div>
      </section>
      </EditableSection>

      {/* Referenz Köniz - kompakt */}
      <EditableSection contentKey="RAUMGESTALTUNG_REFERENZ" label="Referenz Köniz">
      <section className="py-12 lg:py-16">
        <div className="container-content">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-[var(--color-apple-gray-100)] rounded-2xl">
              <div className="relative w-full md:w-48 aspect-[4/3] md:aspect-square rounded-xl overflow-hidden flex-shrink-0" {...referenzImageEdit}>
                <Image
                  src={referenz.image}
                  alt="RubikONE Köniz"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow text-center md:text-left">
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-1" {...referenzTaglineEdit}>{referenz.tagline}</p>
                <h3 className="text-headline text-[var(--color-apple-dark)]" {...referenzHeadlineEdit}>
                  {referenz.headline}
                </h3>
                <p className="mt-2 text-body text-[var(--color-apple-gray-600)]" {...referenzDescEdit}>
                  {referenz.description}
                </p>
              </div>
              <Link href={referenz.ctaHref} className="btn-secondary flex-shrink-0" {...referenzCtaEdit}>
                {referenz.ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
      </EditableSection>

      {/* FAQ */}
      <EditableSection contentKey="RAUMGESTALTUNG_FAQ" label="FAQ">
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <SectionHeader
            title="Häufig gestellte Fragen"
            subtitle="FAQ"
            className="mb-12"
          />

          <FadeUp>
            <div className="max-w-3xl mx-auto">
              {(faq as any[]).map((item: any, index: number) => (
                <FAQItemCard
                  key={index}
                  item={item}
                  index={index}
                  isOpen={openFAQ === index}
                  onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
      </EditableSection>

      {/* Konfigurator CTA */}
      <section className="py-16 lg:py-20 bg-[var(--color-apple-gray-100)]">
        <div className="container-content max-w-2xl">
          <FadeUp>
            <ConfiguratorTrigger variant="card" />
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <EditableSection contentKey="RAUMGESTALTUNG_CTA" label="Call-to-Action">
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
