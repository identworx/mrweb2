import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageCta from "@/components/PageCta";
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
import { getIconSlots } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

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
  const [layout, product, icons] = await Promise.all([
    getPublicLayoutData(),
    resolveProduct(slug),
    getIconSlots(["arrow-right", "checkmark"]),
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
      <main id="main">
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
                  className="font-accent text-white/70 text-[11px] tracking-[0.2em] uppercase hover:text-white/80 transition-colors"
                >
                  {displayCollection} Collection
                </Link>
              </div>
            )}

            <h1 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.1]">
              {product.name}
            </h1>

            {product.productGroupName && (
              <p className="font-body text-white/70 text-sm md:text-base mt-1.5">
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

              {/* Product Info Panel */}
              <div className="bg-white border border-black/[0.06] p-6 md:p-8 lg:p-10 self-start">
                {/* Collection Context */}
                {moodColors.length > 0 && (
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex">
                      {moodColors.map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <Link
                      href={`/kollektionen/${product.collectionSlug}`}
                      className="font-accent text-text-muted text-[10px] tracking-[0.2em] uppercase hover:text-pumpkin transition-colors"
                    >
                      {displayCollection} Collection
                    </Link>
                  </div>
                )}

                {product.productGroupName && (
                  <Link
                    href={`/produktkategorien/${product.categorySlug}`}
                    className="inline-block font-accent text-text-muted text-[10px] tracking-[0.15em] uppercase hover:text-pumpkin transition-colors mb-5"
                  >
                    {product.productGroupName}
                  </Link>
                )}

                {/* Description */}
                {product.description && (
                  <p className="font-body text-anthracite/80 text-[15px] md:text-base leading-[1.85] max-w-lg mb-7">
                    {product.description}
                  </p>
                )}

                {/* Spec Cards */}
                {(product.material || product.size || product.code || product.colorName || product.patternName) && (
                  <div className="grid grid-cols-2 gap-2.5 mb-7">
                    {product.material && (
                      <SpecCard label="Material" value={product.material} />
                    )}
                    {product.size && (
                      <SpecCard label="Größe" value={product.size} />
                    )}
                    {product.code && (
                      <SpecCard label="Artikelcode" value={product.code} />
                    )}
                    {product.colorName && (
                      <SpecCard label="Farbe" value={product.colorName} />
                    )}
                    {product.patternName && (
                      <SpecCard label="Muster" value={product.patternName} />
                    )}
                  </div>
                )}

                {/* Features */}
                {product.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-7">
                    {product.features.map((feature) => (
                      <span
                        key={feature}
                        className="font-accent text-[9px] tracking-[0.1em] uppercase px-2.5 py-1 border border-black/[0.08] text-text-muted bg-[#FAF8F5]"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTAs */}
                <div className="border-t border-black/[0.06] pt-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/kontakt" className="btn-primary flex-1 justify-center">
                      Anfrage senden
                      <CmsIcon icon={icons["arrow-right"]} width={14} height={14} />
                    </Link>
                    <Link href="/kataloge" className="btn-outline flex-1 justify-center">
                      Katalog ansehen
                    </Link>
                  </div>
                  <p className="font-body text-text-muted text-xs mt-3 text-center">
                    Muster & Beratung auf Anfrage
                  </p>
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
                className="inline-flex items-center gap-3 text-anthracite hover:text-pumpkin mt-8 group transition-colors duration-300"
              >
                <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                  Mehr über {fabric.name} erfahren
                </span>
                <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="text-pumpkin motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
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
                  className="inline-flex items-center gap-3 text-anthracite hover:text-pumpkin mt-6 group transition-colors duration-300"
                >
                  <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                    Zur {displayCollection} Collection
                  </span>
                  <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="text-pumpkin motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
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

        <PageCta
          variant="light"
          title={`${product.name} für Ihr Projekt?`}
          description="Fordern Sie ein Muster an oder lassen Sie sich zu Material, Maßen und Verfügbarkeit beraten."
          primaryLabel="Kontakt aufnehmen"
          primaryHref="/kontakt"
          secondaryLabel="Katalog ansehen"
          secondaryHref="/kataloge"
        />
      </main>
      <Footer {...layout.footer} />
    </>
  );
}

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3.5 md:p-4 bg-[#FAF8F5] border border-black/[0.04]">
      <p className="font-accent text-text-muted text-[9px] tracking-[0.2em] uppercase mb-1">
        {label}
      </p>
      <p className="font-heading text-anthracite text-[13px] md:text-sm font-semibold leading-snug">
        {value}
      </p>
    </div>
  );
}

function MaterialCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 md:p-6 bg-[#FAF8F5] border border-black/[0.04]">
      <p className="font-accent text-text-muted text-[10px] tracking-[0.2em] uppercase mb-2">
        {label}
      </p>
      <p className="font-heading text-anthracite text-sm font-semibold">
        {value}
      </p>
    </div>
  );
}
