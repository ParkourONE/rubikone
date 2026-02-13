"use client";

import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { ConfiguratorTrigger } from "./configurator-overlay";

export function ConfiguratorCTASection() {
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
            Ihr individuelles Leistungspaket
          </h2>

          <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto">
            Konfigurieren Sie Ihr Projekt und erhalten Sie eine persönliche Übersicht per E-Mail.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <ConfiguratorTrigger
              variant="button"
              className="bg-white text-[var(--color-apple-blue)] hover:bg-white/90"
            />
          </div>

          <p className="mt-6 text-body-sm text-white/60">
            Keine Registrierung nötig • Unverbindlich • Persönliche Übersicht per E-Mail
          </p>
        </motion.div>
      </div>
    </section>
  );
}
