"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Route, Calendar, Quote, ArrowRight, ArrowLeft, CheckCircle, X, Download } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { KOENIZ_CASE_STUDY, KOENIZ_DETAILS } from "@/lib/constants";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { appleTransition } from "@/lib/animations";

const GALLERY_IMAGES = [
  { src: "/images/koeniz/schulklasse.jpg", alt: "Schulklasse beim RubikONE Training" },
  { src: "/images/koeniz/kind-springt.jpg", alt: "Kind springt am Posten" },
  { src: "/images/koeniz/kinder-springen.jpg", alt: "Kinder springen gemeinsam" },
  { src: "/images/koeniz/spass.jpg", alt: "Spass beim Bewegen" },
  { src: "/images/koeniz/schloss.jpg", alt: "Schlossareal Köniz" },
];

export default function KoenizPage() {
  const [activeInsight, setActiveInsight] = useState<number | null>(null);
  const insightScrollRef = useRef<HTMLDivElement>(null);
  const feedbackScrollRef = useRef<HTMLDivElement>(null);

  const scrollInsights = (direction: "left" | "right") => {
    if (insightScrollRef.current) {
      const scrollAmount = 360;
      insightScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

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
      <PageHero
        title="Köniz macht es vor."
        description="Die erste RubikONE-Installation der Schweiz. Ein BASPO lab7x1 Pilotprojekt mit wissenschaftlicher Evaluation."
        breadcrumb="Referenz Köniz"
        image="/images/koeniz/luftbild.jpg"
        imageAlt="Luftaufnahme RubikONE Köniz im Schlossareal"
      />

      {/* Die Geschichte - mit lab7x1 */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
            className="mb-12"
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
              BASPO lab7x1
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)] max-w-3xl">
              Ein Innovationsprojekt des Bundes.
            </h2>
            <p className="mt-6 text-body-lg text-[var(--color-apple-gray-700)] max-w-3xl">
              «Täglich eine Stunde, sieben Tage die Woche» – nach dieser Formel soll sich die Schweizer Bevölkerung bewegen. Das Bundesamt für Sport BASPO hat dafür das <strong>lab7x1</strong> aufgebaut: Ein Innovationslabor, das neue Ideen zur Bewegungsförderung testet und evaluiert.
            </p>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-700)] max-w-3xl">
              RubikONE wurde als Laborversuch finanziert und über zwei Jahre wissenschaftlich begleitet. Die Gemeinde Köniz stellte das Schlossareal zur Verfügung – ein anspruchsvoller Standort unter Denkmalschutz.
            </p>
          </motion.div>

          {/* Timeline */}
          <StaggerContainer className="mt-16 max-w-3xl">
            {KOENIZ_CASE_STUDY.timeline.map((item, index) => (
              <StaggerItem key={index}>
                <div className="flex gap-6 items-start pb-8 relative">
                  <div className="flex-shrink-0 w-32 text-right">
                    <span className="text-body font-semibold text-[var(--color-apple-blue)]">{item.date}</span>
                  </div>
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-[var(--color-apple-blue)] relative z-10" />
                    {index < KOENIZ_CASE_STUDY.timeline.length - 1 && (
                      <div className="absolute top-4 left-1.5 w-0.5 h-full bg-[var(--color-apple-gray-200)]" />
                    )}
                  </div>
                  <div className="flex-grow pb-4">
                    <p className="text-body text-[var(--color-apple-dark)]">{item.event}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Download Evaluation Report */}
          <FadeUp className="mt-12">
            <a
              href="/downloads/RubikONE-Evaluation-Koeniz.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-[var(--color-apple-gray-100)] rounded-xl hover:bg-[var(--color-apple-gray-200)] transition-colors group"
            >
              <Download className="h-5 w-5 text-[var(--color-apple-blue)]" />
              <div>
                <p className="text-body font-medium text-[var(--color-apple-dark)]">Evaluationsbericht herunterladen</p>
                <p className="text-body-sm text-[var(--color-apple-gray-600)]">Vollständiger wissenschaftlicher Abschlussbericht (PDF)</p>
              </div>
            </a>
          </FadeUp>
        </div>
      </section>

      {/* Herausforderung & Lösung - mit Bildern */}
      <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <FadeUp>
              <div className="bg-white rounded-2xl overflow-hidden shadow-apple h-full">
                {/* Bild */}
                <div className="relative aspect-[16/9]">
                  <Image
                    src={KOENIZ_CASE_STUDY.challenge.image}
                    alt="Herausforderung"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Content */}
                <div className="p-8">
                  <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-6">
                    {KOENIZ_CASE_STUDY.challenge.title}
                  </h3>
                  <ul className="space-y-4">
                    {KOENIZ_CASE_STUDY.challenge.points.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-[var(--color-apple-gray-400)] mt-2 flex-shrink-0" />
                        <span className="text-body text-[var(--color-apple-gray-700)]">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="bg-[var(--color-apple-blue)] rounded-2xl overflow-hidden text-white h-full">
                {/* Bild */}
                <div className="relative aspect-[16/9]">
                  <Image
                    src={KOENIZ_CASE_STUDY.solution.image}
                    alt="Lösung"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Content */}
                <div className="p-8">
                  <h3 className="text-title-3 mb-6">
                    {KOENIZ_CASE_STUDY.solution.title}
                  </h3>
                  <ul className="space-y-4">
                    {KOENIZ_CASE_STUDY.solution.points.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                        <span className="text-body">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Denkmalschutz Highlight */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-content">
          <FadeUp>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-apple-gray-100)] rounded-full mb-6">
                <span className="text-body-sm font-medium text-[var(--color-apple-gray-600)]">Denkmalschutz? Wir haben Erfahrung.</span>
              </div>
              <p className="text-title-2 text-[var(--color-apple-dark)]">
                {KOENIZ_CASE_STUDY.denkmalpflege}
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Erkenntnisse - Slider Cards mit Modal */}
      <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)] overflow-hidden">
        <div className="container-content mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
              Wissenschaftlich evaluiert
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]">
              Die Erkenntnisse.
            </h2>
          </motion.div>
        </div>

        {/* Slider */}
        <div
          ref={insightScrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="slider-spacer" />

          {KOENIZ_CASE_STUDY.insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: index * 0.05 }}
              className="flex-shrink-0 w-[320px]"
            >
              <div
                onClick={() => setActiveInsight(index)}
                className="bg-white rounded-2xl p-8 shadow-apple h-full cursor-pointer hover:shadow-apple-lg transition-shadow"
              >
                <h3 className="text-headline font-semibold text-[var(--color-apple-dark)] mb-3">
                  {insight.title}
                </h3>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-4">
                  {insight.shortDesc}
                </p>
                <span className="inline-flex items-center gap-1 text-body-sm text-[var(--color-apple-blue)] font-medium">
                  Mehr
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </motion.div>
          ))}

          <div className="slider-spacer" />
        </div>

        {/* Navigation */}
        <div className="container-content mt-6">
          <div className="flex justify-end gap-4">
            <button
              onClick={() => scrollInsights("left")}
              className="p-2 rounded-full hover:bg-[var(--color-apple-gray-200)] transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
            </button>
            <button
              onClick={() => scrollInsights("right")}
              className="p-2 rounded-full hover:bg-[var(--color-apple-gray-200)] transition-colors"
            >
              <ArrowRight className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
            </button>
          </div>
        </div>
      </section>

      {/* Insight Modal */}
      <AnimatePresence>
        {activeInsight !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveInsight(null)}
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={appleTransition}
              className="relative bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveInsight(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-[var(--color-apple-gray-100)] rounded-full flex items-center justify-center hover:bg-[var(--color-apple-gray-200)] transition-colors"
              >
                <X className="h-5 w-5 text-[var(--color-apple-gray-600)]" />
              </button>
              <h3 className="text-title-2 text-[var(--color-apple-dark)] mb-4">
                {KOENIZ_CASE_STUDY.insights[activeInsight].title}
              </h3>
              <p className="text-body text-[var(--color-apple-gray-700)] leading-relaxed">
                {KOENIZ_CASE_STUDY.insights[activeInsight].fullDesc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stimmen der Teilnehmenden - Slider wie Homepage */}
      <section className="py-16 lg:py-24 bg-white overflow-hidden">
        <div className="container-content mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
              Workshop-Feedback
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]">
              Das sagen die Teilnehmenden.
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

          {KOENIZ_CASE_STUDY.workshopFeedback.map((feedback, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: index * 0.05 }}
              className="flex-shrink-0 w-[320px]"
            >
              <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6 h-full">
                <Quote className="h-8 w-8 text-[var(--color-apple-gray-300)] mb-4" strokeWidth={1} />
                <p className="text-body text-[var(--color-apple-dark)] leading-relaxed">
                  &ldquo;{feedback}&rdquo;
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

      {/* Offizielle Stimmen */}
      <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <SectionHeader
            title="Stimmen zum Projekt"
            subtitle="Offizielle Partner"
          />

          <StaggerContainer className="mt-12 grid lg:grid-cols-2 gap-6">
            {KOENIZ_DETAILS.quotes.map((quote, index) => (
              <StaggerItem key={index}>
                <div className="bg-white rounded-2xl p-6 shadow-apple">
                  <div className="flex gap-3 mb-4">
                    <Quote className="h-6 w-6 text-[var(--color-apple-blue)] flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-body text-[var(--color-apple-dark)] leading-relaxed">
                      &ldquo;{quote.text}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-apple-gray-200)]">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-apple-gray-200)] flex items-center justify-center">
                      <span className="text-body-sm font-semibold text-[var(--color-apple-gray-500)]">
                        {quote.author.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">
                        {quote.author}
                      </p>
                      <p className="text-caption text-[var(--color-apple-gray-600)]">
                        {quote.role}
                      </p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-content">
          <SectionHeader
            title="Impressionen"
            subtitle="RubikONE in Aktion"
          />

          <StaggerContainer className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {GALLERY_IMAGES.map((image, index) => (
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

      {/* Praktische Infos */}
      <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
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

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-[var(--color-apple-blue)]">
        <div className="container-content text-center">
          <FadeUp>
            <h2 className="text-title-1 text-white">
              Köniz war der Anfang.
            </h2>
            <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto">
              Jetzt ist Ihre Gemeinde dran. Starten Sie mit einem Impulsworkshop und entdecken Sie, welches Potenzial in Ihrer Umgebung steckt.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/impulsworkshop" className="btn-primary bg-white text-[var(--color-apple-blue)] hover:bg-white/90">
                Impulsworkshop anfragen
              </Link>
              <Link href="/kontakt" className="btn-secondary text-white hover:text-white/80">
                Beratungsgespräch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
