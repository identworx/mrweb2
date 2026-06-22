import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ScrollReveal from "@/components/ScrollReveal";
import AmbienteGalleryClient from "@/components/collections/AmbienteGalleryClient";
import { getActiveAmbienteImages } from "@/lib/cms/ambiente";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import Link from "next/link";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ambiente-Galerie | Mosaroma",
  description:
    "Mosaroma in echten Räumen — vom mediterranen Innenhof bis zur Terrasse am Meer. Entdecken Sie unsere Outdoor-Textilien im Einsatz.",
};

export default async function AmbienteGalleryPage() {
  const [layout, images] = await Promise.all([
    getPublicLayoutData(),
    getActiveAmbienteImages(),
  ]);

  return (
    <>
      <Header {...layout.header} />
      <main id="main">
        <PageHero
          eyebrow="Saison 2027 · Outdoor Living"
          title="Ambiente."
          description="Mosaroma in echten Räumen — vom mediterranen Innenhof bis zur Terrasse am Meer."
        />
        <BreadcrumbBar
          items={[
            { label: "Kollektionen", href: "/kollektionen" },
            { label: "Ambiente" },
          ]}
        />

        <section className="pt-14 md:pt-20 pb-20 md:pb-28 bg-white">
          <div className="mx-auto max-w-[1440px] px-5 md:px-10">
            <ScrollReveal>
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-[56ch] mb-10 md:mb-14">
                Filtern Sie nach Farbwelt und öffnen Sie jedes Motiv in voller
                Größe.
              </p>
            </ScrollReveal>

            <AmbienteGalleryClient images={images} />
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-28 bg-anthracite text-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
            <ScrollReveal>
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase mb-4">
                Inspiration gefunden?
              </p>
              <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                Diese Stimmung für Ihren Außenbereich?
              </h2>
              <p className="font-body text-white/60 text-base md:text-[1.0625rem] leading-[1.8] max-w-xl mx-auto mb-8">
                Wir stellen passende Stoffmuster für Ihr Projekt zusammen.
              </p>
              <Link href="/kontakt" className="btn-primary">
                Musterset anfordern
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
