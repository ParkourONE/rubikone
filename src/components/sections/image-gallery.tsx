"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { appleTransition } from "@/lib/animations";
import { GALLERY_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";

export function ImageGallery() {
  const galleryContent = useContent("GALLERY_CONTENT", GALLERY_CONTENT);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 420;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)] overflow-hidden">
      {/* Header - in container */}
      <div className="container-content mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
        >
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
            {galleryContent.tagline}
          </p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">
            {galleryContent.headline}
          </h2>
        </motion.div>
      </div>

      {/* Slider - outside container, full width with spacers */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Left spacer */}
        <div className="slider-spacer" />

        {galleryContent.images.map((item: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: index * 0.05 }}
            className="flex-shrink-0 w-[340px] lg:w-[400px]"
          >
              <div className="bg-white rounded-2xl overflow-hidden shadow-apple h-full">
                {/* Large Image - No overlay text */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Content below image - Title bold before text */}
                <div className="p-5">
                  <p className="text-body text-[var(--color-apple-gray-700)] leading-relaxed">
                    <span className="font-semibold text-[var(--color-apple-dark)]">{item.title}.</span>{" "}
                    {item.comment}
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
