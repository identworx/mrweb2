import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ScrollReveal from "@/components/ScrollReveal";
import MaterialAnchorNavEn from "@/components/materials/MaterialAnchorNavEn";
import FabricLibraryPreview from "@/components/materials/FabricLibraryPreview";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";
import {
  mackintoshTechnology,
  olefinBenefits,
  oceanCycleProcess,
} from "@/lib/mosaroma/materials";
import { getTranslations } from "@/lib/i18n/get-translation";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getServicePageBySlug, getSectionImage, getSectionData } from "@/lib/cms/service-pages";
import { getFabricPreviewSwatches, getFabricFamiliesForHub } from "@/lib/cms/fabric-library";
import Image from "next/image";
import { getIconSlots } from "@/lib/cms/icons";
import { SERVICE_SECTION_ICON_KEYS } from "@/lib/cms/icon-key-map";
import CmsIcon from "@/components/cms/CmsIcon";
import PageCta from "@/components/PageCta";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [hero, t] = await Promise.all([
    getPageHeroData("materialien", "materialien", "en"),
    getTranslations("page", "materials", "en"),
  ]);
  return {
    title: t["seoTitle"] || "Materials | Mosaroma",
    description: t["seoDescription"] || "Discover Mosaroma fabric qualities.",
  };
}

export default async function MaterialsPage() {
  const [layout, hero, result, previewSwatches, olefinImage, hubFamilies, ctaData, techData, olefinData, oceanData, icons] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("materialien", "materialien", "en"),
    getServicePageBySlug("materialien"),
    getFabricPreviewSwatches(6),
    getSectionImage("materialien", "materials-olefin"),
    getFabricFamiliesForHub("en"),
    getSectionData("materialien", "materials-catalog-cta"),
    getSectionData("materialien", "materials-technology"),
    getSectionData("materialien", "materials-olefin"),
    getSectionData("materialien", "materials-oceancycle"),
    getIconSlots([...SERVICE_SECTION_ICON_KEYS]),
  ]);

  const [techT, olefinT, oceanT, pageT] = await Promise.all([
    getTranslations("material", "mackintosh-technology", "en"),
    getTranslations("material", "olefin-benefits", "en"),
    getTranslations("material", "ocean-cycle", "en"),
    getTranslations("page", "materials", "en"),
  ]);

  const tech = {
    eyebrow: techT.eyebrow || "Technology",
    title: techT.title || mackintoshTechnology.title,
    content: null,
    fallbackParagraphs: mackintoshTechnology.description.map((p, i) => techT[`description.${i + 1}`] || p),
    steps: mackintoshTechnology.steps.map((s, i) => ({
      ...s,
      title: techT[`step.${i + 1}.title`] || s.title,
      description: techT[`step.${i + 1}.description`] || s.description,
      label: techT[`step.${i + 1}.label`] || ["100 % PP", "Additiv wasserabweisend", "Spinndüsengefärbte UV-Pigmente"][i] || "",
    })),
    benefits: mackintoshTechnology.benefits.map((b, i) => techT[`benefit.${i + 1}`] || b),
  };

  const olefin = {
    title: olefinT.title || "Why Olefin?",
    tags: olefinBenefits.tags.map((tag, i) => olefinT[`tag.${i + 1}`] || tag),
    content: null,
    fallbackParagraphs: olefinBenefits.paragraphs.map((p, i) => olefinT[`paragraph.${i + 1}`] || p),
  };

  const ocean = {
    eyebrow: oceanT.eyebrow || "Sustainability",
    title: oceanT.title || oceanCycleProcess.title,
    content: null,
    fallbackDescription: oceanT.description || oceanCycleProcess.description,
    steps: oceanCycleProcess.steps.map((s, i) => ({
      title: oceanT[`step.${i + 1}.title`] || s.title,
      description: oceanT[`step.${i + 1}.description`] || s.description,
    })),
    highlights: oceanCycleProcess.highlights.map((hl, i) => oceanT[`highlight.${i + 1}`] || hl),
  };

  const contentSections =
    result.state === "published"
      ? result.page.sections.filter(
          (s) => !s.settings?.helper && !String(s.settings?.style ?? "").startsWith("materials-"),
        )
      : [];

  const hasCmsSections = contentSections.length > 0;

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
        <BreadcrumbBar items={[{ label: pageT["breadcrumb"] || "Materials" }]} locale="en" />
        <MaterialAnchorNavEn />

        {hasCmsSections ? (
          contentSections.map((section, i) => (
            <ServiceSectionRenderer
              key={section.id}
              section={section}
              background={i % 2 === 0 ? "white" : "cream"}
              icons={icons}
              locale="en"
            />
          ))
        ) : (
          <>
            {/* Mackintosh® Technology */}
            <section id="technologie" className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="accent-line" />
                  <p className="font-accent text-pumpkin-accessible text-xs tracking-[0.3em] uppercase">
                    {tech.eyebrow}
                  </p>
                </div>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
                  {tech.title}
                </h2>

                {tech.content ? (
                  <RichTextRenderer
                    html={tech.content}
                    className="max-w-3xl font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] [&_p+p]:mt-5 mb-16"
                  />
                ) : (
                  <div className="max-w-3xl space-y-5 mb-16">
                    {tech.fallbackParagraphs.map((paragraph, i) => (
                      <p
                        key={i}
                        className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                  {tech.steps.map((step, i) => (
                    <ScrollReveal key={step.title} delay={i * 120}>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="flex items-center justify-center w-10 h-10 bg-pumpkin text-white font-heading text-sm font-bold">
                          {i + 1}
                        </span>
                        <h3 className="font-heading text-anthracite text-lg font-bold">
                          {step.title}
                        </h3>
                      </div>
                      <p className="font-body text-text-gray text-sm leading-[1.8]">
                        {step.description}
                      </p>
                      {step.label && (
                        <p className="font-accent text-text-muted text-xs tracking-[0.15em] uppercase mt-3">
                          {step.label}
                        </p>
                      )}
                    </ScrollReveal>
                  ))}
                </div>

                <ScrollReveal>
                  <div className="bg-cream p-8 md:p-12">
                    <h3 className="font-heading text-anthracite text-xl font-bold mb-6">
                      {techT["benefitsTitle"] || "Benefits of Mackintosh® Technology"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {tech.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-start gap-3">
                          <CmsIcon icon={icons["checkmark"]} width={18} height={18} className="text-pumpkin flex-shrink-0 mt-0.5" />
                          <span className="font-body text-anthracite text-sm leading-relaxed">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* Why Olefin? */}
            <section className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className={`grid grid-cols-1 items-start gap-10 lg:gap-10 ${olefinImage ? "lg:grid-cols-[5fr_4fr]" : ""}`}>
                  <div>
                    <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
                      {olefin.title}
                    </h2>

                    <div className="flex flex-wrap gap-2.5 mb-10">
                      {olefin.tags.map((tag, i) => (
                        <ScrollReveal key={tag} delay={i * 60}>
                          <span className="inline-block font-accent text-[10px] tracking-[0.18em] uppercase bg-pumpkin/8 text-anthracite/80 px-3.5 py-1.5">
                            {tag}
                          </span>
                        </ScrollReveal>
                      ))}
                    </div>

                    {olefin.content ? (
                      <RichTextRenderer
                        html={olefin.content}
                        className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] [&_p+p]:mt-5 [text-wrap:pretty]"
                      />
                    ) : (
                      <div className="space-y-5">
                        {olefin.fallbackParagraphs.map((p, i) => (
                          <p
                            key={i}
                            className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]"
                            style={{ textWrap: "pretty" }}
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  {olefinImage && (
                    <ScrollReveal>
                      <div className="lg:mt-20">
                        <Image
                          src={olefinImage.url}
                          alt={olefinImage.alt}
                          width={600}
                          height={460}
                          className="w-full aspect-[5/4] object-cover shadow-[0_6px_28px_rgba(45,45,45,0.06)]"
                        />
                      </div>
                    </ScrollReveal>
                  )}
                </div>
              </div>
            </section>

            {/* Our Fabric Families */}
            {hubFamilies.length > 0 && (
            <section id="stofffamilien" className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <p className="font-accent text-text-muted text-[10px] tracking-[0.15em] uppercase mb-3">
                  {hubFamilies.length} {pageT["qualitiesLabel"] || "Qualities"}
                </p>

                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  {pageT["familiesTitle"] || "Our Fabric Families"}
                </h2>

                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12">
                  {pageT["familiesDescription"] || `${hubFamilies.length} fabric families, developed for different outdoor requirements — from premium olefin to recycled ocean polypropylene.`}
                </p>

                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${hubFamilies.length >= 4 ? "lg:grid-cols-4" : hubFamilies.length === 3 ? "lg:grid-cols-3" : ""}`}>
                  {hubFamilies.map((family, i) => {
                    const isDark = family.isHighlighted || (!hubFamilies.some((f) => f.isHighlighted) && i === 0);
                    return (
                      <ScrollReveal key={family.slug || family.id} delay={i * 80}>
                        <Link
                          href="/en/materials/fabrics-samples"
                          className={`block p-7 h-full transition-all duration-300 motion-safe:hover:-translate-y-1 group ${
                            isDark
                              ? "bg-anthracite text-white"
                              : "bg-light-gray text-anthracite"
                          }`}
                        >
                          <h3
                            className={`font-heading text-lg font-bold mb-1 transition-colors duration-300 ${
                              isDark
                                ? "text-white group-hover:text-pumpkin"
                                : "text-anthracite group-hover:text-pumpkin"
                            }`}
                          >
                            {family.name}
                          </h3>
                          {family.subtitle ? (
                            <p className="font-accent text-xs tracking-[0.15em] uppercase mb-4 text-pumpkin-accessible">
                              {family.subtitle}
                            </p>
                          ) : (
                            <div className="mb-4" />
                          )}

                          <div className="space-y-3 text-sm">
                            {family.material && (
                              <div>
                                <span className={`font-heading text-[10px] font-semibold uppercase tracking-[0.1em] ${isDark ? "text-white/70" : "text-text-muted"}`}>
                                  {pageT["label.material"] || "Material"}
                                </span>
                                <p className={`font-body leading-relaxed ${isDark ? "text-white/80" : "text-anthracite"}`}>
                                  {family.material}
                                </p>
                              </div>
                            )}
                            {family.weight && (
                              <div>
                                <span className={`font-heading text-[10px] font-semibold uppercase tracking-[0.1em] ${isDark ? "text-white/70" : "text-text-muted"}`}>
                                  {pageT["label.weight"] || "Weight"}
                                </span>
                                <p className={`font-body leading-relaxed ${isDark ? "text-white/80" : "text-anthracite"}`}>
                                  {family.weight}
                                </p>
                              </div>
                            )}
                            {family.dyeing && (
                              <div>
                                <span className={`font-heading text-[10px] font-semibold uppercase tracking-[0.1em] ${isDark ? "text-white/70" : "text-text-muted"}`}>
                                  {pageT["label.dyeing"] || "Dyeing"}
                                </span>
                                <p className={`font-body leading-relaxed ${isDark ? "text-white/80" : "text-anthracite"}`}>
                                  {family.dyeing}
                                </p>
                              </div>
                            )}
                          </div>

                          {family.highlights.length > 0 && (
                            <div className={`mt-5 pt-5 ${isDark ? "border-t border-white/10" : "border-t border-anthracite/10"}`}>
                              <ul className="space-y-2">
                                {family.highlights.slice(0, 3).map((hl) => (
                                  <li key={hl} className="flex items-start gap-2 text-sm">
                                    <CmsIcon icon={icons["checkmark"]} width={14} height={14} className="text-pumpkin flex-shrink-0 mt-0.5" />
                                    <span className={`font-body leading-relaxed ${isDark ? "text-white/70" : "text-text-gray"}`}>
                                      {hl}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="mt-5 pt-4 flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-[0.1em] text-pumpkin-accessible">
                            <span>{pageT["viewFabrics"] || "View fabrics"}</span>
                            <CmsIcon icon={icons["arrow-right"]} width={12} height={12} className="motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </Link>
                      </ScrollReveal>
                    );
                  })}
                </div>
              </div>
            </section>
            )}

            {/* OceanCycle Process */}
            <section id="nachhaltigkeit" className="section-padding bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  {ocean.title}
                </h2>

                {ocean.content ? (
                  <RichTextRenderer
                    html={ocean.content}
                    className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12 [&_p+p]:mt-5"
                  />
                ) : (
                  <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-12">
                    {ocean.fallbackDescription}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-light-gray">
                  {ocean.steps.map((step, i) => (
                    <ScrollReveal key={step.title} delay={i * 100}>
                      <div className="bg-white p-6 md:p-8 h-full relative">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="flex items-center justify-center w-8 h-8 bg-pumpkin/10 text-pumpkin font-heading text-sm font-bold">
                            {i + 1}
                          </span>
                          {i < ocean.steps.length - 1 && (
                            <CmsIcon icon={icons["arrow-right"]} width={20} height={20} className="text-pumpkin/40 absolute right-4 top-8 hidden lg:block" />
                          )}
                        </div>
                        <h3 className="font-heading text-anthracite text-base font-bold mb-2">
                          {step.title}
                        </h3>
                        <p className="font-body text-text-gray text-sm leading-[1.8]">
                          {step.description}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                <ScrollReveal>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ocean.highlights.map((hl) => (
                      <div key={hl} className="flex items-start gap-3">
                        <CmsIcon icon={icons["checkmark"]} width={16} height={16} className="text-pumpkin flex-shrink-0 mt-0.5" />
                        <span className="font-body text-anthracite text-sm leading-relaxed">
                          {hl}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>
              </div>
            </section>

            {/* Fabrics & Samples Preview */}
            <section className="section-padding bg-white">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                  {pageT["fabricsTitle"] || "Fabrics & Samples"}
                </h2>

                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-10">
                  {pageT["fabricsDescription"] || "Browse our complete fabric library — filter by fabric family, product type or search by fabric name and article number."}
                </p>

                <FabricLibraryPreview swatches={previewSwatches} icons={icons} locale="en" />
              </div>
            </section>

            {/* CTA */}
            <PageCta
              variant="light"
              title={pageT["cta.title"] || "All details in the catalogue"}
              description={pageT["cta.description"] || "Discover all fabric qualities, colours and technical data in our current catalogue."}
              primaryLabel={pageT["cta.primaryLabel"] || "View catalogue"}
              primaryHref="/en/catalogues"
            />
          </>
        )}
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
