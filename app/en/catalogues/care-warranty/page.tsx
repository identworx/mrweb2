import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isPublicPathEnabled } from "@/lib/cms/nav-visibility";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import BoldText from "@/components/service/BoldText";
import CareCardPrint from "@/components/service/CareCardPrint";
import CmsIcon from "@/components/cms/CmsIcon";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getServicePageBySlug } from "@/lib/cms/service-pages";
import { getIconSlots } from "@/lib/cms/icons";
import { SERVICE_SECTION_ICON_KEYS } from "@/lib/cms/icon-key-map";
import PageCta from "@/components/PageCta";
import { getTranslations } from "@/lib/i18n/get-translation";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [hero, t] = await Promise.all([
    getPageHeroData("pflege-garantie", "pflegeGarantie", "en"),
    getTranslations("page", "care-warranty", "en"),
  ]);
  return {
    title: t["seoTitle"] || "Care & Warranty | Mosaroma",
    description: t["seoDescription"] || "Washing instructions, care tips and warranty conditions for Mosaroma outdoor textiles made from MACKINTOSH® Solution-Dyed Olefin.",
  };
}

const staticWashSteps = [
  {
    step: "01",
    title: "Washing",
    text: "Remove filling from cover. Wash cover by hand or machine. **Select gentle cycle at max. 30°C** and use a mild detergent.",
  },
  {
    step: "02",
    title: "Stain Treatment",
    text: "Treat stubborn stains with a solution of **15 ml mild detergent + 50 ml household bleach** in 1 litre warm water (max. 30°C). Gently dab the stain or loosen with a soft brush, then wash as in step 1.",
  },
  {
    step: "03",
    title: "Drying",
    text: "**Dry damp cover flat or hanging in the air** — do not tumble dry, do not place in direct sunlight. Pull cover back over filling while still slightly damp to avoid creasing.",
  },
];

const staticCareSymbols = [
  { label: "Gentle cycle, no fabric softener", key: "wash-30" },
  { label: "Diluted bleach permitted", key: "bleach-dilute" },
  { label: "Do not tumble dry", key: "no-dryer" },
  { label: "Air dry", key: "line-dry" },
  { label: "Keep away from heat sources, store dry", key: "no-heat" },
];

export default async function CareWarrantyPage() {
  if (!(await isPublicPathEnabled("/kataloge/pflege-garantie"))) notFound();

  const [layout, hero, result, icons, t] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("pflege-garantie", "pflegeGarantie", "en"),
    getServicePageBySlug("pflege-garantie"),
    getIconSlots([...SERVICE_SECTION_ICON_KEYS]),
    getTranslations("page", "care-warranty", "en"),
  ]);

  if (result.state === "not-public") {
    notFound();
  }

  const localizedWashSteps = staticWashSteps.map((step, i) => ({
    step: step.step,
    title: t[`wash.${i + 1}.title`] || step.title,
    text: t[`wash.${i + 1}.text`] || step.text,
  }));

  const localizedCareSymbols = staticCareSymbols.map((sym, i) => ({
    label: t[`care.${i + 1}.label`] || sym.label,
    key: sym.key,
  }));

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
          height="compact"
        />
        <BreadcrumbBar
          items={[
            { label: t["breadcrumb.catalogues"] || "Catalogues", href: "/en/catalogues" },
            { label: t["breadcrumb.self"] || "Care & Warranty" },
          ]}
          locale="en"
        />

        <>
            {/* Intro */}
            <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.1] mb-3">
                  {t["introTitle1"] || "Buy once."}
                </h2>
                <p className="font-heading text-pumpkin text-2xl md:text-3xl lg:text-[2.25rem] font-bold tracking-tight leading-[1.1] italic mb-10 md:mb-14">
                  {t["introTitle2"] || "Keep for years."}
                </p>

                <div className="max-w-3xl mb-16 md:mb-20">
                  <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]" style={{ textWrap: "pretty" }}>
                    {t["introText"] || "MACKINTOSH® Solution-Dyed Olefin is designed for long-term outdoor use. Our fabrics also make the cushions moisture-resistant. Remove soiling as soon as possible and clean covers with water and a sponge. Regular care extends the life of your cushions and upholstery and keeps them looking like new."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                  <div>
                    <h3 className="font-heading text-anthracite text-lg font-bold mb-4">
                      {t["storageTitle"] || "Storage"}
                    </h3>
                    <p className="font-body text-text-gray text-sm leading-[1.8]" style={{ textWrap: "pretty" }}>
                      {t["storageText"] || "Dry damp cover flat or hanging in the air — do not tumble dry, do not place in direct sunlight. Pull cover back over filling while still slightly damp to avoid creasing."}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-heading text-anthracite text-lg font-bold mb-4">
                      {t["sealingTitle"] || "Sealing"}
                    </h3>
                    <p className="font-body text-text-gray text-sm leading-[1.8]" style={{ textWrap: "pretty" }}>
                      {t["sealingText"] || "The fabrics are water and dirt repellent — no additional sealing required. Should special treatment be necessary, please contact us."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Washing Instructions */}
            <section className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin-accessible text-xs tracking-[0.3em] uppercase">
                    {t["washEyebrow"] || "Washing Instructions"}
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12 md:mb-16">
                  {t["washTitle"] || "Clean in three steps."}
                </h2>

                <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
                  {localizedWashSteps.map((step) => (
                    <div key={step.step}>
                      <span className="font-heading text-pumpkin text-4xl md:text-5xl font-extrabold tracking-tight">
                        {step.step}
                      </span>
                      <h3 className="font-heading text-anthracite text-lg font-bold mt-4 mb-3">
                        {step.title}
                      </h3>
                      <p className="font-body text-text-gray text-sm leading-[1.8]" style={{ textWrap: "pretty" }}>
                        <BoldText text={step.text} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Care at a Glance */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-10 md:mb-14">
                  {t["careTitle"] || "Care at a Glance"}
                </h2>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-8 md:gap-6">
                  {localizedCareSymbols.map((symbol) => (
                    <figure key={symbol.key} className="text-center">
                      <div className="w-16 h-16 mx-auto flex items-center justify-center border border-anthracite/15 text-anthracite mb-4" aria-hidden="true">
                        <CmsIcon icon={icons[`care-${symbol.key}`]} width={32} height={32} />
                      </div>
                      <figcaption className="font-body text-text-gray text-xs leading-snug">
                        {symbol.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
                <CareCardPrint icons={icons} locale="en" />
              </div>
            </section>

            {/* Warranty */}
            <section className="section-padding bg-pumpkin">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                  <div aria-label="3 Years on Mosaroma." role="group">
                    <span className="block font-heading text-white text-[8rem] md:text-[10rem] lg:text-[12rem] font-extrabold leading-none tracking-tight" aria-hidden="true">
                      3
                    </span>
                    <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight -mt-2 md:-mt-4" aria-hidden="true">
                      {t["warrantyYears"] || "Years on Mosaroma."}
                    </h2>
                  </div>
                  <div>
                    <p className="font-body text-white/90 text-base md:text-[1.0625rem] leading-[1.8] mb-6" style={{ textWrap: "pretty" }}>
                      {t["warrantyText1"] || "We know how important quality and reliability are. That's why we stand behind all Mosaroma fabrics with comprehensive guarantees."}
                    </p>
                    <p className="font-body text-white/90 text-base md:text-[1.0625rem] leading-[1.8]" style={{ textWrap: "pretty" }}>
                      {t["warrantyText2"] || "Our upholstery fabrics are covered by a limited 3-year warranty that protects against loss of strength or colour, pilling and abrasion under normal use and weather conditions."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <PageCta
              variant="light"
              title={t["cta.title"] || "More about our materials"}
              description={t["cta.description"] || "Detailed information on fabric qualities, test values and care properties can be found on our Materials page."}
              primaryLabel={t["cta.primaryLabel"] || "Discover materials"}
              primaryHref="/en/materials"
              secondaryLabel={t["cta.secondaryLabel"] || "Contact us"}
              secondaryHref="/en/contact"
            />
        </>
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
