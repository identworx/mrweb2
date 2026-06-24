import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getServicePageBySlug } from "@/lib/cms/service-pages";
import { getIconSlots } from "@/lib/cms/icons";
import { SERVICE_SECTION_ICON_KEYS } from "@/lib/cms/icon-key-map";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms & Conditions | Mosaroma",
    description: "General terms and conditions of Mosaroma Industries GmbH.",
  };
}

export default async function TermsPage() {
  const [layout, result, icons] = await Promise.all([
    getPublicLayoutData("en"),
    getServicePageBySlug("agb"),
    getIconSlots([...SERVICE_SECTION_ICON_KEYS]),
  ]);

  if (result.state !== "published") {
    notFound();
  }

  const page = result.page;

  return (
    <>
      <Header {...layout.header} locale="en" />
      <main id="main">
        <PageHero
          title="Terms & Conditions"
          description={page.introText || undefined}
          height="compact"
        />
        <BreadcrumbBar items={[{ label: "Terms & Conditions" }]} />

        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="max-w-3xl">
              <p className="font-body text-text-muted text-sm italic leading-[1.8] mb-8 p-4 bg-cream border border-light-gray">
                This English translation is provided for convenience only. The German version is legally binding.
              </p>
            </div>
          </div>
        </section>

        {page.sections.length > 0 ? (
          page.sections.map((section, i) => (
            <ServiceSectionRenderer
              key={section.id}
              section={section}
              background={i % 2 === 0 ? "white" : "cream"}
              icons={icons}
            />
          ))
        ) : (
          <section className="section-padding bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="max-w-3xl">
                <p className="font-body text-text-gray text-base leading-[1.8]">
                  {page.introText || ""}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer {...layout.footer} locale="en" />
    </>
  );
}
