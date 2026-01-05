import Link from "next/link";
import { SITE_CONFIG, FOOTER_LINKS, CONTACT_INFO } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

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
              {SITE_CONFIG.description}
            </p>
            <div className="mt-4 text-body-sm text-[var(--color-apple-gray-600)]">
              <p>Ein Projekt von</p>
              <a
                href={SITE_CONFIG.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-apple-blue)] hover:underline"
              >
                {SITE_CONFIG.company}
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
                    className="text-body-sm text-[var(--color-apple-gray-700)] hover:text-[var(--color-apple-dark)] transition-colors"
                  >
                    {link.label}
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
          <div className="flex items-center gap-2 text-caption text-[var(--color-apple-gray-500)]">
            <span className="inline-flex items-center gap-1">
              Made in Switzerland
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
