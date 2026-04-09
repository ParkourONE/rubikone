"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { appleTransition } from "@/lib/animations";
import { STATS_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

interface StatsSlide {
  value?: string;
  title?: string;
  description?: string;
  image?: string;
}

function StatsSlideCard({ slide, index }: { slide: StatsSlide; index: number }) {
  const path = `STATS_CONTENT.slides[${index}]`;
  const itemEdit = useEditPath(path);
  const valueEdit = useEditPath(`${path}.value`);
  const titleEdit = useEditPath(`${path}.title`);
  const descEdit = useEditPath(`${path}.description`);
  const imgEdit = useEditPath(`${path}.image`);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...appleTransition, delay: index * 0.1 }}
      className="flex-shrink-0 w-[320px]"
      {...itemEdit}
    >
      <div className="bg-[var(--color-apple-gray-100)] rounded-2xl overflow-hidden h-full">
        {slide.image && (
          <div className="relative aspect-[4/3]">
            <Image
              src={slide.image}
              alt={slide.title ?? ""}
              fill
              className="object-cover"
              {...imgEdit}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {slide.value && (
              <div className="absolute bottom-4 left-4">
                <span className="text-display text-white font-bold" {...valueEdit}>
                  {slide.value}
                </span>
              </div>
            )}
          </div>
        )}
        <div className="p-6">
          {slide.title && (
            <h3 className="text-headline text-[var(--color-apple-dark)] mb-2" {...titleEdit}>
              {slide.title}
            </h3>
          )}
          {slide.description && (
            <p className="text-body-sm text-[var(--color-apple-gray-600)] leading-relaxed" {...descEdit}>
              {slide.description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function StatsSection() {
  const statsContent = useContent("STATS_CONTENT", STATS_CONTENT);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };


  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      {/* Header - in container, left aligned */}
      <div className="container-content mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
        >
          <p
            className="text-body-sm text-[var(--color-apple-gray-600)] mb-2"
            {...useEditPath("STATS_CONTENT.tagline")}
          >
            {statsContent.tagline}
          </p>
          <h2
            className="text-title-1 text-[var(--color-apple-dark)]"
            {...useEditPath("STATS_CONTENT.headline")}
          >
            {statsContent.headline}
          </h2>
        </motion.div>
      </div>

      {/* Slider - OUTSIDE container, full width */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Left spacer - aligns first card with container start */}
        <div className="slider-spacer" />

        {statsContent.slides.map((slide: any, index: number) => (
          <StatsSlideCard key={index} slide={slide} index={index} />
        ))}

        {/* Right spacer */}
        <div className="slider-spacer" />
      </div>

      {/* Navigation Arrows - in container, right aligned */}
      <div className="container-content mt-6">
        <div className="flex justify-end gap-4">
          <button
            onClick={() => scroll("left")}
            className="hover:text-[var(--color-apple-blue)] transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hover:text-[var(--color-apple-blue)] transition-colors"
          >
            <ArrowRight className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
          </button>
        </div>
      </div>
    </section>
  );
}
