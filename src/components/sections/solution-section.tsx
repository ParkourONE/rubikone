"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Plus, X } from "lucide-react";
import { useState, useRef } from "react";
import { appleTransition } from "@/lib/animations";
import { useScrollLock } from "@/hooks/useScrollLock";
import { SOLUTION_CARDS_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

type SolutionCardItem = {
  _id?: string;
  id: string;
  title: string;
  subtitle: string;
  image: string;
  modalTitle: string;
  modalContent: string;
};

function SolutionCardView({
  card,
  index,
  onOpen,
}: {
  card: SolutionCardItem;
  index: number;
  onOpen: () => void;
}) {
  const cardEdit = useEditPath(`SOLUTION_CARDS_CONTENT.${index}`);
  const titleEdit = useEditPath(`SOLUTION_CARDS_CONTENT.${index}.title`);
  const subtitleEdit = useEditPath(`SOLUTION_CARDS_CONTENT.${index}.subtitle`);
  const imageEdit = useEditPath(`SOLUTION_CARDS_CONTENT.${index}.image`);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...appleTransition, delay: index * 0.1 }}
      className="flex-shrink-0 w-[360px]"
      {...cardEdit}
    >
      <div
        className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
        onClick={onOpen}
      >
        <Image
          src={card.image}
          alt={card.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          {...imageEdit}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-body-sm text-white/70 mb-1" {...subtitleEdit}>
            {card.subtitle}
          </p>
          <h3
            className="text-title-2 text-white font-semibold"
            {...titleEdit}
          >
            {card.title}
          </h3>
        </div>
        <button
          className="absolute bottom-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          <Plus className="h-5 w-5 text-white" />
        </button>
      </div>
    </motion.div>
  );
}

export function SolutionSection() {
  const SOLUTION_CARDS = useContent<SolutionCardItem[]>(
    "SOLUTION_CARDS_CONTENT",
    SOLUTION_CARDS_CONTENT
  );
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
            <SolutionCardView
              key={card._id ?? card.id}
              card={card}
              index={index}
              onOpen={() => setActiveModal(card.id)}
            />
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
