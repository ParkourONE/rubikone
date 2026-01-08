"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { VorherNachherSlider } from "@/components/shared/vorher-nachher-slider";

export function VorherNachherTeaser() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Interaktiver Slider */}
          <VorherNachherSlider
            vorherSrc="/images/konzept/vorher.jpg"
            nachherSrc="/images/konzept/nachher.jpg"
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: 0.2 }}
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
              Das Prinzip
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]">
              Keine neuen Geräte. Nur ein neuer Blick.
            </h2>
            <p className="mt-6 text-body-lg text-[var(--color-apple-gray-700)]">
              RubikONE nutzt bestehende urbane Elemente und macht sie durch Beschilderung und Farbmarkierungen als Bewegungsräume sichtbar – normenkonform und vollständig reversibel.
            </p>
            <div className="mt-8">
              <Link href="/konzept" className="btn-secondary inline-flex">
                Das Konzept entdecken
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
