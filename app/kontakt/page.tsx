import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import { pageHeroes } from "@/lib/mosaroma/pageHeroes";

export const metadata: Metadata = {
  title: "Kontakt | Mosaroma",
  description:
    "Kontaktieren Sie MOSAROMA — Mosaroma Industries GmbH in Oyten bei Bremen. Wir freuen uns auf Ihre Nachricht.",
};

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <PageHero {...pageHeroes.kontakt} />

        {/* Contact info + form */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Left: Contact info */}
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Kontaktdaten
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-xl md:text-2xl font-bold tracking-tight mb-8">
                  Mosaroma Industries GmbH
                </h2>

                <div className="space-y-4 mb-8">
                  <p className="font-body text-text-gray text-base leading-[1.8]">
                    Rudolf-Diesel-Str. 11–13
                    <br />
                    28876 Oyten
                    <br />
                    Deutschland
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-pumpkin flex-shrink-0"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <a
                      href="mailto:info@mosaroma.de"
                      className="font-body text-anthracite text-sm hover:text-pumpkin transition-colors duration-300"
                    >
                      info@mosaroma.de
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-pumpkin flex-shrink-0"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    <a
                      href="https://www.mosaroma.de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-anthracite text-sm hover:text-pumpkin transition-colors duration-300"
                    >
                      www.mosaroma.de
                    </a>
                  </div>
                </div>

                <div className="bg-cream p-5">
                  <div className="flex items-center gap-3">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-pumpkin flex-shrink-0"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <p className="font-body text-anthracite text-sm">
                      Mo–Fr &middot; 9–17 Uhr
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Contact form placeholder */}
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Nachricht
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-xl md:text-2xl font-bold tracking-tight mb-8">
                  Schreiben Sie uns
                </h2>

                {/* TODO: contact form needs backend implementation */}
                <form className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-anthracite/60 mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Ihr Name"
                      className="w-full font-body text-sm text-anthracite bg-light-gray border-0 px-5 py-3.5 placeholder:text-text-gray/40 focus:outline-none focus:ring-2 focus:ring-pumpkin/30 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-anthracite/60 mb-2"
                    >
                      E-Mail
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Ihre E-Mail-Adresse"
                      className="w-full font-body text-sm text-anthracite bg-light-gray border-0 px-5 py-3.5 placeholder:text-text-gray/40 focus:outline-none focus:ring-2 focus:ring-pumpkin/30 transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-anthracite/60 mb-2"
                    >
                      Nachricht
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      placeholder="Ihre Nachricht"
                      className="w-full font-body text-sm text-anthracite bg-light-gray border-0 px-5 py-3.5 placeholder:text-text-gray/40 focus:outline-none focus:ring-2 focus:ring-pumpkin/30 transition-all duration-300 resize-vertical"
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    Nachricht senden
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Standort info */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Standort
              </p>
            </div>

            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              Oyten bei Bremen
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                  14.000m²
                </span>
                <span className="block font-body text-text-gray text-sm mt-1">
                  Fläche
                </span>
              </div>
              <div>
                <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                  seit 2021
                </span>
                <span className="block font-body text-text-gray text-sm mt-1">
                  am Standort
                </span>
              </div>
              <div>
                <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                  2–4 Tage
                </span>
                <span className="block font-body text-text-gray text-sm mt-1">
                  Lieferzeit DACH
                </span>
              </div>
              <div>
                <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                  DACH
                </span>
                <span className="block font-body text-text-gray text-sm mt-1">
                  Liefergebiet
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Alle Details im Katalog
            </h2>
            <p className="font-body text-white/60 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              Entdecken Sie alle Produkte, Stoffqualitäten und Kollektionen in
              unserem aktuellen Katalog.
            </p>
            <Link href="/kataloge" className="btn-primary">
              Katalog ansehen
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
