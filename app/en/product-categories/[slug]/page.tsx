import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbBar from "@/components/BreadcrumbBar";
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
import PageCta from "@/components/PageCta";
import { getIconSlots } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import { translateProductTypeAsync } from "@/lib/i18n/product-types";

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
    return { title: "Category not found | Mosaroma" };
  }
  const settings = await getSiteSettings();
  const displayName = await translateProductTypeAsync(group.name, "en");
  const title = group.seoTitle || `${displayName} | Mosaroma Product Categories`;
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

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [layout, group, products, icons] = await Promise.all([
    getPublicLayoutData("en"),
    resolveGroup(slug),
    getProductsByProductGroupSlug(slug),
    getIconSlots(["arrow-right", "checkmark"]),
  ]);

  if (!group) {
    notFound();
  }

  const staticCat = getStaticCategoryBySlug(slug);
  const collectionGroups = groupProductsByCollection(products);
  const displayName = await translateProductTypeAsync(group.name, "en");

  return (
    <>
      <Header {...layout.header} locale="en" />
      <main id="main">
        {/* Category detail with breadcrumbs */}
        <section className="bg-cream pt-28 md:pt-32 pb-16 md:pb-24">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="mb-6 md:mb-8">
              <BreadcrumbBar items={[
                { label: "Product Categories", href: "/en/product-categories" },
                { label: displayName },
              ]} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <h1 className="font-heading text-anthracite text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-tight leading-[1.08]">
                  {displayName}
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
                Features &amp; Benefits
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {group.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-start gap-4 p-6 bg-cream"
                  >
                    <CmsIcon icon={icons["checkmark"]} width={20} height={20} className="text-pumpkin flex-shrink-0 mt-0.5" />
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
                Available Sizes
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
                        Fabric: {dim.fabric}
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
                Available Fabric Qualities
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
                href="/en/materials"
                className="inline-flex items-center gap-3 text-anthracite hover:text-pumpkin group transition-colors duration-300"
              >
                <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
                  Discover all materials
                </span>
                <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="text-pumpkin motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </section>
        )}

        {/* Products per collection */}
        {collectionGroups.length > 0 && (
          <section className="section-padding bg-cream">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
                All {displayName}
              </h2>

              <div className="space-y-14">
                {collectionGroups.map((cg) => (
                  <div key={cg.slug} id={`collection-${cg.slug}`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold">
                        {cg.name}
                      </h3>
                      <Link
                        href={`/en/collections/${cg.slug}`}
                        className="inline-flex items-center gap-2 text-anthracite hover:text-pumpkin group transition-colors duration-300"
                      >
                        <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.12em]">
                          View collection
                        </span>
                        <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="text-pumpkin motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
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
              Looking for a specific colour or collection?
            </p>
            <Link href="/en/collections" className="btn-outline">
              View collections
            </Link>
          </div>
        </section>

        <PageCta
          variant="minimal"
          title={`Interested in ${displayName}?`}
          description="Discover our complete range in the catalogue or get in touch with us directly."
          primaryLabel="Get in touch"
          primaryHref="/en/contact"
          secondaryLabel="View catalogue"
          secondaryHref="/en/catalogues"
        />
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
