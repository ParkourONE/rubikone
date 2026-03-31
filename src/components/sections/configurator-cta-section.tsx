"use client";

import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { ConfiguratorTrigger } from "./configurator-overlay";
import { CONFIGURATOR_CTA_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";

export function ConfiguratorCTASection() {
  const configCta = useContent("CONFIGURATOR_CTA_CONTENT", CONFIGURATOR_CTA_CONTENT);
  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-[var(--color-apple-blue)] via-[var(--color-apple-blue)] to-[var(--color-apple-blue)]/80">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mb-6">
            <Calculator className="h-8 w-8 text-white" />
          </div>

          <h2 className="text-title-1 text-white max-w-2xl mx-auto">
            {configCta.headline}
          </h2>

          <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto">
            {configCta.subheadline}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <ConfiguratorTrigger
              variant="button"
              className="bg-white text-[var(--color-apple-blue)] hover:bg-white/90"
            />
          </div>

          <p className="mt-6 text-body-sm text-white/60">
            {configCta.note}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
