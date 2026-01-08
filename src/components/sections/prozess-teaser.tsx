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
              Von der Idee zur Eröffnung
            </p>
            <h2 className="text-title-2 text-white">
              In vier Schritten zu Ihrem RubikONE.
            </h2>
          </div>
          <Link
            href="/fuer-gemeinden"
            className="btn-primary bg-white text-[var(--color-apple-dark)] hover:bg-white/90 inline-flex self-start md:self-center"
          >
            Prozess ansehen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
