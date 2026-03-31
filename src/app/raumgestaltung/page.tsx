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
import { RAUMGESTALTUNG_PAGE, PROCESS_PHASES } from "@/lib/constants";
import { EditableSection } from "@/components/admin/editable-section";

const iconMap: Record<number, any> = {
  0: Building2,
  1: GraduationCap,
  2: Users,
};

function FAQItem({ question, answer, isOpen, onToggle }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[var(--color-apple-gray-200)]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-body font-semibold text-[var(--color-apple-dark)] pr-4">
          {question}
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
            <p className="text-body text-[var(--color-apple-gray-600)] pb-5">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RaumgestaltungPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <>
      <EditableSection contentKey="RAUMGESTALTUNG_PAGE" label="Raumgestaltung">
      {/* Hero */}
      <PageHero
        title={RAUMGESTALTUNG_PAGE.hero.title}
        description={RAUMGESTALTUNG_PAGE.hero.description}
        breadcrumb={RAUMGESTALTUNG_PAGE.hero.breadcrumb}
        image={RAUMGESTALTUNG_PAGE.hero.image}
        imageAlt={RAUMGESTALTUNG_PAGE.hero.imageAlt}
      />

      {/* Mehrwert für alle - 3 Columns */}
      <section className="section-spacing">
        <div className="container-content">
          <SectionHeader
            title={RAUMGESTALTUNG_PAGE.mehrwert.title}
            subtitle={RAUMGESTALTUNG_PAGE.mehrwert.subtitle}
            description={RAUMGESTALTUNG_PAGE.mehrwert.description}
            className="mb-12"
          />

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {(RAUMGESTALTUNG_PAGE.mehrwert.stakeholders as any[]).map((stakeholder: any, index: number) => {
              const Icon = iconMap[index] || Users;
              return (
                <StaggerItem key={index}>
                  <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8 h-full">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-apple-blue)] text-white mb-6">
                      <Icon className="h-7 w-7" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-headline text-[var(--color-apple-dark)] mb-4">
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
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Das macht RubikONE einzigartig - Kompakt */}
      <section className="py-12 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {(RAUMGESTALTUNG_PAGE.uspKompakt as any[]).map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-[var(--color-apple-blue)] flex-shrink-0" />
                  <div>
                    <p className="text-body font-semibold text-[var(--color-apple-dark)]">
                      {item.title}
                    </p>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Testimonial Bernadette */}
      <section className="section-spacing">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeUp>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={RAUMGESTALTUNG_PAGE.testimonialBernadette.image}
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
                  <p className="text-title-3 text-[var(--color-apple-dark)] leading-relaxed">
                    &laquo;{RAUMGESTALTUNG_PAGE.testimonialBernadette.quote}&raquo;
                  </p>
                </blockquote>
                <div className="mt-6">
                  <p className="text-body font-semibold text-[var(--color-apple-dark)]">{RAUMGESTALTUNG_PAGE.testimonialBernadette.name}</p>
                  <p className="text-body-sm text-[var(--color-apple-gray-600)]">{RAUMGESTALTUNG_PAGE.testimonialBernadette.detail}</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Prozess */}
      <section className="section-spacing bg-[var(--color-apple-dark)] text-white">
        <div className="container-content">
          <SectionHeader
            title={RAUMGESTALTUNG_PAGE.prozess.title}
            subtitle={RAUMGESTALTUNG_PAGE.prozess.subtitle}
            description={RAUMGESTALTUNG_PAGE.prozess.description}
            className="mb-12 [&_h2]:text-white [&_p]:text-white/70"
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(RAUMGESTALTUNG_PAGE.prozess.schritte as any[]).map((schritt: any, index: number) => (
              <StaggerItem key={index}>
                <div className="bg-white/5 rounded-[var(--radius-apple-lg)] overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={schritt.image}
                      alt={schritt.titel}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-full bg-[var(--color-apple-blue)] flex items-center justify-center text-white font-bold">
                      {schritt.nummer}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-headline">{schritt.titel}</h3>
                    <p className="mt-2 text-body-sm text-white/70">
                      {schritt.beschreibung}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Referenz Köniz - kompakt */}
      <section className="py-12 lg:py-16">
        <div className="container-content">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-[var(--color-apple-gray-100)] rounded-2xl">
              <div className="relative w-full md:w-48 aspect-[4/3] md:aspect-square rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src={RAUMGESTALTUNG_PAGE.referenzKoeniz.image}
                  alt="RubikONE Köniz"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow text-center md:text-left">
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-1">{RAUMGESTALTUNG_PAGE.referenzKoeniz.tagline}</p>
                <h3 className="text-headline text-[var(--color-apple-dark)]">
                  {RAUMGESTALTUNG_PAGE.referenzKoeniz.headline}
                </h3>
                <p className="mt-2 text-body text-[var(--color-apple-gray-600)]">
                  {RAUMGESTALTUNG_PAGE.referenzKoeniz.description}
                </p>
              </div>
              <Link href={RAUMGESTALTUNG_PAGE.referenzKoeniz.ctaHref} className="btn-secondary flex-shrink-0">
                {RAUMGESTALTUNG_PAGE.referenzKoeniz.ctaText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <SectionHeader
            title="Häufig gestellte Fragen"
            subtitle="FAQ"
            className="mb-12"
          />

          <FadeUp>
            <div className="max-w-3xl mx-auto">
              {(RAUMGESTALTUNG_PAGE.faq as any[]).map((item: any, index: number) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openFAQ === index}
                  onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
                />
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Konfigurator CTA */}
      <section className="py-16 lg:py-20 bg-[var(--color-apple-gray-100)]">
        <div className="container-content max-w-2xl">
          <FadeUp>
            <ConfiguratorTrigger variant="card" />
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-[var(--color-apple-blue)]">
        <div className="container-content text-center">
          <FadeUp>
            <h2 className="text-title-1 text-white">
              {RAUMGESTALTUNG_PAGE.cta.headline}
            </h2>
            <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto">
              {RAUMGESTALTUNG_PAGE.cta.description}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={RAUMGESTALTUNG_PAGE.cta.ctaPrimary.href} className="btn-primary bg-white text-[var(--color-apple-blue)] hover:bg-white/90">
                {RAUMGESTALTUNG_PAGE.cta.ctaPrimary.label}
              </Link>
              <Link href={RAUMGESTALTUNG_PAGE.cta.ctaSecondary.href} className="btn-secondary text-white hover:text-white/80">
                {RAUMGESTALTUNG_PAGE.cta.ctaSecondary.label}
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
