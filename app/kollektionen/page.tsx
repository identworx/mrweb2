import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import CollectionCard from "@/components/CollectionCard";
import ConsultationCard from "@/components/ConsultationCard";
import ScrollReveal from "@/components/ScrollReveal";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
import { getPublishedCollections } from "@/lib/cms/collections";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getServicePageBySlug } from "@/lib/cms/service-pages";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("kollektionen", "kollektionen");
  return {
    title: hero.seoTitle || "Kollektionen 2027 | Mosaroma",
    description:
      hero.seoDescription ||
      "Entdecken Sie die 7 Kollektionen von MOSAROMA -- kuratierte Farbwelten für den Außenbereich, gefertigt in Mackintosh®, Nerio und Basic Qualitäten.",
  };
}

export default async function KollektionenPage() {
  const [layout, hero, collections, pageResult] = await Promise.all([
    getPublicLayoutData(),
    getPageHeroData("kollektionen", "kollektionen"),
    getPublishedCollections(),
    getServicePageBySlug("kollektionen"),
  ]);

  const hasCmsSections =
    pageResult.state === "published" && pageResult.page.sections.length > 0;

  const allMoodColors = collections.flatMap((c) => c.moodColors);

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
        />
        <BreadcrumbBar items={[{ label: "Kollektionen" }]} />

        {/* Color mood bar */}
        {allMoodColors.length > 0 && (
          <div className="flex" aria-hidden="true">
            {allMoodColors.map((color, i) => (
              <div
                key={i}
                className="flex-1 h-1"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {/* Collection grid */}
        <section className="pt-14 md:pt-20 pb-20 md:pb-28 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <ScrollReveal>
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-2xl mb-12 md:mb-16">
                Jede Kollektion erzählt ihre eigene Geschichte aus Farbe, Material und Stimmung.
                Wählen Sie die Farbwelt, die zu Ihrem Außenbereich passt.
              </p>
            </ScrollReveal>

            {collections.length === 0 ? (
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                Aktuell sind keine Kollektionen verfügbar. Bitte schauen Sie
                später wieder vorbei.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {collections.map((collection, i) => (
                  <ScrollReveal key={collection.slug} delay={i * 60}>
                    <CollectionCard
                      name={collection.name}
                      slug={collection.slug}
                      description={collection.shortDescription}
                      moodColors={collection.moodColors}
                      fabric={collection.fabric}
                      image={collection.cardImage}
                      alt={collection.cardAlt}
                    />
                  </ScrollReveal>
                ))}
                <ScrollReveal delay={collections.length * 60}>
                  <ConsultationCard />
                </ScrollReveal>
              </div>
            )}
          </div>
        </section>

        {/* CMS sections (benefits, CTA) or static fallback */}
        {hasCmsSections ? (
          pageResult.page.sections.map((section, i) => (
            <ServiceSectionRenderer
              key={section.id}
              section={section}
              background={i % 2 === 0 ? "cream" : "white"}
            />
          ))
        ) : (
          <>
            {/* Benefits */}
            <section className="py-16 md:py-24 bg-cream">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <ScrollReveal>
                  <div className="max-w-3xl mb-12">
                    <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                      Eine Performance. Sieben Farbwelten.
                    </h2>
                    <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                      Unabhängig von der Farbe: Jede Mosaroma-Kollektion wird aus wetterfesten Outdoor-Stoffen gefertigt.
                    </p>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-black/[0.06]">
                  {[
                    {
                      title: "UV-beständig",
                      text: "Spinndüsengefärbte Fasern für höchste Lichtechtheit, auch bei dauerhafter Sonneneinstrahlung.",
                      icon: (
                        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-7 h-7">
                          <circle cx="16" cy="16" r="6" />
                          <path d="M16 4v4M16 24v4M4 16h4M24 16h4M7.8 7.8l2.8 2.8M21.4 21.4l2.8 2.8M7.8 24.2l2.8-2.8M21.4 10.6l2.8-2.8" />
                        </svg>
                      ),
                    },
                    {
                      title: "Wasserabweisend",
                      text: "Stoffe, die Regen und Feuchtigkeit abperlen lassen und schnell trocknen.",
                      icon: (
                        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-7 h-7">
                          <path d="M16 4C16 4 6 15 6 21a10 10 0 0020 0C26 15 16 4 16 4z" />
                        </svg>
                      ),
                    },
                    {
                      title: "Schimmelfest",
                      text: "Resistente Materialien, die auch in feuchten Umgebungen sauber bleiben.",
                      icon: (
                        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-7 h-7">
                          <path d="M10 16l4 4 8-8" />
                          <rect x="4" y="4" width="24" height="24" rx="2" />
                        </svg>
                      ),
                    },
                    {
                      title: "3 Jahre Garantie",
                      text: "Qualitätsversprechen auf alle Mosaroma-Produkte gemäß Garantiebedingungen.",
                      icon: (
                        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-7 h-7">
                          <path d="M16 3l3.5 7 7.5 1-5.5 5.3L22.8 24 16 20.2 9.2 24l1.3-7.7L5 11l7.5-1z" />
                        </svg>
                      ),
                    },
                  ].map((benefit, i) => (
                    <ScrollReveal key={benefit.title} delay={i * 80}>
                      <div className="bg-white p-6 md:p-8 h-full">
                        <div className="text-pumpkin mb-4">{benefit.icon}</div>
                        <h3 className="font-heading text-anthracite text-sm md:text-base font-bold tracking-tight mb-2">
                          {benefit.title}
                        </h3>
                        <p className="font-body text-text-gray text-xs md:text-sm leading-[1.7]">
                          {benefit.text}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="relative py-20 md:py-28 bg-anthracite overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 10.5px), repeating-linear-gradient(-45deg, transparent, transparent 10px, white 10.5px, white 11px)",
                }}
              />

              <div className="relative mx-auto max-w-[1400px] px-5 md:px-10 text-center">
                <ScrollReveal>
                  <p className="font-accent text-pumpkin text-[11px] tracking-[0.3em] uppercase mb-4">
                    Noch unentschlossen?
                  </p>
                  <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-5">
                    Lassen Sie sich ein Musterset schicken.
                  </h2>
                  <p className="font-body text-white/65 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-10">
                    Vergleichen Sie die Farbwelten in Ruhe zu Hause. Wir senden Ihnen Stoffmuster
                    Ihrer Favoriten und beraten zu Formen und Sondermaßen.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/kontakt" className="btn-primary">
                      Musterset anfordern
                    </Link>
                    <Link href="/kataloge" className="btn-outline-white">
                      Kataloge ansehen
                    </Link>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
