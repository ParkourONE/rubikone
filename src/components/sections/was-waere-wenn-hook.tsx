"use client";

import { motion } from "framer-motion";
import { appleTransition } from "@/lib/animations";

export function WasWaereWennHook() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-title-1 lg:text-display text-[var(--color-apple-dark)] leading-tight">
            Was wäre wenn...
          </h2>
          <p className="mt-6 text-title-3 text-[var(--color-apple-gray-700)] font-normal leading-relaxed">
            ...eine Treppe zum Fitnessplatz wird?<br />
            ...die Mauer zur Balancechallenge?<br />
            ...der öffentliche Raum zum Fitnesscenter?
          </p>
          <p className="mt-8 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl mx-auto">
            Wir machen bestehende Bewegungsmöglichkeiten im öffentlichen Raum sichtbar. Keine neuen Geräte – nur ein neuer Blick.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
