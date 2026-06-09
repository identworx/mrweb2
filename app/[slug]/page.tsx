import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHero from "@/components/sections/PageHero";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import ServiceSectionRenderer from "@/components/service/ServiceSectionRenderer";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import { getServicePageBySlug } from "@/lib/cms/service-pages";
import { getPublishedPages } from "@/lib/cms/pages";
import { pageSlugToPublicPath } from "@/lib/cms/page-paths";
import { prisma } from "@/lib/db/prisma";

export const revalidate = 60;

function isRootLevelSlug(slug: string): boolean {
  const canonicalPath = pageSlugToPublicPath(slug);
  return canonicalPath === `/${slug}`;
}

export async function generateStaticParams() {
  const pages = await getPublishedPages();
  return pages
    .filter((p) => isRootLevelSlug(p.slug))
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!isRootLevelSlug(slug)) return {};

  const page = await prisma.page.findUnique({
    where: { slug },
    select: { title: true, seoTitle: true, seoDescription: true },
  });

  if (!page) return {};

  return {
    title: page.seoTitle || `${page.title} | Mosaroma`,
    description: page.seoDescription || null,
  };
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isRootLevelSlug(slug)) {
    notFound();
  }

  const [layout, result] = await Promise.all([
    getPublicLayoutData(),
    getServicePageBySlug(slug),
  ]);

  if (result.state !== "published") {
    notFound();
  }

  const page = result.page;

  return (
    <>
      <Header {...layout.header} />
      <main>
        <PageHero
          title={page.headline || page.title}
          description={page.introText || undefined}
          image={page.heroImageUrl || undefined}
          height="compact"
        />
        <BreadcrumbBar items={[{ label: page.title }]} />

        {page.sections.length > 0 ? (
          page.sections.map((section, i) => (
            <ServiceSectionRenderer
              key={section.id}
              section={section}
              background={i % 2 === 0 ? "white" : "cream"}
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
      <Footer {...layout.footer} />
    </>
  );
}
