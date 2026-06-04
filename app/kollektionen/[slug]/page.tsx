import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { collections, getCollectionBySlug } from "@/lib/mosaroma/collections";
import { categories } from "@/lib/mosaroma/categories";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) {
    return { title: "Kollektion nicht gefunden | Mosaroma" };
  }
  return {
    title: `Kollektion ${collection.name} | Mosaroma`,
    description: collection.description,
  };
}

export default async function KollektionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const collectionCategories = categories.filter((cat) =>
    collection.productCategories.includes(cat.slug)
  );

  return (
    <>
      <Header />
      <main>
        {/* Hero with color band */}
        <section className="bg-cream pt-32 md:pt-40 lg:pt-44">
          {/* Wide mood color band */}
          <div className="flex w-full h-3 md:h-4">
            {collection.moodColors.map((color, i) => (
              <div
                key={i}
                className="flex-1"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="section-padding">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="accent-line" />
                <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                  Kollektion {collection.number}
                </p>
              </div>

              <h1 className="font-heading text-anthracite text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-tight leading-[1.08]">
                {collection.name}
              </h1>

              {collection.subtitle && (
                <p className="font-heading text-anthracite/60 text-xl md:text-2xl lg:text-[1.75rem] font-medium tracking-tight leading-snug mt-4">
                  {collection.subtitle}
                </p>
              )}

              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mt-6 max-w-2xl">
                {collection.description}
              </p>
            </div>
          </div>
        </section>

        {/* Extended description / mood text */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-5">
                <div className="accent-line" />
                <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                  Stimmung
                </p>
              </div>
              <p className="font-heading text-anthracite text-xl md:text-2xl lg:text-[1.75rem] font-medium tracking-tight leading-snug">
                {collection.extendedDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Color palette */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Farbpalette
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Die vier Stimmungsfarben
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {collection.moodColors.map((color, i) => (
                <div key={i} className="group">
                  <div
                    className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.02]"
                    style={{ backgroundColor: color }}
                  />
                  <p className="font-heading text-anthracite text-sm font-semibold mt-4">
                    Farbe {i + 1}
                  </p>
                  <p className="font-body text-text-gray text-sm mt-1 uppercase tracking-wider">
                    {color}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Product categories */}
        {collectionCategories.length > 0 && (
          <section className="section-padding bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="accent-line" />
                <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                  Produkte
                </p>
              </div>
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
                Produktkategorien in dieser Kollektion
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {collectionCategories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/produktkategorien/${cat.slug}`}
                    className="group flex items-center gap-5 p-6 bg-cream transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  >
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-pumpkin/10 rounded-full group-hover:bg-pumpkin/20 transition-colors duration-300">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-pumpkin"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-heading text-anthracite text-base font-bold group-hover:text-pumpkin transition-colors duration-300">
                        {cat.title}
                      </p>
                      <p className="font-body text-text-gray text-sm leading-relaxed mt-1">
                        {cat.shortDescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Fabric info */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Stoffqualität
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6">
              Material dieser Kollektion
            </h2>
            <div className="bg-white p-8 md:p-10 border border-light-gray max-w-2xl">
              <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-2 border border-pumpkin/30 text-pumpkin/80 bg-pumpkin/5 inline-block mb-4">
                {collection.fabric}
              </span>
              <p className="font-body text-text-gray text-base leading-[1.8]">
                Diese Kollektion wird in der Stoffqualität{" "}
                <strong className="text-anthracite">{collection.fabric}</strong>{" "}
                gefertigt. Alle Informationen zu unseren Materialien und
                Technologien finden Sie auf der Materialseite.
              </p>
              <Link
                href="/materialien"
                className="inline-flex items-center gap-3 text-pumpkin mt-6 group"
              >
                <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                  Materialien entdecken
                </span>
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Kollektion {collection.name} entdecken
            </h2>
            <p className="font-body text-white/60 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              Blättern Sie durch unseren Katalog oder sprechen Sie uns direkt an
              -- wir beraten Sie gerne.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kataloge" className="btn-primary">
                Katalog ansehen
              </Link>
              <Link href="/kontakt" className="btn-outline-white">
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
