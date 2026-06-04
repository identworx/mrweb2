import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { collections, getCollectionBySlug } from "@/lib/mosaroma/collections";
import { categories } from "@/lib/mosaroma/categories";
import { getProductsByCollectionAndCategory } from "@/lib/mosaroma/products";

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
    title: `${collection.name} Collection | Mosaroma Kollektionen 2027`,
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
        {/* Breadcrumbs */}
        <div className="bg-cream">
          <Breadcrumbs
            items={[
              { label: "Kollektionen", href: "/kollektionen" },
              { label: `${collection.name} Collection` },
            ]}
          />
        </div>

        {/* Hero with color band and background image */}
        <section className="relative bg-cream pb-16 md:pb-24 overflow-hidden">
          <Image
            src={`/images/placeholders/collections/hero/${slug}.svg`}
            alt={`${collection.name} Collection Hero`}
            fill
            className="object-cover opacity-30"
            sizes="100vw"
            priority
          />
          <div className="relative">
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

            <div className="mx-auto max-w-[1400px] px-5 md:px-10 pt-12 md:pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
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

              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={collection.image}
                  alt={collection.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
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

        {/* Products grouped by category with subcategory hero images */}
        {collectionCategories.length > 0 && (
          <section className="section-padding bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="accent-line" />
                <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                  Produkte
                </p>
              </div>
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
                Produkte in dieser Kollektion
              </h2>

              <div className="space-y-16">
                {collectionCategories.map((cat) => {
                  const categoryProducts = getProductsByCollectionAndCategory(
                    collection.slug,
                    cat.slug,
                  );
                  if (categoryProducts.length === 0) return null;
                  return (
                    <div key={cat.slug} id={`kategorie-${cat.slug}`}>
                      {/* Subcategory hero image */}
                      <div className="relative aspect-[3/1] overflow-hidden mb-6">
                        <Image
                          src={`/images/placeholders/subcategories/hero/${slug}-${cat.slug}.svg`}
                          alt={`${collection.name} ${cat.title}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1400px) 100vw, 1400px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                          <h3 className="font-heading text-white text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                            {cat.title}
                          </h3>
                          <p className="font-body text-white/70 text-sm mt-1">
                            {categoryProducts.length}{" "}
                            {categoryProducts.length === 1
                              ? "Produkt"
                              : "Produkte"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        {categoryProducts.map((product) => (
                          <ProductCard key={product.slug} product={product} />
                        ))}
                      </div>
                    </div>
                  );
                })}
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
              <Link href="/kollektionen" className="btn-primary">
                Alle Kollektionen
              </Link>
              <Link href="/kataloge" className="btn-outline-white">
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
