import Image from "next/image";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/Breadcrumbs";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  alt?: string;
  variant?: "light" | "dark";
  height?: "compact" | "default" | "large";
  breadcrumbs?: BreadcrumbItem[];
};

const FALLBACK_IMAGE = "/images/placeholders/page-heroes/default-hero.svg";

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  alt = "MOSAROMA Hero",
  variant = "dark",
  breadcrumbs,
}: PageHeroProps) {
  const heroImage = image || FALLBACK_IMAGE;
  const isDark = variant === "dark";

  return (
    <section
      className="relative overflow-hidden h-[300px] md:h-[320px] flex items-end"
    >
      <Image
        src={heroImage}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {isDark ? (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.30) 60%, rgba(0,0,0,0.12) 80%, transparent 100%)",
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(250,248,245,0.92) 0%, rgba(250,248,245,0.70) 35%, rgba(250,248,245,0.40) 60%, rgba(250,248,245,0.15) 80%, transparent 100%)",
          }}
        />
      )}

      <div className="relative w-full pt-24 md:pt-28 pb-6 md:pb-8">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          {breadcrumbs && (
            <div className="mb-4">
              <Breadcrumbs
                items={breadcrumbs}
                variant={isDark ? "light" : "dark"}
              />
            </div>
          )}

          {eyebrow && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-px bg-pumpkin" />
              <p className="font-accent text-pumpkin text-[11px] tracking-[0.3em] uppercase">
                {eyebrow}
              </p>
            </div>
          )}

          <h1
            className={`font-heading text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-[1.08] max-w-3xl ${
              isDark ? "text-white" : "text-anthracite"
            }`}
          >
            {title}
          </h1>

          {description && (
            <p
              className={`font-body text-sm md:text-[0.9375rem] leading-[1.7] mt-3 max-w-2xl line-clamp-2 ${
                isDark ? "text-white/60" : "text-text-gray"
              }`}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
