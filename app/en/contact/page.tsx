import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isPublicPathEnabled } from "@/lib/cms/nav-visibility";
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
import { getTranslations } from "@/lib/i18n/get-translation";

export const revalidate = 60;

const FALLBACK_FORM: PublicForm = {
  slug: "contact",
  title: null,
  description: null,
  submitLabel: "Send message",
  successMessage: "Thank you for your message. We will get back to you shortly.",
  errorMessage: "An error occurred. Please try again.",
  privacyText: null,
  honeypotField: null,
  fields: [
    { name: "name", type: "TEXT", label: "Name", placeholder: "Your name", helpText: null, required: true, options: null },
    { name: "email", type: "EMAIL", label: "Email", placeholder: "Your email address", helpText: null, required: true, options: null },
    { name: "message", type: "TEXTAREA", label: "Message", placeholder: "Your message", helpText: null, required: true, options: null },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  const [hero, t] = await Promise.all([
    getPageHeroData("kontakt", "kontakt", "en"),
    getTranslations("page", "contact", "en"),
  ]);
  return {
    title: t["seoTitle"] || "Contact | Mosaroma",
    description: t["seoDescription"] || "Contact MOSAROMA — Mosaroma Industries GmbH in Oyten near Bremen.",
  };
}

export default async function ContactPage() {
  if (!(await isPublicPathEnabled("/kontakt"))) notFound();

  const [layout, hero, { form, status }, icons, t] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("kontakt", "kontakt", "en"),
    getPublicFormBySlug("contact"),
    getIconSlots(["contact-email", "contact-globe", "contact-clock"]),
    getTranslations("page", "contact", "en"),
  ]);

  const isInactive = status === "inactive";

  const localizedFallbackForm: PublicForm = {
    ...FALLBACK_FORM,
    submitLabel: t["form.submitLabel"] || FALLBACK_FORM.submitLabel,
    successMessage: t["form.successMessage"] || FALLBACK_FORM.successMessage,
    errorMessage: t["form.errorMessage"] || FALLBACK_FORM.errorMessage,
    fields: FALLBACK_FORM.fields.map((f) => ({
      ...f,
      label: t[`form.${f.name}.label`] || f.label,
      placeholder: t[`form.${f.name}.placeholder`] || f.placeholder,
    })),
  };

  const localizedCmsForm: PublicForm | null = form
    ? {
        ...form,
        submitLabel: t["form.submitLabel"] || form.submitLabel,
        successMessage: t["form.successMessage"] || form.successMessage,
        errorMessage: t["form.errorMessage"] || form.errorMessage,
        fields: form.fields.map((f) => ({
          ...f,
          label: t[`form.${f.name}.label`] || f.label,
          placeholder: t[`form.${f.name}.placeholder`] || f.placeholder,
        })),
      }
    : null;

  const displayForm = localizedCmsForm || (isInactive ? null : localizedFallbackForm);

  const companyName = layout.footer.companyName || "Mosaroma Industries GmbH";
  const addressLine1 = layout.footer.addressLine1 || "Rudolf-Diesel-Str. 11–13";
  const addressLine2 = layout.footer.addressLine2 || null;
  const postalCity = layout.footer.postalCity || "28876 Oyten";
  const country = layout.footer.country || "Germany";
  const email = layout.footer.email || layout.siteSettings.contactEmail || "info@mosaroma.de";

  return (
    <>
      <Header {...layout.header} locale="en" />
      <main id="main">
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
        />
        <BreadcrumbBar items={[{ label: t["breadcrumb"] || "Contact" }]} locale="en" />

        <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              {/* Left: Contact info */}
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin-accessible text-xs tracking-[0.3em] uppercase">
                    {t["contactDetails"] || "Contact Details"}
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
                      {t["businessHours"] || "Mon–Fri · 9:00 AM–5:00 PM"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Contact form */}
              <div>
                <h2 className="font-heading text-anthracite text-xl md:text-2xl font-bold tracking-tight mb-8">
                  {t["writeToUs"] || "Write to Us"}
                </h2>

                {isInactive ? (
                  <div className="bg-gray-50 border border-gray-200 p-6 text-center">
                    <p className="font-body text-text-gray text-base">
                      {t["formUnavailable"] || "The contact form is currently unavailable. Please contact us by email."}
                    </p>
                  </div>
                ) : displayForm ? (
                  <PublicContactForm form={displayForm} locale="en" />
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
