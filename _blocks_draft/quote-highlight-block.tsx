"use client";

import { FadeUp } from "@/components/shared/fade-up";

export function QuoteHighlightBlock({ data }: { data: any }) {
  const quote = data?.quote || "";
  const author = data?.author || "";
  const role = data?.role || "";

  return (
    <section className="section-spacing">
      <div className="container-narrow">
        <FadeUp>
          <blockquote className="relative text-center">
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 text-8xl font-bold leading-none text-[var(--color-apple-blue)] opacity-20 select-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="text-title-2 italic text-[var(--color-apple-dark)]">
              {quote}
            </p>
            {(author || role) && (
              <footer className="mt-6">
                {author && (
                  <cite className="not-italic text-body-lg font-semibold text-[var(--color-apple-dark)]">
                    {author}
                  </cite>
                )}
                {role && (
                  <p className="mt-1 text-body-sm text-[var(--color-apple-gray-600)]">
                    {role}
                  </p>
                )}
              </footer>
            )}
          </blockquote>
        </FadeUp>
      </div>
    </section>
  );
}
