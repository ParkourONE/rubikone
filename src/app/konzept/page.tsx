"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, X } from "lucide-react";
import { useRef, useState } from "react";
import { appleTransition } from "@/lib/animations";

// Alle Posten-Schilder aus Köniz
const POSTEN_SCHILDER = [
  { nummer: "01", image: "/images/posten/schild-01.jpg" },
  { nummer: "02", image: "/images/posten/schild-02.jpg" },
  { nummer: "03", image: "/images/posten/schild-03.jpg" },
  { nummer: "04", image: "/images/posten/schild-04.jpg" },
  { nummer: "05", image: "/images/posten/schild-05.jpg" },
  { nummer: "06", image: "/images/posten/schild-06.jpg" },
  { nummer: "07", image: "/images/posten/schild-07.jpg" },
  { nummer: "08", image: "/images/posten/schild-08.jpg" },
  { nummer: "09", image: "/images/posten/schild-09.jpg" },
];

// Die 5 Lerndimensionen mit Modal-Content
const LERNDIMENSIONEN = [
  {
    id: "motorisch",
    title: "Motorisch",
    icon: "/images/lerndimensionen/motorisch.jpg",
    shortDesc: "Körperliche Bewegung",
    modalTitle: "Motorisches Lernen",
    modalContent: `Die motorische Dimension umfasst alle körperlichen Bewegungsabläufe und deren Koordination.

Bei RubikONE trainieren Teilnehmende:
• Gleichgewicht und Balance
• Koordination und Körperkontrolle
• Kraft und Ausdauer
• Beweglichkeit und Flexibilität
• Räumliche Orientierung

Jede Übung kann in drei Schwierigkeitsstufen ausgeführt werden, sodass vom Einsteiger bis zum Fortgeschrittenen alle eine passende Herausforderung finden.`,
  },
  {
    id: "kognitiv",
    title: "Kognitiv",
    icon: "/images/lerndimensionen/kognitiv.jpg",
    shortDesc: "Denken & Konzentration",
    modalTitle: "Kognitives Lernen",
    modalContent: `Die kognitive Dimension fördert geistige Prozesse wie Aufmerksamkeit, Konzentration und Problemlösung.

Beispiel-Challenges auf den Posten:
• "Zähle während der Übung rückwärts von 20"
• "Atme bewusst ein und aus"
• "Merke dir die Reihenfolge der Posten"

Diese Aufgaben verbinden Bewegung mit Denkprozessen – ein Ansatz, der nachweislich die Gehirnleistung fördert und besonders für Kinder und ältere Menschen wertvoll ist.`,
  },
  {
    id: "emotional",
    title: "Emotional",
    icon: "/images/lerndimensionen/emotional.jpg",
    shortDesc: "Gefühle ausdrücken",
    modalTitle: "Emotionales Lernen",
    modalContent: `Die emotionale Dimension hilft, Gefühle wahrzunehmen und auszudrücken.

Beispiel-Challenges auf den Posten:
• "Lächle während jeder Übung"
• "Singe dein Lieblingslied während du balancierst"
• "Beschreibe mit zwei Adjektiven, wie du dich fühlst"

Bewegung und Emotionen sind eng verknüpft. RubikONE nutzt diese Verbindung bewusst, um positive Gefühle zu fördern und Stress abzubauen.`,
  },
  {
    id: "sozial",
    title: "Sozial",
    icon: "/images/lerndimensionen/sozial.jpg",
    shortDesc: "Gemeinsam bewegen",
    modalTitle: "Soziales Lernen",
    modalContent: `Die soziale Dimension fördert Interaktion und Gemeinschaft.

Beispiel-Challenges auf den Posten:
• "Grüsse alle Personen, denen du begegnest"
• "Führe die Übung zu zweit aus"
• "Gib der nächsten Person ein High-Five"

RubikONE ist bewusst im öffentlichen Raum platziert. Menschen begegnen sich, kommen ins Gespräch, trainieren zusammen. So entsteht Gemeinschaft – generationenübergreifend.`,
  },
  {
    id: "sensorisch",
    title: "Sensorisch",
    icon: "/images/lerndimensionen/sensorisch.jpg",
    shortDesc: "Sinne schärfen",
    modalTitle: "Sensorisches Lernen",
    modalContent: `Die sensorische Dimension schärft die Sinneswahrnehmung.

Beispiel-Challenges auf den Posten:
• "Schliesse während der Übung die Augen"
• "Nimm die Geräusche in deiner Umgebung wahr"
• "Laufe barfuss zum nächsten Posten"

Durch bewusstes Wahrnehmen der Umgebung wird die Achtsamkeit gefördert. Die Teilnehmenden lernen, ihren Körper und ihre Umwelt intensiver zu spüren.`,
  },
];

// Sicherheitsnormen
const NORMEN = [
  { code: "SN EN 16630:2015", name: "Fitnessgeräte" },
  { code: "SN EN 1177:2020", name: "Spielplatzböden" },
  { code: "SIA 358", name: "Geländer" },
  { code: "bfu-Richtlinien", name: "Unfallverhütung" },
];

export default function KonzeptPage() {
  const postenScrollRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollPosten = (direction: "left" | "right") => {
    if (postenScrollRef.current) {
      const scrollAmount = 400;
      postenScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Vorher/Nachher Slider Handler
  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    handleSliderMove(e.touches[0].clientX);
  };

  const activeDimension = LERNDIMENSIONEN.find((d) => d.id === activeModal);

  return (
    <>
      {/* Hero - Was wäre wenn */}
      <section className="relative min-h-[70vh] lg:min-h-[80vh] flex items-center">
        {/* Full-width Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/generationen-kraft.jpg"
            alt="Generationen trainieren gemeinsam im urbanen Raum"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>

        {/* Content */}
        <div className="container-content relative z-10 py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={appleTransition}
            className="max-w-2xl"
          >
            <p className="text-body-sm text-white/70 mb-4">
              Das Konzept
            </p>
            <h1 className="text-display text-white leading-tight">
              Was wäre wenn...
            </h1>
            <p className="mt-6 text-title-3 text-white/90 font-normal leading-relaxed">
              ...jede Treppe zum Trainingsgerät wird?<br />
              ...jede Mauer zum Balancierbalken?<br />
              ...jeder Weg zur Bewegungsroute?
            </p>
            <p className="mt-8 text-body-lg text-white/70 max-w-xl">
              RubikONE macht sichtbar, was schon da ist. Keine neuen Geräte – nur ein neuer Blick auf den öffentlichen Raum.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Das Prinzip mit Vorher/Nachher Slider */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
            className="mb-12"
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
              Das Prinzip
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]">
              Keine neuen Geräte. Nur ein neuer Blick.
            </h2>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl">
              RubikONE nutzt bestehende urbane Elemente und macht sie durch Beschilderung und Farbmarkierungen als Bewegungsräume sichtbar.
            </p>
          </motion.div>

          {/* Vorher/Nachher Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: 0.1 }}
          >
            <div
              ref={sliderRef}
              className="relative aspect-[16/9] rounded-2xl overflow-hidden cursor-ew-resize select-none"
              onMouseMove={handleMouseMove}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => setIsDragging(false)}
            >
              {/* Nachher Bild (Hintergrund) */}
              <Image
                src="/images/konzept/nachher.jpg"
                alt="Nachher: Aktivierter Bewegungsraum"
                fill
                className="object-cover"
                draggable={false}
              />

              {/* Vorher Bild (Overlay mit Clip) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <Image
                  src="/images/konzept/vorher.jpg"
                  alt="Vorher: Ungenutzte Infrastruktur"
                  fill
                  className="object-cover"
                  draggable={false}
                />
              </div>

              {/* Slider Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
                style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                onMouseDown={() => setIsDragging(true)}
                onTouchStart={() => setIsDragging(true)}
              >
                {/* Handle Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <div className="flex items-center gap-1">
                    <ArrowLeft className="h-4 w-4 text-[var(--color-apple-gray-600)]" />
                    <ArrowRight className="h-4 w-4 text-[var(--color-apple-gray-600)]" />
                  </div>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full">
                <span className="text-body-sm font-medium text-[var(--color-apple-gray-600)]">Vorher</span>
              </div>
              <div className="absolute bottom-4 right-4 bg-[var(--color-apple-blue)] px-4 py-2 rounded-full">
                <span className="text-body-sm font-medium text-white">Nachher</span>
              </div>
            </div>
          </motion.div>

          {/* 3 Elemente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: 0.2 }}
            className="mt-12 grid md:grid-cols-3 gap-6"
          >
            {[
              { title: "Beschilderung", desc: "Klare Schilder mit Übungen und QR-Codes für Video-Anleitungen" },
              { title: "Farbmarkierungen", desc: "Farbige Markierungen zeigen, wo trainiert wird" },
              { title: "Normenkonform", desc: "Entspricht allen relevanten Schweizer Sicherheitsnormen" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4 bg-[var(--color-apple-gray-100)] rounded-2xl p-6">
                <div className="w-8 h-8 rounded-full bg-[var(--color-apple-blue)] flex items-center justify-center flex-shrink-0">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-body font-semibold text-[var(--color-apple-dark)]">{item.title}</p>
                  <p className="text-body-sm text-[var(--color-apple-gray-600)] mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Beispiel-Posten - Slider */}
      <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)] overflow-hidden">
        {/* Header */}
        <div className="container-content mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
              Beispiele aus Köniz
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]">
              Natürliche Bewegungen, klar erklärt.
            </h2>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl">
              Jeder Posten zeigt Übungen mit Illustrationen und zusätzlichen Challenges für ganzheitliches Lernen.
            </p>
          </motion.div>
        </div>

        {/* Slider */}
        <div
          ref={postenScrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="slider-spacer" />

          {POSTEN_SCHILDER.map((posten, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <div className="relative w-[260px] lg:w-[300px] rounded-2xl overflow-hidden shadow-apple">
                <Image
                  src={posten.image}
                  alt={`Posten ${posten.nummer}`}
                  width={300}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          ))}

          <div className="slider-spacer" />
        </div>

        {/* Navigation */}
        <div className="container-content mt-6">
          <div className="flex justify-end gap-4">
            <button
              onClick={() => scrollPosten("left")}
              className="hover:text-[var(--color-apple-blue)] transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
            </button>
            <button
              onClick={() => scrollPosten("right")}
              className="hover:text-[var(--color-apple-blue)] transition-colors"
            >
              <ArrowRight className="h-6 w-6 text-[var(--color-apple-gray-500)]" />
            </button>
          </div>
        </div>
      </section>

      {/* Die 5 Lerndimensionen mit Modals */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
            className="mb-12"
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
              TRUST Education
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)] max-w-2xl">
              Mehr als Bewegung. Ganzheitliches Lernen.
            </h2>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl">
              Jeder Posten fördert fünf Lerndimensionen gleichzeitig – durch zusätzliche Challenges auf jedem Schild.
            </p>
          </motion.div>

          {/* 5 Dimensionen - Clickable Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {LERNDIMENSIONEN.map((dim, index) => (
              <motion.div
                key={dim.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...appleTransition, delay: index * 0.1 }}
                onClick={() => setActiveModal(dim.id)}
                className="bg-white rounded-2xl p-8 text-center cursor-pointer shadow-apple hover:shadow-apple-lg transition-all group"
              >
                <div className="w-16 h-16 mx-auto mb-5 relative group-hover:scale-110 transition-transform">
                  <Image
                    src={dim.icon}
                    alt={dim.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-headline font-semibold text-[var(--color-apple-dark)] mb-2">
                  {dim.title}
                </h3>
                <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-4">
                  {dim.shortDesc}
                </p>
                <span className="inline-flex items-center gap-1 text-body-sm text-[var(--color-apple-blue)] font-medium">
                  Mehr
                  <ArrowRight className="h-4 w-4" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sicherheit */}
      <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={appleTransition}
            >
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
                Normenkonform
              </p>
              <h2 className="text-title-1 text-[var(--color-apple-dark)]">
                Sicherheit nach Schweizer Standards.
              </h2>
              <p className="mt-6 text-body-lg text-[var(--color-apple-gray-700)]">
                Jeder RubikONE entspricht den relevanten Schweizer Sicherheitsnormen für Fitnessgeräte im Aussenbereich.
              </p>

              {/* Normen */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {NORMEN.map((norm, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 shadow-apple">
                    <p className="text-body-sm font-mono font-semibold text-[var(--color-apple-blue)]">{norm.code}</p>
                    <p className="text-caption text-[var(--color-apple-gray-600)] mt-1">{norm.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: 0.1 }}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/images/konzept/wegweiser.jpg"
                  alt="RubikONE Beschilderung"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-[var(--color-apple-blue)]">
        <div className="container-content text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
          >
            <h2 className="text-title-1 text-white">
              Überzeugt? Erleben Sie es selbst.
            </h2>
            <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto">
              In Köniz können Sie RubikONE live erleben. Oder buchen Sie einen Impulsworkshop für Ihre Gemeinde.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/koeniz" className="btn-primary bg-white text-[var(--color-apple-blue)] hover:bg-white/90">
                Fallstudie Köniz
              </Link>
              <Link href="/impulsworkshop" className="btn-secondary text-white hover:text-white/80">
                Impulsworkshop anfragen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modal für Lerndimensionen */}
      <AnimatePresence>
        {activeModal && activeDimension && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 pb-4 overflow-y-auto"
            onClick={() => setActiveModal(null)}
          >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={appleTransition}
              className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-[var(--color-apple-gray-100)] rounded-full flex items-center justify-center hover:bg-[var(--color-apple-gray-200)] transition-colors"
              >
                <X className="h-5 w-5 text-[var(--color-apple-gray-600)]" />
              </button>

              {/* Content */}
              <div className="p-8">
                {/* Icon & Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={activeDimension.icon}
                      alt={activeDimension.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)]">Lerndimension</p>
                    <h3 className="text-title-2 text-[var(--color-apple-dark)]">
                      {activeDimension.modalTitle}
                    </h3>
                  </div>
                </div>

                {/* Text */}
                <div className="text-body text-[var(--color-apple-gray-700)] whitespace-pre-line leading-relaxed">
                  {activeDimension.modalContent}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
