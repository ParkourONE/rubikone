"use client";

import { useState } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Building2, GraduationCap, Users, CheckCircle, ArrowRight, Play, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/sections/hero-section";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { ConfiguratorTrigger } from "@/components/sections/configurator-overlay";
import { appleTransition } from "@/lib/animations";

// SEO metadata handled in layout or via generateMetadata

const stakeholderBenefits = [
  {
    icon: Building2,
    title: "Städte & Gemeinden",
    benefits: [
      "Nachhaltige Stadtentwicklung ohne Platzanspruch",
      "Innovative Gesundheitsförderung vor der Haustür",
      "Stärkung der lokalen Gemeinschaft",
      "Minimaler Ressourceneinsatz",
    ],
  },
  {
    icon: GraduationCap,
    title: "Bildung & Kultur",
    benefits: [
      "Erweitertes Klassenzimmer & Bildungserlebnis",
      "Förderung von Teamwork & Konzentrationsfähigkeit",
      "Bewegungspausen leicht gemacht",
      "Kreative Lernmöglichkeiten",
    ],
  },
  {
    icon: Users,
    title: "Bevölkerung",
    benefits: [
      "Kostenfrei & flexibel erreichbar",
      "Für alle Altersgruppen & Fitnesslevel",
      "Ausgleich im Alltag",
      "Fördert einen aktiven Lebensstil",
    ],
  },
];

const prozessSchritte = [
  { nummer: "1", titel: "Kennenlernen", beschreibung: "Impulsworkshop vor Ort oder Beratungsgespräch", image: "/images/gemeinden/prozess-1.jpg" },
  { nummer: "2", titel: "Planen", beschreibung: "Standortanalyse und Baugesuchsunterstützung", image: "/images/gemeinden/prozess-2.jpg" },
  { nummer: "3", titel: "Umsetzen", beschreibung: "Produktion und Installation der Schilder", image: "/images/gemeinden/prozess-3.jpg" },
  { nummer: "4", titel: "Eröffnen", beschreibung: "Einweihungsevent mit der Bevölkerung", image: "/images/gemeinden/prozess-4.jpg" },
];

const uspItems = [
  {
    title: "Einfache Integration",
    description: "Keine neuen Anlagen nötig. Wegweiser und Postenschilder werden an vorhandene Elemente wie Säulen oder Mauern montiert.",
    image: "/images/gemeinden/integration.jpg",
  },
  {
    title: "Nachhaltigkeit",
    description: "Das verwendete Material ist langlebig und wartungsarm. Einmaliger Aufwand – nachhaltiger Nutzen.",
    image: "/images/gemeinden/nachhaltigkeit.jpg",
  },
  {
    title: "Lebensqualität",
    description: "Bewegung ist Leben – mit RubikONE fördern Sie physische, psychische und soziale Gesundheit.",
    image: "/images/gemeinden/lebensqualitaet.jpg",
  },
];

const faqItems = [
  {
    question: "Wie trägt RubikONE zur Gesundheitsförderung bei?",
    answer: "RubikONE lädt zu täglicher Bewegung ein und motiviert Menschen, sich physisch und mental aus der Komfortzone zu locken. Sportmotorische wie auch sensorische und emotionale Challenges haben das Potenzial, die Gesundheit auf allen Ebenen zu steigern.",
  },
  {
    question: "Warum ist RubikONE eine nachhaltige Lösung?",
    answer: "Das verwendete Material ist langlebig und wartungsarm. Es werden keine neuen Geräte oder Anlagen gebaut – nur bestehende Elemente werden sichtbar gemacht. In 8 Monaten Testbetrieb in Köniz sind keine Wartungskosten angefallen.",
  },
  {
    question: "Wie schnell kann RubikONE umgesetzt werden?",
    answer: "Von der Idee bis zur Eröffnung rechnen wir mit 4–6 Monaten. Der grösste Zeitfaktor ist das Baugesuchsverfahren (3–4 Monate). Die physische Installation dauert nur wenige Tage.",
  },
  {
    question: "Braucht es ein Baugesuch?",
    answer: "Ja, für eine Fixinstallation ist ein Baugesuch notwendig. Die gute Nachricht: Da nur Schilder und Farbmarkierungen installiert werden, ist der Prozess deutlich einfacher als bei herkömmlichen Sportanlagen.",
  },
  {
    question: "Was ist mit Haftung und Sicherheit?",
    answer: "Jeder RubikONE entspricht den relevanten Schweizer Sicherheitsnormen, insbesondere SN EN 16630:2015 (Fitnessgeräte im Aussenbereich) und weiteren Standards. Die Haftungsfrage ist klar geregelt.",
  },
  {
    question: "Gibt es spezielle Angebote für Schulen?",
    answer: "Ja! RubikONE eignet sich ideal für Schulareale. Wir bieten spezielle Pakete für Schulen an, inklusive pädagogischem Begleitmaterial und Einführungsworkshops für Lehrpersonen.",
  },
];

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

export default function FuerGemeindenPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Bewegungsförderung ohne Bauaufwand."
        description="RubikONE verwandelt bestehende Umgebungselemente in vielseitige Bewegungsräume. Nachhaltige Gesundheitsförderung – permanent sichtbar und zugänglich."
        breadcrumb="Für Gemeinden"
        image="/images/koeniz/kind-springt.jpg"
        imageAlt="Kind springt bei RubikONE"
      />

      {/* SRF Einstein Video Section */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeUp>
              <div>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
                  SRF Einstein
                </p>
                <h2 className="text-title-1 text-[var(--color-apple-dark)]">
                  «Darum sollten alle mal Parkour ausprobieren.»
                </h2>
                <p className="mt-6 text-body-lg text-[var(--color-apple-gray-700)]">
                  RubikONE ist mehr als Bewegung. Denn RubikONE ist Parkour. Ein Freizeitangebot zur Förderung der physischen, psychischen und sozialen Gesundheit.
                </p>
                <div className="mt-8">
                  <a
                    href="https://www.srf.ch/play/tv/einstein/video/darum-sollten-alle-mal-parkour-ausprobieren?urn=urn:srf:video:d1be2ecf-295a-4f0a-881e-f532bc747ab3"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex"
                  >
                    <Play className="h-5 w-5" />
                    Zur SRF Reportage
                  </a>
                </div>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <a
                href="https://www.srf.ch/play/tv/einstein/video/darum-sollten-alle-mal-parkour-ausprobieren?urn=urn:srf:video:d1be2ecf-295a-4f0a-881e-f532bc747ab3"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-video rounded-2xl overflow-hidden group"
              >
                <Image
                  src="/images/parkour/training.jpg"
                  alt="SRF Einstein Reportage über Parkour"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="h-8 w-8 text-[var(--color-apple-blue)] ml-1" />
                  </div>
                </div>
              </a>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Mehrwert für alle - 3 Columns */}
      <section className="section-spacing">
        <div className="container-content">
          <SectionHeader
            title="Mehrwert für alle"
            subtitle="Stakeholder Benefits"
            description="Mit RubikONE wird die Stadt, der Schulhausplatz oder die neu geplante Ecke zum interaktiven Bewegungsraum."
            className="mb-12"
          />

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {stakeholderBenefits.map((stakeholder, index) => (
              <StaggerItem key={index}>
                <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8 h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-apple-blue)] text-white mb-6">
                    <stakeholder.icon className="h-7 w-7" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-headline text-[var(--color-apple-dark)] mb-4">
                    {stakeholder.title}
                  </h3>
                  <ul className="space-y-3">
                    {stakeholder.benefits.map((benefit, benefitIndex) => (
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
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Das macht RubikONE einzigartig */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <SectionHeader
            title="Das macht RubikONE einzigartig"
            subtitle="USP"
            className="mb-12"
          />

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {uspItems.map((item, index) => (
              <StaggerItem key={index}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-apple h-full">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-headline text-[var(--color-apple-dark)] mb-3">
                      {item.title}
                    </h3>
                    <p className="text-body text-[var(--color-apple-gray-600)]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonial Bernadette */}
      <section className="section-spacing">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeUp>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/gemeinden/bernadette.jpg"
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
                    «Als Seniorin und Grossmutter war ich anfangs skeptisch, ob RubikONE auch für mich geeignet ist. Die klaren Anleitungen und die Möglichkeit, alles mit der Familie zu machen, haben mich überzeugt.»
                  </p>
                </blockquote>
                <div className="mt-6">
                  <p className="text-body font-semibold text-[var(--color-apple-dark)]">Bernadette</p>
                  <p className="text-body-sm text-[var(--color-apple-gray-600)]">66 Jahre, Köniz</p>
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
            title="Von der Idee zur Eröffnung"
            subtitle="Unser Prozess"
            description="In vier Schritten zu Ihrem RubikONE – wir übernehmen alles oder nur das, was Sie brauchen."
            className="mb-12 [&_h2]:text-white [&_p]:text-white/70"
          />

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {prozessSchritte.map((schritt, index) => (
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

      {/* Referenz Köniz */}
      <section className="section-spacing">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeUp>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/gemeinden/koeniz-ref.jpg"
                  alt="RubikONE Köniz"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
                  Referenz
                </p>
                <h2 className="text-title-1 text-[var(--color-apple-dark)]">
                  Köniz war die erste Gemeinde.
                </h2>
                <p className="mt-6 text-body-lg text-[var(--color-apple-gray-700)]">
                  Im August 2024 eröffnete der erste RubikONE im Schlossareal Köniz. 11 Posten auf 1.2 km – bewilligt im Denkmalschutz.
                </p>
                <div className="mt-8 flex flex-wrap gap-8">
                  <div>
                    <p className="text-display text-[var(--color-apple-blue)]">11</p>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)]">Posten</p>
                  </div>
                  <div>
                    <p className="text-display text-[var(--color-apple-blue)]">1.2 km</p>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)]">Strecke</p>
                  </div>
                  <div>
                    <p className="text-display text-[var(--color-apple-blue)]">0 CHF</p>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)]">Wartungskosten</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/koeniz" className="btn-secondary inline-flex">
                    Fallstudie ansehen
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <SectionHeader
            title="Häufige Fragen von Gemeinden"
            subtitle="FAQ"
            className="mb-12"
          />

          <FadeUp>
            <div className="max-w-3xl mx-auto">
              {faqItems.map((item, index) => (
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
              Bereit für den nächsten Schritt?
            </h2>
            <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto">
              Erleben Sie, wie RubikONE auch in Ihrer Gemeinde Bewegung neu definiert. Nutzen Sie den öffentlichen Raum clever, nachhaltig und innovativ.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/impulsworkshop" className="btn-primary bg-white text-[var(--color-apple-blue)] hover:bg-white/90">
                Impulsworkshop buchen
              </Link>
              <Link href="/kontakt" className="btn-secondary text-white hover:text-white/80">
                Beratungsgespräch vereinbaren
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
