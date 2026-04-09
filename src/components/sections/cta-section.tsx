"use client";

import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { CTA_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { FadeUp } from "@/components/shared/fade-up";
import { useEditPath } from "@/components/cms/primitives";

interface CTASectionProps {
  variant?: "default" | "dark";
}

export function CTASection({ variant = "default" }: CTASectionProps) {
  const ctaContent = useContent("CTA_CONTENT", CTA_CONTENT);
  const isDark = variant === "dark";

  return (
    <section className={`section-spacing ${isDark ? "bg-[var(--color-apple-dark)]" : "bg-[var(--color-apple-gray-100)]"}`}>
      <div className="container-content">
        <FadeUp>
          <div className="text-center max-w-3xl mx-auto">
            <h2
              className={`text-title-1 ${isDark ? "text-white" : "text-[var(--color-apple-dark)]"}`}
              {...useEditPath("CTA_CONTENT.headline")}
            >
              {ctaContent.headline}
            </h2>
            <p
              className={`mt-4 text-body-lg ${isDark ? "text-white/70" : "text-[var(--color-apple-gray-600)]"}`}
              {...useEditPath("CTA_CONTENT.subheadline")}
            >
              {ctaContent.subheadline}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={ctaContent.ctaPrimary.href}
                className={isDark ? "bg-white text-[var(--color-apple-dark)] hover:bg-white/90 btn-primary" : "btn-primary"}
              >
                {ctaContent.ctaPrimary.label}
              </Link>
              <Link
                href={ctaContent.ctaSecondary.href}
                className={`btn-secondary ${isDark ? "text-white hover:text-white/80" : ""}`}
              >
                {ctaContent.ctaSecondary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </FadeUp>

        {/* Downloads */}
        {ctaContent.downloads.length > 0 && (
          <FadeUp delay={0.2}>
            <div className="mt-12 text-center">
              <p className={`text-body-sm mb-4 ${isDark ? "text-white/60" : "text-[var(--color-apple-gray-500)]"}`}>
                Unterlagen für Ihre Entscheidungsträger
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {ctaContent.downloads.map((download, index) => (
                  <a
                    key={index}
                    href={download.href}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                      isDark
                        ? "border-white/20 text-white hover:bg-white/10"
                        : "border-[var(--color-apple-gray-300)] text-[var(--color-apple-gray-600)] hover:bg-white"
                    }`}
                    download
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-body-sm">{download.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}

// Smaller inline CTA
interface InlineCTAProps {
  title: string;
  ctaLabel: string;
  ctaHref: string;
}

export function InlineCTA({ title, ctaLabel, ctaHref }: InlineCTAProps) {
  return (
    <FadeUp>
      <div className="bg-[var(--color-apple-gray-100)] rounded-[var(--radius-apple-xl)] p-8 lg:p-12 text-center">
        <h3 className="text-title-3">{title}</h3>
        <Link href={ctaHref} className="btn-primary mt-6 inline-flex">
          {ctaLabel}
        </Link>
      </div>
    </FadeUp>
  );
}
