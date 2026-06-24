import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import PublicContactForm from "@/components/public/PublicContactForm";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getPublicFormBySlug, type PublicForm } from "@/lib/cms/forms";
import { getIconSlots } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

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
  const [layout, hero, { form, status }, icons] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("kontakt", "kontakt"),
    getPublicFormBySlug("contact"),
    getIconSlots(["contact-email", "contact-globe", "contact-clock"]),
  ]);

  const isInactive = status === "inactive";
  const displayForm = form || (isInactive ? null : FALLBACK_FORM);

  const companyName = layout.footer.companyName || "Mosaroma Industries GmbH";
  const addressLine1 = layout.footer.addressLine1 || "Rudolf-Diesel-Str. 11–13";
  const addressLine2 = layout.footer.addressLine2 || null;
  const postalCity = layout.footer.postalCity || "28876 Oyten";
  const country = layout.footer.country || "Deutschland";
  const email = layout.footer.email || layout.siteSettings.contactEmail || "info@mosaroma.de";

  return (
    <>
      <Header {...layout.header} />
      <main id="main">
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
        />
        <BreadcrumbBar items={[{ label: "Kontakt" }]} />

        <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Left: Contact info */}
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin-accessible text-xs tracking-[0.3em] uppercase">
                    Kontaktdaten
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-xl md:text-2xl font-bold tracking-tight mb-8">
                  {companyName}
                </h2>

                <div className="space-y-4 mb-8">
                  <p className="font-body text-text-gray text-base leading-[1.8]">
                    {addressLine1}
                    {addressLine2 && (<><br />{addressLine2}</>)}
                    <br />
                    {postalCity}
                    <br />
                    {country}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CmsIcon icon={icons["contact-email"]} width={16} height={16} className="text-pumpkin flex-shrink-0" />
                    <a
                      href={`mailto:${email}`}
                      className="font-body text-anthracite text-sm hover:text-pumpkin transition-colors duration-300"
                    >
                      {email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <CmsIcon icon={icons["contact-globe"]} width={16} height={16} className="text-pumpkin flex-shrink-0" />
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
                    <CmsIcon icon={icons["contact-clock"]} width={16} height={16} className="text-pumpkin flex-shrink-0" />
                    <p className="font-body text-anthracite text-sm">
                      Mo–Fr &middot; 9–17 Uhr
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Contact form */}
              <div>
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
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
