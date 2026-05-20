"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { KONZEPT_MEHRWERT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

interface MehrwertSlide {
  image: string;
  imageAlt?: string;
  body: string;
  _id?: string;
}

export function MehrwertSection() {
  const content = useContent("KONZEPT_MEHRWERT", KONZEPT_MEHRWERT) as {
    tagline: string;
    headline: string;
    description: string;
    slides: MehrwertSlide[];
  };
  const taglineEdit = useEditPath("KONZEPT_MEHRWERT.tagline");
  const headlineEdit = useEditPath("KONZEPT_MEHRWERT.headline");
  const descEdit = useEditPath("KONZEPT_MEHRWERT.description");

  const [activeIndex, setActiveIndex] = useState(0);
  const slides = content.slides ?? [];
  const active = slides[activeIndex];
  const total = slides.length;

  const goPrev = () => setActiveIndex((i) => (i - 1 + total) % total);
  const goNext = () => setActiveIndex((i) => (i + 1) % total);

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        {/* Tagline + Headline + Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="max-w-3xl mb-12"
        >
          {content.tagline && (
            <p
              className="text-body-sm text-[var(--color-apple-gray-600)] mb-2"
              {...taglineEdit}
            >
              {content.tagline}
            </p>
          )}
          {content.headline && (
            <h2
              className="text-title-1 text-[var(--color-apple-dark)]"
              {...headlineEdit}
            >
              {content.headline}
            </h2>
          )}
          {content.description && (
            <p
              className="mt-6 text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed"
              {...descEdit}
            >
              {content.description}
            </p>
          )}
        </motion.div>

        {active && (
          <div className="relative">
            {/* Two-column: portrait image left, text right */}
            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-10 lg:gap-16 items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${activeIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35 }}
                  className="relative aspect-[3/4] max-w-[460px] mx-auto lg:mx-0 w-full rounded-2xl overflow-hidden shadow-apple bg-white"
                  data-edit-path={`KONZEPT_MEHRWERT.slides.${activeIndex}.image`}
                >
                  <Image
                    src={active.image}
                    alt={active.imageAlt || `Slide ${activeIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 460px"
                  />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`txt-${activeIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed [&_p+ul]:mt-2 [&_strong]:font-semibold [&_strong]:text-[var(--color-apple-dark)]"
                  data-edit-path={`KONZEPT_MEHRWERT.slides.${activeIndex}.body`}
                  dangerouslySetInnerHTML={{ __html: active.body }}
                />
              </AnimatePresence>
            </div>

            {/* Navigation: arrows + dots + counter */}
            {total > 1 && (
              <div className="mt-10 flex items-center justify-center gap-6">
                <button
                  onClick={goPrev}
                  aria-label="Vorheriger Slide"
                  className="w-11 h-11 rounded-full bg-white shadow-apple flex items-center justify-center hover:bg-[var(--color-apple-gray-200)] transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-[var(--color-apple-dark)]" />
                </button>

                <div className="flex items-center gap-3">
                  {slides.map((slide, i) => (
                    <button
                      key={slide._id ?? i}
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Slide ${i + 1} anzeigen`}
                      className={`rounded-full transition-all ${
                        i === activeIndex
                          ? "h-3 w-8 bg-[var(--color-apple-blue)]"
                          : "h-3 w-3 bg-[var(--color-apple-gray-400)] hover:bg-[var(--color-apple-gray-500)]"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={goNext}
                  aria-label="Nächster Slide"
                  className="w-11 h-11 rounded-full bg-white shadow-apple flex items-center justify-center hover:bg-[var(--color-apple-gray-200)] transition-colors"
                >
                  <ArrowRight className="h-5 w-5 text-[var(--color-apple-dark)]" />
                </button>
              </div>
            )}

            {/* Slide counter */}
            {total > 1 && (
              <p className="mt-4 text-center text-body-sm text-[var(--color-apple-gray-500)]">
                {activeIndex + 1} / {total}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
