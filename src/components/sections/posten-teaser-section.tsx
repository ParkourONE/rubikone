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
  _id?: string;
}

export function PostenTeaserSection() {
  const posten = useContent("POSTEN_TEASER_CONTENT", POSTEN_TEASER_CONTENT) as {
    tagline: string;
    headline: string;
    description1: string;
    description2: string;
    images: PostenImage[];
    ctaPrimary?: { label: string; href: string };
  };
  const taglineEdit = useEditPath("POSTEN_TEASER_CONTENT.tagline");
  const headlineEdit = useEditPath("POSTEN_TEASER_CONTENT.headline");
  const desc1Edit = useEditPath("POSTEN_TEASER_CONTENT.description1");
  const desc2Edit = useEditPath("POSTEN_TEASER_CONTENT.description2");
  const ctaEdit = useEditPath("POSTEN_TEASER_CONTENT.ctaPrimary");

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        {/* Centered headline + descriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="max-w-3xl mx-auto text-center"
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
              className="mt-6 text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed [&_p+ul]:mt-2 [&_strong]:font-semibold [&_strong]:text-[var(--color-apple-dark)]"
              dangerouslySetInnerHTML={{ __html: posten.description2 }}
              {...desc2Edit}
            />
          )}
        </motion.div>

        {/* Three-column image grid */}
        {posten.images && posten.images.length > 0 && (
          <div className="mt-12 grid md:grid-cols-3 gap-4 lg:gap-6">
            {posten.images.map((img, index) => (
              <motion.div
                key={img._id ?? index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...appleTransition, delay: 0.1 + index * 0.05 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-apple"
                data-edit-path={`POSTEN_TEASER_CONTENT.images.${index}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt || `Posten ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
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
            className="mt-12 flex justify-center"
          >
            <Link
              href={posten.ctaPrimary.href}
              className="btn-secondary inline-flex"
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
