import { Variants, Transition } from "framer-motion";

// Apple-style easing
export const appleEasing = [0.25, 0.1, 0.25, 1.0] as const;
export const appleSpring = [0.175, 0.885, 0.32, 1.275] as const;
export const outExpo = [0.19, 1, 0.22, 1] as const;

// Standard transitions
export const appleTransition: Transition = {
  duration: 0.6,
  ease: appleEasing,
};

export const fastTransition: Transition = {
  duration: 0.3,
  ease: appleEasing,
};

export const springTransition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

// Fade Up Animation
export const fadeUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: appleTransition,
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: fastTransition,
  },
};

// Fade In Animation
export const fadeIn: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: appleTransition,
  },
  exit: {
    opacity: 0,
    transition: fastTransition,
  },
};

// Scale In Animation
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: appleTransition,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: fastTransition,
  },
};

// Slide In from Right
export const slideInRight: Variants = {
  initial: {
    opacity: 0,
    x: 20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: appleTransition,
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: fastTransition,
  },
};

// Slide In from Left
export const slideInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: appleTransition,
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: fastTransition,
  },
};

// Stagger Container
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger Container with more delay
export const staggerContainerSlow: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Stagger Item (use with staggerContainer)
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: appleTransition,
  },
};

// Card Hover Animation
export const cardHover: Variants = {
  initial: {
    y: 0,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },
  hover: {
    y: -4,
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
    transition: {
      duration: 0.3,
      ease: appleEasing,
    },
  },
};

// Button Tap Animation
export const buttonTap = {
  scale: 0.98,
  transition: {
    duration: 0.1,
  },
};

// Navigation Menu Animation
export const menuAnimation: Variants = {
  initial: {
    opacity: 0,
    y: -10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: appleEasing,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15,
    },
  },
};

// Page Transition
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: appleEasing,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Scroll Reveal Animation (for use with whileInView)
export const scrollReveal: Variants = {
  initial: {
    opacity: 0,
    y: 40,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: appleEasing,
    },
  },
};

// Viewport settings for scroll animations
export const viewportSettings = {
  once: true,
  margin: "-100px",
};

// Counter Animation (for animated numbers)
export const counterAnimation = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

// Accordion Animation
export const accordionAnimation: Variants = {
  initial: {
    height: 0,
    opacity: 0,
  },
  animate: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.3,
        ease: appleEasing,
      },
      opacity: {
        duration: 0.25,
        delay: 0.05,
      },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.3,
        ease: appleEasing,
      },
      opacity: {
        duration: 0.2,
      },
    },
  },
};

// Helper function to create delayed variants
export function withDelay(variants: Variants, delay: number): Variants {
  return {
    ...variants,
    animate: {
      ...variants.animate,
      transition: {
        ...(variants.animate as any)?.transition,
        delay,
      },
    },
  };
}
