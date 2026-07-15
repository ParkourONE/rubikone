"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { POSTEN_TEASER_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

interface PostenImage {
  src: string;
  alt?: string;
  portrait?: boolean;
  _id?: string;
}

interface PostenFeature {
  label: string;
  _id?: string;
}

export function PostenTeaserSection() {
  const posten = useContent("POSTEN_TEASER_CONTENT", POSTEN_TEASER_CONTENT) as {
    tagline: string;
    headline: string;
    description1: string;
    description2: string;
    features?: PostenFeature[];
    images: PostenImage[];
    ctaPrimary?: { label: string; href: string };
  };
  const taglineEdit = useEditPath("POSTEN_TEASER_CONTENT.tagline");
  const headlineEdit = useEditPath("POSTEN_TEASER_CONTENT.headline");
  const desc1Edit = useEditPath("POSTEN_TEASER_CONTENT.description1");
  const desc2Edit = useEditPath("POSTEN_TEASER_CONTENT.description2");
  const ctaEdit = useEditPath("POSTEN_TEASER_CONTENT.ctaPrimary");

  const ctaIsExternal = posten.ctaPrimary?.href.startsWith("http");

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        {/* Left-aligned headline + descriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="max-w-3xl"
        >
          {posten.tagline && (
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2" {...taglineEdit}>
              {posten.tagline}
            </p>
          )}
          {posten.headline && (
            <h2 className="text-title-1 text-[var(--color-apple-dark)]" {...headlineEdit}>
              {posten.headline}
            </h2>
          )}
          {posten.description1 && (
            <p
              className="mt-6 text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed"
              {...desc1Edit}
            >
              {posten.description1}
            </p>
          )}
          {posten.description2 && (
            <div
              className="mt-4 text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed [&_strong]:font-semibold [&_strong]:text-[var(--color-apple-dark)]"
              dangerouslySetInnerHTML={{ __html: posten.description2 }}
              {...desc2Edit}
            />
          )}
        </motion.div>

        {/* Feature cards - four in a row */}
        {posten.features && posten.features.length > 0 && (
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {posten.features.map((feature, index) => (
              <motion.div
                key={feature._id ?? index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...appleTransition, delay: 0.05 + index * 0.05 }}
                className="bg-white rounded-2xl px-5 py-4 shadow-apple flex items-center justify-center text-center"
                data-edit-path={`POSTEN_TEASER_CONTENT.features.${index}`}
              >
                <p className="text-body text-[var(--color-apple-gray-700)] whitespace-pre-line">
                  {feature.label}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Image row: landscape images fill, portrait image keeps full height */}
        {posten.images && posten.images.length > 0 && (
          <div className="mt-8 grid gap-4 lg:gap-6 lg:h-[440px] xl:h-[500px] lg:grid-cols-[1fr_1fr_auto]">
            {posten.images.map((img, index) => (
              <motion.div
                key={img._id ?? index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...appleTransition, delay: 0.1 + index * 0.05 }}
                className={
                  img.portrait
                    ? "relative aspect-[553/850] w-full max-w-sm mx-auto lg:mx-0 lg:w-auto lg:h-full rounded-2xl overflow-hidden shadow-apple"
                    : "relative aspect-[4/3] lg:aspect-auto lg:h-full rounded-2xl overflow-hidden shadow-apple"
                }
                data-edit-path={`POSTEN_TEASER_CONTENT.images.${index}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || `Posten ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        {posten.ctaPrimary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: 0.3 }}
            className="mt-12 flex justify-start"
          >
            <Link
              href={posten.ctaPrimary.href}
              className="btn-secondary inline-flex"
              {...(ctaIsExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              {...ctaEdit}
            >
              {posten.ctaPrimary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
