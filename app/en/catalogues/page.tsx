import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ScrollReveal from "@/components/ScrollReveal";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getPublicDownloadsByType } from "@/lib/cms/downloads";
import type { FrontendDownload } from "@/lib/cms/downloads";
import { getIconSlots } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import type { ServicePage } from "@/lib/mosaroma/servicePages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("kataloge", "kataloge", "en");
  return {
    title: "Catalogues & Downloads | Mosaroma",
    description:
      "Mosaroma Catalogue 2027, product dimensions, care instructions, warranty information and technical fabric data.",
  };
}

const SERVICE_ICON_MAP: Record<string, string> = {
  ruler: "service-ruler",
  shield: "service-shield",
  default: "service-fabric",
};

const servicePagesEn: ServicePage[] = [
  {
    slug: "product-dimensions",
    title: "Product Dimensions",
    href: "/en/catalogues/product-dimensions",
    description:
      "All dimensions and measurements of relevant product shapes at a glance.",
    icon: "ruler",
  },
  {
    slug: "care-warranty",
    title: "Care & Warranty",
    href: "/en/catalogues/care-warranty",
    description:
      "Cleaning, storage and warranty information for Mosaroma outdoor products.",
    icon: "shield",
  },
  {
    slug: "fabric-technical-data",
    title: "Fabric Technical Data",
    href: "/en/catalogues/fabric-technical-data",
    description:
      "Technical data, fabric qualities and test values for Mosaroma materials.",
    icon: "fabric",
  },
];

function CatalogCard({ download, icons }: { download: FrontendDownload; icons: Record<string, import("@/lib/cms/icons").ResolvedIcon> }) {
  const href = download.externalUrl || download.fileUrl || "#";
  const isExternal = download.opensInNewTab || href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="btn-outline-white"
    >
      {download.buttonLabel}
      {isExternal && <CmsIcon icon={icons["external-link"]} width={14} height={14} />}
    </a>
  );
}

export default async function CataloguesPage() {
  const [layout, hero, catalogs, icons] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("kataloge", "kataloge", "en"),
    getPublicDownloadsByType("catalog", "en"),
    getIconSlots(["service-ruler", "service-shield", "service-fabric", "external-link", "arrow-right"]),
  ]);

  const catalogDe = catalogs.find((d) => d.language === "de");
  const catalogEn = catalogs.find((d) => d.language === "en");

  return (
    <>
      <Header {...layout.header} locale="en" />
      <main id="main">
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
        />
        <BreadcrumbBar items={[{ label: "Catalogues" }]} locale="en" />

        {/* Catalogue 2027 Feature Card */}
        <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="bg-anthracite p-8 md:p-12 lg:p-16">
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-px bg-pumpkin" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Catalogue
                  </p>
                </div>

                <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  Catalogue 2027
                </h2>

                <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] mb-6">
                  The complete Mosaroma product catalogue with collections,
                  materials, product dimensions and service information for the
                  2027 season.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border border-white/20 text-white/70">
                    Flipbook
                  </span>
                  <span className="font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border border-white/20 text-white/70">
                    Deutsch
                  </span>
                  <span className="font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border border-white/20 text-white/70">
                    English
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {catalogDe && <CatalogCard download={catalogDe} icons={icons} />}
                  {catalogEn && <CatalogCard download={catalogEn} icons={icons} />}
                </div>

                <p className="font-body text-white/70 text-xs mt-6">
                  Opens in a new tab.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Cards */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Further Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {servicePagesEn.map((page, i) => (
                <ScrollReveal key={page.slug} delay={i * 100}>
                <Link
                  href={page.href}
                  className="group block bg-white p-8 border border-light-gray transition-all duration-500 motion-safe:hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-pumpkin/10 text-pumpkin group-hover:bg-pumpkin group-hover:text-white transition-all duration-500 mb-6">
                    <CmsIcon icon={icons[SERVICE_ICON_MAP[page.icon] || SERVICE_ICON_MAP.default]} width={24} height={24} />
                  </div>

                  <h3 className="font-heading text-anthracite text-lg font-bold group-hover:text-pumpkin transition-colors duration-300 mb-2">
                    {page.title}
                  </h3>

                  <p className="font-body text-text-gray text-sm leading-relaxed mb-6">
                    {page.description}
                  </p>

                  <span className="inline-flex items-center gap-2 text-pumpkin-accessible">
                    <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.12em]">
                      View
                    </span>
                    <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
