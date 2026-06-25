import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ScrollReveal from "@/components/ScrollReveal";
import PageCta from "@/components/PageCta";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getPageHeroData } from "@/lib/cms/page-hero";
import { getTranslations } from "@/lib/i18n/get-translation";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [hero, t] = await Promise.all([
    getPageHeroData("ueber-uns", "ueberUns", "en"),
    getTranslations("page", "about-us", "en"),
  ]);
  return {
    title: t["seoTitle"] || "About Us | Mosaroma",
    description: t["seoDescription"] || "For generations, we have been developing and producing high-quality outdoor textiles.",
  };
}

const promises = [
  {
    title: "Comfort",
    description:
      "Soft feel, lasting quality and timeless design for relaxed outdoor moments.",
  },
  {
    title: "Quality",
    description:
      "Premium materials and Mackintosh® Inside Technology provide lasting protection from sun, rain and dirt.",
  },
  {
    title: "Responsibility",
    description:
      "We develop long-lasting products with a conscious approach to resources.",
  },
  {
    title: "Design",
    description:
      "Clean lines and timeless aesthetics create products that blend harmoniously into any setting.",
  },
];

const sustainabilityStats = [
  { value: "42 %", label: "less water" },
  { value: "38 %", label: "less chemicals" },
  { value: "71 %", label: "solar power" },
];

export default async function AboutUsPage() {
  const [layout, hero, t] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("ueber-uns", "ueberUns", "en"),
    getTranslations("page", "about-us", "en"),
  ]);

  const localizedPromises = promises.map((p, i) => ({
    title: t[`promises.${i + 1}.title`] || p.title,
    description: t[`promises.${i + 1}.description`] || p.description,
  }));

  const localizedStats = sustainabilityStats.map((s, i) => ({
    value: s.value,
    label: t[`stats.${i + 1}.label`] || s.label,
  }));

  return (
    <>
      <Header {...layout.header} locale="en" />
      <main id="main">
        {/* Hero */}
        <PageHero
          eyebrow={hero.eyebrow}
          title={hero.title}
          description={hero.description}
          image={hero.image}
          alt={hero.alt}
        />
        <BreadcrumbBar items={[{ label: t["breadcrumb"] || "About Us" }]} locale="en" />

        {/* About text */}
        <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="max-w-3xl">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-5">
                {t["intro.p1"] || "For generations, we have been developing and producing high-quality outdoor textiles and products. We combine sophisticated design, high performance and responsible practices. Durable materials, innovative production processes and a consistent focus on sustainable cycles define our work. The well-being of people and nature is always at the centre of what we do."}
              </p>
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                {t["intro.p2"] || "We believe outdoor textiles must offer far more than mere functionality. They should create comfort, relaxation and well-being."}
              </p>
            </div>
          </div>
        </section>

        {/* Four promises */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
              {t["promisesTitle"] || "What drives us."}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {localizedPromises.map((promise, i) => (
                <ScrollReveal key={promise.title} delay={i * 80}>
                  <div className="bg-white p-8 transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                    <h3 className="font-heading text-anthracite text-lg font-bold mb-3">
                      {promise.title}
                    </h3>
                    <p className="font-body text-text-gray text-sm leading-[1.8]">
                      {promise.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Sustainability */}
        <section className="section-padding bg-anthracite">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-6">
              {t["sustainabilityTitle"] || "Green by Design. From the first thread."}
            </h2>

            <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-14">
              {t["sustainabilityDescription"] || "Solution-dyed polypropylene (PP) saves significant water, energy and CO₂ compared to conventionally dyed fibres. Colour is incorporated during fibre production — subsequent dyeing and washing are eliminated entirely."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
              {localizedStats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 100}>
                  <div className="text-center">
                    <span className="block font-heading text-pumpkin text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                      {stat.value}
                    </span>
                    <span className="block font-body text-white/70 text-sm mt-2">
                      {stat.label}
                    </span>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <p className="font-body text-white/70 text-sm leading-[1.8] max-w-2xl">
              {t["sustainabilityNote"] || "Compared to conventionally piece-dyed polyester. Values based on internal calculations and industry data."}
            </p>
          </div>
        </section>

        {/* Location */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              {t["locationTitle"] || "Oyten near Bremen"}
            </h2>

            <ScrollReveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    14.000m²
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    {t["location.area.label"] || "Area"}
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    {t["location.since.value"] || "since 2021"}
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    {t["location.since.label"] || "at location"}
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    {t["location.delivery.value"] || "2–4 days"}
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    {t["location.delivery.label"] || "Delivery DACH"}
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    DACH
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    {t["location.region.label"] || "Delivery area"}
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <Link href="/en/contact" className="btn-outline">
              {t["locationButton"] || "Contact us"}
            </Link>
          </div>
        </section>

        {/* Warranty */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              {t["warrantyTitle"] || "3-Year Warranty."}
            </h2>

            <div className="max-w-3xl space-y-5">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                {t["warrantyDescription"] || "We offer a 3-year warranty on all Mosaroma upholstery fabrics — protection against loss of strength or colour, pilling and abrasion under normal use and weather conditions."}
              </p>
            </div>
          </div>
        </section>

        <PageCta
          variant="dark"
          title={t["cta.title"] || "Ready for your next project?"}
          description={t["cta.description"] || "Whether retail, hospitality or gastronomy — we advise you personally on collections, materials and individual solutions."}
          primaryLabel={t["cta.primaryLabel"] || "Contact us"}
          primaryHref="/en/contact"
          secondaryLabel={t["cta.secondaryLabel"] || "Discover collections"}
          secondaryHref="/en/collections"
        />
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
