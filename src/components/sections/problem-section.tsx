"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PROBLEM_CONTENT } from "@/lib/constants";
import { FadeUp } from "@/components/shared/fade-up";
import { appleTransition } from "@/lib/animations";

export function ProblemSection() {
  return (
    <section className="section-spacing bg-white">
      <div className="container-narrow text-center">
        <FadeUp>
          <p className="text-hero text-[var(--color-apple-dark)]">
            {PROBLEM_CONTENT.statistic}
          </p>
          <p className="text-title-3 text-[var(--color-apple-gray-600)] mt-2">
            {PROBLEM_CONTENT.statisticLabel}
          </p>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className="mt-12 lg:mt-16">
            <p className="text-title-1 text-[var(--color-apple-dark)]">
              {PROBLEM_CONTENT.headline}
            </p>
            <p className="text-title-1 text-[var(--color-apple-gray-500)]">
              {PROBLEM_CONTENT.subheadline}
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.3}>
          <p className="mt-8 text-caption text-[var(--color-apple-gray-500)]">
            Quelle: {PROBLEM_CONTENT.source}
          </p>
        </FadeUp>

        {/* Partner Logos - In boxes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...appleTransition, delay: 0.4 }}
          className="mt-16"
        >
          <p className="text-body-sm text-[var(--color-apple-gray-500)] mb-6">
            Unterstützt und evaluiert von
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8 flex items-center justify-center">
              <div className="relative h-20 w-52">
                <Image
                  src="/images/logos/baspo.gif"
                  alt="Bundesamt für Sport BASPO"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8 flex items-center justify-center">
              <div className="relative h-20 w-44">
                <Image
                  src="/images/logos/koeniz.jpg"
                  alt="Gemeinde Köniz"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
