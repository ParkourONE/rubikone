"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Quote, Users } from "lucide-react";
import { motion } from "framer-motion";
import { PARKOURONE_STORY } from "@/lib/constants";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { appleTransition } from "@/lib/animations";

// Timeline images mapped to milestones
const TIMELINE_IMAGES: Record<string, string> = {
  "2000": "/images/parkour/geschichte/muensingen-roger-widmer-altes-bild.jpg",
  "2006": "/images/parkour/geschichte/erste-pk-klasse.jpg",
  "2007": "/images/parkour/geschichte/firmengruendung.jpg",
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


      {/* Timeline with Images */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <SectionHeader
            title={PARKOURONE_STORY.history.headline}
            subtitle="Von den Anfängen bis heute"
          />

          <div className="mt-12 lg:mt-16 max-w-5xl mx-auto space-y-16">
            {PARKOURONE_STORY.history.milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ ...appleTransition, delay: index * 0.1 }}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <span className="text-display text-[var(--color-apple-blue)] font-bold">
                    {milestone.year}
                  </span>
                  <h3 className="text-title-2 text-[var(--color-apple-dark)] mt-2">
                    {milestone.title}
                  </h3>
                  <p className="mt-4 text-body-lg text-[var(--color-apple-gray-700)]">
                    {milestone.description}
                  </p>
                </div>
                {TIMELINE_IMAGES[milestone.year] && (
                  <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                    <Image
                      src={TIMELINE_IMAGES[milestone.year]}
                      alt={milestone.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
