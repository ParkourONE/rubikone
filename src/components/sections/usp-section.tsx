"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { appleTransition } from "@/lib/animations";
import { USP_ITEMS } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

type UspItem = {
  _id?: string;
  title: string;
  description: string;
  image: string;
};

function UspCard({ item, index }: { item: UspItem; index: number }) {
  const cardEdit = useEditPath(`USP_ITEMS.${index}`);
  const titleEdit = useEditPath(`USP_ITEMS.${index}.title`);
  const descEdit = useEditPath(`USP_ITEMS.${index}.description`);
  const imageEdit = useEditPath(`USP_ITEMS.${index}.image`);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...appleTransition, delay: index * 0.1 }}
      className="flex-shrink-0 w-[320px]"
      {...cardEdit}
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-apple h-full">
        <div className="relative aspect-[4/3]" {...imageEdit}>
          <Image src={item.image} alt={item.title} fill className="object-cover" />
        </div>
        <div className="p-6">
          <h3
            className="text-headline text-[var(--color-apple-dark)] mb-3"
            {...titleEdit}
          >
            {item.title}
          </h3>
          <p
            className="text-body-sm text-[var(--color-apple-gray-600)]"
            {...descEdit}
          >
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function USPSection() {
  const uspItems = useContent<UspItem[]>("USP_ITEMS", USP_ITEMS);
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
          <UspCard key={item._id ?? index} item={item} index={index} />
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
