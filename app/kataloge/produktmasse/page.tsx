import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/sections/PageHero";
import { pageHeroes } from "@/lib/mosaroma/pageHeroes";

export const metadata: Metadata = {
  title: "Produktmaße | Mosaroma",
  description:
    "Übersicht der wichtigsten Mosaroma Produktmaße für Bankauflagen, Poufs, Tischsets und Tischläufer.",
};

interface DimensionRow {
  label: string;
  value: string;
}

interface DimensionGroup {
  title: string;
  image: string;
  alt: string;
  note?: string;
  rows: DimensionRow[];
}

const dimensionGroups: DimensionGroup[] = [
  {
    title: "Bankauflagen",
    image: "/images/placeholders/service/produktmasse-bankauflagen.svg",
    alt: "Mosaroma Bankauflagen Maße Platzhalter",
    note: "Tiefe 49 cm und Dicke 6 cm bei allen Längen identisch.",
    rows: [
      { label: "S", value: "50 × 49 × 6 cm" },
      { label: "M", value: "110 × 49 × 6 cm" },
      { label: "L", value: "140 × 49 × 6 cm" },
      { label: "XL", value: "170 × 49 × 6 cm" },
    ],
  },
  {
    title: "Poufs",
    image: "/images/placeholders/service/produktmasse-poufs.svg",
    alt: "Mosaroma Poufs Maße Platzhalter",
    rows: [
      { label: "Pouf klein", value: "45 × 45 cm" },
      { label: "Pouf groß", value: "70 × 36 cm" },
    ],
  },
  {
    title: "Tischset",
    image: "/images/placeholders/service/produktmasse-tischset.svg",
    alt: "Mosaroma Tischset Maße Platzhalter",
    rows: [{ label: "Tischset", value: "35 × 45 × 0,6 cm" }],
  },
  {
    title: "Tischläufer",
    image: "/images/placeholders/service/produktmasse-tischlaeufer.svg",
    alt: "Mosaroma Tischläufer Maße Platzhalter",
    rows: [
      { label: "Variante A", value: "35 × 130 × 0,6 cm" },
      { label: "Variante B", value: "47,5 × 120 × 0,6 cm" },
    ],
  },
];

export default function ProduktmassePage() {
  return (
    <>
      <Header />
      <main>
        <PageHero {...pageHeroes.produktmasse} height="compact" />

        <Breadcrumbs
          items={[
            { label: "Kataloge", href: "/kataloge" },
            { label: "Produktmaße" },
          ]}
        />

        {/* Dimension Groups */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="space-y-16">
              {dimensionGroups.map((group) => (
                <div key={group.title}>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="accent-line" />
                    <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                      Abmessungen
                    </p>
                  </div>
                  <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-8">
                    {group.title}
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="relative aspect-[2/1] overflow-hidden bg-light-gray">
                      <Image
                        src={group.image}
                        alt={group.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>

                    <div>
                      <div className="border border-light-gray">
                        <div className="grid grid-cols-[140px_1fr] bg-cream">
                          <div className="px-5 py-3 font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-text-gray/60">
                            Variante
                          </div>
                          <div className="px-5 py-3 font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-text-gray/60">
                            Maße
                          </div>
                        </div>
                        {group.rows.map((row) => (
                          <div
                            key={row.label}
                            className="grid grid-cols-[140px_1fr] border-t border-light-gray"
                          >
                            <div className="px-5 py-4 font-heading text-anthracite text-sm font-semibold">
                              {row.label}
                            </div>
                            <div className="px-5 py-4 font-body text-text-gray text-sm">
                              {row.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {group.note && (
                        <p className="font-body text-text-gray/60 text-sm mt-4 italic">
                          {group.note}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Fragen zu Produktmaßen?
            </h2>
            <p className="font-body text-white/60 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              Sprechen Sie uns an — wir beraten Sie gerne zu Maßen,
              Sonderanfertigungen und Verfügbarkeit.
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
      </main>
      <Footer />
    </>
  );
}
