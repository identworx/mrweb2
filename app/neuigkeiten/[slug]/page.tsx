import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { newsItems } from "@/lib/mosaroma/news";
import { getPublicLayoutData } from "@/lib/cms/public-layout";
import {
  getNewsArticleBySlugWithStatus,
  getNewsStaticParams,
} from "@/lib/cms/news";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";

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
  const layout = await getPublicLayoutData();
  const result = await getNewsArticleBySlugWithStatus(slug);

  if (result.state === "published") {
    const article = result.article;
    return (
      <>
        <Header {...layout.header} />
        <main>
          <section className="relative min-h-[360px] md:min-h-[420px] lg:min-h-[480px] flex items-end overflow-hidden">
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
                  "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.50) 35%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.10) 80%, transparent 100%)",
              }}
            />
            <div className="relative w-full pb-12 md:pb-16 lg:pb-20 pt-40 md:pt-48 lg:pt-52">
              <div className="mx-auto max-w-[1400px] px-5 md:px-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-pumpkin/10 text-pumpkin">
                    {article.category}
                  </span>
                  <span className="font-body text-white/50 text-xs">
                    {article.publishedAt}
                  </span>
                </div>

                <h1 className="font-heading text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08]">
                  {article.title}
                </h1>
              </div>
            </div>
          </section>

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
                      <p className="font-body text-text-gray/50 text-sm italic">
                        Dieser Inhalt wird in Kürze veröffentlicht. Schauen Sie bald wieder vorbei.
                      </p>
                    </div>
                  </>
                )}

                <Link
                  href="/neuigkeiten"
                  className="inline-flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-pumpkin hover:text-burnt-orange transition-colors duration-300"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M19.5 12h-15m0 0l5.5 5.5M4.5 12l5.5-5.5" />
                  </svg>
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
      <main>
        <section className="relative min-h-[360px] md:min-h-[420px] lg:min-h-[480px] flex items-end overflow-hidden">
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
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.50) 35%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.10) 80%, transparent 100%)",
            }}
          />
          <div className="relative w-full pb-12 md:pb-16 lg:pb-20 pt-40 md:pt-48 lg:pt-52">
            <div className="mx-auto max-w-[1400px] px-5 md:px-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-pumpkin/10 text-pumpkin">
                  {staticItem.tag}
                </span>
                <span className="font-body text-white/50 text-xs">
                  {staticItem.date}
                </span>
              </div>

              <h1 className="font-heading text-white text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08]">
                {staticItem.title}
              </h1>
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="max-w-3xl">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-10">
                {staticItem.description}
              </p>

              <div className="bg-cream p-8 md:p-12 mb-10">
                <p className="font-body text-text-gray/50 text-sm italic">
                  Dieser Inhalt wird in Kürze veröffentlicht. Schauen Sie bald wieder vorbei.
                </p>
              </div>

              <Link
                href="/neuigkeiten"
                className="inline-flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-pumpkin hover:text-burnt-orange transition-colors duration-300"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M19.5 12h-15m0 0l5.5 5.5M4.5 12l5.5-5.5" />
                </svg>
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
