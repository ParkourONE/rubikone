"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { VorherNachherSlider } from "@/components/shared/vorher-nachher-slider";
import { VORHER_NACHHER_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

export function VorherNachherTeaser() {
  const vnContent = useContent("VORHER_NACHHER_CONTENT", VORHER_NACHHER_CONTENT);
  const taglineEdit = useEditPath("VORHER_NACHHER_CONTENT.tagline");
  const headlineEdit = useEditPath("VORHER_NACHHER_CONTENT.headline");
  const descEdit = useEditPath("VORHER_NACHHER_CONTENT.description");
  const ctaEdit = useEditPath("VORHER_NACHHER_CONTENT.ctaText");
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Interaktiver Slider */}
          <VorherNachherSlider
            vorherSrc={vnContent.vorherImage}
            nachherSrc={vnContent.nachherImage}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: 0.2 }}
          >
            {vnContent.tagline && (
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2" {...taglineEdit}>
                {vnContent.tagline}
              </p>
            )}
            {vnContent.headline && (
              <h2 className="text-title-1 text-[var(--color-apple-dark)]" {...headlineEdit}>
                {vnContent.headline}
              </h2>
            )}
            {vnContent.description && (
              <p className="mt-6 text-body-lg text-[var(--color-apple-gray-700)]" {...descEdit}>
                {vnContent.description}
              </p>
            )}
            {vnContent.ctaText && (
              <div className="mt-8">
                <Link href={vnContent.ctaHref ?? "#"} className="btn-secondary inline-flex" {...ctaEdit}>
                  {vnContent.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
