"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { appleTransition } from "@/lib/animations";

// The 5 TRUST Education learning dimensions
const LERNDIMENSIONEN = [
  {
    id: "motorisch",
    title: "Motorisch",
    icon: "/images/lerndimensionen/motorisch.jpg",
    description: "Körperliche Bewegung und Koordination",
    example: "Balanciere auf einem Bein während der Übung",
    color: "bg-emerald-500",
  },
  {
    id: "kognitiv",
    title: "Kognitiv",
    icon: "/images/lerndimensionen/kognitiv.jpg",
    description: "Denken, Problemlösung und Konzentration",
    example: "Zähle rückwärts von 20 während du balancierst",
    color: "bg-blue-500",
  },
  {
    id: "emotional",
    title: "Emotional",
    icon: "/images/lerndimensionen/emotional.jpg",
    description: "Gefühle wahrnehmen und ausdrücken",
    example: "Lächle während jeder Übung",
    color: "bg-amber-500",
  },
  {
    id: "sozial",
    title: "Sozial",
    icon: "/images/lerndimensionen/sozial.jpg",
    description: "Gemeinsam bewegen und interagieren",
    example: "Grüsse alle Personen, denen du begegnest",
    color: "bg-rose-500",
  },
  {
    id: "sensorisch",
    title: "Sensorisch",
    icon: "/images/lerndimensionen/sensorisch.jpg",
    description: "Sinne schärfen und bewusst wahrnehmen",
    example: "Schliesse die Augen während der Übung",
    color: "bg-violet-500",
  },
];

export function LerndimensionenSection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-content">
        {/* Header */}
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
          <h2 className="text-title-1 text-[var(--color-apple-dark)] max-w-3xl">
            Mehr als Bewegung. Ganzheitliches Lernen.
          </h2>
          <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl">
            Jeder Posten fördert fünf Lerndimensionen gleichzeitig. So wird aus einer einfachen Übung ein multidimensionales Lernerlebnis.
          </p>
        </motion.div>

        {/* 5 Dimensions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-12">
          {LERNDIMENSIONEN.map((dimension, index) => (
            <motion.div
              key={dimension.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: index * 0.1 }}
              className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6 text-center hover:shadow-apple transition-shadow"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <Image
                  src={dimension.icon}
                  alt={dimension.title}
                  fill
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-headline font-semibold text-[var(--color-apple-dark)] mb-2">
                {dimension.title}
              </h3>

              {/* Description */}
              <p className="text-body-sm text-[var(--color-apple-gray-600)]">
                {dimension.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* How it works - Example Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...appleTransition, delay: 0.3 }}
          className="bg-[var(--color-apple-gray-100)] rounded-3xl overflow-hidden"
        >
          <div className="grid lg:grid-cols-2">
            {/* Image Side */}
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px]">
              <Image
                src="/images/posten/posten-1.jpg"
                alt="RubikONE Posten mit Lerndimensionen"
                fill
                className="object-cover"
              />
            </div>

            {/* Content Side */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-title-2 text-[var(--color-apple-dark)] mb-4">
                So funktioniert es
              </h3>
              <p className="text-body text-[var(--color-apple-gray-700)] mb-6">
                Jeder Posten zeigt neben den Hauptübungen zusätzliche Challenges. Diese kleinen Aufgaben aktivieren verschiedene Lerndimensionen und machen die Bewegung zum ganzheitlichen Erlebnis.
              </p>

              {/* Example Challenges */}
              <div className="space-y-3">
                <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">
                  Beispiel-Challenges:
                </p>
                {LERNDIMENSIONEN.slice(0, 3).map((dim) => (
                  <div
                    key={dim.id}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3"
                  >
                    <div className="w-8 h-8 relative flex-shrink-0">
                      <Image
                        src={dim.icon}
                        alt={dim.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-body-sm text-[var(--color-apple-gray-700)]">
                      <span className="font-medium">{dim.title}:</span> {dim.example}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
