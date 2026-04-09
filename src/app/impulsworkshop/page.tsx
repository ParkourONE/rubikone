"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users, MapPin, Cloud, CheckCircle, ArrowRight, HelpCircle } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { EditableSection } from "@/components/admin/editable-section";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import {
  WORKSHOP_DETAILS,
  CONTACT_PERSON,
  WORKSHOP_HERO,
  WORKSHOP_KEY_FACTS,
  WORKSHOP_IMAGES,
  WORKSHOP_MITNEHMEN,
  WORKSHOP_PREIS,
  WORKSHOP_FUER_WEN,
  WORKSHOP_CTA,
} from "@/lib/constants";

const KEY_FACT_ICONS = [Clock, Users, MapPin, Cloud];

export default function ImpulsworkshopPage() {
  const hero = useContent("WORKSHOP_HERO", WORKSHOP_HERO) as any;
  const keyFactsData = useContent("WORKSHOP_KEY_FACTS", WORKSHOP_KEY_FACTS) as any;
  const workshopImages = useContent("WORKSHOP_IMAGES", WORKSHOP_IMAGES) as any;
  const mitnehmen = useContent("WORKSHOP_MITNEHMEN", WORKSHOP_MITNEHMEN) as any;
  const preis = useContent("WORKSHOP_PREIS", WORKSHOP_PREIS) as any;
  const fuerWen = useContent("WORKSHOP_FUER_WEN", WORKSHOP_FUER_WEN) as any;
  const cta = useContent("WORKSHOP_CTA", WORKSHOP_CTA) as any;

  const mitnehmenTitleEdit = useEditPath("WORKSHOP_MITNEHMEN.title");
  const mitnehmenSubtitleEdit = useEditPath("WORKSHOP_MITNEHMEN.subtitle");
  const fuerWenNoteEdit = useEditPath("WORKSHOP_FUER_WEN.idealNote");
  const preisWetterEdit = useEditPath("WORKSHOP_PREIS.preisWetter");
  const ctaHeadlineEdit = useEditPath("WORKSHOP_CTA.headline");
  const ctaDescEdit = useEditPath("WORKSHOP_CTA.description");
  const ctaPrimaryEdit = useEditPath("WORKSHOP_CTA.ctaPrimary");
  const ctaSecondaryEdit = useEditPath("WORKSHOP_CTA.ctaSecondary");

  return (
    <>
      <EditableSection contentKey="WORKSHOP_HERO" label="Hero">
      <PageHero
        title={hero.title}
        description={hero.description}
        breadcrumb={hero.breadcrumb}
        image={hero.image}
        imageAlt={hero.imageAlt}
        titleEditPath="WORKSHOP_HERO.title"
        descriptionEditPath="WORKSHOP_HERO.description"
        breadcrumbEditPath="WORKSHOP_HERO.breadcrumb"
        imageEditPath="WORKSHOP_HERO.image"
      />
      </EditableSection>

      {/* Key Facts */}
      <EditableSection contentKey="WORKSHOP_KEY_FACTS" label="Key Facts">
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-wide">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {(keyFactsData.keyFacts as any[]).map((item: any, index: number) => {
              const Icon = KEY_FACT_ICONS[index] || Clock;
              return (
                <StaggerItem key={index}>
                  <div className="text-center">
                    <Icon className="h-8 w-8 mx-auto text-[var(--color-apple-blue)] mb-3" />
                    <p className="text-title-3 text-[var(--color-apple-dark)]">{item.value}</p>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{item.label}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>
      </EditableSection>

      {/* Was Sie erwartet */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <SectionHeader
            title="Was Sie erwartet"
            subtitle="Ein Workshop, der bewegt"
          />

          <div className="mt-12 lg:mt-16">
            <FadeUp>
              <p className="text-body-lg text-[var(--color-apple-gray-700)] max-w-3xl mx-auto text-center">
                {WORKSHOP_DETAILS.description}
              </p>
            </FadeUp>

            {/* Programm Timeline */}
            <StaggerContainer className="mt-12 grid md:grid-cols-4 gap-6">
              {WORKSHOP_DETAILS.program.map((item: any, index: number) => (
                <StaggerItem key={index}>
                  <div className="bg-white rounded-2xl p-6 shadow-apple h-full">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-apple-blue)] text-white flex items-center justify-center font-semibold mb-4">
                      {index + 1}
                    </div>
                    <h3 className="text-headline text-[var(--color-apple-dark)] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)]">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Workshop Images */}
      <EditableSection contentKey="WORKSHOP_IMAGES" label="Workshop-Bilder">
      <section className="section-spacing bg-white">
        <div className="container-wide">
          <FadeUp>
            <div className="grid md:grid-cols-3 gap-4">
              {(workshopImages.images as any[]).map((img: any, index: number) => (
                <div key={index} className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${index === 0 ? "md:col-span-2" : ""}`}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>
      </EditableSection>

      {/* Was Sie mitnehmen */}
      <EditableSection contentKey="WORKSHOP_MITNEHMEN" label="Was Sie mitnehmen">
      <section className="section-spacing bg-[var(--color-apple-dark)] text-white">
        <div className="container-content">
          <SectionHeader
            title={mitnehmen.title}
            subtitle={mitnehmen.subtitle}
            className="[&_h2]:text-white [&_p]:text-white/70"
            titleProps={mitnehmenTitleEdit}
            subtitleProps={mitnehmenSubtitleEdit}
          />

          <StaggerContainer className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORKSHOP_DETAILS.whatYouGet.map((item: string, index: number) => (
              <StaggerItem key={index}>
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-[var(--color-apple-blue-light)] flex-shrink-0 mt-0.5" />
                  <p className="text-body text-white/90">{item}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
      </EditableSection>

      {/* Für wen? */}
      <EditableSection contentKey="WORKSHOP_FUER_WEN" label="Für wen?">
      <section className="section-spacing bg-white">
        <div className="container-content">
          <SectionHeader
            title={WORKSHOP_DETAILS.forWhom.headline}
            subtitle="Der richtige Mix macht's"
          />

          <StaggerContainer className="mt-12 grid md:grid-cols-3 gap-8">
            {WORKSHOP_DETAILS.forWhom.groups.map((group: any, index: number) => (
              <StaggerItem key={index}>
                <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8 h-full">
                  <h3 className="text-headline text-[var(--color-apple-dark)] mb-4">
                    {group.title}
                  </h3>
                  <ul className="space-y-2">
                    {group.roles.map((role: string, roleIndex: number) => (
                      <li key={roleIndex} className="flex items-center gap-2 text-body text-[var(--color-apple-gray-700)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-apple-blue)]" />
                        {role}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeUp delay={0.2}>
            <p className="mt-8 text-center text-body text-[var(--color-apple-gray-600)]" {...fuerWenNoteEdit}>
              {fuerWen.idealNote}
            </p>
          </FadeUp>
        </div>
      </section>
      </EditableSection>

      {/* Preis-Box */}
      <EditableSection contentKey="WORKSHOP_PREIS" label="Preis">
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <FadeUp>
            <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 lg:p-12 shadow-apple-lg text-center">
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">Impulsworkshop</p>
              <p className="text-display text-[var(--color-apple-dark)]">{WORKSHOP_DETAILS.price}</p>
              <p className="text-body-sm text-[var(--color-apple-gray-500)] mt-1">{WORKSHOP_DETAILS.priceNote}</p>

              <div className="mt-8 pt-8 border-t border-[var(--color-apple-gray-200)]">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-caption text-[var(--color-apple-gray-500)]">Dauer</p>
                    <p className="text-body font-medium text-[var(--color-apple-dark)]">{WORKSHOP_DETAILS.duration}</p>
                  </div>
                  <div>
                    <p className="text-caption text-[var(--color-apple-gray-500)]">Teilnehmende</p>
                    <p className="text-body font-medium text-[var(--color-apple-dark)]">{WORKSHOP_DETAILS.participants}</p>
                  </div>
                  <div>
                    <p className="text-caption text-[var(--color-apple-gray-500)]">Ort</p>
                    <p className="text-body font-medium text-[var(--color-apple-dark)]">{WORKSHOP_DETAILS.location}</p>
                  </div>
                  <div>
                    <p className="text-caption text-[var(--color-apple-gray-500)]">Wetter</p>
                    <p className="text-body font-medium text-[var(--color-apple-dark)]" {...preisWetterEdit}>{preis.preisWetter}</p>
                  </div>
                </div>
              </div>

              <Link href="/kontakt" className="btn-primary mt-8 inline-flex">
                Workshop anfragen
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
      </EditableSection>

      {/* FAQ */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <SectionHeader
            title="Häufige Fragen"
            subtitle="Zum Impulsworkshop"
          />

          <StaggerContainer className="mt-12 max-w-3xl mx-auto space-y-4">
            {WORKSHOP_DETAILS.faq.map((item: any, index: number) => (
              <StaggerItem key={index}>
                <div className="bg-[var(--color-apple-gray-100)] rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <HelpCircle className="h-5 w-5 text-[var(--color-apple-blue)] flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-body font-semibold text-[var(--color-apple-dark)]">
                        {item.question}
                      </h3>
                      <p className="mt-2 text-body text-[var(--color-apple-gray-700)]">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Ansprechpartnerin */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <FadeUp>
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 rounded-full bg-[var(--color-apple-gray-300)] mx-auto mb-6 flex items-center justify-center">
                <Users className="h-10 w-10 text-[var(--color-apple-gray-500)]" />
              </div>
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">Ihre Ansprechpartnerin</p>
              <h3 className="text-title-2 text-[var(--color-apple-dark)]">{CONTACT_PERSON.name}</h3>
              <p className="text-body text-[var(--color-apple-gray-600)] mt-1">{CONTACT_PERSON.role}</p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={`mailto:${CONTACT_PERSON.email}`} className="btn-primary">
                  E-Mail schreiben
                </a>
                <a href={`tel:${CONTACT_PERSON.phone}`} className="btn-secondary">
                  Anrufen
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <EditableSection contentKey="WORKSHOP_CTA" label="Call-to-Action">
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
