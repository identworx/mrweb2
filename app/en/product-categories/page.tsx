import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import CategoryCard from "@/components/CategoryCard";
import { getActiveProductGroups } from "@/lib/cms/product-groups";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { translateProductType } from "@/lib/i18n/product-types";

export const metadata: Metadata = {
  title: "Product Categories | Mosaroma Outdoor Textiles",
  description:
    "Discover decorative cushions, high-back cushions, low-back cushions, seat cushions, bench cushions, poufs, placemats and blankets from Mosaroma.",
};

export const revalidate = 60;

export default async function ProductCategoriesPage() {
  const [layout, groups] = await Promise.all([
    getPublicLayoutData("en"),
    getActiveProductGroups(),
  ]);

  return (
    <>
      <Header {...layout.header} locale="en" />
      <main id="main">
        <PageHero
          eyebrow="Discover"
          title="Product Categories"
          description="Discover all MOSAROMA product categories — from decorative cushions and pads to poufs, placemats and blankets. Each category combines premium materials with thoughtful design for the outdoors."
        />
        <BreadcrumbBar items={[{ label: "Product Categories" }]} />

        <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            {groups.length === 0 ? (
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                No product categories are currently available. Please check back later.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                  <CategoryCard
                    key={group.slug}
                    title={translateProductType(group.name, "en")}
                    image={group.image}
                    alt={group.imageAlt}
                    description={group.shortDescription}
                    href={`/en/product-categories/${group.slug}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-6">
              Looking for a specific colour or collection? Discover our collections.
            </p>
            <Link href="/en/collections" className="btn-outline">
              View Collections
            </Link>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
