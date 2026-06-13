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
  const displayCollection = product.collectionName || staticCollection?.name || product.collectionSlug;

  return (
    <>
      <Header {...layout.header} />
      <main>
        {/* ── Product Hero Band ── */}
        <section
          className="relative bg-anthracite pt-28 md:pt-32 pb-6 md:pb-8"
          style={
            moodColors.length >= 2
              ? {
                  background: `linear-gradient(135deg, #2D2D2D 0%, #2D2D2D 60%, ${moodColors[0]}33 100%)`,
                }
              : undefined
          }
        >
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="mb-4">
              <Breadcrumbs
                variant="light"
                items={[
                  { label: "Kollektionen", href: "/kollektionen" },
                  {
                    label: displayCollection,
                    href: `/kollektionen/${product.collectionSlug}`,
                  },
                  { label: product.name },
                ]}
              />
            </div>

            {moodColors.length > 0 && (
              <div className="flex items-center gap-3 mb-3">
                <div className="flex">
                  {moodColors.map((color, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-3.5"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <Link
                  href={`/kollektionen/${product.collectionSlug}`}
                  className="font-accent text-white/40 text-[11px] tracking-[0.2em] uppercase hover:text-white/70 transition-colors"
                >
                  {displayCollection} Collection
                </Link>
              </div>
            )}

            <h1 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1]">
              {product.name}
            </h1>

            {product.productGroupName && (
              <p className="font-body text-white/50 text-sm md:text-base mt-1.5">
                {product.productGroupName}
              </p>
            )}
          </div>
        </section>

        {/* ── Product Stage ── */}
        <section className="bg-[#FAF8F5] py-10 md:py-14">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] gap-8 lg:gap-12">
              {/* Gallery */}
              <div className="max-w-[580px] lg:max-w-none">
                <ProductImageGallery
                  items={galleryItems}
                  productName={product.name}
                  collectionName={displayCollection}
                  collectionColors={moodColors}
                />
              </div>

              {/* Product Info */}
              <div>
                {product.description && (
                  <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                    {product.description}
                  </p>
                )}

                {/* Specs */}
                <div className="mt-7 border-t border-black/[0.06] pt-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3.5">
                    {product.material && (
                      <SpecRow label="Material" value={product.material} />
                    )}
                    {product.size && (
                      <SpecRow label="Größe" value={product.size} />
                    )}
                    {product.code && (
                      <SpecRow label="Artikelcode" value={product.code} />
                    )}
                    {product.colorName && (
                      <SpecRow label="Farbe" value={product.colorName} />
                    )}
                    {product.patternName && (
                      <SpecRow label="Muster" value={product.patternName} />
                    )}
                  </div>
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
                <div className="flex flex-wrap items-center gap-4 mt-8">
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

        {/* ── Material Section ── */}
        {fabric && (
          <section className="py-12 md:py-16 bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-8 h-px bg-pumpkin" />
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight">
                  {fabric.name}
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                <MaterialCard label="Material" value={fabric.material} />
                <MaterialCard label="Gewicht" value={fabric.weight} />
                <MaterialCard label="Färbung" value={fabric.dyeing} />
                <MaterialCard label="Komfort" value={fabric.comfort} />
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

        {/* ── Collection Reference ── */}
        {staticCollection && (
          <section className="py-12 md:py-16 bg-[#FAF8F5]">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="bg-white border border-black/[0.06] p-8 md:p-10 lg:p-12 max-w-3xl">
                {moodColors.length > 0 && (
                  <div className="flex gap-0.5 mb-5">
                    {moodColors.map((color, i) => (
                      <div
                        key={i}
                        className="w-7 h-7"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
                <h3 className="font-heading text-anthracite text-xl md:text-2xl font-bold tracking-tight">
                  {displayCollection} Collection
                </h3>
                <p className="font-body text-text-gray text-sm md:text-base leading-[1.8] mt-3 max-w-xl">
                  {staticCollection.description}
                </p>
                <Link
                  href={`/kollektionen/${product.collectionSlug}`}
                  className="inline-flex items-center gap-3 text-pumpkin mt-6 group"
                >
                  <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                    Zur {displayCollection} Collection
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

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="py-12 md:py-16 bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-8 h-px bg-pumpkin" />
                <h2 className="font-heading text-anthracite text-xl md:text-2xl font-bold tracking-tight">
                  Das könnte Sie auch interessieren
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Product CTA ── */}
        <section className="py-14 md:py-20 bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              {product.name} für Ihr Projekt?
            </h2>
            <p className="font-body text-white/60 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              Fordern Sie ein Muster an oder lassen Sie sich zu Material,
              Maßen und Verfügbarkeit beraten.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kontakt" className="btn-primary">
                Kontakt aufnehmen
              </Link>
              <Link href="/kataloge" className="btn-outline-white">
                Katalog ansehen
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-text-gray/50 w-24 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="font-body text-anthracite text-sm">{value}</span>
    </div>
  );
}

function MaterialCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 md:p-6 bg-[#FAF8F5] border border-black/[0.04]">
      <p className="font-accent text-text-gray/50 text-[10px] tracking-[0.2em] uppercase mb-2">
        {label}
      </p>
      <p className="font-heading text-anthracite text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}
