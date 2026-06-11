import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import {
  getCollectionBySlugWithStatus,
  getCollectionStaticParams,
  type FrontendCollection,
} from "@/lib/cms/collections";
import {
  getCollectionBySlug as getStaticCollectionBySlug,
  type Collection as StaticCollection,
} from "@/lib/mosaroma/collections";
import { getProductsByCollectionSlug, type FrontendProduct } from "@/lib/cms/products";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getSiteSettings } from "@/lib/cms/settings";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  return getCollectionStaticParams();
}

function staticToFrontend(sc: StaticCollection): FrontendCollection {
  return {
    slug: sc.slug,
    name: sc.name,
    number: sc.number,
    eyebrow: `Kollektion ${sc.number}`,
    subtitle: sc.subtitle,
    shortDescription: sc.description,
    longDescription: sc.extendedDescription,
    fabric: sc.fabric,
    cardImage: sc.image,
    cardAlt: sc.alt,
    heroImage: `/images/placeholders/collections/hero/${sc.slug}.svg`,
    heroAlt: `${sc.name} Collection Hero`,
    moodColors: [...sc.moodColors],
    seoTitle: null,
    seoDescription: null,
  };
}

async function resolveCollection(slug: string): Promise<FrontendCollection | null> {
  const result = await getCollectionBySlugWithStatus(slug);

  if (result.state === "published") return result.collection;

  if (result.state === "not-public") return null;

  const staticCol = getStaticCollectionBySlug(slug);
  return staticCol ? staticToFrontend(staticCol) : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await resolveCollection(slug);
  if (!collection) {
    return { title: "Kollektion nicht gefunden | Mosaroma" };
  }
  const settings = await getSiteSettings();
  const title =
    collection.seoTitle ||
    `${collection.name} Collection | Mosaroma Kollektionen 2027`;
  const description =
    collection.seoDescription ||
    collection.shortDescription ||
    settings?.defaultSeoDescription ||
    "";
  return { title, description };
}

function groupProductsByCategory(products: FrontendProduct[]) {
  const groups: { slug: string; name: string; products: FrontendProduct[] }[] = [];
  const map = new Map<string, FrontendProduct[]>();
  const nameMap = new Map<string, string>();

  for (const p of products) {
    const key = p.categorySlug;
    if (!map.has(key)) {
      map.set(key, []);
      nameMap.set(key, p.productGroupName || key);
    }
    map.get(key)!.push(p);
  }

  for (const [slug, prods] of map) {
    groups.push({ slug, name: nameMap.get(slug) || slug, products: prods });
  }

  return groups;
}

export default async function KollektionPage({ params }: PageProps) {
  const { slug } = await params;
  const [layout, collection, products] = await Promise.all([
    getPublicLayoutData(),
    resolveCollection(slug),
    getProductsByCollectionSlug(slug),
  ]);

  if (!collection) {
    notFound();
  }

  const productGroups = groupProductsByCategory(products);

  return (
    <>
      <Header {...layout.header} />
      <main>
        {/* Compact hero with background image, breadcrumbs inside */}
        <section className="relative overflow-hidden h-[300px] md:h-[320px] flex items-end">
          <Image
            src={collection.heroImage}
            alt={collection.heroAlt}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.12) 80%, transparent 100%)",
            }}
          />

          <div className="relative w-full pt-24 md:pt-28 pb-6 md:pb-8">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-px bg-pumpkin" />
                  <p className="font-accent text-pumpkin text-[11px] tracking-[0.3em] uppercase">
                    {collection.eyebrow}
                  </p>
                </div>

                <h1 className="font-heading text-white text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.08]">
                  {collection.name}
                </h1>

                {collection.subtitle && (
                  <p className="font-heading text-white/70 text-base md:text-lg font-medium tracking-tight leading-snug mt-2 line-clamp-1">
                    {collection.subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
        <BreadcrumbBar items={[
          { label: "Kollektionen", href: "/kollektionen" },
          { label: `${collection.name} Collection` },
        ]} />

        {/* Extended description / mood text */}
        {collection.longDescription && (
          <section className="section-padding bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="max-w-3xl">
                <p className="font-heading text-anthracite text-xl md:text-2xl lg:text-[1.75rem] font-medium tracking-tight leading-snug">
                  {collection.longDescription}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Color palette */}
        {collection.moodColors.length > 0 && (
          <section className="section-padding bg-cream">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
                Die Stimmungsfarben
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
        )}

        {/* Products grouped by category */}
        {productGroups.length > 0 && (
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

              <div className="space-y-10 md:space-y-14">
                {productGroups.map((group) => (
                  <div key={group.slug} id={`kategorie-${group.slug}`}>
                    <div className="mb-6">
                      <h3 className="font-heading text-anthracite text-xl md:text-2xl font-bold tracking-tight">
                        {group.name}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                      {group.products.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Fabric info */}
        {collection.fabric && (
          <section className="section-padding bg-cream">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
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
        )}

        {/* CTA */}
        <section className="section-padding bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
              Kollektion {collection.name} entdecken
            </h2>
            <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              Blättern Sie durch unseren Katalog oder sprechen Sie uns direkt an
              -- wir beraten Sie gerne.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kollektionen" className="btn-outline-white">
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
      <Footer {...layout.footer} />
    </>
  );
}
