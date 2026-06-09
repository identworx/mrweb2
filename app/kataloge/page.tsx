import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import { servicePages, catalogLinks } from "@/lib/mosaroma/servicePages";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getPublicDownloadsByType } from "@/lib/cms/downloads";
import type { FrontendDownload } from "@/lib/cms/downloads";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("kataloge", "kataloge");
  return {
    title: hero.seoTitle || "Kataloge & Downloads | Mosaroma",
    description:
      hero.seoDescription ||
      "Mosaroma Katalog 2027, Produktmaße, Pflegehinweise, Garantieinformationen und technische Stoffdaten.",
  };
}

function ServiceIcon({ icon }: { icon: string }) {
  if (icon === "ruler") {
    return (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M5.636 18.364L18.364 5.636a1 1 0 011.414 0l0 0a1 1 0 010 1.414L7.05 19.778a1 1 0 01-1.414 0l0 0a1 1 0 010-1.414z" />
        <path d="M8.464 15.536l2-2M11.293 12.707l2-2M14.121 9.879l2-2" />
      </svg>
    );
  }
  if (icon === "shield") {
    return (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M4 6h16M4 10h16M4 14h10M4 18h6" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

function CatalogCard({ download, variant }: { download: FrontendDownload; variant: "primary" | "secondary" }) {
  const href = download.externalUrl || download.fileUrl || "#";
  const isExternal = download.opensInNewTab || href.startsWith("http");

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={variant === "primary" ? "btn-primary" : "btn-outline-white"}
    >
      {download.buttonLabel}
      {isExternal && <ExternalLinkIcon />}
    </a>
  );
}

export default async function KatalogePage() {
  const [layout, hero, catalogs] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("kataloge", "kataloge"),
    getPublicDownloadsByType("catalog"),
  ]);

  const catalogDe = catalogs.find((d) => d.language === "de");
  const catalogEn = catalogs.find((d) => d.language === "en");

  return (
    <>
      <Header {...layout.header} />
      <main>
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
          breadcrumbs={[{ label: "Kataloge" }]}
        />

        {/* Katalog 2027 Feature Card */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="bg-anthracite p-8 md:p-12 lg:p-16">
              <div className="max-w-3xl">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-px bg-pumpkin" />
                  <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                    Katalog
                  </p>
                </div>

                <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  Katalog 2027
                </h2>

                <p className="font-body text-white/60 text-base md:text-[1.0625rem] leading-[1.8] mb-6">
                  Der vollständige Mosaroma Produktkatalog mit Kollektionen,
                  Materialien, Produktmaßen und Serviceinformationen der Saison
                  2027.
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  <span className="font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border border-white/20 text-white/50">
                    Flipbook
                  </span>
                  <span className="font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border border-white/20 text-white/50">
                    Deutsch
                  </span>
                  <span className="font-heading text-[9px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border border-white/20 text-white/50">
                    English
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {catalogDe ? (
                    <CatalogCard download={catalogDe} variant="primary" />
                  ) : (
                    <a href={catalogLinks.de} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      Deutsch ansehen <ExternalLinkIcon />
                    </a>
                  )}
                  {catalogEn ? (
                    <CatalogCard download={catalogEn} variant="secondary" />
                  ) : (
                    <a href={catalogLinks.en} target="_blank" rel="noopener noreferrer" className="btn-outline-white">
                      English ansehen <ExternalLinkIcon />
                    </a>
                  )}
                </div>

                <p className="font-body text-white/30 text-xs mt-6">
                  Öffnet in neuem Tab.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Cards */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Service
              </p>
            </div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
              Weitere Informationen
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {servicePages.map((page) => (
                <Link
                  key={page.slug}
                  href={page.href}
                  className="group block bg-white p-8 border border-light-gray transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-pumpkin/10 text-pumpkin group-hover:bg-pumpkin group-hover:text-white transition-all duration-500 mb-6">
                    <ServiceIcon icon={page.icon} />
                  </div>

                  <h3 className="font-heading text-anthracite text-lg font-bold group-hover:text-pumpkin transition-colors duration-300 mb-2">
                    {page.title}
                  </h3>

                  <p className="font-body text-text-gray text-sm leading-relaxed mb-6">
                    {page.description}
                  </p>

                  <span className="inline-flex items-center gap-2 text-pumpkin">
                    <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.12em]">
                      Ansehen
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
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
