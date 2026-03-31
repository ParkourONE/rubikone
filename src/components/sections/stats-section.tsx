"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { appleTransition } from "@/lib/animations";
import { STATS_CONTENT } from "@/lib/constants";

export function StatsSection() {
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
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">{STATS_CONTENT.tagline}</p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">
            {STATS_CONTENT.headline}
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

        {STATS_CONTENT.slides.map((slide: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: index * 0.1 }}
            className="flex-shrink-0 w-[320px]"
          >
            <div className="bg-[var(--color-apple-gray-100)] rounded-2xl overflow-hidden h-full">
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-display text-white font-bold">
                    {slide.value}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="p-6">
                <h3 className="text-headline text-[var(--color-apple-dark)] mb-2">
                  {slide.title}
                </h3>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] leading-relaxed">
                  {slide.description}
                </p>
              </div>
            </div>
          </motion.div>
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
