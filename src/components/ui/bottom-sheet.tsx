"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { useScrollLock } from "@/hooks/useScrollLock";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

/**
 * Apple-style Bottom Sheet component.
 * Slides up from bottom, content inside scrolls, can be dragged to close.
 */
export function BottomSheet({ isOpen, onClose, children, title }: BottomSheetProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Handle drag to close
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If dragged down more than 100px or with high velocity, close
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[95vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex-shrink-0 pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 bg-[var(--color-apple-gray-300)] rounded-full mx-auto" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex-shrink-0 px-6 pb-4 border-b border-[var(--color-apple-gray-200)]">
                <div className="flex items-center justify-between">
                  <h2 className="text-title-3 font-semibold text-[var(--color-apple-dark)]">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-[var(--color-apple-gray-100)] rounded-full flex items-center justify-center hover:bg-[var(--color-apple-gray-200)] transition-colors"
                  >
                    <X className="h-4 w-4 text-[var(--color-apple-gray-600)]" />
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable Content */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto overscroll-contain"
              onPointerDown={(e) => e.stopPropagation()} // Prevent drag when scrolling
            >
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
