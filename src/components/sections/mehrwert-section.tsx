"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
          <>
            {/* Two-column: image left, text right */}
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${activeIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-apple"
                  data-edit-path={`KONZEPT_MEHRWERT.slides.${activeIndex}.image`}
                >
                  <Image
                    src={active.image}
                    alt={active.imageAlt || `Slide ${activeIndex + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`txt-${activeIndex}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed [&_p+p]:mt-4 [&_strong]:font-semibold [&_strong]:text-[var(--color-apple-dark)]"
                  data-edit-path={`KONZEPT_MEHRWERT.slides.${activeIndex}.body`}
                  dangerouslySetInnerHTML={{ __html: active.body }}
                />
              </AnimatePresence>
            </div>

            {/* Dots navigation */}
            {slides.length > 1 && (
              <div className="mt-10 flex justify-center gap-3">
                {slides.map((slide, i) => (
                  <button
                    key={slide._id ?? i}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Slide ${i + 1} anzeigen`}
                    className={`h-3 w-3 rounded-full transition-colors ${
                      i === activeIndex
                        ? "bg-[var(--color-apple-blue)]"
                        : "bg-[var(--color-apple-gray-300)] hover:bg-[var(--color-apple-gray-400)]"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
