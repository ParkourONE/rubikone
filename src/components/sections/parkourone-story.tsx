"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, Quote, Users, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PARKOURONE_STORY, UEBER_UNS_STORY } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { appleTransition } from "@/lib/animations";
import { useEditPath } from "@/components/cms/primitives";

// Timeline images mapped to milestones
const TIMELINE_IMAGES: Record<string, string> = {
  "2000": "/images/parkour/geschichte/muensingen-roger-widmer-altes-bild.jpg",
  "2006": "/images/parkour/geschichte/erste-pk-klasse.jpg",
  "2008": "/images/parkour/geschichte/firmengruendung.jpg",
  "2012": "/images/parkour/geschichte/tracespace_ruhleben2.jpg",
  "2024": "/images/parkour/parkour-pro-bild.jpg",
};

// Full ParkourONE Story Section for dedicated page
export function ParkourONEStoryFull() {
  const parkourStory = useContent("PARKOURONE_STORY", PARKOURONE_STORY);
  const ueberUnsPage = useContent("UEBER_UNS_STORY", UEBER_UNS_STORY);
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const storyIntroTaglineEdit = useEditPath("UEBER_UNS_STORY.storyIntro.tagline");
  const storyIntroHeadlineEdit = useEditPath("UEBER_UNS_STORY.storyIntro.headline");
  const storyIntroDesc1Edit = useEditPath("UEBER_UNS_STORY.storyIntro.description1");
  const storyIntroDesc2Edit = useEditPath("UEBER_UNS_STORY.storyIntro.description2");
  const storyIntroImageEdit = useEditPath("UEBER_UNS_STORY.storyIntro.image");
  const timelineTaglineEdit = useEditPath("UEBER_UNS_STORY.timelineTagline");
  const historyHeadlineEdit = useEditPath("PARKOURONE_STORY.history.headline");
  const quoteTextEdit = useEditPath("PARKOURONE_STORY.quote.text");
  const quoteAuthorEdit = useEditPath("PARKOURONE_STORY.quote.author");
  const quoteRoleEdit = useEditPath("PARKOURONE_STORY.quote.role");
  const expertiseTaglineEdit = useEditPath("UEBER_UNS_STORY.expertiseTagline");
  const expertiseHeadlineEdit = useEditPath("PARKOURONE_STORY.expertise.headline");
  const threeThemesTitleEdit = useEditPath("UEBER_UNS_STORY.threeThemes.title");
  const threeThemesSubtitleEdit = useEditPath("UEBER_UNS_STORY.threeThemes.subtitle");
  const fullWidthQuoteEdit = useEditPath("UEBER_UNS_STORY.fullWidthQuote");

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
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-4" {...storyIntroTaglineEdit}>
                  {ueberUnsPage.storyIntro.tagline}
                </p>
                <h2 className="text-title-1 text-[var(--color-apple-dark)]" {...storyIntroHeadlineEdit}>
                  {ueberUnsPage.storyIntro.headline}
                </h2>
                <p className="mt-6 text-body-lg text-[var(--color-apple-gray-700)]" {...storyIntroDesc1Edit}>
                  {ueberUnsPage.storyIntro.description1}
                </p>
                <p className="mt-4 text-body text-[var(--color-apple-gray-600)]" {...storyIntroDesc2Edit}>
                  {ueberUnsPage.storyIntro.description2}
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden" {...storyIntroImageEdit}>
                <Image
                  src={ueberUnsPage.storyIntro.image}
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
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2" {...timelineTaglineEdit}>
              {ueberUnsPage.timelineTagline}
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]" {...historyHeadlineEdit}>
              {parkourStory.history.headline}
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

          {parkourStory.history.milestones.map((milestone, index) => (
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
              {TIMELINE_IMAGES[parkourStory.history.milestones[activeMilestone].year] && (
                <div className="relative aspect-[16/9]">
                  <Image
                    src={TIMELINE_IMAGES[parkourStory.history.milestones[activeMilestone].year]}
                    alt={parkourStory.history.milestones[activeMilestone].title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="text-display text-white font-bold">
                      {parkourStory.history.milestones[activeMilestone].year}
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
                  {parkourStory.history.milestones[activeMilestone].title}
                </h3>
                <p className="text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed">
                  {parkourStory.history.milestones[activeMilestone].description}
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
                <p className="text-title-2 text-white leading-relaxed" {...quoteTextEdit}>
                  &ldquo;{parkourStory.quote.text}&rdquo;
                </p>
              </blockquote>
              <div className="mt-8">
                <p className="text-body font-semibold text-white" {...quoteAuthorEdit}>{parkourStory.quote.author}</p>
                <p className="text-body-sm text-white/60" {...quoteRoleEdit}>{parkourStory.quote.role}</p>
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
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2" {...expertiseTaglineEdit}>
                  {ueberUnsPage.expertiseTagline}
                </p>
                <h2 className="text-title-1 text-[var(--color-apple-dark)]" {...expertiseHeadlineEdit}>
                  {parkourStory.expertise.headline}
                </h2>
              </FadeUp>
              <StaggerContainer className="mt-8 space-y-6">
                {parkourStory.expertise.points.map((point, index) => (
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
            title={ueberUnsPage.threeThemes.title}
            subtitle={ueberUnsPage.threeThemes.subtitle}
            titleProps={threeThemesTitleEdit}
            subtitleProps={threeThemesSubtitleEdit}
          />

          <StaggerContainer className="mt-12 grid md:grid-cols-3 gap-6">
            {ueberUnsPage.threeThemes.themes.map((theme: any, index: number) => (
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
            <p className="text-title-2 text-white max-w-2xl" {...fullWidthQuoteEdit}>
              {ueberUnsPage.fullWidthQuote}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

// Compact ParkourONE Story Section for Homepage
export function ParkourONEStoryCompact() {
  const parkourStory = useContent("PARKOURONE_STORY", PARKOURONE_STORY);
  const ueberUnsPage = useContent("UEBER_UNS_STORY", UEBER_UNS_STORY);
  const compactTaglineEdit = useEditPath("UEBER_UNS_STORY.compactIntro.tagline");
  const compactHeadlineEdit = useEditPath("UEBER_UNS_STORY.compactIntro.headline");
  const compactDescEdit = useEditPath("UEBER_UNS_STORY.compactIntro.description");
  const compactCtaEdit = useEditPath("UEBER_UNS_STORY.compactIntro.ctaText");
  const compactStat1ValueEdit = useEditPath("UEBER_UNS_STORY.compactIntro.stat1.value");
  const compactStat1LabelEdit = useEditPath("UEBER_UNS_STORY.compactIntro.stat1.label");
  const compactStat2ValueEdit = useEditPath("UEBER_UNS_STORY.compactIntro.stat2.value");
  const compactStat2LabelEdit = useEditPath("UEBER_UNS_STORY.compactIntro.stat2.label");
  const compactQuoteTextEdit = useEditPath("PARKOURONE_STORY.quote.text");
  const compactQuoteAuthorEdit = useEditPath("PARKOURONE_STORY.quote.author");
  const compactQuoteRoleEdit = useEditPath("PARKOURONE_STORY.quote.role");
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
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2" {...compactTaglineEdit}>
            {ueberUnsPage.compactIntro.tagline}
          </p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]" {...compactHeadlineEdit}>
            {ueberUnsPage.compactIntro.headline}
          </h2>
          <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-3xl mx-auto" {...compactDescEdit}>
            {ueberUnsPage.compactIntro.description}
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
            <p className="text-display text-[var(--color-apple-blue)]" {...compactStat1ValueEdit}>{ueberUnsPage.compactIntro.stat1.value}</p>
            <p className="text-body text-[var(--color-apple-gray-600)]" {...compactStat1LabelEdit}>{ueberUnsPage.compactIntro.stat1.label}</p>
          </div>
          <div className="text-center">
            <p className="text-display text-[var(--color-apple-blue)]" {...compactStat2ValueEdit}>{ueberUnsPage.compactIntro.stat2.value}</p>
            <p className="text-body text-[var(--color-apple-gray-600)]" {...compactStat2LabelEdit}>{ueberUnsPage.compactIntro.stat2.label}</p>
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
          <Link href={ueberUnsPage.compactIntro.ctaHref} className="btn-secondary inline-flex" {...compactCtaEdit}>
            {ueberUnsPage.compactIntro.ctaText}
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
              <p className="text-body text-[var(--color-apple-dark)] leading-relaxed" {...compactQuoteTextEdit}>
                &ldquo;{parkourStory.quote.text}&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-apple-gray-200)]">
              <div className="w-10 h-10 rounded-full bg-[var(--color-apple-gray-300)] flex items-center justify-center">
                <Users className="h-5 w-5 text-[var(--color-apple-gray-500)]" />
              </div>
              <div>
                <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]" {...compactQuoteAuthorEdit}>
                  {parkourStory.quote.author}
                </p>
                <p className="text-caption text-[var(--color-apple-gray-600)]" {...compactQuoteRoleEdit}>
                  {parkourStory.quote.role}
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
  const parkourStory = useContent("PARKOURONE_STORY", PARKOURONE_STORY);
  return (
    <section className="section-spacing bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <SectionHeader
          title="20 Jahre Parkour-Expertise"
          subtitle="Unsere Geschichte"
        />

        <div className="mt-12 overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 min-w-max px-4">
            {parkourStory.history.milestones.map((milestone, index) => (
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
