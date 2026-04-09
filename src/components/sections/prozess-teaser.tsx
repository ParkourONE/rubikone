"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { PROZESS_TEASER_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

export function ProzessTeaser() {
  const prozessTeaser = useContent("PROZESS_TEASER_CONTENT", PROZESS_TEASER_CONTENT);
  const taglineEdit = useEditPath("PROZESS_TEASER_CONTENT.tagline");
  const headlineEdit = useEditPath("PROZESS_TEASER_CONTENT.headline");
  const desc1Edit = useEditPath("PROZESS_TEASER_CONTENT.description1");
  const desc2Edit = useEditPath("PROZESS_TEASER_CONTENT.description2");
  const ctaEdit = useEditPath("PROZESS_TEASER_CONTENT.ctaText");
  return (
    <section className="py-16 lg:py-20 bg-[var(--color-apple-dark)]">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            {prozessTeaser.tagline && (
              <p className="text-body-sm text-white/60 mb-2" {...taglineEdit}>
                {prozessTeaser.tagline}
              </p>
            )}
            {prozessTeaser.headline && (
              <h2 className="text-title-2 text-white" {...headlineEdit}>
                {prozessTeaser.headline}
              </h2>
            )}
            {prozessTeaser.description1 && (
              <p className="mt-4 text-body text-white/70 max-w-xl" {...desc1Edit}>
                {prozessTeaser.description1}
              </p>
            )}
            {prozessTeaser.description2 && (
              <p className="mt-2 text-body text-white/70 max-w-xl" {...desc2Edit}>
                {prozessTeaser.description2}
              </p>
            )}
          </div>
          {prozessTeaser.ctaText && (
            <Link
              href={prozessTeaser.ctaHref ?? "#"}
              className="btn-primary bg-white text-[var(--color-apple-dark)] hover:bg-white/90 inline-flex self-start md:self-center"
              {...ctaEdit}
            >
              {prozessTeaser.ctaText}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
