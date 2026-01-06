"use client";

import { useEffect } from "react";

/**
 * Scroll lock hook using position: fixed approach.
 * This reliably locks the background on ALL browsers including iOS Safari.
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    const body = document.body;
    const html = document.documentElement;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    // Save original styles
    const originalStyles = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
    };

    // Lock background with position: fixed
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    // Compensate for scrollbar width
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = originalStyles.bodyOverflow;
      body.style.position = originalStyles.bodyPosition;
      body.style.top = originalStyles.bodyTop;
      body.style.left = originalStyles.bodyLeft;
      body.style.right = originalStyles.bodyRight;
      body.style.width = originalStyles.bodyWidth;
      body.style.paddingRight = originalStyles.bodyPaddingRight;
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
    };
  }, [isLocked]);
}
