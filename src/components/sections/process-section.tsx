"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { appleTransition } from "@/lib/animations";

// Process steps with images
const PROCESS_STEPS = [
  {
    number: "1",
    title: "Kennenlernen",
    subtitle: "Impulsworkshop",
    description: "Wir zeigen Ihnen vor Ort, was möglich ist.",
    modalContent: `In einem 120-minütigen Workshop vor Ort zeigen wir Ihnen die Möglichkeiten von RubikONE.

Gemeinsam gehen wir durch Ihre Gemeinde und entdecken vorhandene Infrastruktur mit neuen Augen. Sie werden überrascht sein, wie viele Bewegungsmöglichkeiten bereits existieren.

Was Sie erwartet:
• Begehung potenzieller Standorte
• Analyse der vorhandenen Infrastruktur
• Erste Ideen und Vorschläge
• Beantwortung aller Fragen

Nach dem Workshop wissen Sie, ob RubikONE zu Ihrer Gemeinde passt.`,
    duration: "1 Tag",
    image: "/images/workshop/frauen-balancieren.jpg",
  },
  {
    number: "2",
    title: "Planung",
    subtitle: "Konzept & Sicherheit",
    description: "Wir entwickeln Ihre individuelle Route.",
    modalContent: `Die Planung ist das Herzstück jedes RubikONE-Projekts. Wir entwickeln ein massgeschneidertes Konzept für Ihre Gemeinde.

Normenkonform:
Alle Posten entsprechen den relevanten Schweizer Sicherheitsnormen. Sicherheit hat höchste Priorität.

Was wir tun:
• Detaillierte Routenplanung
• Auswahl der optimalen Standorte
• Gestaltungskonzept entwickeln
• Sicherheitsprüfung aller Posten
• Abstimmung mit Ihren Behörden

Das Ergebnis: Ein vollständiges Konzept, das auf Ihre Gemeinde zugeschnitten ist.`,
    duration: "4-6 Wochen",
    image: "/images/process/gestaltung.jpg",
  },
  {
    number: "3",
    title: "Umsetzung",
    subtitle: "Handwerk & Installation",
    description: "Lokale Handwerker setzen alles um.",
    modalContent: `Die Umsetzung erfolgt durch lokale Handwerker unter unserer Anleitung. So bleibt die Wertschöpfung in Ihrer Region.

Was umgesetzt wird:
• Farbmarkierungen auf Böden und Wänden
• Produktion der Beschilderung
• Montage aller Elemente
• Qualitätskontrolle

Alles aus einer Hand:
Wir koordinieren alle Gewerke und sorgen für eine reibungslose Umsetzung. Sie haben einen Ansprechpartner für alles.`,
    duration: "2-3 Wochen",
    image: "/images/process/bemalung.jpg",
  },
  {
    number: "4",
    title: "Eröffnung",
    subtitle: "Start & Begleitung",
    description: "Gemeinsamer Start mit Ihrer Bevölkerung.",
    modalContent: `Die Eröffnung ist der Startschuss für Bewegung in Ihrer Gemeinde. Wir sorgen dafür, dass alle davon erfahren.

Das Eröffnungsevent:
• Offizielle Einweihung mit Behörden
• Trainings für die Bevölkerung
• Schulklassen-Workshops
• Medienarbeit

Nach der Eröffnung:
Wir lassen Sie nicht allein. Auf Wunsch bieten wir regelmässige Trainings und Events an, um RubikONE lebendig zu halten.`,
    duration: "1 Tag",
    image: "/images/koeniz/schulklasse.jpg",
  },
];

export function ProcessSection() {
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
  useEffect(() => {
    if (activeModal !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModal]);

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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px]"
            >
              <div
                className="relative rounded-2xl overflow-hidden shadow-apple cursor-pointer group aspect-[3/4]"
                onClick={() => setActiveModal(index)}
              >
                {/* Full Image - Portrait */}
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient for title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Title at bottom */}
                <div className="absolute bottom-4 left-4 right-14">
                  <p className="text-body-sm text-white/70">{step.subtitle}</p>
                  <h3 className="text-headline text-white font-semibold">{step.title}</h3>
                </div>

                {/* Plus Icon - Bottom right */}
                <button
                  className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModal(index);
                  }}
                >
                  <Plus className="h-5 w-5 text-white" />
                </button>
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

      {/* Modal - Scrollable */}
      <AnimatePresence>
        {activeModal !== null && activeStep && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 pb-4 overflow-y-auto"
            onClick={() => setActiveModal(null)}
          >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal Content - Scrollable container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={appleTransition}
              className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>

              {/* Image */}
              <div className="relative aspect-video">
                <Image
                  src={activeStep.image}
                  alt={activeStep.title}
                  fill
                  className="object-cover rounded-t-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-3xl" />
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
              <div className="p-8">
                <div className="text-body text-[var(--color-apple-gray-700)] whitespace-pre-line leading-relaxed">
                  {activeStep.modalContent}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
