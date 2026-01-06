"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Plus, X } from "lucide-react";
import { useState, useRef } from "react";
import { appleTransition } from "@/lib/animations";
import { useScrollLock } from "@/hooks/useScrollLock";

// Solution Cards Data
const SOLUTION_CARDS = [
  {
    id: "erlaubnis",
    title: "Erlaubnis",
    subtitle: "Die unsichtbare Barriere",
    image: "/images/hero/oma-enkelin.jpg",
    modalTitle: "Menschen brauchen Erlaubnis, sich zu bewegen.",
    modalContent: `40% der Schweizer Bevölkerung bewegt sich zu wenig. Nicht weil sie nicht wollen – sondern weil niemand sie einlädt.

RubikONE gibt diese Erlaubnis. Durch sichtbare Markierungen und klare Beschilderung sagen wir: "Hier darfst du dich bewegen. Hier ist es erwünscht."

Das ist der erste Schritt zur Veränderung. Menschen brauchen die Bestätigung, dass Bewegung im öffentlichen Raum nicht nur erlaubt, sondern gewollt ist.`,
  },
  {
    id: "sichtbarkeit",
    title: "Sichtbarkeit",
    subtitle: "Den Blick verändern",
    image: "/images/konzept/bemalung.jpg",
    modalTitle: "Wir machen sichtbar, was schon da ist.",
    modalContent: `Treppen werden zu Trainingsgeräten. Mauern zu Balancierbalken. Geländer zu Kletterstangen.

RubikONE nutzt bestehende urbane Elemente und macht sie durch Farbmarkierungen und Beschilderung als Bewegungsräume sichtbar.

Keine neuen Geräte. Kein Tiefbau. Keine grossen Investitionen. Nur ein neuer Blick auf das, was bereits vorhanden ist.`,
  },
  {
    id: "posten",
    title: "Posten",
    subtitle: "9 natürliche Bewegungen",
    image: "/images/posten/balance-nahaufnahme.jpg",
    modalTitle: "Neun Bewegungen – für alle Generationen.",
    modalContent: `Jede RubikONE-Route besteht aus Bewegungsposten mit natürlichen Bewegungsmustern: Greifen, Hangeln, Balancieren, Springen, Klettern, Ausdehnen, Krafttraining, Quadrupedie und Laufen.

Jede Übung gibt es in drei Schwierigkeitsgraden – Grün, Blau, Rot. So findet jede:r den passenden Einstieg, vom Kind bis zur Grossmutter.

Die Anzahl der Posten passen wir individuell an: Von 6 bis 16 Posten ist alles möglich, je nach Bedarf Ihrer Gemeinde.`,
  },
  {
    id: "wirkung",
    title: "Wirkung",
    subtitle: "Wissenschaftlich bewiesen",
    image: "/images/hero/generationen-kraft.jpg",
    modalTitle: "Wirkung, die messbar ist.",
    modalContent: `Das Bundesamt für Sport BASPO hat RubikONE im Rahmen des lab7x1 Programms evaluiert. Die Ergebnisse aus Köniz:

• 531 aktive Teilnehmende in 8 Monaten
• 94% verstehen das Konzept sofort
• 84% schätzen den kostenlosen Zugang
• 0 CHF Wartungskosten
• 0 Fälle von Vandalismus

RubikONE funktioniert – und die Zahlen beweisen es.`,
  },
];

export function SolutionSection() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const activeCard = SOLUTION_CARDS.find((card) => card.id === activeModal);

  // Lock body scroll when modal is open
  useScrollLock(activeModal !== null);

  return (
    <>
      <section className="py-16 lg:py-24 bg-white overflow-hidden">
        {/* Header - in container */}
        <div className="container-content mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
              Wie es funktioniert
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)] max-w-2xl">
              RubikONE gibt Menschen die Erlaubnis, sich zu bewegen.
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

          {SOLUTION_CARDS.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: index * 0.1 }}
              className="flex-shrink-0 w-[360px]"
            >
              <div
                className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setActiveModal(card.id)}
              >
                {/* Image */}
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-body-sm text-white/70 mb-1">
                    {card.subtitle}
                  </p>
                  <h3 className="text-title-2 text-white font-semibold">
                    {card.title}
                  </h3>
                </div>

                {/* Plus Icon - Bottom right */}
                <button
                  className="absolute bottom-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModal(card.id);
                  }}
                >
                  <Plus className="h-5 w-5 text-white" />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Konzept entdecken Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: 0.4 }}
            className="flex-shrink-0 w-[360px]"
          >
            <Link href="/konzept" className="block">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--color-apple-gray-100)] flex items-center justify-center group hover:bg-[var(--color-apple-gray-200)] transition-colors">
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-apple-blue)] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <ArrowRight className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-title-2 text-[var(--color-apple-dark)] font-semibold mb-2">
                    Konzept entdecken
                  </h3>
                  <p className="text-body text-[var(--color-apple-gray-600)]">
                    Erfahren Sie mehr über die 9 Bewegungen und das System dahinter.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

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

      {/* Modal */}
      <AnimatePresence>
        {activeModal && activeCard && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setActiveModal(null)}
            />

            {/* Full Screen Scroll Container */}
            <div
              className="fixed inset-0 z-50 overflow-y-auto"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="min-h-full flex flex-col items-center py-[30px] px-[10px]">
                <div className="flex-1" />

                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  transition={appleTransition}
                  className="bg-white rounded-3xl shadow-2xl w-full max-w-[630px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Image Header */}
                  <div className="relative h-56 rounded-t-3xl overflow-hidden">
                    <Image
                      src={activeCard.image}
                      alt={activeCard.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Close Button */}
                    <button
                      onClick={() => setActiveModal(null)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>

                    <div className="absolute bottom-6 left-6">
                      <p className="text-body-sm text-white/70 mb-1">
                        {activeCard.subtitle}
                      </p>
                      <h3 className="text-title-1 text-white font-semibold">
                        {activeCard.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 rounded-b-3xl">
                    <h4 className="text-title-3 text-[var(--color-apple-dark)] mb-4">
                      {activeCard.modalTitle}
                    </h4>
                    <div className="text-body text-[var(--color-apple-gray-700)] whitespace-pre-line leading-relaxed">
                      {activeCard.modalContent}
                    </div>
                  </div>
                </motion.div>

                <div className="flex-1" />
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
