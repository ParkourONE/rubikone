"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

export function FloatingConfigurator() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Show after scrolling 400px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 400) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const showButton = isVisible && !isDismissed;

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
        >
          {/* Dismiss button */}
          <button
            onClick={() => setIsDismissed(true)}
            className="w-8 h-8 bg-white/80 backdrop-blur rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
            aria-label="Schliessen"
          >
            <X className="h-4 w-4 text-[var(--color-apple-gray-500)]" />
          </button>

          {/* Main button - links to Impulsworkshop */}
          <Link href="/impulsworkshop">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-5 py-3 bg-[var(--color-apple-blue)] text-white rounded-full shadow-apple-xl hover:shadow-2xl transition-shadow"
            >
              <ArrowRight className="h-5 w-5" />
              <span className="font-medium">Der nächste Schritt</span>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
