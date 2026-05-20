"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { PRINZIP_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

export function PrinzipSection() {
  const prinzip = useContent("PRINZIP_CONTENT", PRINZIP_CONTENT) as {
    tagline: string;
    headline: string;
    description1: string;
    description2: string;
    image: string;
    imageAlt?: string;
    ctaPrimary?: { label: string; href: string };
  };
  const taglineEdit = useEditPath("PRINZIP_CONTENT.tagline");
  const headlineEdit = useEditPath("PRINZIP_CONTENT.headline");
  const desc1Edit = useEditPath("PRINZIP_CONTENT.description1");
  const desc2Edit = useEditPath("PRINZIP_CONTENT.description2");
  const imageEdit = useEditPath("PRINZIP_CONTENT.image");
  const ctaEdit = useEditPath("PRINZIP_CONTENT.ctaPrimary");

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        {/* Full-width tagline + headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="mb-12 max-w-3xl"
        >
          {prinzip.tagline && (
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2" {...taglineEdit}>
              {prinzip.tagline}
            </p>
          )}
          {prinzip.headline && (
            <h2 className="text-title-1 text-[var(--color-apple-dark)]" {...headlineEdit}>
              {prinzip.headline}
            </h2>
          )}
        </motion.div>

        {/* Two-column: text left, image right */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: 0.1 }}
          >
            <p
              className="text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: prinzip.description1 }}
              {...desc1Edit}
            />
            <p
              className="mt-6 text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed"
              {...desc2Edit}
            >
              {prinzip.description2}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: 0.2 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-apple"
            {...imageEdit}
          >
            <Image
              src={prinzip.image}
              alt={prinzip.imageAlt || prinzip.headline}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </div>

        {/* CTA at the bottom */}
        {prinzip.ctaPrimary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: 0.3 }}
            className="mt-12 flex justify-center"
          >
            <Link
              href={prinzip.ctaPrimary.href}
              className="btn-secondary inline-flex"
              {...ctaEdit}
            >
              {prinzip.ctaPrimary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
