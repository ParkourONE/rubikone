"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Quote, Users } from "lucide-react";
import { motion } from "framer-motion";
import { PARKOURONE_STORY } from "@/lib/constants";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { appleTransition } from "@/lib/animations";

// Full ParkourONE Story Section for dedicated page
export function ParkourONEStoryFull() {
  return (
    <>
      {/* Intro */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <FadeUp>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-4">
                Die Pioniere
              </p>
              <h2 className="text-title-1 text-[var(--color-apple-dark)]">
                Entwickelt von Pionieren.
              </h2>
              <p className="mt-6 text-body-lg text-[var(--color-apple-gray-700)]">
                Seit Jahrzehnten bewegen wir uns im öffentlichen Raum. RubikONE ist unsere logische Weiterentwicklung dessen, was wir tagtäglich tun: Den öffentlichen Raum nutzen als Fitnesscenter.
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <SectionHeader
            title={PARKOURONE_STORY.history.headline}
            subtitle="Von den Anfängen bis heute"
          />

          <StaggerContainer className="mt-12 lg:mt-16 max-w-4xl mx-auto">
            {PARKOURONE_STORY.history.milestones.map((milestone, index) => (
              <StaggerItem key={index}>
                <div className="flex gap-6 lg:gap-8 items-start pb-12 relative">
                  <div className="flex-shrink-0 w-20 lg:w-24 text-right">
                    <span className="text-title-3 font-bold text-[var(--color-apple-blue)]">
                      {milestone.year}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-[var(--color-apple-blue)] relative z-10" />
                    {index < PARKOURONE_STORY.history.milestones.length - 1 && (
                      <div className="absolute top-4 left-1.5 w-0.5 h-full bg-[var(--color-apple-gray-300)]" />
                    )}
                  </div>
                  <div className="flex-grow pb-4">
                    <h3 className="text-headline text-[var(--color-apple-dark)]">{milestone.title}</h3>
                    <p className="mt-2 text-body text-[var(--color-apple-gray-700)]">{milestone.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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

      {/* Expertise */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <SectionHeader
            title={PARKOURONE_STORY.expertise.headline}
            subtitle="Was uns auszeichnet"
          />

          <StaggerContainer className="mt-12 grid md:grid-cols-2 gap-8">
            {PARKOURONE_STORY.expertise.points.map((point, index) => (
              <StaggerItem key={index}>
                <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8 h-full">
                  <h3 className="text-headline text-[var(--color-apple-dark)]">{point.title}</h3>
                  <p className="mt-3 text-body text-[var(--color-apple-gray-700)]">{point.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Values */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <SectionHeader
            title="Unsere Werte"
            subtitle="Wofür wir stehen"
          />

          <StaggerContainer className="mt-12 grid md:grid-cols-3 gap-8">
            {PARKOURONE_STORY.values.map((value, index) => (
              <StaggerItem key={index}>
                <div className="bg-white rounded-2xl p-8 shadow-apple text-center h-full">
                  <h3 className="text-title-2 text-[var(--color-apple-blue)]">{value.title}</h3>
                  <p className="mt-4 text-body text-[var(--color-apple-gray-700)]">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Team */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <SectionHeader
            title="Das Team"
            subtitle="Die Menschen hinter RubikONE"
          />

          <StaggerContainer className="mt-12 grid md:grid-cols-3 gap-8">
            {PARKOURONE_STORY.team.map((member, index) => (
              <StaggerItem key={index}>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto rounded-full bg-[var(--color-apple-gray-200)] flex items-center justify-center mb-6">
                    <Users className="h-12 w-12 text-[var(--color-apple-gray-400)]" />
                  </div>
                  <h3 className="text-headline text-[var(--color-apple-dark)]">{member.name}</h3>
                  <p className="text-body-sm text-[var(--color-apple-blue)] mt-1">{member.role}</p>
                  <p className="mt-4 text-body text-[var(--color-apple-gray-600)]">{member.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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
