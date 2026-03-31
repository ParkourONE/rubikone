"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { appleTransition } from "@/lib/animations";

export function TestimonialsSection() {
  const testimonials = useContent("TESTIMONIALS", TESTIMONIALS);
  return (
    <section className="section-spacing bg-white">
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
            Stimmen zum Projekt
          </p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">
            Das sagen unsere Partner.
          </h2>
        </motion.div>

        {/* Testimonials Grid - Compact Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...appleTransition, delay: index * 0.1 }}
            >
              <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6 h-full">
                {/* Quote */}
                <div className="flex gap-3 mb-4">
                  <Quote className="h-6 w-6 text-[var(--color-apple-blue)] flex-shrink-0" strokeWidth={1.5} />
                  <p className="text-body text-[var(--color-apple-dark)] leading-relaxed">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>

                {/* Attribution */}
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-apple-gray-200)]">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5">
                    <Image
                      src={testimonial.logo}
                      alt={testimonial.author}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">
                      {testimonial.author}
                    </p>
                    <p className="text-caption text-[var(--color-apple-gray-600)]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Single testimonial for featured placement
export function SingleTestimonial({ index = 0 }: { index?: number }) {
  const testimonial = index === 1 ? (TESTIMONIALS as any)[1] : (TESTIMONIALS as any)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={appleTransition}
    >
      <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-6 max-w-xl mx-auto">
        <div className="flex gap-3 mb-4">
          <Quote className="h-6 w-6 text-[var(--color-apple-blue)] flex-shrink-0" strokeWidth={1.5} />
          <p className="text-body text-[var(--color-apple-dark)] leading-relaxed">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-apple-gray-200)]">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5">
            <Image
              src={testimonial.logo}
              alt={testimonial.author}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-body-sm font-semibold text-[var(--color-apple-dark)]">
              {testimonial.author}
            </p>
            <p className="text-caption text-[var(--color-apple-gray-600)]">
              {testimonial.role}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
