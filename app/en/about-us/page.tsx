import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ScrollReveal from "@/components/ScrollReveal";
import PageCta from "@/components/PageCta";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getTranslations } from "@/lib/i18n/get-translation";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [hero, t] = await Promise.all([
    getPageHeroData("ueber-uns", "ueberUns", "en"),
    getTranslations("page", "about-us", "en"),
  ]);
  return {
    title: t["seoTitle"] || "Über uns | Mosaroma",
    description: t["seoDescription"] || "Seit Generationen entwickeln und produzieren wir hochwertige Outdoor-Textilien.",
  };
}

const promises = [
  {
    title: "Komfort",
    description:
      "Weiche Haptik, langlebige Qualität und zeitloses Design für entspannte Momente im Freien.",
  },
  {
    title: "Qualität",
    description:
      "Hochwertige Materialien und die Mackintosh® Inside Technology sorgen für dauerhaften Schutz vor Sonne, Regen und Schmutz.",
  },
  {
    title: "Verantwortung",
    description:
      "Wir entwickeln langlebige Produkte mit einem bewussten Umgang mit Ressourcen.",
  },
  {
    title: "Design",
    description:
      "Klare Formen und eine zeitlose Ästhetik schaffen Produkte, die sich harmonisch in jede Umgebung einfügen.",
  },
];

const sustainabilityStats = [
  { value: "42 %", label: "weniger Wasser" },
  { value: "38 %", label: "weniger Chemie" },
  { value: "71 %", label: "Solarstrom" },
];

export default async function AboutUsPage() {
  const [layout, hero, t] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("ueber-uns", "ueberUns", "en"),
    getTranslations("page", "about-us", "en"),
  ]);

  const localizedPromises = promises.map((p, i) => ({
    title: t[`promises.${i + 1}.title`] || p.title,
    description: t[`promises.${i + 1}.description`] || p.description,
  }));

  const localizedStats = sustainabilityStats.map((s, i) => ({
    value: s.value,
    label: t[`stats.${i + 1}.label`] || s.label,
  }));

  return (
    <>
      <Header {...layout.header} locale="en" />
      <main id="main">
        {/* Hero */}
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
        />
        <BreadcrumbBar items={[{ label: t["breadcrumb"] || "Über uns" }]} />

        {/* About text */}
        <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="max-w-3xl">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-5">
                {t["intro.p1"] || "Seit Generationen entwickeln und produzieren wir hochwertige Outdoor-Textilien und -Produkte. Wir verbinden anspruchsvolles Design, hohe Leistungsfähigkeit und verantwortungsvolles Handeln. Langlebige Materialien, innovative Produktionsverfahren und der konsequente Blick auf nachhaltige Kreisläufe bestimmen unsere Arbeit. Das Wohl von Mensch und Natur steht dabei immer im Mittelpunkt."}
              </p>
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                {t["intro.p2"] || "Wir sind überzeugt, dass Outdoor-Textilien weit mehr bieten müssen als reine Funktionalität. Sie sollen Komfort, Entspannung und Wohlbefinden schaffen."}
              </p>
            </div>
          </div>
        </section>

        {/* Four promises */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
              {t["promisesTitle"] || "Was uns antreibt."}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {localizedPromises.map((promise, i) => (
                <ScrollReveal key={promise.title} delay={i * 80}>
                  <div className="bg-white p-8 transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                    <h3 className="font-heading text-anthracite text-lg font-bold mb-3">
                      {promise.title}
                    </h3>
                    <p className="font-body text-text-gray text-sm leading-[1.8]">
                      {promise.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section className="section-padding bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6">
              {t["sustainabilityTitle"] || "Green by Design. Vom ersten Faden an."}
            </h2>

            <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-14">
              {t["sustainabilityDescription"] || "Spinndüsengefärbtes Polypropylen (PP) spart im Vergleich zu konventionell gefärbten Fasern erheblich Wasser, Energie und CO₂. Die Farbe wird bereits bei der Faserherstellung eingebracht — nachträgliches Färben und Waschen entfallen komplett."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
              {localizedStats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 100}>
                  <div className="text-center">
                    <span className="block font-heading text-pumpkin text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                      {stat.value}
                    </span>
                    <span className="block font-body text-white/70 text-sm mt-2">
                      {stat.label}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <p className="font-body text-white/70 text-sm leading-[1.8] max-w-2xl">
              {t["sustainabilityNote"] || "Im Vergleich zu konventionell stückgefärbtem Polyester. Werte basierend auf internen Berechnungen und Branchendaten."}
            </p>
          </div>
        </section>

        {/* Location */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              {t["locationTitle"] || "Oyten bei Bremen"}
            </h2>

            <ScrollReveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    14.000m²
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    {t["location.area.label"] || "Fläche"}
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    {t["location.since.value"] || "seit 2021"}
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    {t["location.since.label"] || "am Standort"}
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    {t["location.delivery.value"] || "2–4 Tage"}
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    {t["location.delivery.label"] || "Lieferung DACH"}
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    DACH
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    {t["location.region.label"] || "Liefergebiet"}
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <Link href="/en/contact" className="btn-outline">
              {t["locationButton"] || "Kontakt aufnehmen"}
            </Link>
          </div>
        </section>

        {/* Warranty */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              {t["warrantyTitle"] || "3 Jahre Garantie."}
            </h2>

            <div className="max-w-3xl space-y-5">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                {t["warrantyDescription"] || "Wir bieten eine 3-Jahres-Garantie auf alle Mosaroma-Bezugsstoffe — Schutz vor Festigkeits- oder Farbverlust, Pilling und Abrieb bei normaler Nutzung und Witterungsbedingungen."}
              </p>
            </div>
          </div>
        </section>

        <PageCta
          variant="dark"
          title={t["cta.title"] || "Bereit für Ihr nächstes Projekt?"}
          description={t["cta.description"] || "Ob Einzelhandel, Hotellerie oder Gastronomie — wir beraten Sie persönlich zu Kollektionen, Materialien und individuellen Lösungen."}
          primaryLabel={t["cta.primaryLabel"] || "Kontakt aufnehmen"}
          primaryHref="/en/contact"
          secondaryLabel={t["cta.secondaryLabel"] || "Kollektionen entdecken"}
          secondaryHref="/en/collections"
        />
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
