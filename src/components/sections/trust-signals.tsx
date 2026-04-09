"use client";

import { motion } from "framer-motion";
import { TRUST_STATS, PARTNERS } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useEditPath } from "@/components/cms/primitives";

// Stats Section
export function TrustStats() {
  return (
    <section className="py-16 lg:py-20 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12"
          {...useEditPath("TRUST_STATS")}
        >
          {TRUST_STATS.map((stat, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="text-center"
            >
              <div className="text-display text-[var(--color-apple-blue)]">
                {stat.value}
              </div>
              <div className="mt-1 text-headline text-[var(--color-apple-dark)]">
                {stat.label}
              </div>
              <div className="mt-1 text-body-sm text-[var(--color-apple-gray-600)]">
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Partner Logos
export function PartnerLogos() {
  return (
    <section className="py-12 lg:py-16 border-y border-[var(--color-apple-gray-200)]">
      <div className="container-content">
        <p className="text-center text-body-sm text-[var(--color-apple-gray-600)] mb-8">
          Unterstützt von
        </p>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-wrap justify-center items-center gap-12 lg:gap-16"
        >
          {PARTNERS.map((partner, index) => (
            <motion.a
              key={index}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={staggerItem}
              className="text-[var(--color-apple-gray-600)] hover:text-[var(--color-apple-dark)] transition-colors"
            >
              <span className="text-headline font-medium">{partner.name}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// Combined Trust Section
export function TrustSection() {
  return (
    <>
      <PartnerLogos />
      <TrustStats />
    </>
  );
}
