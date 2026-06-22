import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import CollectionAnchorNav from "@/components/CollectionAnchorNav";
import CollectionProductCard from "@/components/CollectionProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import {
  getCollectionBySlugWithStatus,
  getCollectionStaticParams,
  type FrontendCollection,
} from "@/lib/cms/collections";
import {
  getCollectionBySlug as getStaticCollectionBySlug,
  type Collection as StaticCollection,
} from "@/lib/mosaroma/collections";
import {
  fabricQualities,
  type FabricQuality,
} from "@/lib/mosaroma/materials";
import { getProductsByCollectionSlug, type FrontendProduct } from "@/lib/cms/products";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getSiteSettings } from "@/lib/cms/settings";
import { getIconSlots } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

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
  const groups: { slug: string; name: string; description: string; products: FrontendProduct[] }[] = [];
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
    groups.push({
      slug,
      name: nameMap.get(slug) || slug,
      description: "",
      products: prods,
    });
  }

  return groups;
}

function resolveFabricData(fabricName: string): FabricQuality | null {
  const normalized = fabricName.toLowerCase();
  if (normalized.includes("nerio")) return fabricQualities.find((f) => f.slug === "nerio") ?? null;
  if (normalized.includes("basic")) return fabricQualities.find((f) => f.slug === "basic") ?? null;
  if (normalized.includes("lite")) return fabricQualities.find((f) => f.slug === "mackintosh-lite") ?? null;
  if (normalized.includes("mackintosh")) return fabricQualities.find((f) => f.slug === "mackintosh") ?? null;
  return null;
}

function isPlaceholder(src: string) {
  return src.includes("/placeholders/") || src.endsWith(".svg");
}

function getHeroFallbackStyle(colors: string[]) {
  if (colors.length >= 2) {
    return {
      background: `linear-gradient(160deg, ${colors[0]} 0%, ${colors[Math.min(1, colors.length - 1)]} 45%, ${colors[Math.min(2, colors.length - 1)]} 100%)`,
    };
  }
  return { background: colors[0] || "#2D2D2D" };
}

const SERVICE_LINKS = [
  { label: "Produktmaße", href: "/kataloge/produktmasse", description: "Maßtabellen für alle Formate" },
  { label: "Pflege & Garantie", href: "/kataloge/pflege-garantie", description: "Reinigung, Pflege und Gewährleistung" },
  { label: "Technische Daten", href: "/kataloge/stoff-technische-daten", description: "Stoffeigenschaften im Detail" },
  { label: "Kataloge", href: "/kataloge", description: "Alle Kataloge als Download" },
];

export default async function KollektionPage({ params }: PageProps) {
  const { slug } = await params;
  const [layout, collection, products, icons] = await Promise.all([
    getPublicLayoutData(),
    resolveCollection(slug),
    getProductsByCollectionSlug(slug),
    getIconSlots(["arrow-right", "checkmark"]),
  ]);

  if (!collection) {
    notFound();
  }

  const productGroups = groupProductsByCategory(products);
  const fabricData = resolveFabricData(collection.fabric);
  const hasRealHero = !isPlaceholder(collection.heroImage);

  const anchorItems = [
    ...(collection.moodColors.length > 0 ? [{ id: "farben", label: "Farben" }] : []),
    ...(productGroups.length > 0 ? [{ id: "produkte", label: "Produkte" }] : []),
    ...(collection.fabric ? [{ id: "material", label: "Material" }] : []),
    { id: "service", label: "Service" },
    { id: "beratung", label: "Beratung" },
  ];

  const totalProducts = products.length;

  return (
    <>
      <Header {...layout.header} />
      <main id="main">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden h-[300px] md:h-[320px] flex items-end">
          {hasRealHero ? (
            <Image
              src={collection.heroImage}
              alt={collection.heroAlt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          ) : (
            <>
              <div className="absolute inset-0" style={getHeroFallbackStyle(collection.moodColors)} />
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.25) 3px, rgba(255,255,255,0.25) 4px)",
                }}
              />
            </>
          )}
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
                  {collection.name} Collection
                </h1>

                {collection.subtitle && (
                  <p className="font-heading text-white/65 text-base md:text-lg font-medium tracking-tight leading-snug mt-2 line-clamp-1">
                    {collection.subtitle}
                  </p>
                )}

                <div className="flex items-center gap-5 mt-4">
                  <a
                    href="#produkte"
                    className="font-heading text-white/70 text-[11px] font-semibold uppercase tracking-[0.1em] hover:text-white transition-colors duration-300"
                  >
                    Produkte entdecken
                  </a>
                  {collection.fabric && (
                    <a
                      href="#material"
                      className="font-heading text-white/70 text-[11px] font-semibold uppercase tracking-[0.1em] hover:text-white transition-colors duration-300"
                    >
                      Material ansehen
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <BreadcrumbBar items={[
          { label: "Kollektionen", href: "/kollektionen" },
          { label: `${collection.name} Collection` },
        ]} />

        {/* ── Anchor Navigation ── */}
        <CollectionAnchorNav items={anchorItems} />

        {/* ── Intro + Quick Facts ── */}
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
              <div className="lg:col-span-3">
                {collection.longDescription && (
                  <ScrollReveal>
                    <p className="font-heading text-anthracite text-xl md:text-2xl lg:text-[1.625rem] font-medium tracking-tight leading-[1.4]">
                      {collection.longDescription}
                    </p>
                  </ScrollReveal>
                )}
                {collection.shortDescription && collection.shortDescription !== collection.longDescription && (
                  <ScrollReveal delay={80}>
                    <p className="font-body text-text-gray text-[15px] leading-[1.8] mt-5">
                      {collection.shortDescription}
                    </p>
                  </ScrollReveal>
                )}
              </div>

              <div className="lg:col-span-2">
                <ScrollReveal delay={120}>
                  <div className="border border-black/[0.06] p-6 md:p-7 space-y-4">
                    <h3 className="font-heading text-anthracite text-[11px] font-semibold uppercase tracking-[0.15em]">
                      Auf einen Blick
                    </h3>
                    <dl className="space-y-3">
                      {collection.fabric && (
                        <div className="flex items-start gap-3">
                          <dt className="font-body text-text-gray/60 text-[13px] min-w-[90px]">Stoff</dt>
                          <dd className="font-body text-anthracite text-[13px] font-medium">{collection.fabric}</dd>
                        </div>
                      )}
                      {fabricData?.dyeing && (
                        <div className="flex items-start gap-3">
                          <dt className="font-body text-text-gray/60 text-[13px] min-w-[90px]">Färbung</dt>
                          <dd className="font-body text-anthracite text-[13px] font-medium">{fabricData.dyeing}</dd>
                        </div>
                      )}
                      {fabricData?.material && (
                        <div className="flex items-start gap-3">
                          <dt className="font-body text-text-gray/60 text-[13px] min-w-[90px]">Material</dt>
                          <dd className="font-body text-anthracite text-[13px] font-medium">{fabricData.material}</dd>
                        </div>
                      )}
                      {totalProducts > 0 && (
                        <div className="flex items-start gap-3">
                          <dt className="font-body text-text-gray/60 text-[13px] min-w-[90px]">Produkte</dt>
                          <dd className="font-body text-anthracite text-[13px] font-medium">{totalProducts} Artikel in {productGroups.length} Kategorien</dd>
                        </div>
                      )}
                      {collection.moodColors.length > 0 && (
                        <div className="flex items-start gap-3">
                          <dt className="font-body text-text-gray/60 text-[13px] min-w-[90px]">Palette</dt>
                          <dd className="flex items-center gap-1.5">
                            {collection.moodColors.map((color, i) => (
                              <div
                                key={i}
                                className="w-5 h-5 border border-black/[0.08]"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── Mood Colors ── */}
        {collection.moodColors.length > 0 && (
          <section id="farben" className="bg-cream py-12 md:py-16">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-8">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Farbwelt
                  </p>
                </div>
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-10">
                  Die Stimmungsfarben
                </h2>
              </ScrollReveal>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {collection.moodColors.map((color, i) => (
                  <ScrollReveal key={i} delay={i * 60}>
                    <div className="group">
                      <div
                        className="aspect-[4/3] w-full border border-black/[0.06] transition-shadow duration-500 group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
                        style={{ backgroundColor: color }}
                      />
                      <div className="mt-3 flex items-baseline justify-between">
                        <p className="font-heading text-anthracite text-sm font-semibold">
                          {collection.name} {String(i + 1).padStart(2, "0")}
                        </p>
                        <p className="font-accent text-text-gray/50 text-[11px] tracking-wider uppercase">
                          {color}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Products ── */}
        {productGroups.length > 0 && (
          <section id="produkte" className="bg-white py-12 md:py-16">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Kollektion
                  </p>
                </div>
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-12">
                  <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight">
                    Produkte in dieser Kollektion
                  </h2>
                  <p className="font-body text-text-gray text-sm">
                    {totalProducts} Produkte in {productGroups.length} Kategorien
                  </p>
                </div>
              </ScrollReveal>

              <div className="space-y-14 md:space-y-20">
                {productGroups.map((group) => (
                  <div key={group.slug} id={`kategorie-${group.slug}`}>
                    <ScrollReveal>
                      <div className="flex items-end justify-between border-b border-black/[0.06] pb-4 mb-8">
                        <div>
                          <h3 className="font-heading text-anthracite text-xl md:text-2xl font-bold tracking-tight">
                            {group.name}
                          </h3>
                        </div>
                        <span className="font-accent text-text-gray/50 text-[11px] tracking-[0.12em] uppercase flex-shrink-0 ml-4">
                          {group.products.length} {group.products.length === 1 ? "Produkt" : "Produkte"}
                        </span>
                      </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                      {group.products.map((product, pi) => (
                        <ScrollReveal key={product.slug} delay={Math.min(pi, 7) * 40}>
                          <CollectionProductCard
                            product={product}
                            collectionColors={collection.moodColors}
                          />
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Material ── */}
        {collection.fabric && (
          <section id="material" className="bg-cream py-12 md:py-16">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <ScrollReveal>
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Stoff & Technik
                  </p>
                </div>
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-10">
                  Material dieser Kollektion
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={60}>
                <div className="bg-white border border-black/[0.06] overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8 md:p-10 lg:p-12">
                      <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-2 border border-pumpkin/30 text-pumpkin/80 bg-pumpkin/[0.04] inline-block mb-5">
                        {collection.fabric}
                      </span>

                      <p className="font-body text-text-gray text-[15px] leading-[1.8] mb-6">
                        Diese Kollektion wird in der Stoffqualität{" "}
                        <strong className="text-anthracite">{collection.fabric}</strong>{" "}
                        gefertigt.
                        {fabricData?.material && (
                          <> Basis: {fabricData.material}.</>
                        )}
                        {fabricData?.weight && (
                          <> Gewicht: {fabricData.weight}.</>
                        )}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href="/materialien"
                          className="inline-flex items-center gap-2 text-pumpkin group"
                        >
                          <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.12em]">
                            Materialien entdecken
                          </span>
                          <CmsIcon icon={icons["arrow-right"]} width={13} height={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                        </Link>
                      </div>
                    </div>

                    {fabricData && (fabricData.highlights || fabricData.dyeing) && (
                      <div className="border-t lg:border-t-0 lg:border-l border-black/[0.06] p-8 md:p-10 lg:p-12 bg-cream/50">
                        <h4 className="font-heading text-anthracite text-[11px] font-semibold uppercase tracking-[0.15em] mb-5">
                          Eigenschaften
                        </h4>
                        <ul className="space-y-3">
                          {fabricData.dyeing && (
                            <li className="flex items-start gap-3">
                              <CmsIcon icon={icons["checkmark"]} width={14} height={14} className="text-pumpkin/60 mt-0.5 flex-shrink-0" />
                              <span className="font-body text-text-gray text-[13px]">{fabricData.dyeing}</span>
                            </li>
                          )}
                          {fabricData.comfort && (
                            <li className="flex items-start gap-3">
                              <CmsIcon icon={icons["checkmark"]} width={14} height={14} className="text-pumpkin/60 mt-0.5 flex-shrink-0" />
                              <span className="font-body text-text-gray text-[13px]">{fabricData.comfort}</span>
                            </li>
                          )}
                          {fabricData.cushionThickness && (
                            <li className="flex items-start gap-3">
                              <CmsIcon icon={icons["checkmark"]} width={14} height={14} className="text-pumpkin/60 mt-0.5 flex-shrink-0" />
                              <span className="font-body text-text-gray text-[13px]">{fabricData.cushionThickness}</span>
                            </li>
                          )}
                          {fabricData.highlights?.map((h) => (
                            <li key={h} className="flex items-start gap-3">
                              <CmsIcon icon={icons["checkmark"]} width={14} height={14} className="text-pumpkin/60 mt-0.5 flex-shrink-0" />
                              <span className="font-body text-text-gray text-[13px]">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ── Service Links ── */}
        <section id="service" className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <ScrollReveal>
              <div className="flex items-center gap-4 mb-5">
                <div className="accent-line" />
                <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                  Informationen
                </p>
              </div>
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-10">
                Passende Informationen
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SERVICE_LINKS.map((link, i) => (
                <ScrollReveal key={link.href} delay={i * 50}>
                  <Link
                    href={link.href}
                    className="group flex flex-col p-6 border border-black/[0.06] bg-cream/50 transition-all duration-400 hover:border-black/[0.10] hover:bg-cream h-full"
                  >
                    <h3 className="font-heading text-anthracite text-[15px] font-bold tracking-tight group-hover:text-pumpkin transition-colors duration-300">
                      {link.label}
                    </h3>
                    <p className="font-body text-text-gray/70 text-[13px] leading-[1.7] mt-2 flex-1">
                      {link.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-pumpkin/60 group-hover:text-pumpkin transition-colors duration-300 mt-4">
                      <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em]">
                        Ansehen
                      </span>
                      <CmsIcon icon={icons["arrow-right"]} width={12} height={12} className="motion-safe:group-hover:translate-x-0.5 transition-transform duration-300" />
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Collection CTA ── */}
        <section id="beratung" className="relative bg-anthracite overflow-hidden py-16 md:py-20">
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.25) 3px, rgba(255,255,255,0.25) 4px)",
            }}
          />

          <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="max-w-2xl mx-auto text-center">
              <ScrollReveal>
                <p className="font-accent text-pumpkin/70 text-[10px] tracking-[0.25em] uppercase mb-4">
                  Beratung & Muster
                </p>
                <h2 className="font-heading text-white text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  {collection.name} Collection für Ihr Projekt?
                </h2>
                <p className="font-body text-white/55 text-[15px] leading-[1.8] mb-8 max-w-lg mx-auto">
                  Fordern Sie passende Muster an oder lassen Sie sich zu Formen, Materialien und Produktmaßen beraten.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/kontakt" className="btn-primary">
                    Kontakt aufnehmen
                  </Link>
                  <Link href="/kataloge/produktmasse" className="btn-outline-white">
                    Produktmaße ansehen
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
