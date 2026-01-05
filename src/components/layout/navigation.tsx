"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS, SITE_CONFIG } from "@/lib/constants";
import { menuAnimation } from "@/lib/animations";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-12 transition-all duration-300",
          isScrolled
            ? "bg-white/80 nav-blur border-b border-[var(--color-apple-gray-200)]"
            : "bg-transparent"
        )}
      >
        <nav className="container-wide h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-[var(--color-apple-dark)]"
          >
            {SITE_CONFIG.name}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link",
                  pathname === item.href && "opacity-100 font-semibold"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="/kontakt" className="btn-primary text-sm py-2 px-5">
              Beratung anfragen
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 -mr-2"
            aria-label={isMobileMenuOpen ? "Menü schliessen" : "Menü öffnen"}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-white md:hidden"
          >
            <motion.nav
              initial="initial"
              animate="animate"
              exit="exit"
              variants={{
                initial: {},
                animate: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.1,
                  },
                },
                exit: {},
              }}
              className="flex flex-col pt-20 px-6"
            >
              {NAVIGATION_ITEMS.map((item) => (
                <motion.div key={item.href} variants={menuAnimation}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-4 text-2xl font-medium border-b border-[var(--color-apple-gray-200)]",
                      pathname === item.href
                        ? "text-[var(--color-apple-blue)]"
                        : "text-[var(--color-apple-dark)]"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={menuAnimation} className="mt-8">
                <Link href="/kontakt" className="btn-primary w-full text-center">
                  Beratung anfragen
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
