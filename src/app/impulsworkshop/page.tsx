import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, Users, MapPin, Cloud, CheckCircle, ArrowRight, HelpCircle, ChevronDown } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { WORKSHOP_DETAILS, CONTACT_PERSON } from "@/lib/constants";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";

export const metadata: Metadata = {
  title: "Impulsworkshop | RubikONE",
  description: "Der einfachste Weg zu starten. Ein 120-minütiger Workshop vor Ort in Ihrer Gemeinde. Nach dem Workshop sehen Sie Ihre Umgebung mit anderen Augen.",
};

export default function ImpulsworkshopPage() {
  return (
    <>
      <PageHero
        title="Der einfachste Weg zu starten."
        description="Ein Workshop vor Ort. 120 Minuten. Danach sehen Sie Ihre Gemeinde mit anderen Augen."
        breadcrumb="Impulsworkshop"
        image="/images/workshop/frauen-balancieren.jpg"
        imageAlt="Workshop-Teilnehmerinnen beim Balancieren"
      />

      {/* Key Facts */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-wide">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {[
              { icon: Clock, value: WORKSHOP_DETAILS.duration, label: "Workshop-Dauer" },
              { icon: Users, value: WORKSHOP_DETAILS.participants, label: "Teilnehmende" },
              { icon: MapPin, value: "Vor Ort", label: "Bei Ihnen" },
              { icon: Cloud, value: "Jedes Wetter", label: "Draussen" },
            ].map((item, index) => (
              <StaggerItem key={index}>
                <div className="text-center">
                  <item.icon className="h-8 w-8 mx-auto text-[var(--color-apple-blue)] mb-3" />
                  <p className="text-title-3 text-[var(--color-apple-dark)]">{item.value}</p>
                  <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{item.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

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
              {WORKSHOP_DETAILS.program.map((item, index) => (
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
      <section className="section-spacing bg-white">
        <div className="container-wide">
          <FadeUp>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden md:col-span-2">
                <Image
                  src="/images/workshop/frauen-balancieren.jpg"
                  alt="Frauen balancieren beim Workshop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid gap-4">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/workshop/balancieren-helfen.jpg"
                    alt="Gegenseitige Hilfe beim Balancieren"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/workshop/quadrupedie.jpg"
                    alt="Quadrupedie-Übung auf der Linie"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Was Sie mitnehmen */}
      <section className="section-spacing bg-[var(--color-apple-dark)] text-white">
        <div className="container-content">
          <SectionHeader
            title="Was Sie mitnehmen"
            subtitle="Nach 120 Minuten"
            className="[&_h2]:text-white [&_p]:text-white/70"
          />

          <StaggerContainer className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WORKSHOP_DETAILS.whatYouGet.map((item, index) => (
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

      {/* Für wen? */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <SectionHeader
            title={WORKSHOP_DETAILS.forWhom.headline}
            subtitle="Der richtige Mix macht's"
          />

          <StaggerContainer className="mt-12 grid md:grid-cols-3 gap-8">
            {WORKSHOP_DETAILS.forWhom.groups.map((group, index) => (
              <StaggerItem key={index}>
                <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8 h-full">
                  <h3 className="text-headline text-[var(--color-apple-dark)] mb-4">
                    {group.title}
                  </h3>
                  <ul className="space-y-2">
                    {group.roles.map((role, roleIndex) => (
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
            <p className="mt-8 text-center text-body text-[var(--color-apple-gray-600)]">
              Ideal: 6-12 Teilnehmende aus verschiedenen Abteilungen. So entsteht ein gemeinsames Verständnis.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Preis-Box */}
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
                    <p className="text-body font-medium text-[var(--color-apple-dark)]">Draussen, bei jedem Wetter</p>
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

      {/* FAQ */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <SectionHeader
            title="Häufige Fragen"
            subtitle="Zum Impulsworkshop"
          />

          <StaggerContainer className="mt-12 max-w-3xl mx-auto space-y-4">
            {WORKSHOP_DETAILS.faq.map((item, index) => (
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
      <section className="section-spacing bg-[var(--color-apple-blue)]">
        <div className="container-content text-center">
          <FadeUp>
            <h2 className="text-title-1 text-white">
              Bereit für den neuen Blick?
            </h2>
            <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto">
              In 120 Minuten zeigen wir Ihnen, was in Ihrer Gemeinde möglich ist. Ohne Verpflichtung, mit konkreten Ideen.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kontakt" className="btn-primary bg-white text-[var(--color-apple-blue)] hover:bg-white/90">
                Workshop anfragen
              </Link>
              <Link href="/koeniz" className="btn-secondary text-white hover:text-white/80">
                Fallstudie ansehen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
