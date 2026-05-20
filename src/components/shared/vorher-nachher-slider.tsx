"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { appleTransition } from "@/lib/animations";

interface VorherNachherSliderProps {
  vorherSrc: string;
  nachherSrc: string;
  vorherAlt?: string;
  nachherAlt?: string;
  vorherLabel?: string;
  nachherLabel?: string;
  className?: string;
  aspectClass?: string;
}

export function VorherNachherSlider({
  vorherSrc,
  nachherSrc,
  vorherAlt = "Vorher: Ungenutzte Infrastruktur",
  nachherAlt = "Nachher: Aktivierter Bewegungsraum",
  vorherLabel = "Vorher",
  nachherLabel = "Nachher",
  className = "",
  aspectClass = "aspect-[16/9]",
}: VorherNachherSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...appleTransition, delay: 0.1 }}
      className={className}
    >
      <div
        ref={sliderRef}
        className={`relative ${aspectClass} rounded-2xl overflow-hidden cursor-ew-resize select-none shadow-apple-lg`}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => setIsDragging(false)}
      >
        {/* Nachher Bild (Hintergrund) */}
        <Image
          src={nachherSrc}
          alt={nachherAlt}
          fill
          className="object-cover"
          priority
        />

        {/* Vorher Bild (Overlay mit Clip) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <Image
            src={vorherSrc}
            alt={vorherAlt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* Handle Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
            <div className="flex items-center gap-1">
              <svg className="w-3 h-3 text-[var(--color-apple-gray-500)] rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <svg className="w-3 h-3 text-[var(--color-apple-gray-500)]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-body-sm font-medium text-white">{vorherLabel}</span>
        </div>
        <div className="absolute bottom-4 right-4 bg-[var(--color-apple-blue)] px-3 py-1.5 rounded-full">
          <span className="text-body-sm font-medium text-white">{nachherLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}
