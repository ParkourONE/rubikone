"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HERO_CONTENT } from "@/lib/constants";
import { useContent } from "@/hooks/useContent";
import { staggerContainer, staggerItem, appleTransition } from "@/lib/animations";
import { useEditPath } from "@/components/cms/primitives";

// Main Hero Section - Split Layout
export function HeroSection() {
  const heroContent = useContent("HERO_CONTENT", HERO_CONTENT);
  const headlineEdit = useEditPath("HERO_CONTENT.headline");
  const subheadlineEdit = useEditPath("HERO_CONTENT.subheadline");
  const ctaPrimaryEdit = useEditPath("HERO_CONTENT.ctaPrimary");

  return (
    <>
      {/* Mobile: Classic Layout */}
      <section className="lg:hidden relative pt-24 pb-12 bg-white">
        <div className="px-6">
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
              {...headlineEdit}
            >
              {heroContent.headline}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={staggerItem}
              className="mt-8 text-body-lg text-[var(--color-apple-gray-600)]"
              {...subheadlineEdit}
            >
              {heroContent.subheadline}
            </motion.p>

            {/* CTA */}
            {heroContent.ctaPrimary && (
              <motion.div
                variants={staggerItem}
                className="mt-10 flex flex-col items-center sm:items-start sm:flex-row gap-4"
              >
                <Link href={heroContent.ctaPrimary.href} className="btn-primary" {...ctaPrimaryEdit}>
                  {heroContent.ctaPrimary.label}
                </Link>
              </motion.div>
            )}
          </motion.div>

          {/* Video */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...appleTransition, delay: 0.3 }}
            className="mt-10 relative h-[40vh] rounded-2xl overflow-hidden shadow-apple-xl"
          >
            <video
              src="/videos/hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Desktop: Clean Split Layout (Apple-Style) */}
      <section className="hidden lg:block relative min-h-[calc(100vh-80px)] bg-white">
        <div className="grid grid-cols-2 min-h-[calc(100vh-80px)]">
          {/* Left: Content */}
          <div className="flex items-center px-12 xl:px-20">
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
                className="text-display text-[var(--color-apple-dark)]"
                {...headlineEdit}
              >
                {heroContent.headline}
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={staggerItem}
                className="mt-8 text-body-lg text-[var(--color-apple-gray-600)]"
                {...subheadlineEdit}
              >
                {heroContent.subheadline}
              </motion.p>

              {/* CTA */}
              {heroContent.ctaPrimary && (
                <motion.div
                  variants={staggerItem}
                  className="mt-10 flex flex-row gap-4"
                >
                  <Link href={heroContent.ctaPrimary.href} className="btn-primary" {...ctaPrimaryEdit}>
                    {heroContent.ctaPrimary.label}
                  </Link>
                </motion.div>
              )}

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

          {/* Right: Video - With padding and rounded corners */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...appleTransition, delay: 0.3 }}
            className="flex items-center pt-24 px-8 pb-8"
          >
            <video
              src="/videos/hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover rounded-2xl"
            />
          </motion.div>
        </div>
      </section>

    </>
  );
}

// Page Hero for inner pages - Split Layout (Apple-Style)
interface PageHeroProps {
  title: string;
  description?: string;
  breadcrumb?: string;
  image?: string;
  imageAlt?: string;
}

export function PageHero({ title, description, breadcrumb, image, imageAlt }: PageHeroProps) {
  // Hero with image - Split Layout
  if (image) {
    return (
      <>
        {/* Mobile: Classic stacked layout */}
        <section className="lg:hidden relative pt-24 pb-12 bg-white">
          <div className="px-6">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="max-w-xl"
            >
              {breadcrumb && (
                <motion.p
                  variants={staggerItem}
                  className="text-body-sm text-[var(--color-apple-gray-600)] mb-3"
                >
                  {breadcrumb}
                </motion.p>
              )}
              <motion.h1 variants={staggerItem} className="text-hero text-[var(--color-apple-dark)]">
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

            {/* Image below text on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...appleTransition, delay: 0.3 }}
              className="mt-10 relative h-[40vh] rounded-2xl overflow-hidden shadow-apple-xl"
            >
              <Image
                src={image}
                alt={imageAlt || title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* Desktop: Clean Split Layout (Apple-Style) */}
        <section className="hidden lg:block relative min-h-[calc(100vh-80px)] bg-white">
          <div className="grid grid-cols-2 min-h-[calc(100vh-80px)]">
            {/* Left: Content */}
            <div className="flex items-center px-12 xl:px-20">
              <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="max-w-xl"
              >
                {breadcrumb && (
                  <motion.p
                    variants={staggerItem}
                    className="text-body-sm text-[var(--color-apple-gray-600)] mb-3"
                  >
                    {breadcrumb}
                  </motion.p>
                )}
                <motion.h1 variants={staggerItem} className="text-display text-[var(--color-apple-dark)]">
                  {title}
                </motion.h1>
                {description && (
                  <motion.p
                    variants={staggerItem}
                    className="mt-6 text-body-lg text-[var(--color-apple-gray-600)]"
                  >
                    {description}
                  </motion.p>
                )}

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
                  src={image}
                  alt={imageAlt || title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>

        </section>
      </>
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
