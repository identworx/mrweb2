import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getServicePageBySlug } from "@/lib/cms/service-pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("pflege-garantie", "pflegeGarantie");
  return {
    title: hero.seoTitle || "Pflege & Garantie | Mosaroma",
    description:
      hero.seoDescription ||
      "Hinweise zur Reinigung, Lagerung und Garantie von Mosaroma Outdoor-Produkten.",
  };
}

interface CareSection {
  title: string;
  items: string[];
}

const staticCareSections: CareSection[] = [
  {
    title: "Reinigung",
    items: [
      "Regelmäßig abbürsten oder absaugen, um Staub und Schmutz zu entfernen.",
      "Bei Bedarf mit lauwarmem Wasser und milder Seifenlösung reinigen.",
      "Mackintosh®-Stoffe sind bleichfest — bei Bedarf mit verdünnter Chlorbleiche behandelbar.",
      "Nicht in der Waschmaschine waschen, sofern nicht ausdrücklich angegeben.",
      "Nach der Reinigung an der Luft trocknen lassen.",
    ],
  },
  {
    title: "Lagerung",
    items: [
      "Bei längerer Nichtnutzung trocken und geschützt lagern.",
      "Auflagen und Kissen vor der Lagerung vollständig trocknen lassen.",
      "Direkte Sonneneinstrahlung bei der Lagerung vermeiden.",
      "Belüftete Aufbewahrung bevorzugen, um Schimmelbildung vorzubeugen.",
    ],
  },
  {
    title: "Garantie",
    items: [
      "3 Jahre begrenzte Garantie auf Bezugsstoffe.",
      "Schutz vor Verlust von Festigkeit oder Farbe.",
      "Schutz vor Pilling.",
      "Schutz vor Abrieb durch normale Nutzung und Witterungseinflüsse.",
    ],
  },
  {
    title: "Hinweise für langlebige Nutzung",
    items: [
      "Verschüttete Flüssigkeiten zeitnah entfernen.",
      "Bei starkem Regen Polster nach Möglichkeit geschützt aufbewahren.",
      "Olefin-Stoffe trocknen schnell und nehmen kaum Wasser auf.",
      "Regelmäßige Pflege verlängert die Lebensdauer der Produkte.",
    ],
  },
];

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-pumpkin flex-shrink-0 mt-0.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default async function PflegeGarantiePage() {
  const [layout, hero, result] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("pflege-garantie", "pflegeGarantie"),
    getServicePageBySlug("pflege-garantie"),
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
          breadcrumbs={[
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
            />
          ))
        ) : (
          <>
            {/* Static fallback */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="max-w-3xl space-y-14">
                  {staticCareSections.map((s) => (
                    <div key={s.title}>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="accent-line" />
                        <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                          {s.title}
                        </p>
                      </div>
                      <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-8">
                        {s.title}
                      </h2>
                      <div className="space-y-4">
                        {s.items.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-4 p-5 bg-cream rounded"
                          >
                            <CheckIcon />
                            <span className="font-body text-anthracite text-sm md:text-base leading-relaxed">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="bg-white p-8 md:p-10 border border-light-gray max-w-2xl">
                  <h3 className="font-heading text-anthracite text-xl font-bold mb-3">
                    Mehr über unsere Materialien
                  </h3>
                  <p className="font-body text-text-gray text-sm leading-[1.8] mb-6">
                    Detaillierte Informationen zu den Stoffqualitäten und deren
                    Pflegeeigenschaften finden Sie auf unserer Materialseite.
                  </p>
                  <Link
                    href="/materialien"
                    className="inline-flex items-center gap-3 text-pumpkin group"
                  >
                    <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                      Materialien entdecken
                    </span>
                    <svg
                      width="14" height="14" fill="none" stroke="currentColor"
                      strokeWidth="1.5" viewBox="0 0 24 24"
                      className="group-hover:translate-x-1 transition-transform duration-300"
                    >
                      <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                    </svg>
                  </Link>
                </div>
              </div>
            </section>

            <section className="section-padding bg-anthracite">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
                <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  Fragen zu Pflege oder Garantie?
                </h2>
                <p className="font-body text-white/60 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
                  Wir beraten Sie gerne zu Reinigung, Lagerung und
                  Garantiebedingungen.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/kontakt" className="btn-primary">
                    Kontakt aufnehmen
                  </Link>
                  <Link href="/kataloge" className="btn-outline-white">
                    Zurück zu Kataloge
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
