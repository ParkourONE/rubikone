"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import { appleTransition } from "@/lib/animations";

// Stats Slide Cards Data
const STATS_SLIDES = [
  {
    value: "531",
    title: "Teilnehmende in Köniz",
    description: "Über 531 Personen haben bei unserem Pilotversuch in Köniz aktiv mitgemacht. Von Kindern bis zu Senioren – alle Generationen bewegten sich gemeinsam.",
    image: "/images/koeniz/schulklasse.jpg",
  },
  {
    value: "94%",
    title: "Verstehen sofort",
    description: "Fast alle Teilnehmenden verstanden das Konzept auf Anhieb. Die intuitive Beschilderung macht den Einstieg kinderleicht.",
    image: "/images/hero/oma-enkelin.jpg",
  },
  {
    value: "84%",
    title: "Schätzen den Gratiszugang",
    description: "Bewegung soll für alle zugänglich sein. RubikONE ist kostenlos nutzbar, rund um die Uhr, 365 Tage im Jahr.",
    image: "/images/koeniz/kinder-springen.jpg",
  },
  {
    value: "0 CHF",
    title: "Wartungskosten",
    description: "Keine kaputten Geräte, kein Vandalismus, keine Reparaturen. RubikONE nutzt bestehende Infrastruktur.",
    image: "/images/konzept/wegweiser.jpg",
  },
  {
    value: "BASPO",
    title: "Wissenschaftlich evaluiert",
    description: "Das Bundesamt für Sport hat RubikONE im Rahmen des lab7x1 Programms evaluiert. Die Ergebnisse bestätigen: Es funktioniert.",
    image: "/images/hero/generationen-kraft.jpg",
  },
];

export function StatsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // No need to set scrollLeft - the spacer positions the first card correctly
  // scrollLeft = 0 means spacer is visible, pushing card to align with title

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };


  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      {/* Header - in container, left aligned */}
      <div className="container-content mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
        >
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">Ergebnisse aus Köniz</p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">
            Zahlen, die überzeugen.
          </h2>
        </motion.div>
      </div>

      {/* Slider - OUTSIDE container, full width */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Left spacer - aligns first card with container start */}
        <div className="slider-spacer" />

        {STATS_SLIDES.map((slide, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: index * 0.1 }}
            className="flex-shrink-0 w-[320px]"
          >
            <div className="bg-[var(--color-apple-gray-100)] rounded-2xl overflow-hidden h-full">
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-display text-white font-bold">
                    {slide.value}
                  </span>
                </div>
              </div>
              {/* Content */}
              <div className="p-6">
                <h3 className="text-headline text-[var(--color-apple-dark)] mb-2">
                  {slide.title}
                </h3>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] leading-relaxed">
                  {slide.description}
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
