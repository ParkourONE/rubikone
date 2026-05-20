"use client";

import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { KONZEPT_PERSPEKTIVE } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";
import { VorherNachherSlider } from "@/components/shared/vorher-nachher-slider";

export function PerspektiveSection() {
  const content = useContent("KONZEPT_PERSPEKTIVE", KONZEPT_PERSPEKTIVE) as {
    tagline: string;
    headline: string;
    description: string;
    imageDefault: string;
    imageHover: string;
    imageAlt?: string;
  };
  const taglineEdit = useEditPath("KONZEPT_PERSPEKTIVE.tagline");
  const headlineEdit = useEditPath("KONZEPT_PERSPEKTIVE.headline");
  const descEdit = useEditPath("KONZEPT_PERSPEKTIVE.description");

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        {/* Tagline + Headline + Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="max-w-3xl mb-8"
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

        {/* Discovery hint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...appleTransition, delay: 0.1 }}
          className="mb-4 flex items-center gap-2 text-body-sm text-[var(--color-apple-gray-600)]"
        >
          <Eye className="h-4 w-4 text-[var(--color-apple-blue)]" />
          <span>
            Ziehe den Slider, um die <strong>Parkour-Brille</strong> aufzusetzen
          </span>
        </motion.div>

        {/* Drag slider revealing parkour-brille */}
        <VorherNachherSlider
          vorherSrc={content.imageDefault}
          nachherSrc={content.imageHover}
          vorherAlt={`${content.imageAlt || content.headline} – ohne Parkour-Brille`}
          nachherAlt={`${content.imageAlt || content.headline} – mit Parkour-Brille`}
          vorherLabel="Normaler Blick"
          nachherLabel="Parkour-Brille"
          aspectClass="aspect-[16/9] lg:aspect-[21/9]"
        />
      </div>
    </section>
  );
}
