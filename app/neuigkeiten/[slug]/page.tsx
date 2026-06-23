import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbBar from "@/components/BreadcrumbBar";
import { newsItems } from "@/lib/mosaroma/news";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import {
  getNewsArticleBySlugWithStatus,
  getNewsStaticParams,
} from "@/lib/cms/news";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";
import { getIconSlots } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

export async function generateStaticParams() {
  return getNewsStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const result = await getNewsArticleBySlugWithStatus(slug);

  if (result.state === "published") {
    const a = result.article;
    return {
      title: a.seoTitle || `${a.title} | Mosaroma`,
      description: a.seoDescription || a.excerpt || a.content.slice(0, 160),
    };
  }

  const staticItem = newsItems.find((n) => n.slug === slug);
  if (staticItem) {
    return {
      title: `${staticItem.title} | Mosaroma`,
      description: staticItem.description,
    };
  }

  return { title: "Nicht gefunden | Mosaroma" };
}

export const revalidate = 60;

export default async function NeuigkeitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [layout, result, icons] = await Promise.all([
    getPublicLayoutData(),
    getNewsArticleBySlugWithStatus(slug),
    getIconSlots(["arrow-left"]),
  ]);

  if (result.state === "published") {
    const article = result.article;
    return (
      <>
        <Header {...layout.header} />
        <main id="main">
          <section className="relative overflow-hidden h-[300px] md:h-[320px] flex items-end">
            <Image
              src={article.heroImageUrl || "/images/placeholders/page-heroes/neuigkeiten-hero.svg"}
              alt={article.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.12) 80%, transparent 100%)",
              }}
            />
            <div className="relative w-full pt-24 md:pt-28 pb-6 md:pb-8">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-pumpkin/10 text-text-muted">
                    {article.category}
                  </span>
                  <span className="font-body text-white/70 text-xs">
                    {article.publishedAt}
                  </span>
                </div>

                <h1 className="font-heading text-white text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.08] max-w-3xl">
                  {article.title}
                </h1>
              </div>
            </div>
          </section>
          <BreadcrumbBar items={[
            { label: "Neuigkeiten", href: "/neuigkeiten" },
            { label: article.title },
          ]} />

          <section className="section-padding bg-white">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="max-w-3xl">
                {article.content ? (
                  <RichTextRenderer
                    html={article.content}
                    className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-10 prose prose-neutral max-w-none"
                  />
                ) : (
                  <>
                    <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-10">
                      {article.excerpt}
                    </p>
                    <div className="bg-cream p-8 md:p-12 mb-10">
                      <p className="font-body text-text-muted text-sm italic">
                        Dieser Inhalt wird in Kürze veröffentlicht. Schauen Sie bald wieder vorbei.
                      </p>
                    </div>
                  </>
                )}

                <Link
                  href="/neuigkeiten"
                  className="inline-flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-anthracite hover:text-pumpkin transition-colors duration-300"
                >
                  <CmsIcon icon={icons["arrow-left"]} width={14} height={14} className="text-pumpkin" />
                  Zurück zu Neuigkeiten
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer {...layout.footer} />
      </>
    );
  }

  if (result.state === "not-public") {
    notFound();
  }

  // state: "not-found" or "error" — try static fallback
  const staticItem = newsItems.find((n) => n.slug === slug);
  if (!staticItem) {
    notFound();
  }

  return (
    <>
      <Header {...layout.header} />
      <main id="main">
        <section className="relative overflow-hidden h-[300px] md:h-[320px] flex items-end">
          <Image
            src="/images/placeholders/page-heroes/neuigkeiten-hero.svg"
            alt="Mosaroma Neuigkeiten"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.12) 80%, transparent 100%)",
            }}
          />
          <div className="relative w-full pt-24 md:pt-28 pb-6 md:pb-8">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-pumpkin/10 text-text-muted">
                  {staticItem.tag}
                </span>
                <span className="font-body text-white/70 text-xs">
                  {staticItem.date}
                </span>
              </div>

              <h1 className="font-heading text-white text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.08] max-w-3xl">
                {staticItem.title}
              </h1>
            </div>
          </div>
        </section>
        <BreadcrumbBar items={[
          { label: "Neuigkeiten", href: "/neuigkeiten" },
          { label: staticItem.title },
        ]} />

        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="max-w-3xl">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-10">
                {staticItem.description}
              </p>

              <div className="bg-cream p-8 md:p-12 mb-10">
                <p className="font-body text-text-muted text-sm italic">
                  Dieser Inhalt wird in Kürze veröffentlicht. Schauen Sie bald wieder vorbei.
                </p>
              </div>

              <Link
                href="/neuigkeiten"
                className="inline-flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-anthracite hover:text-pumpkin transition-colors duration-300"
              >
                <CmsIcon icon={icons["arrow-left"]} width={14} height={14} className="text-pumpkin" />
                Zurück zu Neuigkeiten
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer {...layout.footer} />
    </>
  );
}
