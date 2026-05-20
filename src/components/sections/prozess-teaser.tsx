"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { PROZESS_TEASER_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

interface CtaLink {
  label: string;
  href: string;
}

interface DownloadLink {
  label: string;
  href: string;
  _id?: string;
}

export function ProzessTeaser() {
  const prozessTeaser = useContent(
    "PROZESS_TEASER_CONTENT",
    PROZESS_TEASER_CONTENT
  ) as {
    tagline?: string;
    headline?: string;
    description1?: string;
    ctaMid?: CtaLink;
    description2?: string;
    ctaPrimary?: CtaLink;
    ctaSecondary?: CtaLink;
    downloads?: DownloadLink[];
  };
  const taglineEdit = useEditPath("PROZESS_TEASER_CONTENT.tagline");
  const headlineEdit = useEditPath("PROZESS_TEASER_CONTENT.headline");
  const desc1Edit = useEditPath("PROZESS_TEASER_CONTENT.description1");
  const desc2Edit = useEditPath("PROZESS_TEASER_CONTENT.description2");
  const ctaMidEdit = useEditPath("PROZESS_TEASER_CONTENT.ctaMid");
  const ctaPrimaryEdit = useEditPath("PROZESS_TEASER_CONTENT.ctaPrimary");
  const ctaSecondaryEdit = useEditPath("PROZESS_TEASER_CONTENT.ctaSecondary");

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-dark)]">
      <div className="container-content">
        {/* Centered tagline + headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="text-center max-w-3xl mx-auto"
        >
          {prozessTeaser.tagline && (
            <p
              className="text-body-sm text-white/60 mb-2"
              {...taglineEdit}
            >
              {prozessTeaser.tagline}
            </p>
          )}
          {prozessTeaser.headline && (
            <h2 className="text-title-1 text-white" {...headlineEdit}>
              {prozessTeaser.headline}
            </h2>
          )}
        </motion.div>

        {/* Two stacked content blocks */}
        <div className="max-w-2xl mx-auto mt-12 space-y-12">
          {/* Block 1: description1 + ctaMid */}
          {(prozessTeaser.description1 || prozessTeaser.ctaMid) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: 0.1 }}
              className="text-center"
            >
              {prozessTeaser.description1 && (
                <p
                  className="text-body-lg text-white/80 leading-relaxed"
                  {...desc1Edit}
                >
                  {prozessTeaser.description1}
                </p>
              )}
              {prozessTeaser.ctaMid && (
                <div className="mt-6">
                  <Link
                    href={prozessTeaser.ctaMid.href}
                    className="btn-primary bg-white text-[var(--color-apple-dark)] hover:bg-white/90 inline-flex"
                    {...ctaMidEdit}
                  >
                    {prozessTeaser.ctaMid.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* Block 2: description2 + ctaPrimary + ctaSecondary */}
          {(prozessTeaser.description2 ||
            prozessTeaser.ctaPrimary ||
            prozessTeaser.ctaSecondary) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: 0.2 }}
              className="text-center"
            >
              {prozessTeaser.description2 && (
                <p
                  className="text-body-lg text-white/80 leading-relaxed"
                  {...desc2Edit}
                >
                  {prozessTeaser.description2}
                </p>
              )}
              {(prozessTeaser.ctaPrimary || prozessTeaser.ctaSecondary) && (
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {prozessTeaser.ctaPrimary && (
                    <Link
                      href={prozessTeaser.ctaPrimary.href}
                      className="btn-primary bg-white text-[var(--color-apple-dark)] hover:bg-white/90"
                      {...ctaPrimaryEdit}
                    >
                      {prozessTeaser.ctaPrimary.label}
                    </Link>
                  )}
                  {prozessTeaser.ctaSecondary && (
                    <Link
                      href={prozessTeaser.ctaSecondary.href}
                      className="btn-secondary text-white hover:text-white/80 inline-flex"
                      {...ctaSecondaryEdit}
                    >
                      {prozessTeaser.ctaSecondary.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Downloads */}
          {prozessTeaser.downloads && prozessTeaser.downloads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: 0.3 }}
              className="pt-8 border-t border-white/10"
            >
              <div className="flex flex-col items-center gap-3">
                {prozessTeaser.downloads.map((dl, index) => (
                  <a
                    key={dl._id ?? index}
                    href={dl.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-body-sm text-white/70 hover:text-white transition-colors"
                    data-edit-path={`PROZESS_TEASER_CONTENT.downloads.${index}`}
                  >
                    <Download className="h-4 w-4" />
                    {dl.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
