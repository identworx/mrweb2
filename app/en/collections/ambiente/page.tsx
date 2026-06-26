import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isPublicPathEnabled } from "@/lib/cms/nav-visibility";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ScrollReveal from "@/components/ScrollReveal";
import AmbienteGalleryClient from "@/components/collections/AmbienteGalleryClient";
import { getActiveAmbienteImages } from "@/lib/cms/ambiente";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import PageCta from "@/components/PageCta";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Ambiente Gallery | Mosaroma",
  description:
    "Mosaroma in real spaces — from Mediterranean courtyards to seaside terraces. Discover our outdoor textiles in action.",
};

export default async function AmbienteGalleryPage() {
  if (!(await isPublicPathEnabled("/kollektionen/ambiente"))) notFound();

  const [layout, images] = await Promise.all([
    getPublicLayoutData("en"),
    getActiveAmbienteImages(),
  ]);

  return (
    <>
      <Header {...layout.header} locale="en" />
      <main id="main">
        <PageHero
          eyebrow="Season 2027 · Outdoor Living"
          title="Ambiente."
          description="Mosaroma in real spaces — from Mediterranean courtyards to seaside terraces."
        />
        <BreadcrumbBar
          items={[
            { label: "Collections", href: "/en/collections" },
            { label: "Ambiente" },
          ]}
          locale="en"
        />

        <section className="pt-14 md:pt-20 pb-20 md:pb-28 bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <ScrollReveal>
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-[56ch] mb-10 md:mb-14">
                Filter by colour world and open each image at full size.
              </p>
            </ScrollReveal>

            <AmbienteGalleryClient images={images} />
          </div>
        </section>

        <PageCta
          variant="light"
          eyebrow="Found your inspiration?"
          title="This mood for your outdoor space?"
          description="We put together matching fabric samples for your project."
          primaryLabel="Request sample set"
          primaryHref="/en/contact"
        />
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
