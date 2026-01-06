"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, Quote, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PARKOURONE_STORY } from "@/lib/constants";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { appleTransition } from "@/lib/animations";

// Timeline images mapped to milestones
const TIMELINE_IMAGES: Record<string, string> = {
  "2000": "/images/parkour/geschichte/muensingen-roger-widmer-altes-bild.jpg",
  "2006": "/images/parkour/geschichte/erste-pk-klasse.jpg",
  "2008": "/images/parkour/geschichte/firmengruendung.jpg",
  "2012": "/images/parkour/geschichte/tracespace_ruhleben2.jpg",
  "2024": "/images/parkour/parkour-pro-bild.jpg",
};

// Three themes with images
const THREE_THEMES = [
  {
    title: "Stark",
    description: "Körperliche und mentale Stärke durch Bewegung entwickeln.",
    image: "/images/parkour/sprung-hoch.jpg",
  },
  {
    title: "Sinnvoll",
    description: "Bewegung in den Alltag integrieren, nicht davon trennen.",
    image: "/images/parkour/parkourhelfen.jpg",
  },
  {
    title: "Nachhaltig",
    description: "Keine neuen Ressourcen verbrauchen, sondern Bestehendes nutzen.",
    image: "/images/parkour/geschichte/schueler-bewegen.jpg",
  },
];

// Full ParkourONE Story Section for dedicated page
export function ParkourONEStoryFull() {
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);

  const scrollTimeline = (direction: "left" | "right") => {
    if (timelineScrollRef.current) {
      const scrollAmount = 340;
      timelineScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      {/* Intro with Image */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeUp>
              <div>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-4">
                  Die Pioniere
                </p>
                <h2 className="text-title-1 text-[var(--color-apple-dark)]">
                  Entwickelt von Pionieren.
                </h2>
                <p className="mt-6 text-body-lg text-[var(--color-apple-gray-700)]">
                  Seit Jahrzehnten bewegen wir uns im öffentlichen Raum. RubikONE ist die logische Weiterentwicklung dessen, was wir tagtäglich tun: Den öffentlichen Raum nutzen als Fitnesscenter.
                </p>
                <p className="mt-4 text-body text-[var(--color-apple-gray-600)]">
                  Was 2000 mit einer Handvoll Traceure begann, ist heute die grösste Parkourschule der Deutschschweiz. Über 20 Jahre Erfahrung, tausende Schüler:innen und ein klares Ziel: Menschen in Bewegung bringen.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/parkour/training.jpg"
                  alt="Parkour Training"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Timeline Slider with Modal */}
      <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)] overflow-hidden">
        <div className="container-content mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
              Von den Anfängen bis heute
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]">
              {PARKOURONE_STORY.history.headline}
            </h2>
          </motion.div>
        </div>

        {/* Slider */}
        <div
          ref={timelineScrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="slider-spacer" />

          {PARKOURONE_STORY.history.milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: index * 0.05 }}
              className="flex-shrink-0 w-[320px]"
            >
              <div
                onClick={() => setActiveMilestone(index)}
                className="bg-white rounded-2xl overflow-hidden shadow-apple h-full cursor-pointer hover:shadow-apple-lg transition-shadow"
              >
                {TIMELINE_IMAGES[milestone.year] && (
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={TIMELINE_IMAGES[milestone.year]}
                      alt={milestone.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-[var(--color-apple-blue)] text-white px-3 py-1 rounded-full text-body-sm font-semibold">
                      {milestone.year}
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-headline font-semibold text-[var(--color-apple-dark)] mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-body-sm text-[var(--color-apple-gray-600)] line-clamp-2">
                    {milestone.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-body-sm text-[var(--color-apple-blue)] font-medium mt-4">
                    Mehr erfahren
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="slider-spacer" />
        </div>

        {/* Navigation */}
        <div className="container-content mt-6">
          <div className="flex justify-end gap-4">
            <button
              onClick={() => scrollTimeline("left")}
              className="p-2 rounded-full hover:bg-[var(--color-apple-gray-200)] transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
            </button>
            <button
              onClick={() => scrollTimeline("right")}
              className="p-2 rounded-full hover:bg-[var(--color-apple-gray-200)] transition-colors"
            >
              <ArrowRight className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
            </button>
          </div>
        </div>
      </section>

      {/* Timeline Modal */}
      <AnimatePresence>
        {activeMilestone !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setActiveMilestone(null)}
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={appleTransition}
              className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Image */}
              {TIMELINE_IMAGES[PARKOURONE_STORY.history.milestones[activeMilestone].year] && (
                <div className="relative aspect-[16/9]">
                  <Image
                    src={TIMELINE_IMAGES[PARKOURONE_STORY.history.milestones[activeMilestone].year]}
                    alt={PARKOURONE_STORY.history.milestones[activeMilestone].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="text-display text-white font-bold">
                      {PARKOURONE_STORY.history.milestones[activeMilestone].year}
                    </span>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setActiveMilestone(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <X className="h-5 w-5 text-[var(--color-apple-gray-600)]" />
              </button>

              {/* Modal Content */}
              <div className="p-8">
                <h3 className="text-title-2 text-[var(--color-apple-dark)] mb-4">
                  {PARKOURONE_STORY.history.milestones[activeMilestone].title}
                </h3>
                <p className="text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed">
                  {PARKOURONE_STORY.history.milestones[activeMilestone].description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quote */}
      <section className="section-spacing bg-[var(--color-apple-dark)]">
        <div className="container-content">
          <FadeUp>
            <div className="max-w-4xl mx-auto text-center">
              <Quote className="h-12 w-12 text-white/30 mx-auto mb-6" strokeWidth={1} />
              <blockquote>
                <p className="text-title-2 text-white leading-relaxed">
                  &ldquo;{PARKOURONE_STORY.quote.text}&rdquo;
                </p>
              </blockquote>
              <div className="mt-8">
                <p className="text-body font-semibold text-white">{PARKOURONE_STORY.quote.author}</p>
                <p className="text-body-sm text-white/60">{PARKOURONE_STORY.quote.role}</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Expertise with Image */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <FadeUp>
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <Image
                  src="/images/parkour/parkourhelfen.jpg"
                  alt="Gegenseitige Hilfe beim Parkour"
                  fill
                  className="object-cover"
                />
              </div>
            </FadeUp>
            <div>
              <FadeUp delay={0.1}>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
                  Was uns auszeichnet
                </p>
                <h2 className="text-title-1 text-[var(--color-apple-dark)]">
                  {PARKOURONE_STORY.expertise.headline}
                </h2>
              </FadeUp>
              <StaggerContainer className="mt-8 space-y-6">
                {PARKOURONE_STORY.expertise.points.map((point, index) => (
                  <StaggerItem key={index}>
                    <div className="border-l-2 border-[var(--color-apple-blue)] pl-6">
                      <h3 className="text-headline text-[var(--color-apple-dark)]">{point.title}</h3>
                      <p className="mt-2 text-body text-[var(--color-apple-gray-700)]">{point.description}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Three Themes */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <SectionHeader
            title="Wofür wir stehen"
            subtitle="Drei Grundsätze"
          />

          <StaggerContainer className="mt-12 grid md:grid-cols-3 gap-6">
            {THREE_THEMES.map((theme, index) => (
              <StaggerItem key={index}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-apple h-full">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={theme.image}
                      alt={theme.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-title-3 text-[var(--color-apple-dark)]">{theme.title}</h3>
                    <p className="mt-2 text-body text-[var(--color-apple-gray-600)]">{theme.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Full Width Image */}
      <section className="relative h-[50vh] min-h-[400px]">
        <Image
          src="/images/parkour/sprung-hoch.jpg"
          alt="Parkour Sprung"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="container-content">
            <p className="text-title-2 text-white max-w-2xl">
              Bewegung ist mehr als Sport. Es ist eine Art, die Welt zu sehen.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

// Compact ParkourONE Story Section for Homepage
export function ParkourONEStoryCompact() {
  return (
    <section className="section-spacing bg-white">
      <div className="container-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="text-center mb-12"
        >
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
            Die Pioniere
          </p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">
            Entwickelt von Pionieren.
          </h2>
          <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-3xl mx-auto">
            Seit Jahrzehnten bewegen wir uns im öffentlichen Raum. RubikONE ist unsere logische Weiterentwicklung dessen, was wir tagtäglich tun: Den öffentlichen Raum nutzen als Fitnesscenter.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...appleTransition, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-12 lg:gap-20 mb-12"
        >
          <div className="text-center">
            <p className="text-display text-[var(--color-apple-blue)]">20+</p>
            <p className="text-body text-[var(--color-apple-gray-600)]">Jahre Blickwinkel</p>
          </div>
          <div className="text-center">
            <p className="text-display text-[var(--color-apple-blue)]">1'500+</p>
            <p className="text-body text-[var(--color-apple-gray-600)]">Schüler:innen</p>
          </div>
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...appleTransition, delay: 0.2 }}
          className="text-center mb-16"
        >
          <Link href="/ueber-uns" className="btn-secondary inline-flex">
            Mehr über ParkourONE
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Roger Quote - Matching testimonial style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...appleTransition, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
            <div className="flex gap-3 mb-4">
              <Quote className="h-6 w-6 text-[var(--color-apple-blue)] flex-shrink-0" strokeWidth={1.5} />
              <p className="text-body text-[var(--color-apple-dark)] leading-relaxed">
                &ldquo;{PARKOURONE_STORY.quote.text}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-apple-gray-200)]">
              <div className="w-10 h-10 rounded-full bg-[var(--color-apple-gray-300)] flex items-center justify-center">
                <Users className="h-5 w-5 text-[var(--color-apple-gray-500)]" />
              </div>
              <div>
                <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">
                  {PARKOURONE_STORY.quote.author}
                </p>
                <p className="text-caption text-[var(--color-apple-gray-600)]">
                  {PARKOURONE_STORY.quote.role}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Timeline only section for use in other pages
export function ParkourONETimeline() {
  return (
    <section className="section-spacing bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <SectionHeader
          title="20 Jahre Parkour-Expertise"
          subtitle="Unsere Geschichte"
        />

        <div className="mt-12 overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 min-w-max px-4">
            {PARKOURONE_STORY.history.milestones.map((milestone, index) => (
              <div
                key={index}
                className="w-64 flex-shrink-0 bg-white rounded-2xl p-6 shadow-apple"
              >
                <p className="text-title-2 text-[var(--color-apple-blue)] font-bold">{milestone.year}</p>
                <h3 className="text-body font-semibold text-[var(--color-apple-dark)] mt-2">{milestone.title}</h3>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-2">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
