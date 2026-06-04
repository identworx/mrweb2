import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { categories, getCategoryBySlug } from "@/lib/mosaroma/categories";
import { collections } from "@/lib/mosaroma/collections";
import { getProductsByCollectionAndCategory } from "@/lib/mosaroma/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return { title: "Kategorie nicht gefunden | Mosaroma" };
  }
  return {
    title: `${category.title} | Mosaroma Produktkategorien`,
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
    collection.productCategories.includes(slug),
  );

  return (
    <>
      <Header />
      <main>
        {/* Breadcrumbs */}
        <div className="bg-cream">
          <Breadcrumbs
            items={[
              { label: "Produktkategorien", href: "/produktkategorien" },
              { label: category.title },
            ]}
          />
        </div>

        {/* Hero with image */}
        <section className="bg-cream pb-16 md:pb-24">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Produktkategorie
                  </p>
                </div>

                <h1 className="font-heading text-anthracite text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-tight leading-[1.08]">
                  {category.title}
                </h1>

                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mt-6 max-w-2xl">
                  {category.description}
                </p>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

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

        {/* Available Collections overview */}
        {relatedCollections.length > 0 && (
          <section className="section-padding bg-cream">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="accent-line" />
                <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                  Verfügbare Kollektionen
                </p>
              </div>
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
                {category.title} nach Kollektion
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                {relatedCollections.map((collection) => (
                  <a
                    key={collection.slug}
                    href={`#kollektion-${collection.slug}`}
                    className="group block bg-white transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  >
                    <div className="flex">
                      {collection.moodColors.map((color, i) => (
                        <div
                          key={i}
                          className="flex-1 h-2 transition-all duration-500 group-hover:h-3"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="p-4">
                      <p className="font-heading text-anthracite text-sm font-bold group-hover:text-pumpkin transition-colors duration-300">
                        {collection.name}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products per collection */}
        {relatedCollections.length > 0 && (
          <section className="section-padding bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="accent-line" />
                <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                  Produkte
                </p>
              </div>
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
                Alle {category.title}
              </h2>

              <div className="space-y-14">
                {relatedCollections.map((collection) => {
                  const collectionProducts =
                    getProductsByCollectionAndCategory(collection.slug, slug);
                  if (collectionProducts.length === 0) return null;
                  return (
                    <div
                      key={collection.slug}
                      id={`kollektion-${collection.slug}`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="flex">
                            {collection.moodColors.map((color, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 first:rounded-l last:rounded-r"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold">
                            {collection.name}
                          </h3>
                        </div>
                        <Link
                          href={`/kollektionen/${collection.slug}`}
                          className="inline-flex items-center gap-2 text-pumpkin group"
                        >
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
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {collectionProducts.map((product) => (
                          <ProductCard
                            key={product.slug}
                            product={product}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Cross-link to collections */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-6">
              Sie suchen nach Farbe oder Kollektion?
            </p>
            <Link href="/kollektionen" className="btn-outline">
              Zu den Kollektionen
            </Link>
          </div>
        </section>

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
