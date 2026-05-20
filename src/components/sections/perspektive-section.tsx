"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { appleTransition } from "@/lib/animations";
import { KONZEPT_PERSPEKTIVE } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

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
  const imageDefaultEdit = useEditPath("KONZEPT_PERSPEKTIVE.imageDefault");
  const imageHoverEdit = useEditPath("KONZEPT_PERSPEKTIVE.imageHover");

  return (
    <section className="py-16 lg:py-24 bg-white">
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

        {/* Hover image-swap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...appleTransition, delay: 0.1 }}
          className="relative aspect-[16/9] lg:aspect-[21/9] rounded-2xl overflow-hidden shadow-apple group"
        >
          <Image
            src={content.imageDefault}
            alt={content.imageAlt || content.headline}
            fill
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
            sizes="(max-width: 1024px) 100vw, 980px"
            {...imageDefaultEdit}
          />
          <Image
            src={content.imageHover}
            alt={content.imageAlt || content.headline}
            fill
            className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            sizes="(max-width: 1024px) 100vw, 980px"
            {...imageHoverEdit}
          />
        </motion.div>
      </div>
    </section>
  );
}
