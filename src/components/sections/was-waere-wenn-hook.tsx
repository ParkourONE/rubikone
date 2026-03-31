"use client";

import { motion } from "framer-motion";
import { appleTransition } from "@/lib/animations";
import { TEXTHOOK_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";

export function WasWaereWennHook() {
  const texthook = useContent("TEXTHOOK_CONTENT", TEXTHOOK_CONTENT);
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
            {texthook.headline}
          </h2>
          <p className="mt-8 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl mx-auto">
            {texthook.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
