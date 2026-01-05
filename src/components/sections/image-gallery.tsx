"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { appleTransition } from "@/lib/animations";

// Gallery with benefits/comments
const GALLERY_ITEMS = [
  {
    image: "/images/hero/oma-enkelin.jpg",
    title: "Generationen verbinden",
    comment: "Grosseltern und Enkel trainieren gemeinsam – natürlich und ungezwungen.",
  },
  {
    image: "/images/hero/generationen-kraft.jpg",
    title: "Kraft für alle",
    comment: "Vom Teenager bis zur Seniorin: Jeder findet seine passende Herausforderung.",
  },
  {
    image: "/images/koeniz/schulklasse.jpg",
    title: "Schulen integrieren",
    comment: "RubikONE wird zum Outdoor-Klassenzimmer für Bewegung und Spiel.",
  },
  {
    image: "/images/koeniz/kinder-springen.jpg",
    title: "Spielerisch lernen",
    comment: "Kinder entdecken natürliche Bewegungen – ganz ohne Anleitung.",
  },
  {
    image: "/images/workshop/frauen-balancieren.jpg",
    title: "Gemeinschaft stärken",
    comment: "Bewegung schafft Begegnung – über alle Altersgruppen hinweg.",
  },
  {
    image: "/images/posten/balance-nahaufnahme.jpg",
    title: "Koordination fördern",
    comment: "Balancieren trainiert Körper und Geist gleichzeitig.",
  },
  {
    image: "/images/konzept/wegweiser.jpg",
    title: "Intuitiv verstehen",
    comment: "Klare Beschilderung macht den Einstieg kinderleicht.",
  },
  {
    image: "/images/koeniz/spass.jpg",
    title: "Freude an Bewegung",
    comment: "Das wichtigste Ergebnis: Menschen, die Spass an Bewegung haben.",
  },
];

export function ImageGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 420;
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
            Eindrücke aus der Praxis
          </p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">
            Bewegung verbindet Generationen.
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

        {GALLERY_ITEMS.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: index * 0.05 }}
            className="flex-shrink-0 w-[340px] lg:w-[400px]"
          >
              <div className="bg-white rounded-2xl overflow-hidden shadow-apple h-full">
                {/* Large Image - No overlay text */}
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Content below image - Title bold before text */}
                <div className="p-5">
                  <p className="text-body text-[var(--color-apple-gray-700)] leading-relaxed">
                    <span className="font-semibold text-[var(--color-apple-dark)]">{item.title}.</span>{" "}
                    {item.comment}
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
          >
            <ArrowLeft className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="hover:text-[var(--color-apple-blue)] transition-colors"
          >
            <ArrowRight className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
          </button>
        </div>
      </div>
    </section>
  );
}
