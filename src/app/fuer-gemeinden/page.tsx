"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Building2, GraduationCap, Users, CheckCircle, ArrowRight, Play, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageHero } from "@/components/sections/hero-section";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { ConfiguratorTrigger } from "@/components/sections/configurator-overlay";

// SEO metadata handled in layout or via generateMetadata

const stakeholderBenefits = [
  {
    icon: Building2,
    title: "Städte & Gemeinden",
    benefits: [
      "Nachhaltige Raumentwicklung ohne zusätzlichen Platzanspruch",
      "Innovative Gesundheitsförderung vor der Haustür",
      "Stärkung der lokalen Gemeinschaft",
      "Minimaler Ressourceneinsatz",
    ],
  },
  {
    icon: GraduationCap,
    title: "Bildung & Kultur",
    benefits: [
      "Erweitertes Klassenzimmer & Alternative zur Sporthalle",
      "Kreative Bewegungspausen & Lernmöglichkeiten",
      "Förderung von Teamwork",
      "Vielfältige Bewegungspausen",
    ],
  },
  {
    icon: Users,
    title: "Bevölkerung",
    benefits: [
      "Jederzeit & kostenfrei zugänglich",
      "Für alle Altersgruppen & Fitnesslevel",
      "Leicht verständlich dank Bilder & Symbolen",
      "Fördert einen aktiven Lebensstil",
    ],
  },
];

const prozessSchritte = [
  { nummer: "1", titel: "Analyse", beschreibung: "Impulsworkshop und Ausgangslage klären", image: "/images/gemeinden/prozess-1.jpg" },
  { nummer: "2", titel: "Planung", beschreibung: "RubikONE auf Ihre Gemeinde anpassen", image: "/images/gemeinden/prozess-2.jpg" },
  { nummer: "3", titel: "Umsetzung", beschreibung: "Produktion und Installation von RubikONE", image: "/images/gemeinden/prozess-3.jpg" },
  { nummer: "4", titel: "Nutzung", beschreibung: "Eröffnung und Workshops", image: "/images/gemeinden/prozess-4.jpg" },
];

const uspItemsCompact = [
  {
    title: "Einfache Integration",
    description: "Nutzt vorhandene Strukturen",
  },
  {
    title: "Nachhaltigkeit",
    description: "Langlebiges Material",
  },
  {
    title: "Lebensqualität",
    description: "Fördert ganzheitliche Gesundheit",
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
        title="Bewegungsförderung leicht gemacht."
        description="RubikONE verwandelt bestehende Umgebungselemente in vielseitige Bewegungsräume. Nachhaltige Gesundheitsförderung – permanent sichtbar und zugänglich."
        breadcrumb="Für Gemeinden"
        image="/images/koeniz/kind-springt.jpg"
        imageAlt="Kind springt bei RubikONE"
      />

      {/* SRF Einstein Badge */}
      <section className="py-8 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <FadeUp>
            <Link
              href="/ueber-uns#srf-einstein"
              className="inline-flex items-center gap-3 px-5 py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              <Play className="h-5 w-5 text-[var(--color-apple-blue)]" />
              <span className="text-body-sm font-medium text-[var(--color-apple-dark)]">
                Bekannt aus SRF Einstein
              </span>
              <ArrowRight className="h-4 w-4 text-[var(--color-apple-gray-500)]" />
            </Link>
          </FadeUp>
        </div>
      </section>

      {/* Mehrwert für alle - 3 Columns */}
      <section className="section-spacing">
        <div className="container-content">
          <SectionHeader
            title="Mehrwert für alle"
            subtitle="Aufenthaltsqualität steigern"
            description="Mit RubikONE wird die Gemeinde, das Quartier oder das Schulareal zum vielseitigen Bewegungsraum."
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

      {/* Das macht RubikONE einzigartig - Kompakt */}
      <section className="py-12 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {uspItemsCompact.map((item, index) => (
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
            title="In vier Schritten zu Ihrem RubikONE"
            subtitle="Das Vorgehen"
            description="Wir begleiten Sie von A bis Z und übernehmen die fachliche Leitung im gesamten Prozess."
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

      {/* Referenz Köniz - kompakt */}
      <section className="py-12 lg:py-16">
        <div className="container-content">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-[var(--color-apple-gray-100)] rounded-2xl">
              <div className="relative w-full md:w-48 aspect-[4/3] md:aspect-square rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src="/images/gemeinden/koeniz-ref.jpg"
                  alt="RubikONE Köniz"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow text-center md:text-left">
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-1">Referenz</p>
                <h3 className="text-headline text-[var(--color-apple-dark)]">
                  Köniz war die erste Gemeinde.
                </h3>
                <p className="mt-2 text-body text-[var(--color-apple-gray-600)]">
                  Im August 2024 eröffnete der erste RubikONE mit 9 Posten im Schlossareal Köniz – bewilligt im Denkmalschutz.
                </p>
              </div>
              <Link href="/koeniz" className="btn-secondary flex-shrink-0">
                Mehr erfahren
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
