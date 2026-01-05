"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useState } from "react";
import { HERO_CONTENT } from "@/lib/constants";
import { staggerContainer, staggerItem, appleTransition } from "@/lib/animations";

// Main Hero Section - Split Layout
export function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <>
      {/* Hero with Split Layout - Not full height */}
      <section className="relative pt-24 lg:pt-32 pb-12 lg:pb-24 bg-white overflow-hidden">
        <div className="w-full">
          <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-0">
            {/* Left: Content */}
            <div className="px-6 lg:px-12 xl:px-20">
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="max-w-xl"
              >
                {/* Brand Tag */}
                <motion.div variants={staggerItem}>
                  <span className="inline-block px-4 py-2 bg-[var(--color-apple-gray-100)] rounded-full text-[var(--color-apple-gray-600)] text-body-sm font-medium mb-6">
                    RubikONE – Der Fitnessparkour
                  </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  variants={staggerItem}
                  className="text-hero text-[var(--color-apple-dark)]"
                >
                  Bewegung beginnt
                  <br />
                  <span className="text-[var(--color-apple-blue)]">
                    vor der Haustür.
                  </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  variants={staggerItem}
                  className="mt-8 text-body-lg text-[var(--color-apple-gray-600)]"
                >
                  RubikONE verwandelt Ihre Gemeinde in einen Bewegungsraum.
                  Ohne neue Geräte. Ohne Tiefbau. Mit wissenschaftlich bewiesener Wirkung.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  variants={staggerItem}
                  className="mt-10 flex flex-col sm:flex-row gap-4"
                >
                  <Link href={HERO_CONTENT.ctaPrimary.href} className="btn-primary">
                    {HERO_CONTENT.ctaPrimary.label}
                  </Link>
                  <Link href={HERO_CONTENT.ctaSecondary.href} className="btn-secondary">
                    {HERO_CONTENT.ctaSecondary.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Right: Image - With rounded corners and padding */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...appleTransition, delay: 0.3 }}
              className="relative h-[40vh] lg:h-[500px] px-6 lg:px-0 lg:pr-8"
            >
              <div className="relative w-full h-full rounded-2xl lg:rounded-3xl overflow-hidden shadow-apple-xl">
                <Image
                  src="/images/hero/oma-enkelin.jpg"
                  alt="Generationen bewegen sich gemeinsam"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* Video Section - Separate */}
      <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={appleTransition}
            className="text-center mb-12"
          >
            <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">RubikONE in Aktion</p>
            <h2 className="text-title-1 text-[var(--color-apple-dark)]">
              So funktioniert es.
            </h2>
            <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl mx-auto">
              Erleben Sie, wie RubikONE Gemeinden in Bewegung bringt – am Beispiel unseres Pilotprojekts in Köniz.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...appleTransition, delay: 0.1 }}
          >
            <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-apple-xl">
              {showVideo ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src="https://www.youtube.com/embed/wGEUzjLv0Ac?autoplay=1"
                    title="RubikONE Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div
                  className="aspect-video relative cursor-pointer group"
                  onClick={() => setShowVideo(true)}
                >
                  <Image
                    src="/images/hero/generationen-kraft.jpg"
                    alt="RubikONE Video"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-8 w-8 text-[var(--color-apple-blue)] ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

    </>
  );
}

// Page Hero for inner pages - with optional background image
interface PageHeroProps {
  title: string;
  description?: string;
  breadcrumb?: string;
  image?: string;
  imageAlt?: string;
}

export function PageHero({ title, description, breadcrumb, image, imageAlt }: PageHeroProps) {
  // Hero with background image
  if (image) {
    return (
      <section className="relative min-h-[50vh] lg:min-h-[60vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={imageAlt || title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="container-content relative z-10 py-24 lg:py-32">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            {breadcrumb && (
              <motion.p
                variants={staggerItem}
                className="text-body-sm text-white/70 mb-3"
              >
                {breadcrumb}
              </motion.p>
            )}
            <motion.h1 variants={staggerItem} className="text-display text-white">
              {title}
            </motion.h1>
            {description && (
              <motion.p
                variants={staggerItem}
                className="mt-4 text-body-lg text-white/80"
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  // Simple hero without image
  return (
    <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="max-w-3xl"
        >
          {breadcrumb && (
            <motion.p
              variants={staggerItem}
              className="text-body-sm text-[var(--color-apple-gray-600)] mb-3"
            >
              {breadcrumb}
            </motion.p>
          )}
          <motion.h1 variants={staggerItem} className="text-display">
            {title}
          </motion.h1>
          {description && (
            <motion.p
              variants={staggerItem}
              className="mt-4 text-body-lg text-[var(--color-apple-gray-600)]"
            >
              {description}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
