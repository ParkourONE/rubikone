"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ConfiguratorOverlay } from "@/components/sections/configurator-overlay";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function KonfiguratorPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open the overlay on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Small delay before navigating back for smooth animation
    setTimeout(() => {
      router.push("/");
    }, 300);
  };

  return (
    <>
      {/* Background page shown briefly before overlay opens */}
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-apple-gray-100)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--color-apple-blue)] mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-title-1 text-[var(--color-apple-dark)]">
            RubikONE Konfigurator
          </h1>
          <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]">
            Wird geladen...
          </p>
        </motion.div>
      </div>

      {/* The actual configurator overlay */}
      <ConfiguratorOverlay isOpen={isOpen} onClose={handleClose} />
    </>
  );
}
