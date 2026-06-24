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

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getPageHeroData("ueber-uns", "ueberUns");
  return {
    title: hero.seoTitle || "About Us | Mosaroma",
    description:
      hero.seoDescription ||
      "For generations, we have been developing and producing premium outdoor textiles. Design, performance and responsible practice — that is MOSAROMA.",
  };
}

const promises = [
  {
    title: "Comfort",
    description:
      "Soft touch, durable quality and timeless design for relaxed moments outdoors.",
  },
  {
    title: "Quality",
    description:
      "Premium materials and Mackintosh® Inside Technology provide lasting protection against sun, rain and dirt.",
  },
  {
    title: "Responsibility",
    description:
      "We develop long-lasting products with a conscious approach to resources.",
  },
  {
    title: "Design",
    description:
      "Clean forms and timeless aesthetics create products that blend harmoniously into any setting.",
  },
];

const sustainabilityStats = [
  { value: "42 %", label: "less water" },
  { value: "38 %", label: "fewer chemicals" },
  { value: "71 %", label: "solar power" },
];

export default async function AboutUsPage() {
  const [layout, hero] = await Promise.all([
    getPublicLayoutData("en"),
    getPageHeroData("ueber-uns", "ueberUns"),
  ]);

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
        <BreadcrumbBar items={[{ label: "About Us" }]} />

        {/* About text */}
        <section className="pt-12 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="max-w-3xl">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-5">
                For generations, we have been developing and producing premium
                outdoor textiles and products. We combine ambitious design, high
                performance and responsible practice. Durable materials,
                innovative production processes and a consistent focus on
                sustainable cycles define our work. The well-being of people and
                nature is always at the heart of everything we do.
              </p>
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                We are convinced that outdoor textiles must deliver far more
                than mere functionality. They should create comfort, relaxation
                and well-being.
              </p>
            </div>
          </div>
        </section>

        {/* Four promises */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-12">
              What Drives Us.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promises.map((promise, i) => (
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
              Green by Design. From the First Thread.
            </h2>

            <p className="font-body text-white/70 text-base md:text-[1.0625rem] leading-[1.8] max-w-3xl mb-14">
              Solution-dyed polypropylene (PP) saves significant water, energy
              and CO&#8322; compared to conventionally dyed fibres. The colour is
              added during fibre production — subsequent dyeing and washing are
              eliminated entirely.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
              {sustainabilityStats.map((stat, i) => (
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
              Compared to conventionally piece-dyed polyester. Values based on
              internal calculations and industry data.
            </p>
          </div>
        </section>

        {/* Location */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              Oyten near Bremen
            </h2>

            <ScrollReveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    14.000m²
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    Area
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    since 2021
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    at the location
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    2–4 days
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    Delivery DACH
                  </span>
                </div>
                <div>
                  <span className="block font-heading text-pumpkin text-2xl md:text-3xl font-bold">
                    DACH
                  </span>
                  <span className="block font-body text-text-gray text-sm mt-1">
                    Delivery area
                  </span>
                </div>
              </div>
            </ScrollReveal>

            <Link href="/en/contact" className="btn-outline">
              Get in touch
            </Link>
          </div>
        </section>

        {/* Warranty */}
        <section className="section-padding bg-cream">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-8">
              3-Year Warranty.
            </h2>

            <div className="max-w-3xl space-y-5">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8]">
                We offer a 3-year warranty on all Mosaroma cover fabrics —
                protection against loss of strength or colour, pilling and
                abrasion from normal use and weather conditions.
              </p>
            </div>
          </div>
        </section>

        <PageCta
          variant="dark"
          title="Ready for Your Next Project?"
          description="Whether retail, hospitality or gastronomy — we advise you personally on collections, materials and individual solutions."
          primaryLabel="Get in touch"
          primaryHref="/en/contact"
          secondaryLabel="Discover collections"
          secondaryHref="/en/collections"
        />
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
