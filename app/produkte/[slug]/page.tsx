import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import {
  getProductBySlugWithStatus,
  getProductStaticParams,
  getProductsByCollectionSlug,
  type FrontendProduct,
} from "@/lib/cms/products";
import {
  getProductBySlug as getStaticProductBySlug,
  products as staticProducts,
} from "@/lib/mosaroma/products";
import { getCollectionBySlug as getStaticCollectionBySlug } from "@/lib/mosaroma/collections";
import { fabricQualities } from "@/lib/mosaroma/materials";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getSiteSettings } from "@/lib/cms/settings";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  return getProductStaticParams();
}

async function resolveProduct(slug: string): Promise<FrontendProduct | null> {
  const result = await getProductBySlugWithStatus(slug);

  if (result.state === "published") return result.product;
  if (result.state === "not-public") return null;

  const staticProduct = getStaticProductBySlug(slug);
  if (!staticProduct) return null;

  return {
    ...staticProduct,
    shortDescription: "",
    galleryItems: [],
    heroImage: staticProduct.image,
    seoTitle: null,
    seoDescription: null,
    collectionName: staticProduct.collectionSlug,
    productGroupName: staticProduct.categorySlug,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug);
  if (!product) {
    return { title: "Produkt nicht gefunden | Mosaroma" };
  }
  const settings = await getSiteSettings();
  const title =
    product.seoTitle ||
    `${product.name} | Mosaroma`;
  const description =
    product.seoDescription ||
    product.shortDescription ||
    (product.description ? product.description.slice(0, 160) : null) ||
    settings?.defaultSeoDescription ||
    "";
  return { title, description };
}

export default async function ProduktPage({ params }: PageProps) {
  const { slug } = await params;
  const [layout, product] = await Promise.all([
    getPublicLayoutData(),
    resolveProduct(slug),
  ]);

  if (!product) {
    notFound();
  }

  const staticCollection = getStaticCollectionBySlug(product.collectionSlug);
  const fabric = fabricQualities.find((f) => f.slug === product.materialSlug);

  let relatedProducts: FrontendProduct[] = [];
  try {
    const collectionProducts = await getProductsByCollectionSlug(product.collectionSlug);
    relatedProducts = collectionProducts
      .filter((p) => p.slug !== product.slug)
      .slice(0, 4);
  } catch {
    relatedProducts = staticProducts
      .filter(
        (p) =>
          p.slug !== product.slug &&
          (p.collectionSlug === product.collectionSlug ||
            p.categorySlug === product.categorySlug),
      )
      .slice(0, 4)
      .map((sp) => ({
        ...sp,
        shortDescription: "",
        galleryItems: [],
        heroImage: sp.image,
        seoTitle: null,
        seoDescription: null,
        collectionName: sp.collectionSlug,
        productGroupName: sp.categorySlug,
      }));
  }

  const mainItem = { id: "main", url: product.image, alt: product.alt };
  const seen = new Set<string>([product.image]);
  const extraItems = product.galleryItems.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
  const galleryItems = [mainItem, ...extraItems];

  const moodColors = staticCollection?.moodColors || [];

  return (
    <>
      <Header {...layout.header} />
      <main>
        {/* Product detail with breadcrumbs */}
        <section className="bg-cream pt-28 md:pt-32 pb-16 md:pb-24">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="mb-6 md:mb-8">
              <Breadcrumbs
                items={[
                  { label: "Kollektionen", href: "/kollektionen" },
                  {
                    label: product.collectionName || product.collectionSlug,
                    href: `/kollektionen/${product.collectionSlug}`,
                  },
                  { label: product.name },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Gallery */}
              <ProductImageGallery
                items={galleryItems}
                productName={product.name}
              />

              {/* Product Info */}
              <div className="lg:pt-4">
                {moodColors.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex">
                      {moodColors.map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 first:rounded-l last:rounded-r"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <Link
                      href={`/kollektionen/${product.collectionSlug}`}
                      className="font-accent text-text-gray/60 text-xs tracking-[0.2em] uppercase hover:text-pumpkin transition-colors"
                    >
                      {product.collectionName || product.collectionSlug} Collection
                    </Link>
                  </div>
                )}

                <h1 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.1]">
                  {product.name}
                </h1>

                {product.productGroupName && (
                  <Link
                    href={`/produktkategorien/${product.categorySlug}`}
                    className="inline-block mt-2 font-body text-text-gray text-base hover:text-pumpkin transition-colors"
                  >
                    {product.productGroupName}
                  </Link>
                )}

                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mt-6">
                  {product.description}
                </p>

                {/* Details */}
                <div className="mt-8 space-y-4 border-t border-light-gray pt-8">
                  {product.material && (
                    <DetailRow label="Material" value={product.material} />
                  )}
                  {product.size && (
                    <DetailRow label="Größe" value={product.size} />
                  )}
                  {product.code && (
                    <DetailRow label="Artikelcode" value={product.code} />
                  )}
                  {product.colorName && (
                    <DetailRow label="Farbe" value={product.colorName} />
                  )}
                  {product.patternName && (
                    <DetailRow label="Muster" value={product.patternName} />
                  )}
                </div>

                {/* Features */}
                {product.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {product.features.map((feature) => (
                      <span
                        key={feature}
                        className="font-accent text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 border border-pumpkin/25 text-pumpkin/70 bg-pumpkin/5"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4 mt-10">
                  <Link href="/kontakt" className="btn-primary">
                    Anfrage senden
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
                    </svg>
                  </Link>
                  <Link href="/kataloge" className="btn-outline">
                    Katalog ansehen
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Material Section */}
        {fabric && (
          <section className="section-padding bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="accent-line" />
                <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                  Material
                </p>
              </div>
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-8">
                {fabric.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <InfoCard label="Material" value={fabric.material} />
                <InfoCard label="Gewicht" value={fabric.weight} />
                <InfoCard label="Färbung" value={fabric.dyeing} />
                <InfoCard label="Komfort" value={fabric.comfort} />
              </div>
              <Link
                href="/materialien"
                className="inline-flex items-center gap-3 text-pumpkin mt-8 group"
              >
                <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                  Mehr über {fabric.name} erfahren
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
        )}

        {/* Collection Link */}
        {staticCollection && (
          <section className="section-padding bg-cream">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="accent-line" />
                <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                  Kollektion
                </p>
              </div>
              <div className="bg-white p-8 md:p-10 border border-light-gray max-w-2xl">
                {moodColors.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex">
                      {moodColors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 first:rounded-l last:rounded-r"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <h3 className="font-heading text-anthracite text-xl font-bold">
                  {product.collectionName || staticCollection.name} Collection
                </h3>
                <p className="font-body text-text-gray text-sm leading-[1.8] mt-2">
                  {staticCollection.description}
                </p>
                <Link
                  href={`/kollektionen/${product.collectionSlug}`}
                  className="inline-flex items-center gap-3 text-pumpkin mt-6 group"
                >
                  <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                    Zur {product.collectionName || staticCollection.name} Collection
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
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="section-padding bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="accent-line" />
                <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                  Weitere Produkte
                </p>
              </div>
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-10">
                Das könnte Sie auch interessieren
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-padding bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Interesse an diesem Produkt?
            </h2>
            <p className="font-body text-white/60 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              Sprechen Sie uns direkt an — wir beraten Sie gerne zu Materialien,
              Maßen und Verfügbarkeit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kontakt" className="btn-primary">
                Kontakt aufnehmen
              </Link>
              <Link href="/kataloge" className="btn-outline-white">
                Katalog herunterladen
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-text-gray/50 w-28 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="font-body text-anthracite text-sm">{value}</span>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 bg-cream">
      <p className="font-accent text-text-gray/50 text-[10px] tracking-[0.2em] uppercase mb-2">
        {label}
      </p>
      <p className="font-heading text-anthracite text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}
