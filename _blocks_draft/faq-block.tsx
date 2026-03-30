"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FadeUp } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";
import { accordionAnimation, appleEasing } from "@/lib/animations";
import { cn } from "@/lib/utils";

export function FaqSection({ data }: { data: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const headline = data?.headline || "Häufige Fragen";
  const subtitle = data?.subtitle;
  const items = data?.items || [];

  return (
    <section className="section-spacing">
      <div className="container-content">
        <SectionHeader
          title={headline}
          subtitle={subtitle}
          align="center"
        />

        <div className="mt-12 max-w-3xl mx-auto divide-y divide-[var(--color-apple-gray-200)]">
          {items.map((item: any, index: number) => {
            const isOpen = openIndex === index;

            return (
              <FadeUp key={index} delay={index * 0.05}>
                <div className="py-5">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <h3 className="text-body-lg font-semibold text-[var(--color-apple-dark)]">
                      {item?.question}
                    </h3>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: appleEasing }}
                      className="flex-shrink-0 text-[var(--color-apple-gray-500)]"
                    >
                      <ChevronDown className="h-5 w-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        variants={accordionAnimation}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="overflow-hidden"
                      >
                        <p className="pt-3 text-body text-[var(--color-apple-gray-600)]">
                          {item?.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>
    </section>
  );
}
