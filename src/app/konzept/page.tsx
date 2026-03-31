"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, X, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { appleTransition } from "@/lib/animations";
import { useScrollLock } from "@/hooks/useScrollLock";
import { ComparisonSection } from "@/components/sections/comparison-table";
import { StatsSection } from "@/components/sections/stats-section";
import { EditableSection } from "@/components/admin/editable-section";
import { useContent } from "@/hooks/useContent";
import {
  KONZEPT_HERO,
  KONZEPT_PRINZIP,
  KONZEPT_POSTEN_SLIDER,
  KONZEPT_LERNDIMENSIONEN,
  KONZEPT_SICHERHEIT,
  KONZEPT_CTA,
} from "@/lib/constants";

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

export default function KonzeptPage() {
  const postenScrollRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const hero = useContent("KONZEPT_HERO", KONZEPT_HERO) as any;
  const prinzip = useContent("KONZEPT_PRINZIP", KONZEPT_PRINZIP) as any;
  const postenSlider = useContent("KONZEPT_POSTEN_SLIDER", KONZEPT_POSTEN_SLIDER) as any;
  const lerndimensionen = useContent("KONZEPT_LERNDIMENSIONEN", KONZEPT_LERNDIMENSIONEN) as any;
  const sicherheit = useContent("KONZEPT_SICHERHEIT", KONZEPT_SICHERHEIT) as any;
  const cta = useContent("KONZEPT_CTA", KONZEPT_CTA) as any;

  // Lerndimensionen from content with icon paths
  const LERNDIMENSIONEN = (lerndimensionen.dimensions as any[]).map((d: any) => ({
    ...d,
    icon: `/images/lerndimensionen/${d.id}.jpg`,
  }));

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

  const activeDimension = LERNDIMENSIONEN.find((d: any) => d.id === activeModal);

  // Lock body scroll when modal is open
  useScrollLock(activeModal !== null);

  return (
    <>
      {/* Hero - Was wäre wenn - Split Layout */}
      <EditableSection contentKey="KONZEPT_HERO" label="Hero">
      {/* Mobile */}
      <section className="lg:hidden relative pt-24 pb-12 bg-white">
        <div className="px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={appleTransition}
            className="max-w-xl"
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-4">
              {hero.tagline}
            </p>
            <h1 className="text-hero text-[var(--color-apple-dark)] leading-tight">
              {hero.headline}
            </h1>
            <p className="mt-6 text-title-3 text-[var(--color-apple-dark)] font-normal leading-relaxed">
              {hero.questions.split("\n").map((line: string, i: number) => (
                <span key={i}>{line}{i < hero.questions.split("\n").length - 1 && <br />}</span>
              ))}
            </p>
            <p className="mt-6 text-body-lg text-[var(--color-apple-gray-600)] max-w-xl">
              {hero.description}
            </p>
          </motion.div>

          {/* Image below text on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...appleTransition, delay: 0.3 }}
            className="mt-10 relative h-[40vh] rounded-2xl overflow-hidden shadow-apple-xl"
          >
            <Image
              src={hero.heroImage}
              alt="Generationen trainieren gemeinsam im urbanen Raum"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Desktop: Split Layout */}
      <section className="hidden lg:block relative min-h-[calc(100vh-80px)] bg-white">
        <div className="grid grid-cols-2 min-h-[calc(100vh-80px)]">
          {/* Left: Content */}
          <div className="flex items-center px-12 xl:px-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={appleTransition}
              className="max-w-xl"
            >
              <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-4">
                {hero.tagline}
              </p>
              <h1 className="text-display text-[var(--color-apple-dark)] leading-tight">
                {hero.headline}
              </h1>
              <p className="mt-6 text-title-3 text-[var(--color-apple-dark)] font-normal leading-relaxed">
                {hero.questions.split("\n").map((line: string, i: number) => (
                  <span key={i}>{line}{i < hero.questions.split("\n").length - 1 && <br />}</span>
                ))}
              </p>
              <p className="mt-8 text-body-lg text-[var(--color-apple-gray-600)] max-w-xl">
                {hero.description}
              </p>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="mt-12"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown className="h-6 w-6 text-[var(--color-apple-gray-400)]" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Image - With padding and rounded corners */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...appleTransition, delay: 0.3 }}
            className="flex items-center pt-24 px-8 pb-8"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <Image
                src={hero.heroImage}
                alt="Generationen trainieren gemeinsam im urbanen Raum"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>

      </section>
      </EditableSection>

      {/* Das Prinzip mit Vorher/Nachher Slider */}
      <EditableSection contentKey="KONZEPT_PRINZIP" label="Das Prinzip">
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
              {prinzip.tagline}
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]">
              {prinzip.headline}
            </h2>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl">
              {prinzip.description}
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
            {(prinzip.elements as any[]).map((item: any, index: number) => (
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
      </EditableSection>

      {/* Was RubikONE auszeichnet */}
      <EditableSection contentKey="COMPARISON_TABLE" label="Vergleichstabelle">
        <ComparisonSection />
      </EditableSection>

      {/* Beispiel-Posten - Slider */}
      <EditableSection contentKey="KONZEPT_POSTEN_SLIDER" label="Posten-Slider">
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
              {postenSlider.tagline}
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]">
              {postenSlider.headline}
            </h2>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl">
              {postenSlider.description}
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
      </EditableSection>

      {/* Die 5 Lerndimensionen mit Modals */}
      <EditableSection contentKey="KONZEPT_LERNDIMENSIONEN" label="Lerndimensionen">
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
              {lerndimensionen.tagline}
            </p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)] max-w-2xl">
              {lerndimensionen.headline}
            </h2>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl">
              {lerndimensionen.description}
            </p>
          </motion.div>

          {/* 5 Dimensionen - Clickable Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {LERNDIMENSIONEN.map((dim: any, index: number) => (
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
      </EditableSection>

      {/* RubikONE funktioniert - Zahlen */}
      <EditableSection contentKey="STATS_CONTENT" label="Statistiken">
        <StatsSection />
      </EditableSection>

      {/* Sicherheit */}
      <EditableSection contentKey="KONZEPT_SICHERHEIT" label="Sicherheit">
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
                {sicherheit.tagline}
              </p>
              <h2 className="text-title-1 text-[var(--color-apple-dark)]">
                {sicherheit.headline}
              </h2>
              <p className="mt-6 text-body-lg text-[var(--color-apple-gray-700)]">
                {sicherheit.description}
              </p>

              {/* Normen */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {(sicherheit.normen as any[]).map((norm: any, index: number) => (
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
                  src={sicherheit.image}
                  alt="RubikONE Beschilderung"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      </EditableSection>

      {/* CTA */}
      <EditableSection contentKey="KONZEPT_CTA" label="Call-to-Action">
      <section className="py-16 lg:py-24 bg-[var(--color-apple-blue)]">
        <div className="container-content text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
          >
            <h2 className="text-title-1 text-white">
              {cta.headline}
            </h2>
            <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto">
              {cta.description}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={cta.ctaPrimary.href} className="btn-primary bg-white text-[var(--color-apple-blue)] hover:bg-white/90">
                {cta.ctaPrimary.label}
              </Link>
              <Link href={cta.ctaSecondary.href} className="btn-secondary text-white hover:text-white/80">
                {cta.ctaSecondary.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      </EditableSection>

      {/* Modal für Lerndimensionen */}
      <AnimatePresence>
        {activeModal && activeDimension && (
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
                  className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[630px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setActiveModal(null)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-[var(--color-apple-gray-100)] rounded-full flex items-center justify-center hover:bg-[var(--color-apple-gray-200)] transition-colors"
                  >
                    <X className="h-4 w-4 text-[var(--color-apple-gray-600)]" />
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

                <div className="flex-1" />
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
