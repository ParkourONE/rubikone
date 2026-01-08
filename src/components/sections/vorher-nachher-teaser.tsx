"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { appleTransition } from "@/lib/animations";

export function VorherNachherTeaser() {
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
          >
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-apple-lg">
              {/* Nachher Bild als Hauptbild */}
              <Image
                src="/images/konzept/nachher.jpg"
                alt="RubikONE: Aktivierter Bewegungsraum"
                fill
                className="object-cover"
              />
              {/* Vorher als kleines Overlay */}
              <div className="absolute bottom-4 left-4 w-1/3 aspect-[16/9] rounded-lg overflow-hidden border-2 border-white shadow-lg">
                <Image
                  src="/images/konzept/vorher.jpg"
                  alt="Vorher: Ungenutzter Raum"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="text-caption font-medium text-white">Vorher</span>
                </div>
              </div>
              {/* Nachher Label */}
              <div className="absolute bottom-4 right-4 bg-[var(--color-apple-blue)] px-4 py-2 rounded-full">
                <span className="text-body-sm font-medium text-white">Nachher</span>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: 0.1 }}
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
