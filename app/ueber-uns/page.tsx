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

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("ueber-uns", "ueberUns");
  return {
    title: hero.seoTitle || "Über uns | Mosaroma",
    description:
      hero.seoDescription ||
      "Seit Generationen entwickeln und produzieren wir hochwertige Outdoor-Textilien. Design, Leistungsfähigkeit und verantwortungsvolles Handeln — das ist MOSAROMA.",
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
  { value: "38 %", label: "weniger Energie" },
  { value: "71 %", label: "weniger CO₂" },
];

export default async function UeberUnsPage() {
  const [layout, hero] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("ueber-uns", "ueberUns"),
  ]);

  return (
    <>
      <Header {...layout.header} />
      <main id="main">
        {/* Hero */}
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
        />
        <BreadcrumbBar items={[{ label: "Über uns" }]} />

        {/* About text */}
        <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="max-w-3xl">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-5">
                Seit Generationen entwickeln und produzieren wir hochwertige
                Outdoor-Textilien und Produkte. Dabei verbinden wir
                anspruchsvolles Design, hohe Leistungsfähigkeit und
                verantwortungsvolles Handeln. Langlebige Materialien, innovative
                Produktionsverfahren und ein konsequenter Blick auf nachhaltige
                Kreisläufe prägen unsere Arbeit. Das Wohl von Mensch und Natur
                steht dabei immer im Mittelpunkt unseres Handelns.
              </p>
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                Wir sind überzeugt, dass Outdoor-Textilien weit mehr leisten
                müssen als reine Funktionalität. Sie sollen Komfort, Entspannung
                und Wohlbefinden schaffen.
              </p>
            </div>
          </div>
        </section>

        {/* Four promises */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-text-muted text-xs tracking-[0.3em] uppercase">
                Unsere Versprechen
              </p>
            </div>

            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
              Was uns antreibt.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promises.map((promise, i) => (
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

        {/* Nachhaltigkeit */}
        <section className="section-padding bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6">
              Grün gewebt. Vom Tropfen an.
            </h2>

            <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-14">
              Spinndüsengefärbtes Polypropylen (PP) spart im Vergleich zu
              konventionell gefärbten Fasern erheblich Wasser, Energie und CO₂.
              Die Farbe wird bereits bei der Faserherstellung eingebracht — ein
              nachträgliches Färben und Waschen entfällt vollständig.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
              {sustainabilityStats.map((stat, i) => (
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
              Im Vergleich zu konventionell stückgefärbtem Polyester. Werte
              basieren auf internen Berechnungen und Branchendaten.
            </p>
          </div>
        </section>

        {/* Standort */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              Oyten bei Bremen
            </h2>

            <ScrollReveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
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
            </ScrollReveal>

            <Link href="/kontakt" className="btn-outline">
              Kontakt aufnehmen
            </Link>
          </div>
        </section>

        {/* Garantie */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              3 Jahre Garantie.
            </h2>

            <div className="max-w-3xl space-y-5">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                Auf alle Mosaroma-Bezugsstoffe gewähren wir 3 Jahre Garantie —
                Schutz vor dem Verlust von Festigkeit oder Farbe, Pilling sowie
                Abrieb durch normale Nutzung und Witterungseinflüsse.
              </p>
            </div>
          </div>
        </section>

        <PageCta
          variant="dark"
          title="Bereit für Ihr nächstes Projekt?"
          description="Ob Fachhandel, Hotellerie oder Gastronomie — wir beraten Sie persönlich zu Kollektionen, Materialien und individuellen Lösungen."
          primaryLabel="Kontakt aufnehmen"
          primaryHref="/kontakt"
          secondaryLabel="Kollektionen entdecken"
          secondaryHref="/kollektionen"
        />
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
