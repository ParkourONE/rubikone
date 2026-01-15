"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { appleTransition } from "@/lib/animations";

const uspItems = [
  {
    title: "Einfache Integration",
    description: "RubikONE nutzt, was schon da ist: Wegweiser und Postenschilder werden wo immer möglich an vorhandene Strukturen montiert.",
    image: "/images/gemeinden/integration.jpg",
  },
  {
    title: "Nachhaltigkeit",
    description: "Das verwendete Material ist langlebig und bei Bedarf leicht zu ersetzen.",
    image: "/images/gemeinden/nachhaltigkeit.jpg",
  },
  {
    title: "Lebensqualität",
    description: "Bewegung ist Leben – mit RubikONE fördern Sie physische, psychische und soziale Gesundheit.",
    image: "/images/gemeinden/lebensqualitaet.jpg",
  },
];

export function USPSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 360;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)] overflow-hidden">
      {/* Header - in container */}
      <div className="container-content mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
        >
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
            Clever & diskret
          </p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">
            Einmaliger Aufwand – nachhaltiger Nutzen.
          </h2>
        </motion.div>
      </div>

      {/* Slider - outside container, full width with spacers */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Left spacer */}
        <div className="slider-spacer" />

        {uspItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: index * 0.1 }}
            className="flex-shrink-0 w-[320px]"
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow-apple h-full">
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-headline text-[var(--color-apple-dark)] mb-3">
                  {item.title}
                </h3>
                <p className="text-body-sm text-[var(--color-apple-gray-600)]">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Right spacer */}
        <div className="slider-spacer" />
      </div>

      {/* Navigation Arrows - in container, right aligned */}
      <div className="container-content mt-6">
        <div className="flex justify-end gap-4">
          <button
            onClick={() => scroll("left")}
            className="hover:text-[var(--color-apple-blue)] transition-colors"
            aria-label="Vorheriges Element"
          >
            <ArrowLeft className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hover:text-[var(--color-apple-blue)] transition-colors"
            aria-label="Nächstes Element"
          >
            <ArrowRight className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
          </button>
        </div>
      </div>
    </section>
  );
}
