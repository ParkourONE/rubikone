"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { scaleIn, appleEasing } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function LerndimensionenBlock({ data }: { data: any }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const headline = data?.headline || "Lerndimensionen";
  const subtitle = data?.subtitle;
  const items = data?.items || [];

  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  return (
    <section className="section-spacing">
      <div className="container-wide">
        {headline && (
          <SectionHeader
            title={headline}
            subtitle={subtitle}
            align="center"
          />
        )}

        <StaggerContainer className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item: any, index: number) => (
            <StaggerItem key={index}>
              <button
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "group w-full rounded-2xl p-6 text-center transition-all",
                  "bg-[var(--color-apple-gray-100)] hover:bg-white hover:shadow-[var(--shadow-apple-lg)]"
                )}
              >
                {item?.icon && (
                  <span className="mb-3 block text-3xl">{item.icon}</span>
                )}
                <h3 className="text-body-sm font-semibold text-[var(--color-apple-dark)]">
                  {item?.title}
                </h3>
                {item?.shortDescription && (
                  <p className="mt-1 text-caption text-[var(--color-apple-gray-600)]">
                    {item.shortDescription}
                  </p>
                )}
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setActiveIndex(null)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                variants={scaleIn}
                initial="initial"
                animate="animate"
                exit="exit"
                className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-[var(--shadow-apple-xl)]"
              >
                <button
                  onClick={() => setActiveIndex(null)}
                  className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-apple-gray-100)] text-[var(--color-apple-gray-600)] hover:bg-[var(--color-apple-gray-200)] transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {activeItem?.icon && (
                  <span className="mb-4 block text-4xl">{activeItem.icon}</span>
                )}
                <h3 className="text-title-2 text-[var(--color-apple-dark)]">
                  {activeItem?.title}
                </h3>
                {activeItem?.description && (
                  <p className="mt-3 text-body text-[var(--color-apple-gray-600)] leading-relaxed">
                    {activeItem.description}
                  </p>
                )}
                {activeItem?.benefits && activeItem.benefits.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {activeItem.benefits.map((benefit: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-body-sm text-[var(--color-apple-gray-700)]"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-apple-blue)]" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
