"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { appleTransition } from "@/lib/animations";
import { LERNDIMENSIONEN_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { useEditPath } from "@/components/cms/primitives";

type Lerndimension = {
  _id?: string;
  id: string;
  title: string;
  icon: string;
  description: string;
  example: string;
  color: string;
};

function LerndimensionCard({
  dimension,
  index,
}: {
  dimension: Lerndimension;
  index: number;
}) {
  const cardEdit = useEditPath(`LERNDIMENSIONEN_CONTENT.${index}`);
  const titleEdit = useEditPath(`LERNDIMENSIONEN_CONTENT.${index}.title`);
  const descEdit = useEditPath(`LERNDIMENSIONEN_CONTENT.${index}.description`);
  const iconEdit = useEditPath(`LERNDIMENSIONEN_CONTENT.${index}.icon`);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...appleTransition, delay: index * 0.1 }}
      className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6 text-center hover:shadow-apple transition-shadow"
      {...cardEdit}
    >
      <div className="w-16 h-16 mx-auto mb-4 relative" {...iconEdit}>
        <Image
          src={dimension.icon}
          alt={dimension.title}
          fill
          className="object-contain"
        />
      </div>
      <h3
        className="text-headline font-semibold text-[var(--color-apple-dark)] mb-2"
        {...titleEdit}
      >
        {dimension.title}
      </h3>
      <p
        className="text-body-sm text-[var(--color-apple-gray-600)]"
        {...descEdit}
      >
        {dimension.description}
      </p>
    </motion.div>
  );
}

function LerndimensionChallenge({
  dim,
  index,
}: {
  dim: Lerndimension;
  index: number;
}) {
  const exampleEdit = useEditPath(
    `LERNDIMENSIONEN_CONTENT.${index}.example`
  );
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3">
      <div className="w-8 h-8 relative flex-shrink-0">
        <Image
          src={dim.icon}
          alt={dim.title}
          fill
          className="object-contain"
        />
      </div>
      <p
        className="text-body-sm text-[var(--color-apple-gray-700)]"
        {...exampleEdit}
      >
        <span className="font-medium">{dim.title}:</span> {dim.example}
      </p>
    </div>
  );
}

export function LerndimensionenSection() {
  const LERNDIMENSIONEN = useContent<Lerndimension[]>(
    "LERNDIMENSIONEN_CONTENT",
    LERNDIMENSIONEN_CONTENT
  );
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
            <LerndimensionCard
              key={dimension._id ?? dimension.id}
              dimension={dimension}
              index={index}
            />
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
                {LERNDIMENSIONEN.slice(0, 3).map((dim, index) => (
                  <LerndimensionChallenge
                    key={dim._id ?? dim.id}
                    dim={dim}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
