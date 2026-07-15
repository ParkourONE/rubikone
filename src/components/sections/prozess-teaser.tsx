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

interface ProzessBlock {
  description?: string;
  cta?: CtaLink;
  _id?: string;
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
    headline?: string;
    blocks?: ProzessBlock[];
    downloads?: DownloadLink[];
  };
  const headlineEdit = useEditPath("PROZESS_TEASER_CONTENT.headline");

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-[var(--color-apple-blue)] via-[var(--color-apple-blue)] to-[var(--color-apple-blue)]/80">
      <div className="container-content">
        {/* Centered headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="text-center max-w-3xl mx-auto"
        >
          {prozessTeaser.headline && (
            <h2 className="text-title-1 text-white" {...headlineEdit}>
              {prozessTeaser.headline}
            </h2>
          )}
        </motion.div>

        {/* Stacked content blocks: description + CTA */}
        <div className="max-w-2xl mx-auto mt-12 space-y-12">
          {(prozessTeaser.blocks ?? []).map((block, index) => (
            <motion.div
              key={block._id ?? index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: 0.1 + index * 0.1 }}
              className="text-center"
              data-edit-path={`PROZESS_TEASER_CONTENT.blocks.${index}`}
            >
              {block.description && (
                <p className="text-body-lg text-white/80 leading-relaxed">
                  {block.description}
                </p>
              )}
              {block.cta && (
                <div className="mt-6">
                  <Link
                    href={block.cta.href}
                    className="btn-primary bg-white text-[var(--color-apple-blue)] hover:bg-white/90 inline-flex"
                  >
                    {block.cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </motion.div>
          ))}

          {/* Downloads */}
          {prozessTeaser.downloads && prozessTeaser.downloads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: 0.3 }}
              className="pt-8 border-t border-white/20"
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
