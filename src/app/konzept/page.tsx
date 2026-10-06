"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { appleTransition } from "@/lib/animations";
import { useScrollLock } from "@/hooks/useScrollLock";
import { ComparisonSection } from "@/components/sections/comparison-table";
import { PerspektiveSection } from "@/components/sections/perspektive-section";
import { MehrwertSection } from "@/components/sections/mehrwert-section";
import { EditableSection } from "@/components/admin/editable-section";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";
import {
  KONZEPT_HERO,
  KONZEPT_POSTEN_SLIDER,
  KONZEPT_LERNDIMENSIONEN,
  KONZEPT_CTA,
} from "@/lib/constants";

export default function KonzeptPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [postenActiveIndex, setPostenActiveIndex] = useState(0);

  const hero = useContent("KONZEPT_HERO", KONZEPT_HERO) as any;
  const postenSlider = useContent("KONZEPT_POSTEN_SLIDER", KONZEPT_POSTEN_SLIDER) as any;
  const lerndimensionen = useContent("KONZEPT_LERNDIMENSIONEN", KONZEPT_LERNDIMENSIONEN) as any;
  const cta = useContent("KONZEPT_CTA", KONZEPT_CTA) as any;

  const heroTaglineEdit = useEditPath("KONZEPT_HERO.tagline");
  const heroHeadlineEdit = useEditPath("KONZEPT_HERO.headline");
  const heroQuestionsEdit = useEditPath("KONZEPT_HERO.questions");
  const heroDescEdit = useEditPath("KONZEPT_HERO.description");
  const psTaglineEdit = useEditPath("KONZEPT_POSTEN_SLIDER.tagline");
  const psHeadlineEdit = useEditPath("KONZEPT_POSTEN_SLIDER.headline");
  const psDescEdit = useEditPath("KONZEPT_POSTEN_SLIDER.description");
  const ldTaglineEdit = useEditPath("KONZEPT_LERNDIMENSIONEN.tagline");
  const ldHeadlineEdit = useEditPath("KONZEPT_LERNDIMENSIONEN.headline");
  const ldDescEdit = useEditPath("KONZEPT_LERNDIMENSIONEN.description");

  // Lerndimensionen from content with icon paths
  const LERNDIMENSIONEN = (lerndimensionen.dimensions as any[]).map((d: any) => ({
    ...d,
    icon: `/images/lerndimensionen/${d.id}.jpg`,
  }));

  const examples = (lerndimensionen.examples as Array<{ src: string; alt?: string; _id?: string }>) ?? [];

  const postenSlides = (postenSlider.slides as any[]) ?? [];
  const postenSlide = postenSlides[postenActiveIndex];

  const activeDimension = LERNDIMENSIONEN.find((d: any) => d.id === activeModal);

  // Lock body scroll when modal is open
  useScrollLock(activeModal !== null);

  return (
    <>
      {/* Hero - Was wäre wenn - Split Layout */}
      <EditableSection contentKey="KONZEPT_HERO" label="Hero">
      {/* Mobile */}
      <section className="lg:hidden relative pt-24 pb-12 bg-white">
        <div className="px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={appleTransition}
            className="max-w-xl"
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-4" {...heroTaglineEdit}>
              {hero.tagline}
            </p>
            <h1 className="text-hero text-[var(--color-apple-dark)] leading-tight" {...heroHeadlineEdit}>
              {hero.headline}
            </h1>
            <p className="mt-6 text-title-3 text-[var(--color-apple-dark)] font-normal leading-relaxed" {...heroQuestionsEdit}>
              {hero.questions.split("\n").map((line: string, i: number) => (
                <span key={i}>{line}{i < hero.questions.split("\n").length - 1 && <br />}</span>
              ))}
            </p>
            <p className="mt-6 text-body-lg text-[var(--color-apple-gray-600)] max-w-xl" {...heroDescEdit}>
              {hero.description}
            </p>
          </motion.div>

          {/* Image below text on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...appleTransition, delay: 0.3 }}
            className="mt-10 relative h-[40vh] rounded-2xl overflow-hidden shadow-apple-xl"
          >
            <Image
              src={hero.heroImage}
              alt="Generationen trainieren gemeinsam im urbanen Raum"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Desktop: Split Layout */}
      <section className="hidden lg:block relative min-h-[calc(100vh-80px)] bg-white">
        <div className="grid grid-cols-2 min-h-[calc(100vh-80px)]">
          {/* Left: Content */}
          <div className="flex items-center px-12 xl:px-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={appleTransition}
              className="max-w-xl"
            >
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-4">
                {hero.tagline}
              </p>
              <h1 className="text-display text-[var(--color-apple-dark)] leading-tight" {...heroHeadlineEdit}>
                {hero.headline}
              </h1>
              <p className="mt-6 text-title-3 text-[var(--color-apple-dark)] font-normal leading-relaxed">
                {hero.questions.split("\n").map((line: string, i: number) => (
                  <span key={i}>{line}{i < hero.questions.split("\n").length - 1 && <br />}</span>
                ))}
              </p>
              <p className="mt-8 text-body-lg text-[var(--color-apple-gray-600)] max-w-xl" {...heroDescEdit}>
                {hero.description}
              </p>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-12"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown className="h-6 w-6 text-[var(--color-apple-gray-400)]" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Image - With padding and rounded corners */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...appleTransition, delay: 0.3 }}
            className="flex items-center pt-24 px-8 pb-8"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src={hero.heroImage}
                alt="Generationen trainieren gemeinsam im urbanen Raum"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>

      </section>
      </EditableSection>

      {/* 2. Perspektive (Parkour-Brille) */}
      <EditableSection contentKey="KONZEPT_PERSPEKTIVE" label="Perspektive">
        <PerspektiveSection />
      </EditableSection>

      {/* 3. Die 5 Lerndimensionen mit Modals + 3b. Beispielbilder (eigene Section) */}
      <EditableSection contentKey="KONZEPT_LERNDIMENSIONEN" label="Lerndimensionen">
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
            className="mb-12"
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2" {...ldTaglineEdit}>
              {lerndimensionen.tagline}
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)] max-w-2xl" {...ldHeadlineEdit}>
              {lerndimensionen.headline}
            </h2>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl" {...ldDescEdit}>
              {lerndimensionen.description}
            </p>
          </motion.div>

          {/* 5 Dimensionen - Clickable Cards (Höhe ~10% reduziert) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {LERNDIMENSIONEN.map((dim: any, index: number) => (
              <motion.div
                key={dim.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...appleTransition, delay: index * 0.1 }}
                onClick={() => setActiveModal(dim.id)}
                className="bg-white rounded-2xl px-7 py-6 text-center cursor-pointer shadow-apple hover:shadow-apple-lg transition-all group"
              >
                <div className="w-14 h-14 mx-auto mb-4 relative group-hover:scale-110 transition-transform">
                  <Image
                    src={dim.icon}
                    alt={dim.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-headline font-semibold text-[var(--color-apple-dark)] mb-2">
                  {dim.title}
                </h3>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-3">
                  {dim.shortDesc}
                </p>
                <span className="inline-flex items-center gap-1 text-body-sm text-[var(--color-apple-blue)] font-medium">
                  Mehr
                  <ArrowRight className="h-4 w-4" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3b. Beispielbilder: gleiche Lerndimensionen, andere Perspektive */}
      <section className="pb-16 lg:pb-24 bg-white">
        <div className="container-content">
          {lerndimensionen.examplesCaption && (
            <p
              className="text-body-lg text-[var(--color-apple-gray-600)] max-w-3xl mb-10"
              data-edit-path="KONZEPT_LERNDIMENSIONEN.examplesCaption"
            >
              {lerndimensionen.examplesCaption.split("\n").map((line: string, i: number, arr: string[]) => (
                <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>
          )}

          {examples.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
              {examples.map((ex, i: number) => (
                <motion.div
                  key={ex._id ?? i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...appleTransition, delay: 0.1 + i * 0.05 }}
                  className="relative aspect-[800/1062] rounded-2xl overflow-hidden bg-[var(--color-apple-gray-100)]"
                  data-edit-path={`KONZEPT_LERNDIMENSIONEN.examples.${i}`}
                >
                  <Image
                    src={ex.src}
                    alt={ex.alt || `Lerndimension Beispiel ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
      </EditableSection>

      {/* 4. Beispiel-Posten - Perspektiven-Slider */}
      <EditableSection contentKey="KONZEPT_POSTEN_SLIDER" label="Posten-Slider">
      <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
            className="max-w-3xl mb-12"
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2" {...psTaglineEdit}>
              {postenSlider.tagline}
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]" {...psHeadlineEdit}>
              {postenSlider.headline}
            </h2>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl" {...psDescEdit}>
              {postenSlider.description}
            </p>
          </motion.div>

          {postenSlide && (
            <div className="relative">
              {/* Two-column: portrait image left, text right */}
              <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-10 lg:gap-16 items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`posten-img-${postenActiveIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35 }}
                    className="relative aspect-[516/800] max-w-[400px] mx-auto lg:mx-0 w-full rounded-2xl overflow-hidden shadow-apple bg-white"
                    data-edit-path={`KONZEPT_POSTEN_SLIDER.slides.${postenActiveIndex}.image`}
                  >
                    <Image
                      src={postenSlide.image}
                      alt={postenSlide.imageAlt || `Perspektive ${postenActiveIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 400px"
                    />
                  </motion.div>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`posten-txt-${postenActiveIndex}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed [&_p+ul]:mt-2 [&_strong]:font-semibold [&_strong]:text-[var(--color-apple-dark)]"
                    data-edit-path={`KONZEPT_POSTEN_SLIDER.slides.${postenActiveIndex}.body`}
                    dangerouslySetInnerHTML={{ __html: postenSlide.body }}
                  />
                </AnimatePresence>
              </div>

              {/* Navigation: Begriffe statt Punkte */}
              {postenSlides.length > 1 && (
                <div className="mt-10 flex items-center justify-center gap-6">
                  <button
                    onClick={() =>
                      setPostenActiveIndex((i) => (i - 1 + postenSlides.length) % postenSlides.length)
                    }
                    aria-label="Vorherige Perspektive"
                    className="w-11 h-11 flex-shrink-0 rounded-full bg-white shadow-apple flex items-center justify-center hover:bg-[var(--color-apple-gray-200)] transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-[var(--color-apple-dark)]" />
                  </button>

                  <div className="flex items-center gap-4 lg:gap-6 flex-wrap justify-center">
                    {postenSlides.map((slide: any, i: number) => (
                      <button
                        key={slide._id ?? i}
                        onClick={() => setPostenActiveIndex(i)}
                        className={`text-body font-medium transition-opacity ${
                          slide.label === "Neutral" ? "text-[var(--color-apple-blue)]" : "text-accent-orange"
                        } ${
                          i === postenActiveIndex
                            ? "opacity-100 underline underline-offset-4"
                            : "opacity-50 hover:opacity-80"
                        }`}
                      >
                        {slide.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPostenActiveIndex((i) => (i + 1) % postenSlides.length)}
                    aria-label="Nächste Perspektive"
                    className="w-11 h-11 flex-shrink-0 rounded-full bg-white shadow-apple flex items-center justify-center hover:bg-[var(--color-apple-gray-200)] transition-colors"
                  >
                    <ArrowRight className="h-5 w-5 text-[var(--color-apple-dark)]" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      </EditableSection>

      {/* 5. Mehrwert (NEW) */}
      <EditableSection contentKey="KONZEPT_MEHRWERT" label="Mehrwert">
        <MehrwertSection />
      </EditableSection>

      {/* 6. Vergleichstabelle */}
      <EditableSection contentKey="COMPARISON_TABLE" label="Vergleichstabelle">
        <ComparisonSection />
      </EditableSection>

      {/* 7. CTA - reines Hintergrundfoto */}
      <EditableSection contentKey="KONZEPT_CTA" label="Call-to-Action">
        <section
          className="relative h-[50vh] md:h-[60vh] overflow-hidden"
          data-edit-path="KONZEPT_CTA.backgroundImage"
        >
          <Image
            src={cta.backgroundImage}
            alt={cta.imageAlt || "RubikONE"}
            fill
            className="object-cover"
          />
        </section>
      </EditableSection>

      {/* Modal für Lerndimensionen */}
      <AnimatePresence>
        {activeModal && activeDimension && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />

            {/* Full Screen Scroll Container */}
            <div
              className="fixed inset-0 z-50 overflow-y-auto"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="min-h-full flex flex-col items-center py-[30px] px-[10px]">
                <div className="flex-1" />

                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={appleTransition}
                  className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[630px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setActiveModal(null)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-[var(--color-apple-gray-100)] rounded-full flex items-center justify-center hover:bg-[var(--color-apple-gray-200)] transition-colors"
                  >
                    <X className="h-4 w-4 text-[var(--color-apple-gray-600)]" />
                  </button>

                  {/* Content */}
                  <div className="p-8">
                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 relative">
                        <Image
                          src={activeDimension.icon}
                          alt={activeDimension.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="text-body-sm text-[var(--color-apple-gray-600)]">Lerndimension</p>
                        <h3 className="text-title-2 text-[var(--color-apple-dark)]">
                          {activeDimension.modalTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="text-body text-[var(--color-apple-gray-700)] whitespace-pre-line leading-relaxed">
                      {activeDimension.modalContent}
                    </div>
                  </div>
                </motion.div>

                <div className="flex-1" />
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
