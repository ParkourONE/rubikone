"use client";

import Link from "next/link";
import Image from "next/image";
import { Settings } from "lucide-react";
import { SITE_CONFIG, FOOTER_LINKS } from "@/lib/constants";
import { useConsent } from "@/providers/consent-provider";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { openSettings } = useConsent();

  return (
    <footer className="bg-[var(--color-apple-gray-100)] border-t border-[var(--color-apple-gray-200)]">
      {/* Main Footer */}
      <div className="container-wide py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="col-span-2">
            <Link
              href="/"
              className="text-lg font-semibold text-[var(--color-apple-dark)]"
            >
              {SITE_CONFIG.name}
            </Link>
            <p className="mt-3 text-body-sm text-[var(--color-apple-gray-600)] max-w-xs">
              RubikONE verwandelt bestehende Orte in Bewegungsräume – clever. nachhaltig. flexibel.
            </p>

            {/* ParkourONE Logo */}
            <div className="mt-6">
              <a
                href="https://schweiz.parkourone.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <Image
                  src="/images/logos/parkourone-logo.png"
                  alt="ParkourONE"
                  width={180}
                  height={60}
                  className="h-10 w-auto"
                />
              </a>
            </div>

            <div className="mt-4 text-body-sm text-[var(--color-apple-gray-600)] space-y-0.5">
              <p className="font-medium">ParkourONE GmbH</p>
              <p>Südstrasse 16</p>
              <p>SPOT 101</p>
              <p>3110 Münsingen</p>
              <a
                href="mailto:info@rubikone.ch"
                className="text-[var(--color-apple-blue)] hover:underline"
              >
                info@rubikone.ch
              </a>
            </div>
          </div>

          {/* Hauptseiten */}
          <div>
            <h3 className="text-caption font-semibold uppercase tracking-wider text-[var(--color-apple-gray-600)] mb-4">
              Seiten
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.hauptseiten.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-[var(--color-apple-gray-700)] hover:text-[var(--color-apple-dark)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partner & Rechtliches */}
          <div>
            <h3 className="text-caption font-semibold uppercase tracking-wider text-[var(--color-apple-gray-600)] mb-4">
              Partner
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.partner.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-col gap-2 hover:opacity-80 transition-opacity"
                  >
                    {'logo' in link && link.logo && (
                      <div className="p-2 bg-white rounded-lg shadow-md">
                        <Image
                          src={link.logo}
                          alt={link.label}
                          width={60}
                          height={40}
                          className="h-8 w-auto object-contain"
                        />
                      </div>
                    )}
                    <span className="text-body-sm text-[var(--color-apple-gray-700)]">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="text-caption font-semibold uppercase tracking-wider text-[var(--color-apple-gray-600)] mb-4 mt-8">
              Rechtliches
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.rechtliches.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-[var(--color-apple-gray-700)] hover:text-[var(--color-apple-dark)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  onClick={openSettings}
                  className="text-body-sm text-[var(--color-apple-gray-700)] hover:text-[var(--color-apple-dark)] transition-colors inline-flex items-center gap-1.5"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Cookie-Einstellungen
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[var(--color-apple-gray-200)]">
        <div className="container-wide py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-caption text-[var(--color-apple-gray-500)]">
            © {currentYear} {SITE_CONFIG.company}. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-4 text-caption text-[var(--color-apple-gray-500)]">
            <button
              onClick={openSettings}
              className="hover:text-[var(--color-apple-gray-700)] transition-colors"
            >
              Cookie-Einstellungen
            </button>
            <span className="inline-flex items-center gap-1">
              Made in Switzerland
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
