"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { appleTransition } from "@/lib/animations";

export function ProzessTeaser() {
  return (
    <section className="py-16 lg:py-20 bg-[var(--color-apple-dark)]">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-6"
        >
          <div>
            <p className="text-body-sm text-white/60 mb-2">
              Individuell angepasst
            </p>
            <h2 className="text-title-2 text-white">
              Wir gestalten mit Ihnen.
            </h2>
            <p className="mt-4 text-body text-white/70 max-w-xl">
              Es geht darum sich draussen zu bewegen, Neues auszuprobieren, sich aus der Komfortzone zu locken und Erfolgserlebnisse zu sammeln. Mit welchen Bewegungsaufforderungen gelingt das in Ihrer Ortschaft?
            </p>
            <p className="mt-2 text-body text-white/70 max-w-xl">
              Wir helfen Ihnen dabei, aus dem Raumpotenzial gesellschaftlichen Mehrwert zu schöpfen.
            </p>
          </div>
          <Link
            href="/raumgestaltung"
            className="btn-primary bg-white text-[var(--color-apple-dark)] hover:bg-white/90 inline-flex self-start md:self-center"
          >
            Gestalten Sie Ihren Parkour- & Bewegungsraum
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
