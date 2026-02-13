"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { appleTransition } from "@/lib/animations";

export function VideoSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="py-16 lg:py-24 bg-[var(--color-apple-gray-100)]">
      <div className="container-content">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={appleTransition}
          className="text-center mb-12"
        >
          <p className="text-body-sm text-[var(--color-apple-gray-600)] mb-2">Heute in Köniz</p>
          <h2 className="text-title-1 text-[var(--color-apple-dark)]">
            RubikONE in Aktion
          </h2>
          <p className="mt-4 text-body-lg text-[var(--color-apple-gray-600)] max-w-2xl mx-auto">
            2024 eröffnete die Gemeinde Köniz den ersten RubikONE überhaupt. Die Erkenntnis nach 12 Monaten: Wartung Fr. 0.-. Akzeptanz & Dankbarkeit in der Nachbarschaft. Begeisterte Lehrpersonen.
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
  );
}
