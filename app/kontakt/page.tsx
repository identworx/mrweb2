import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import PublicContactForm from "@/components/public/PublicContactForm";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getPublicFormBySlug, type PublicForm } from "@/lib/cms/forms";

export const revalidate = 60;

const FALLBACK_FORM: PublicForm = {
  slug: "contact",
  title: null,
  description: null,
  submitLabel: "Nachricht senden",
  successMessage: "Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze.",
  errorMessage: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
  privacyText: null,
  honeypotField: null,
  fields: [
    { name: "name", type: "TEXT", label: "Name", placeholder: "Ihr Name", helpText: null, required: true, options: null },
    { name: "email", type: "EMAIL", label: "E-Mail", placeholder: "Ihre E-Mail-Adresse", helpText: null, required: true, options: null },
    { name: "message", type: "TEXTAREA", label: "Nachricht", placeholder: "Ihre Nachricht", helpText: null, required: true, options: null },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("kontakt", "kontakt");
  return {
    title: hero.seoTitle || "Kontakt | Mosaroma",
    description:
      hero.seoDescription ||
      "Kontaktieren Sie MOSAROMA — Mosaroma Industries GmbH in Oyten bei Bremen. Wir freuen uns auf Ihre Nachricht.",
  };
}

export default async function KontaktPage() {
  const [layout, hero, { form, status }] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("kontakt", "kontakt"),
    getPublicFormBySlug("contact"),
  ]);

  const isInactive = status === "inactive";
  const displayForm = form || (isInactive ? null : FALLBACK_FORM);

  return (
    <>
      <Header {...layout.header} />
      <main>
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
          breadcrumbs={[{ label: "Kontakt" }]}
        />

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

              {/* Right: Contact form */}
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

                {isInactive ? (
                  <div className="bg-gray-50 border border-gray-200 p-6 text-center">
                    <p className="font-body text-text-gray text-base">
                      Das Kontaktformular ist derzeit nicht verfügbar. Bitte kontaktieren Sie uns per E-Mail.
                    </p>
                  </div>
                ) : displayForm ? (
                  <PublicContactForm form={displayForm} />
                ) : null}
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
      <Footer {...layout.footer} />
    </>
  );
}
