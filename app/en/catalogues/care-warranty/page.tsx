import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
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
    title: t["seoTitle"] || "Pflege & Garantie | Mosaroma",
    description: t["seoDescription"] || "Waschanleitungen, Pflegetipps und Garantiebedingungen für Mosaroma-Outdoor-Textilien aus MACKINTOSH® Solution-Dyed Olefin.",
  };
}

const staticWashSteps = [
  {
    step: "01",
    title: "Waschen",
    text: "Füllung aus dem Bezug nehmen. Bezug von Hand oder in der Maschine waschen. **Schonwaschgang bei max. 30 °C** wählen und ein mildes Waschmittel verwenden.",
  },
  {
    step: "02",
    title: "Fleckenbehandlung",
    text: "Hartnäckige Flecken mit einer Lösung aus **15 ml mildem Waschmittel + 50 ml Haushaltsbleiche** in 1 Liter warmem Wasser (max. 30 °C) behandeln. Fleck vorsichtig abtupfen oder mit einer weichen Bürste lösen, dann wie in Schritt 1 waschen.",
  },
  {
    step: "03",
    title: "Trocknen",
    text: "**Feuchten Bezug flach oder hängend an der Luft trocknen** — nicht in den Trockner, nicht in die direkte Sonne. Bezug noch leicht feucht wieder über die Füllung ziehen, um Faltenbildung zu vermeiden.",
  },
];

const staticCareSymbols = [
  { label: "Schonwaschgang, kein Weichspüler", key: "wash-30" },
  { label: "Verdünnte Bleiche erlaubt", key: "bleach-dilute" },
  { label: "Nicht in den Trockner", key: "no-dryer" },
  { label: "An der Luft trocknen", key: "line-dry" },
  { label: "Von Wärmequellen fernhalten, trocken lagern", key: "no-heat" },
];

export default async function CareWarrantyPage() {
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

  const hasCmsSections =
    result.state === "published" && result.page.sections.length > 0;

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
            { label: t["breadcrumb.catalogues"] || "Kataloge", href: "/en/catalogues" },
            { label: t["breadcrumb.self"] || "Pflege & Garantie" },
          ]}
        />

        {hasCmsSections ? (
          result.page.sections.map((section, i) => (
            <ServiceSectionRenderer
              key={section.id}
              section={section}
              background={i % 2 === 0 ? "white" : "cream"}
              icons={icons}
              locale="en"
            />
          ))
        ) : (
          <>
            {/* Intro */}
            <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.1] mb-3">
                  {t["introTitle1"] || "Einmal kaufen."}
                </h2>
                <p className="font-heading text-pumpkin text-2xl md:text-3xl lg:text-[2.25rem] font-bold tracking-tight leading-[1.1] italic mb-10 md:mb-14">
                  {t["introTitle2"] || "Jahrelang behalten."}
                </p>

                <div className="max-w-3xl mb-16 md:mb-20">
                  <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]" style={{ textWrap: "pretty" }}>
                    {t["introText"] || "MACKINTOSH® Solution-Dyed Olefin ist für den langfristigen Outdoor-Einsatz konzipiert. Unsere Stoffe machen die Kissen zudem feuchtigkeitsbeständig. Verschmutzungen möglichst bald entfernen und die Bezüge mit Wasser und einem Schwamm reinigen. Regelmäßige Pflege verlängert die Lebensdauer Ihrer Kissen und Polster und hält sie wie neu."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                  <div>
                    <h3 className="font-heading text-anthracite text-lg font-bold mb-4">
                      {t["storageTitle"] || "Aufbewahrung"}
                    </h3>
                    <p className="font-body text-text-gray text-sm leading-[1.8]" style={{ textWrap: "pretty" }}>
                      {t["storageText"] || "Feuchten Bezug flach oder hängend an der Luft trocknen — nicht in den Trockner, nicht in die direkte Sonne. Bezug noch leicht feucht wieder über die Füllung ziehen, um Faltenbildung zu vermeiden."}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-heading text-anthracite text-lg font-bold mb-4">
                      {t["sealingTitle"] || "Versiegelung"}
                    </h3>
                    <p className="font-body text-text-gray text-sm leading-[1.8]" style={{ textWrap: "pretty" }}>
                      {t["sealingText"] || "Die Stoffe sind wasser- und schmutzabweisend — keine zusätzliche Versiegelung erforderlich. Sollte eine Spezialbehandlung nötig sein, kontaktieren Sie uns."}
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
                    {t["washEyebrow"] || "Waschanleitung"}
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12 md:mb-16">
                  {t["washTitle"] || "In drei Schritten sauber."}
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
                  {t["careTitle"] || "Pflege auf einen Blick"}
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
                      {t["warrantyYears"] || "Jahre auf Mosaroma."}
                    </h2>
                  </div>
                  <div>
                    <p className="font-body text-white/90 text-base md:text-[1.0625rem] leading-[1.8] mb-6" style={{ textWrap: "pretty" }}>
                      {t["warrantyText1"] || "Wir wissen, wie wichtig Qualität und Zuverlässigkeit sind. Deshalb stehen wir hinter allen Mosaroma-Stoffen mit umfassenden Garantien."}
                    </p>
                    <p className="font-body text-white/90 text-base md:text-[1.0625rem] leading-[1.8]" style={{ textWrap: "pretty" }}>
                      {t["warrantyText2"] || "Unsere Bezugsstoffe sind durch eine beschränkte 3-Jahres-Garantie abgedeckt, die Schutz vor Festigkeits- oder Farbverlust, Pilling und Abrieb bei normaler Nutzung und Witterung bietet."}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <PageCta
              variant="light"
              title={t["cta.title"] || "Mehr über unsere Materialien"}
              description={t["cta.description"] || "Detaillierte Informationen zu Stoffqualitäten, Prüfwerten und Pflegeeigenschaften finden Sie auf unserer Materialien-Seite."}
              primaryLabel={t["cta.primaryLabel"] || "Materialien entdecken"}
              primaryHref="/en/materials"
              secondaryLabel={t["cta.secondaryLabel"] || "Kontakt aufnehmen"}
              secondaryHref="/en/contact"
            />
          </>
        )}
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
