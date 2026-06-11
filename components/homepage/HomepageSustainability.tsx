import Link from "next/link";
import type { HomepageSection } from "@/lib/cms/homepage";
import RichTextRenderer from "@/components/rich-text/RichTextRenderer";

interface Stat {
  value: string;
  label: string;
  detail: string;
}

interface Props {
  section: HomepageSection;
}

export default function HomepageSustainability({ section }: Props) {
  const stats = (section.settings.stats as Stat[]) || [];
  const eyebrow = section.eyebrow || "Nachhaltigkeit";
  const title = section.title || "Grün gewebt. Vom Tropfen an.";
  const content = section.content || "";
  const ctaLabel = section.buttonLabel;
  const ctaHref = section.buttonHref;

  return (
    <section className="relative py-20 md:py-28 lg:py-32 bg-[#1a2e1a] overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0 L60 30 L30 60 L0 30 Z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="text-center mb-14 md:mb-18">
          <h2 className="font-heading text-white text-3xl md:text-[2.75rem] lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.1]">
            {title}
          </h2>
          {content && (
            <RichTextRenderer
              html={content}
              className="font-body text-white/60 text-base md:text-[1.0625rem] leading-[1.8] mt-5 mx-auto max-w-2xl"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {stats.map((item) => (
            <div key={item.value} className="text-center p-6 md:p-8 bg-white/[0.04] border border-white/[0.06]">
              <span className="font-heading text-pumpkin text-5xl md:text-6xl font-extrabold tracking-tight">
                {item.value}
              </span>
              <p className="font-heading text-white text-lg font-semibold mt-3 mb-2">
                {item.label}
              </p>
              {item.detail && (
                <p className="font-body text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
                  {item.detail}
                </p>
              )}
            </div>
          ))}
        </div>

        {ctaLabel && ctaHref && (
          <div className="mt-12 md:mt-16 text-center">
            <Link href={ctaHref} className="btn-outline-white">
              {ctaLabel}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
