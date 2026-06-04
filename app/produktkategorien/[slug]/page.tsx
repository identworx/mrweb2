import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { categories, getCategoryBySlug } from "@/lib/mosaroma/categories";
import { collections } from "@/lib/mosaroma/collections";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { title: "Kategorie nicht gefunden | Mosaroma" };
  }
  return {
    title: `${category.title} | Mosaroma Outdoor-Textilien`,
    description: category.description,
  };
}

export default async function KategoriePage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const relatedCollections = collections.filter((collection) =>
    collection.productCategories.includes(slug)
  );

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <PageHero
          accent={category.title}
          title={category.title}
          description={category.description}
        />

        {/* Features */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Eigenschaften
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Merkmale & Vorteile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {category.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-4 p-6 bg-cream rounded"
                >
                  <svg
                    width="20"
                    height="20"
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
                  <span className="font-body text-anthracite text-base leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dimensions */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Abmessungen
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Verfügbare Größen
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {category.dimensions.map((dim) => (
                <div
                  key={dim.label}
                  className="bg-white p-6 border border-light-gray"
                >
                  <p className="font-heading text-anthracite text-lg font-bold mb-2">
                    {dim.label}
                  </p>
                  {dim.fabric && (
                    <p className="font-body text-text-gray text-sm leading-relaxed">
                      Stoff: {dim.fabric}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Available Fabrics */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Materialien
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Verfügbare Stoffqualitäten
            </h2>
            <div className="flex flex-wrap gap-4 mb-8">
              {category.availableFabrics.map((fabric) => (
                <span
                  key={fabric}
                  className="font-heading text-[11px] font-semibold uppercase tracking-[0.1em] px-5 py-3 border border-anthracite/15 text-anthracite/70 bg-cream"
                >
                  {fabric}
                </span>
              ))}
            </div>
            <Link
              href="/materialien"
              className="inline-flex items-center gap-3 text-pumpkin group"
            >
              <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                Alle Materialien entdecken
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
        </section>

        {/* Related Collections */}
        {relatedCollections.length > 0 && (
          <section className="section-padding bg-cream">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="accent-line" />
                <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                  Kollektionen
                </p>
              </div>
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
                In diesen Kollektionen erhältlich
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {relatedCollections.map((collection) => (
                  <Link
                    key={collection.slug}
                    href={`/kollektionen/${collection.slug}`}
                    className="group block bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  >
                    {/* Color band */}
                    <div className="flex">
                      {collection.moodColors.map((color, i) => (
                        <div
                          key={i}
                          className="flex-1 h-2 transition-all duration-500 group-hover:h-3"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="p-6">
                      <p className="font-heading text-anthracite text-lg font-bold group-hover:text-pumpkin transition-colors duration-300">
                        {collection.name}
                      </p>
                      <p className="font-body text-text-gray text-sm leading-[1.8] mt-2">
                        {collection.description}
                      </p>
                      <span className="inline-flex items-center gap-2 text-pumpkin mt-4">
                        <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.12em]">
                          Kollektion ansehen
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
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-padding bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Interessiert an {category.title}?
            </h2>
            <p className="font-body text-white/60 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              Entdecken Sie unser komplettes Sortiment im Katalog oder nehmen
              Sie direkt Kontakt mit uns auf.
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
