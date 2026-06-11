import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import {
  getProductGroupBySlugWithStatus,
  getProductGroupStaticParams,
  type FrontendProductGroup,
} from "@/lib/cms/product-groups";
import { getCategoryBySlug as getStaticCategoryBySlug } from "@/lib/mosaroma/categories";
import {
  getProductsByProductGroupSlug,
  type FrontendProduct,
} from "@/lib/cms/products";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getSiteSettings } from "@/lib/cms/settings";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  return getProductGroupStaticParams();
}

async function resolveGroup(slug: string): Promise<FrontendProductGroup | null> {
  const result = await getProductGroupBySlugWithStatus(slug);

  if (result.state === "active") return result.group;
  if (result.state === "inactive") return null;

  const staticCat = getStaticCategoryBySlug(slug);
  if (!staticCat) return null;
  return {
    slug: staticCat.slug,
    name: staticCat.title,
    description: staticCat.description,
    shortDescription: staticCat.shortDescription,
    image: staticCat.image,
    imageAlt: staticCat.alt,
    icon: null,
    features: staticCat.features,
    order: 0,
    seoTitle: null,
    seoDescription: null,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const group = await resolveGroup(slug);
  if (!group) {
    return { title: "Kategorie nicht gefunden | Mosaroma" };
  }
  const settings = await getSiteSettings();
  const title = group.seoTitle || `${group.name} | Mosaroma Produktkategorien`;
  const description =
    group.seoDescription ||
    group.description ||
    settings?.defaultSeoDescription ||
    "";
  return { title, description };
}

function groupProductsByCollection(products: FrontendProduct[]) {
  const groups: { slug: string; name: string; products: FrontendProduct[] }[] = [];
  const map = new Map<string, FrontendProduct[]>();
  const nameMap = new Map<string, string>();

  for (const p of products) {
    const key = p.collectionSlug;
    if (!map.has(key)) {
      map.set(key, []);
      nameMap.set(key, p.collectionName || key);
    }
    map.get(key)!.push(p);
  }

  for (const [slug, prods] of map) {
    groups.push({ slug, name: nameMap.get(slug) || slug, products: prods });
  }

  return groups;
}

export default async function KategoriePage({ params }: PageProps) {
  const { slug } = await params;
  const [layout, group, products] = await Promise.all([
    getPublicLayoutData(),
    resolveGroup(slug),
    getProductsByProductGroupSlug(slug),
  ]);

  if (!group) {
    notFound();
  }

  const staticCat = getStaticCategoryBySlug(slug);
  const collectionGroups = groupProductsByCollection(products);

  return (
    <>
      <Header {...layout.header} />
      <main>
        {/* Category detail with breadcrumbs */}
        <section className="bg-cream pt-28 md:pt-32 pb-16 md:pb-24">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="mb-6 md:mb-8">
              <Breadcrumbs
                items={[
                  { label: "Produktkategorien", href: "/produktkategorien" },
                  { label: group.name },
                ]}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Produktkategorie
                  </p>
                </div>

                <h1 className="font-heading text-anthracite text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-tight leading-[1.08]">
                  {group.name}
                </h1>

                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mt-6 max-w-2xl">
                  {group.description}
                </p>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={group.image}
                  alt={group.imageAlt}
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
        {group.features.length > 0 && (
          <section className="section-padding bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
                Merkmale &amp; Vorteile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {group.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-4 p-6 bg-cream"
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
        )}

        {/* Dimensions from static data */}
        {staticCat && staticCat.dimensions.length > 0 && (
          <section className="section-padding bg-cream">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
                Verfügbare Größen
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {staticCat.dimensions.map((dim) => (
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
        )}

        {/* Available Fabrics from static data */}
        {staticCat && staticCat.availableFabrics.length > 0 && (
          <section className="section-padding bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
                Verfügbare Stoffqualitäten
              </h2>
              <div className="flex flex-wrap gap-4 mb-8">
                {staticCat.availableFabrics.map((fabric) => (
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
        )}

        {/* Products per collection */}
        {collectionGroups.length > 0 && (
          <section className="section-padding bg-cream">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
                Alle {group.name}
              </h2>

              <div className="space-y-14">
                {collectionGroups.map((cg) => (
                  <div key={cg.slug} id={`kollektion-${cg.slug}`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold">
                        {cg.name}
                      </h3>
                      <Link
                        href={`/kollektionen/${cg.slug}`}
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
                      {cg.products.map((product) => (
                        <ProductCard key={product.slug} product={product} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Cross-link */}
        <section className="section-padding bg-white">
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
              Interessiert an {group.name}?
            </h2>
            <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
              Entdecken Sie unser komplettes Sortiment im Katalog oder nehmen
              Sie direkt Kontakt mit uns auf.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/kataloge" className="btn-outline-white">
                Katalog ansehen
              </Link>
              <Link href="/kontakt" className="btn-primary">
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
