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

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("pflege-garantie", "pflegeGarantie");
  return {
    title: hero.seoTitle || "Pflege & Garantie | Mosaroma",
    description:
      hero.seoDescription ||
      "Waschanleitung, Pflegehinweise und Garantiebedingungen für Mosaroma Outdoor-Textilien aus MACKINTOSH® Solution-Dyed Olefin.",
  };
}

const staticWashSteps = [
  {
    step: "01",
    title: "Waschen",
    text: "Nehmen Sie die Füllung aus dem Bezug heraus. Waschen Sie den Bezug mit der Hand oder in der Maschine. Wählen Sie das **Feinwäscheprogramm bei max. 30 °C** und benutzen Sie Feinwaschmittel.",
  },
  {
    step: "02",
    title: "Flecken behandeln",
    text: "Hartnäckige Flecken mit einer Lösung aus **15 ml Feinwaschmittel + 50 ml Haushaltsbleichmittel** in 1 Liter Warmwasser (max. 30 °C) entfernen. Fleck leicht abtupfen oder mit weicher Bürste lösen, dann wie in Schritt 1 waschen.",
  },
  {
    step: "03",
    title: "Trocknen",
    text: "Den feuchten Bezug **liegend oder hängend an der Luft trocknen** — nicht in den Trockner, nicht in der prallen Sonne. Bezug feucht zurück über die Füllung ziehen, das vermeidet Knitter.",
  },
];

const staticCareSymbols = [
  { label: "Feinwäsche, kein Weichspüler", key: "wash-30" },
  { label: "Bleiche verdünnt möglich", key: "bleach-dilute" },
  { label: "Nicht in den Trockner", key: "no-dryer" },
  { label: "Lufttrocknen", key: "line-dry" },
  { label: "Von Hitze fernhalten, trocken lagern", key: "no-heat" },
];

export default async function PflegeGarantiePage() {
  const [layout, hero, result, icons] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("pflege-garantie", "pflegeGarantie"),
    getServicePageBySlug("pflege-garantie"),
    getIconSlots([
      "care-wash-30", "care-bleach-dilute", "care-no-dryer",
      "care-line-dry", "care-no-heat",
    ]),
  ]);

  if (result.state === "not-public") {
    notFound();
  }

  const hasCmsSections =
    result.state === "published" && result.page.sections.length > 0;

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
          height="compact"
        />
        <BreadcrumbBar
          items={[
            { label: "Kataloge", href: "/kataloge" },
            { label: "Pflege & Garantie" },
          ]}
        />

        {hasCmsSections ? (
          result.page.sections.map((section, i) => (
            <ServiceSectionRenderer
              key={section.id}
              section={section}
              background={i % 2 === 0 ? "white" : "cream"}
              icons={icons}
            />
          ))
        ) : (
          <>
            {/* Intro */}
            <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.1] mb-3">
                  Einmal kaufen.
                </h2>
                <p className="font-heading text-pumpkin text-2xl md:text-3xl lg:text-[2.25rem] font-bold tracking-tight leading-[1.1] italic mb-10 md:mb-14">
                  Lange behalten.
                </p>

                <div className="max-w-3xl mb-16 md:mb-20">
                  <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]" style={{ textWrap: "pretty" }}>
                    MACKINTOSH® Solution-Dyed Olefin ist für den dauerhaften
                    Einsatz im Außenbereich gemacht. Mit unseren Stoffen werden
                    die Kissen auch feuchtigkeitsresistent. Entfernen Sie
                    Verschmutzungen am besten sofort und reinigen Sie die Bezüge
                    mit Wasser und einem Schwamm. Wer seine Kissen und Auflagen
                    von Zeit zu Zeit so pflegt, verlängert ihre Lebensdauer und
                    lässt sie wie neu aussehen.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                  <div>
                    <h3 className="font-heading text-anthracite text-lg font-bold mb-4">
                      Lagerung
                    </h3>
                    <p className="font-body text-text-gray text-sm leading-[1.8]" style={{ textWrap: "pretty" }}>
                      Den feuchten Bezug liegend oder hängend an der Luft
                      trocknen — nicht in den Trockner, nicht in der prallen
                      Sonne. Bezug feucht zurück über die Füllung ziehen, das
                      vermeidet Knitter.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-heading text-anthracite text-lg font-bold mb-4">
                      Versiegelung
                    </h3>
                    <p className="font-body text-text-gray text-sm leading-[1.8]" style={{ textWrap: "pretty" }}>
                      Die Stoffe sind wasser- und schmutzabweisend — ganz ohne
                      zusätzliche Versiegelung. Sollte einmal eine besondere
                      Behandlung nötig sein, kontaktieren Sie uns gern.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Waschanleitung */}
            <section className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Waschanleitung
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12 md:mb-16">
                  In drei Schritten sauber.
                </h2>

                <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
                  {staticWashSteps.map((step) => (
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

            {/* Pflege auf einen Blick */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-10 md:mb-14">
                  Pflege auf einen Blick
                </h2>

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-8 md:gap-6">
                  {staticCareSymbols.map((symbol) => (
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
                <CareCardPrint />
              </div>
            </section>

            {/* Garantie */}
            <section className="section-padding bg-pumpkin">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                  <div aria-label="3 Jahre auf Mosaroma." role="group">
                    <span className="block font-heading text-white text-[8rem] md:text-[10rem] lg:text-[12rem] font-extrabold leading-none tracking-tight" aria-hidden="true">
                      3
                    </span>
                    <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight -mt-2 md:-mt-4" aria-hidden="true">
                      Jahre auf Mosaroma.
                    </h2>
                  </div>
                  <div>
                    <p className="font-body text-white/90 text-base md:text-[1.0625rem] leading-[1.8] mb-6" style={{ textWrap: "pretty" }}>
                      Wir wissen, wie wichtig Qualität und Zuverlässigkeit sind.
                      Deshalb stehen wir mit umfassenden Garantien hinter allen
                      Mosaroma-Stoffen.
                    </p>
                    <p className="font-body text-white/90 text-base md:text-[1.0625rem] leading-[1.8]" style={{ textWrap: "pretty" }}>
                      Unsere Bezugsstoffe sind durch eine auf 3 Jahre begrenzte
                      Garantie abgedeckt, die Schutz vor dem Verlust von
                      Festigkeit oder Farbe, Pilling sowie Abrieb durch normale
                      Nutzung und Witterungseinflüsse bietet.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-anthracite">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
                <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  Mehr über unsere Materialien
                </h2>
                <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
                  Detaillierte Informationen zu Stoffqualitäten, Prüfwerten und
                  Pflegeeigenschaften finden Sie auf unserer Materialseite.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/materialien" className="btn-primary">
                    Materialien entdecken
                  </Link>
                  <Link href="/kontakt" className="btn-outline-white">
                    Kontakt aufnehmen
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
