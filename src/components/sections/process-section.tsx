"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { appleTransition } from "@/lib/animations";
import { useScrollLock } from "@/hooks/useScrollLock";
import { PROCESS_STEPS_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

type ProcessStepItem = {
  _id?: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  modalContent: string;
  duration: string;
  image: string;
};

function ProcessStepCard({
  step,
  index,
  onOpen,
}: {
  step: ProcessStepItem;
  index: number;
  onOpen: () => void;
}) {
  const cardEdit = useEditPath(`PROCESS_STEPS_CONTENT.${index}`);
  const titleEdit = useEditPath(`PROCESS_STEPS_CONTENT.${index}.title`);
  const subtitleEdit = useEditPath(`PROCESS_STEPS_CONTENT.${index}.subtitle`);
  const imageEdit = useEditPath(`PROCESS_STEPS_CONTENT.${index}.image`);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...appleTransition, delay: index * 0.1 }}
      className="flex-shrink-0 w-[280px]"
      {...cardEdit}
    >
      <div
        className="relative rounded-2xl overflow-hidden shadow-apple cursor-pointer group aspect-[3/4]"
        onClick={onOpen}
      >
        <Image
          src={step.image}
          alt={step.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          {...imageEdit}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-14">
          <p className="text-body-sm text-white/70" {...subtitleEdit}>
            {step.subtitle}
          </p>
          <h3
            className="text-headline text-white font-semibold"
            {...titleEdit}
          >
            {step.title}
          </h3>
        </div>
        <button
          className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors"
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

export function ProcessSection() {
  const PROCESS_STEPS = useContent<ProcessStepItem[]>(
    "PROCESS_STEPS_CONTENT",
    PROCESS_STEPS_CONTENT
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<number | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const activeStep = activeModal !== null ? PROCESS_STEPS[activeModal] : null;

  // Lock body scroll when modal is open
  useScrollLock(activeModal !== null);

  return (
    <>
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
              In vier Schritten
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]">
              Von der Idee zur Umsetzung.
            </h2>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl">
              Wir übernehmen alles – oder nur das, was Sie brauchen.
            </p>
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

          {PROCESS_STEPS.map((step, index) => (
            <ProcessStepCard
              key={step._id ?? index}
              step={step}
              index={index}
              onOpen={() => setActiveModal(index)}
            />
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

      {/* Modal */}
      <AnimatePresence>
        {activeModal !== null && activeStep && (
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
                      src={activeStep.image}
                      alt={activeStep.title}
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
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <span className="text-headline font-bold text-[var(--color-apple-dark)]">
                            {activeStep.number}
                          </span>
                        </div>
                        <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                          <span className="text-caption font-medium text-white">
                            {activeStep.duration}
                          </span>
                        </div>
                      </div>
                      <p className="text-body-sm text-white/70 mb-1">
                        {activeStep.subtitle}
                      </p>
                      <h3 className="text-title-1 text-white font-semibold">
                        {activeStep.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 rounded-b-3xl">
                    <div className="text-body text-[var(--color-apple-gray-700)] whitespace-pre-line leading-relaxed">
                      {activeStep.modalContent}
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
