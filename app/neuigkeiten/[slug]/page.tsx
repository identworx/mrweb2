import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { newsItems } from "@/lib/mosaroma/news";

export async function generateStaticParams() {
  return newsItems.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = newsItems.find((n) => n.slug === slug);

  if (!item) {
    return { title: "Nicht gefunden | Mosaroma" };
  }

  return {
    title: `${item.title} | Mosaroma`,
    description: item.description,
  };
}

export default async function NeuigkeitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = newsItems.find((n) => n.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero area */}
        <section className="section-padding bg-cream pt-40 md:pt-48 lg:pt-52">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em] px-3 py-1 bg-pumpkin/10 text-pumpkin">
                {item.tag}
              </span>
              <span className="font-body text-text-gray/50 text-xs">
                {item.date}
              </span>
              {item.isPlaceholder && (
                <span className="font-body text-[10px] text-text-gray/40 italic">
                  (Platzhalter)
                </span>
              )}
            </div>

            <h1 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08]">
              {item.title}
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10">
            <div className="max-w-3xl">
              <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] mb-10">
                {item.description}
              </p>

              {/* Placeholder content area */}
              <div className="bg-cream p-8 md:p-12 mb-10">
                <p className="font-body text-text-gray/50 text-sm italic">
                  Dieser Inhalt wird in Kürze veröffentlicht. Schauen Sie bald
                  wieder vorbei.
                </p>
              </div>

              {/* Back link */}
              <Link
                href="/neuigkeiten"
                className="inline-flex items-center gap-2 font-heading text-[11px] font-semibold uppercase tracking-[0.12em] text-pumpkin hover:text-burnt-orange transition-colors duration-300"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.5 12h-15m0 0l5.5 5.5M4.5 12l5.5-5.5" />
                </svg>
                Zurück zu Neuigkeiten
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
