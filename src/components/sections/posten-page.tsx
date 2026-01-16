"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp, ArrowLeft, ArrowRight, Lightbulb, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeUp } from "@/components/shared/fade-up";

interface Exercise {
  title: string;
  reps: string;
  description: string;
  image?: string;
}

interface FurtherExercise {
  title: string;
  description: string;
}

interface PostenPageProps {
  number: string;
  title: string;
  intro: string;
  exercises: Exercise[];
  furtherExercises: FurtherExercise[];
  tagescheck: string;
  potenzial: {
    title: string;
    content: string;
  };
  heroImage?: string;
  prevPosten?: { slug: string; title: string };
  nextPosten?: { slug: string; title: string };
}

export function PostenPage({
  number,
  title,
  intro,
  exercises,
  furtherExercises,
  tagescheck,
  potenzial,
  heroImage,
  prevPosten,
  nextPosten,
}: PostenPageProps) {
  const [showFurtherExercises, setShowFurtherExercises] = useState(false);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center bg-[var(--color-apple-dark)]">
        {heroImage && (
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt={title}
              fill
              className="object-cover opacity-40"
              priority
            />
          </div>
        )}
        <div className="container-content relative z-10 py-20">
          <FadeUp>
            <p className="text-body-lg text-[var(--color-apple-blue)] font-semibold mb-2">
              {number}
            </p>
            <h1 className="text-display text-white uppercase tracking-wide">
              {title}
            </h1>
          </FadeUp>
        </div>
      </section>

      {/* Intro */}
      <section className="section-spacing bg-white">
        <div className="container-content max-w-3xl">
          <FadeUp>
            <p className="text-body-lg text-[var(--color-apple-gray-700)] leading-relaxed">
              {intro}
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Exercises */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise, index) => (
              <FadeUp key={index} delay={index * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-apple h-full">
                  {exercise.image && (
                    <div className="relative aspect-[4/3] bg-[var(--color-apple-gray-200)]">
                      <Image
                        src={exercise.image}
                        alt={exercise.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-headline text-[var(--color-apple-dark)] mb-2">
                      {exercise.title}
                    </h3>
                    <p className="text-body-sm font-semibold text-[var(--color-apple-blue)] mb-3">
                      {exercise.reps}
                    </p>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)]">
                      {exercise.description}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Further Exercises Accordion */}
          {furtherExercises.length > 0 && (
            <FadeUp delay={0.3}>
              <div className="mt-8 max-w-2xl mx-auto">
                <button
                  onClick={() => setShowFurtherExercises(!showFurtherExercises)}
                  className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-apple hover:shadow-apple-lg transition-shadow"
                >
                  <span className="text-body font-semibold text-[var(--color-apple-dark)]">
                    Weitere Übungen
                  </span>
                  {showFurtherExercises ? (
                    <ChevronUp className="h-5 w-5 text-[var(--color-apple-gray-500)]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[var(--color-apple-gray-500)]" />
                  )}
                </button>
                <AnimatePresence>
                  {showFurtherExercises && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-white rounded-b-xl border-t border-[var(--color-apple-gray-200)]">
                        <div className="space-y-4">
                          {furtherExercises.map((exercise, index) => (
                            <div key={index} className="border-b border-[var(--color-apple-gray-200)] pb-4 last:border-0 last:pb-0">
                              <h4 className="text-body font-semibold text-[var(--color-apple-dark)] mb-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-apple-blue)] flex-shrink-0" />
                                {exercise.title}
                              </h4>
                              <p className="text-body-sm text-[var(--color-apple-gray-600)] ml-4">
                                {exercise.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeUp>
          )}
        </div>
      </section>

      {/* Tagescheck */}
      <section className="py-12 bg-white">
        <div className="container-content max-w-2xl">
          <FadeUp>
            <div className="p-6 bg-[var(--color-apple-blue)]/10 rounded-2xl border border-[var(--color-apple-blue)]/20">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-apple-blue)] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-caption font-semibold text-[var(--color-apple-blue)] uppercase tracking-wider mb-2">
                    Tagescheck
                  </p>
                  <p className="text-body-lg text-[var(--color-apple-dark)] font-medium">
                    {tagescheck}
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Potenzial */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content max-w-3xl">
          <FadeUp>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-apple-dark)] flex items-center justify-center flex-shrink-0">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-caption font-semibold text-[var(--color-apple-gray-600)] uppercase tracking-wider mb-1">
                  Potenzial
                </p>
                <h2 className="text-title-2 text-[var(--color-apple-dark)]">
                  {potenzial.title}
                </h2>
              </div>
            </div>
            <div
              className="prose prose-lg max-w-none text-[var(--color-apple-gray-700)]"
              dangerouslySetInnerHTML={{ __html: potenzial.content }}
            />
          </FadeUp>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-8 bg-white border-t border-[var(--color-apple-gray-200)]">
        <div className="container-content">
          <div className="flex justify-between items-center">
            {prevPosten ? (
              <Link
                href={`/${prevPosten.slug}`}
                className="flex items-center gap-2 text-body font-medium text-[var(--color-apple-gray-600)] hover:text-[var(--color-apple-dark)] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{prevPosten.title}</span>
                <span className="sm:hidden">Zurück</span>
              </Link>
            ) : (
              <div />
            )}

            {nextPosten ? (
              <Link
                href={`/${nextPosten.slug}`}
                className="flex items-center gap-2 text-body font-medium text-[var(--color-apple-gray-600)] hover:text-[var(--color-apple-dark)] transition-colors"
              >
                <span className="hidden sm:inline">{nextPosten.title}</span>
                <span className="sm:hidden">Weiter</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="py-8 bg-[var(--color-apple-dark)] text-white">
        <div className="container-content text-center">
          <p className="text-body-sm text-white/70 mb-2">Der Weg ist das Ziel</p>
          <a
            href="https://parkourone.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-body font-medium text-[var(--color-apple-blue)] hover:underline"
          >
            Parkourone.com
          </a>
        </div>
      </section>
    </>
  );
}
