import Link from "next/link";
import type { HomepageSection } from "@/lib/cms/homepage";
import type { FrontendDownload } from "@/lib/cms/downloads";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";

interface Props {
  section: HomepageSection;
  downloads: FrontendDownload[];
}

function DownloadIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-pumpkin">
      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

export default function HomepageDownloads({ section, downloads }: Props) {
  const eyebrow = section.eyebrow || "Downloads";
  const title = section.title || "Kataloge & Dokumente.";
  const description = section.content || "";
  const ctaLabel = section.buttonLabel;
  const ctaHref = section.buttonHref;

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-12">
          <div>
            <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight leading-tight">
              {title}
            </h2>
            {description && (
              <RichTextRenderer
                html={description}
                className="font-body text-text-gray text-sm md:text-base leading-[1.7] mt-3 max-w-xl"
              />
            )}
          </div>
          {ctaLabel && ctaHref && (
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 font-heading text-pumpkin text-sm font-semibold tracking-wide hover:text-burnt-orange transition-colors duration-300 shrink-0"
            >
              {ctaLabel}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
              </svg>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {downloads.map((dl) => {
            const href = dl.externalUrl || dl.fileUrl || "#";
            const isExternal = dl.opensInNewTab || href.startsWith("http");

            return (
              <a
                key={dl.id}
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group flex items-start gap-5 p-7 bg-cream border border-transparent transition-all duration-500 motion-safe:hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:border-pumpkin/10"
              >
                <div className="shrink-0 mt-0.5 w-12 h-12 flex items-center justify-center bg-pumpkin/10 group-hover:bg-pumpkin/20 transition-colors duration-300">
                  <DownloadIcon />
                </div>
                <div>
                  <h3 className="font-heading text-anthracite text-base font-bold mb-1.5 group-hover:text-pumpkin transition-colors duration-300">
                    {dl.title}
                  </h3>
                  {dl.description && (
                    <p className="font-body text-text-gray text-sm leading-relaxed">
                      {dl.description}
                    </p>
                  )}
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}
