import type { ReactNode } from "react";
import type { ResolvedIcon } from "@/lib/cms/icons";
import Link from "next/link";
import CmsIcon from "@/components/cms/CmsIcon";

interface SectionTeaserProps {
  accent: string;
  title: string;
  description?: string;
  children: ReactNode;
  ctaLabel?: string;
  ctaHref?: string;
  bgColor?: "white" | "cream" | "anthracite";
  centered?: boolean;
  icons?: Record<string, ResolvedIcon>;
}

export default function SectionTeaser({
  accent,
  title,
  description,
  children,
  ctaLabel,
  ctaHref,
  bgColor = "white",
  centered = false,
  icons = {},
}: SectionTeaserProps) {
  const bgClass = {
    white: "bg-white",
    cream: "bg-cream",
    anthracite: "bg-anthracite",
  }[bgColor];

  const isDark = bgColor === "anthracite";

  return (
    <section className={`section-padding ${bgClass}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* Section header */}
        <div
          className={`mb-14 md:mb-20 ${
            centered ? "text-center" : ""
          }`}
        >
          <div
            className={`flex items-center gap-4 mb-5 ${
              centered ? "justify-center" : ""
            }`}
          >
            <div className="accent-line" />
            <p className="font-accent text-pumpkin-accessible text-xs tracking-[0.3em] uppercase">
              {accent}
            </p>
          </div>

          <h2
            className={`font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight ${
              isDark ? "text-white" : "text-anthracite"
            }`}
          >
            {title}
          </h2>

          {description && (
            <p
              className={`font-body text-base md:text-[1.0625rem] leading-[1.8] mt-5 ${
                centered ? "mx-auto" : ""
              } max-w-2xl ${
                isDark ? "text-white/70" : "text-text-gray"
              }`}
            >
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        {children}

        {/* Optional CTA */}
        {ctaLabel && ctaHref && (
          <div
            className={`mt-14 md:mt-20 ${
              centered ? "text-center" : ""
            }`}
          >
            <Link
              href={ctaHref}
              className={isDark ? "btn-outline-white" : "btn-primary"}
            >
              {ctaLabel}
              <CmsIcon icon={icons["arrow-right"]} width={14} height={14} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
