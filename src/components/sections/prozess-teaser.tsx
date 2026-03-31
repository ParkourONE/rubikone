"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { PROZESS_TEASER_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";

export function ProzessTeaser() {
  const prozessTeaser = useContent("PROZESS_TEASER_CONTENT", PROZESS_TEASER_CONTENT);
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
            <p className="text-body-sm text-white/60 mb-2">
              {prozessTeaser.tagline}
            </p>
            <h2 className="text-title-2 text-white">
              {prozessTeaser.headline}
            </h2>
            <p className="mt-4 text-body text-white/70 max-w-xl">
              {prozessTeaser.description1}
            </p>
            <p className="mt-2 text-body text-white/70 max-w-xl">
              {prozessTeaser.description2}
            </p>
          </div>
          <Link
            href={prozessTeaser.ctaHref}
            className="btn-primary bg-white text-[var(--color-apple-dark)] hover:bg-white/90 inline-flex self-start md:self-center"
          >
            {prozessTeaser.ctaText}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
