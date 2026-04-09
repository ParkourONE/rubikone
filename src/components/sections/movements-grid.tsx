"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { appleTransition } from "@/lib/animations";
import { MOVEMENTS_GRID } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

type MovementTag = { _id?: string; title: string };

function MovementPill({ item, index }: { item: MovementTag; index: number }) {
  const edit = useEditPath(`MOVEMENTS_GRID.${index}.title`);
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ ...appleTransition, delay: index * 0.05 }}
      className="px-4 py-2 bg-[var(--color-apple-gray-100)] rounded-full text-body font-medium text-[var(--color-apple-dark)] hover:bg-[var(--color-apple-blue)] hover:text-white transition-colors cursor-default"
      {...edit}
    >
      {item.title}
    </motion.span>
  );
}

export function MovementsGrid() {
  const MOVEMENTS = useContent<MovementTag[]>("MOVEMENTS_GRID", MOVEMENTS_GRID);
  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="text-center mb-12"
        >
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">
            Individuell angepasst
          </p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">
            Wir planen Ihre Route.
          </h2>
          <p className="text-body-lg text-[var(--color-apple-gray-600)] mt-4 max-w-2xl mx-auto">
            Jede RubikONE-Installation ist einzigartig. Wir wählen die besten Standorte in Ihrer Gemeinde aus – dort, wo Bewegung natürlich entsteht.
          </p>
        </motion.div>

        {/* Main Card with Image and Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...appleTransition, delay: 0.1 }}
        >
          <div className="bg-white rounded-3xl overflow-hidden shadow-apple-lg">
            <div className="grid lg:grid-cols-2">
              {/* Image Side */}
              <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
                <Image
                  src="/images/hero/generationen-kraft.jpg"
                  alt="Natürliche Bewegungen"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent lg:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h3 className="text-title-2 text-[var(--color-apple-dark)] mb-4">
                  9 natürliche Bewegungen
                </h3>
                <p className="text-body text-[var(--color-apple-gray-700)] mb-6">
                  Menschen bewegen sich seit Jahrtausenden auf diese Art. RubikONE macht diese natürlichen Bewegungsmuster im öffentlichen Raum sichtbar und zugänglich.
                </p>

                {/* Movement Tags */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {MOVEMENTS.map((movement, index) => (
                    <MovementPill
                      key={movement._id ?? movement.title}
                      item={movement}
                      index={index}
                    />
                  ))}
                </div>

                {/* Info Text */}
                <div className="p-4 bg-[var(--color-apple-gray-100)] rounded-xl mb-6">
                  <p className="text-body-sm text-[var(--color-apple-gray-700)]">
                    <span className="font-semibold">Multidimensionales Lernen:</span> Jeder Posten fördert verschiedene Lerndimensionen – motorisch, kognitiv, emotional, sozial und sensorisch.
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href="/konzept"
                  className="btn-secondary inline-flex self-start"
                >
                  Konzept entdecken
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
