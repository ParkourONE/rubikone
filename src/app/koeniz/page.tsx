import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Route, Calendar, Quote, ArrowRight, CheckCircle, Users, TrendingUp } from "lucide-react";
import { PageHero } from "@/components/sections/hero-section";
import { CTASection } from "@/components/sections/cta-section";
import { KOENIZ_CASE_STUDY, KOENIZ_DETAILS } from "@/lib/constants";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/fade-up";
import { SectionHeader } from "@/components/shared/section-header";

const GALLERY_IMAGES = [
  { src: "/images/koeniz/schulklasse.jpg", alt: "Schulklasse beim RubikONE Training" },
  { src: "/images/koeniz/kind-springt.jpg", alt: "Kind springt am Posten" },
  { src: "/images/koeniz/kinder-springen.jpg", alt: "Kinder springen gemeinsam" },
  { src: "/images/koeniz/spass.jpg", alt: "Spass beim Bewegen" },
  { src: "/images/koeniz/schloss.jpg", alt: "Schlossareal Köniz" },
];

export const metadata: Metadata = {
  title: "Fallstudie Köniz | RubikONE",
  description: "Die erste RubikONE-Installation der Schweiz. 9 Posten, 2.5 km Route, im denkmalgeschützten Schlossareal. Erfahren Sie, wie Köniz es gemacht hat.",
};

export default function KoenizPage() {
  return (
    <>
      <PageHero
        title="Köniz hat es bewiesen."
        description="Die erste RubikONE-Installation der Schweiz. 9 Posten. 2.5 km Route. Mitten im denkmalgeschützten Schlossareal."
        breadcrumb="Fallstudie Köniz"
        image="/images/koeniz/luftbild.jpg"
        imageAlt="Luftaufnahme RubikONE Köniz im Schlossareal"
      />

      {/* Intro Stats */}
      <section className="py-16 lg:py-20 bg-[var(--color-apple-gray-100)]">
        <div className="container-wide">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {[
              { value: "531", label: "Teilnehmende", icon: Users },
              { value: "94%", label: "verstehen sofort", icon: CheckCircle },
              { value: "0 CHF", label: "Wartungskosten", icon: TrendingUp },
              { value: "0", label: "Vandalismus", icon: CheckCircle },
            ].map((stat, index) => (
              <StaggerItem key={index}>
                <div className="text-center">
                  <stat.icon className="h-8 w-8 mx-auto text-[var(--color-apple-blue)] mb-3" />
                  <p className="text-display text-[var(--color-apple-dark)]">{stat.value}</p>
                  <p className="text-body text-[var(--color-apple-gray-600)] mt-1">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-spacing">
        <div className="container-wide">
          <FadeUp>
            <div className="aspect-[21/9] rounded-2xl overflow-hidden relative">
              <Image
                src="/images/koeniz/luftbild.jpg"
                alt="Luftaufnahme RubikONE Route Schlossareal Köniz"
                fill
                className="object-cover"
              />
            </div>
          </FadeUp>

          {/* Thumbnail Gallery */}
          <StaggerContainer className="mt-6 grid grid-cols-5 gap-4">
            {GALLERY_IMAGES.map((image, index) => (
              <StaggerItem key={index}>
                <div className="aspect-square rounded-xl overflow-hidden relative cursor-pointer group">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Die Geschichte */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <SectionHeader
            title="Die Geschichte"
            subtitle="November 2024 – Mai 2025"
          />

          <div className="mt-12 lg:mt-16">
            <FadeUp>
              <div className="max-w-3xl mx-auto">
                <p className="text-body-lg text-[var(--color-apple-gray-700)]">
                  Als das Bundesamt für Sport BASPO nach einem Partner für einen Laborversuch zu Bewegungsförderung im öffentlichen Raum suchte, war klar: ParkourONE bringt die Expertise mit, die es braucht. Die Gemeinde Köniz stellte das Schlossareal zur Verfügung – ein anspruchsvoller Standort unter Denkmalschutz.
                </p>
              </div>
            </FadeUp>

            {/* Timeline */}
            <StaggerContainer className="mt-12 max-w-3xl mx-auto">
              {KOENIZ_CASE_STUDY.timeline.map((item, index) => (
                <StaggerItem key={index}>
                  <div className="flex gap-6 items-start pb-8 relative">
                    <div className="flex-shrink-0 w-32 text-right">
                      <span className="text-body font-semibold text-[var(--color-apple-blue)]">{item.date}</span>
                    </div>
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-[var(--color-apple-blue)] relative z-10" />
                      {index < KOENIZ_CASE_STUDY.timeline.length - 1 && (
                        <div className="absolute top-4 left-1.5 w-0.5 h-full bg-[var(--color-apple-gray-200)]" />
                      )}
                    </div>
                    <div className="flex-grow pb-4">
                      <p className="text-body text-[var(--color-apple-dark)]">{item.event}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Herausforderung & Lösung */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <FadeUp>
              <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-apple h-full">
                <h3 className="text-title-3 text-[var(--color-apple-dark)] mb-6">
                  {KOENIZ_CASE_STUDY.challenge.title}
                </h3>
                <ul className="space-y-4">
                  {KOENIZ_CASE_STUDY.challenge.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-apple-gray-400)] mt-2 flex-shrink-0" />
                      <span className="text-body text-[var(--color-apple-gray-700)]">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="bg-[var(--color-apple-blue)] rounded-2xl p-8 lg:p-12 text-white h-full">
                <h3 className="text-title-3 mb-6">
                  {KOENIZ_CASE_STUDY.solution.title}
                </h3>
                <ul className="space-y-4">
                  {KOENIZ_CASE_STUDY.solution.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                      <span className="text-body">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Denkmalschutz Highlight */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <FadeUp>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-apple-gray-100)] rounded-full mb-6">
                <span className="text-body-sm font-medium text-[var(--color-apple-gray-600)]">Denkmalschutz? Kein Problem.</span>
              </div>
              <p className="text-title-2 text-[var(--color-apple-dark)]">
                {KOENIZ_CASE_STUDY.denkmalpflege}
              </p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Die Zahlen */}
      <section className="section-spacing bg-[var(--color-apple-dark)] text-white">
        <div className="container-content">
          <SectionHeader
            title="Die Resultate"
            subtitle="Nach 8 Monaten Testbetrieb"
            className="[&_h2]:text-white [&_p]:text-white/70"
          />

          <StaggerContainer className="mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            {KOENIZ_CASE_STUDY.stats.map((stat, index) => (
              <StaggerItem key={index}>
                <div className="text-center">
                  <p className="text-display text-white">{stat.value}</p>
                  <p className="text-body-sm text-white/70 mt-2">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-spacing bg-white">
        <div className="container-content">
          <SectionHeader
            title="Das sagen die Beteiligten"
            subtitle="Stimmen zum Projekt"
          />

          <StaggerContainer className="mt-12 grid lg:grid-cols-2 gap-8">
            {KOENIZ_DETAILS.quotes.map((quote, index) => (
              <StaggerItem key={index}>
                <div className="bg-[var(--color-apple-gray-100)] rounded-2xl p-8 lg:p-10">
                  <Quote className="h-10 w-10 text-[var(--color-apple-gray-300)] mb-4" strokeWidth={1} />
                  <blockquote>
                    <p className="text-title-3 text-[var(--color-apple-dark)] leading-relaxed">
                      &ldquo;{quote.text}&rdquo;
                    </p>
                  </blockquote>
                  <div className="mt-6">
                    <p className="text-body font-semibold text-[var(--color-apple-dark)]">{quote.author}</p>
                    <p className="text-body-sm text-[var(--color-apple-gray-600)]">{quote.role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Praktische Infos */}
      <section className="section-spacing bg-[var(--color-apple-gray-100)]">
        <div className="container-content">
          <SectionHeader
            title="Selbst erleben"
            subtitle="RubikONE Köniz besuchen"
          />

          <div className="mt-12 grid lg:grid-cols-2 gap-12">
            {/* Map/Image */}
            <FadeUp>
              <div className="aspect-square rounded-2xl overflow-hidden relative">
                <Image
                  src="/images/koeniz/schloss.jpg"
                  alt="Schlossareal Köniz"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-headline font-semibold">{KOENIZ_DETAILS.location.name}</p>
                  <p className="text-body-sm mt-1 opacity-80">{KOENIZ_DETAILS.location.address}</p>
                </div>
              </div>
            </FadeUp>

            {/* Info Cards */}
            <FadeUp delay={0.1}>
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-apple">
                  <div className="flex items-center gap-4">
                    <MapPin className="h-6 w-6 text-[var(--color-apple-blue)]" />
                    <div>
                      <p className="text-body font-semibold text-[var(--color-apple-dark)]">Standort</p>
                      <p className="text-body-sm text-[var(--color-apple-gray-600)]">{KOENIZ_DETAILS.location.address}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-apple">
                  <div className="flex items-center gap-4">
                    <Route className="h-6 w-6 text-[var(--color-apple-blue)]" />
                    <div>
                      <p className="text-body font-semibold text-[var(--color-apple-dark)]">Route</p>
                      <p className="text-body-sm text-[var(--color-apple-gray-600)]">{KOENIZ_DETAILS.route.length} | {KOENIZ_DETAILS.route.posts} Posten | {KOENIZ_DETAILS.route.duration}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-apple">
                  <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-[var(--color-apple-blue)]" />
                    <div>
                      <p className="text-body font-semibold text-[var(--color-apple-dark)]">Öffnungszeiten</p>
                      <p className="text-body-sm text-[var(--color-apple-gray-600)]">{KOENIZ_DETAILS.accessibility.hours}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-apple">
                  <div className="flex items-center gap-4">
                    <Calendar className="h-6 w-6 text-[var(--color-apple-blue)]" />
                    <div>
                      <p className="text-body font-semibold text-[var(--color-apple-dark)]">Anreise</p>
                      <p className="text-body-sm text-[var(--color-apple-gray-600)]">{KOENIZ_DETAILS.accessibility.publicTransport}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-[var(--color-apple-blue)]">
        <div className="container-content text-center">
          <FadeUp>
            <h2 className="text-title-1 text-white">
              Köniz war die erste Gemeinde.
            </h2>
            <p className="mt-4 text-body-lg text-white/80 max-w-2xl mx-auto">
              Wird Ihre die zweite? Starten Sie mit einem Impulsworkshop und erleben Sie, was in Ihrer Gemeinde möglich ist.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/impulsworkshop" className="btn-primary bg-white text-[var(--color-apple-blue)] hover:bg-white/90">
                Impulsworkshop anfragen
              </Link>
              <Link href="/kontakt" className="btn-secondary text-white hover:text-white/80">
                Beratungsgespräch
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
