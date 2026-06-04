import Image from "next/image";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: string;
  alt?: string;
  variant?: "light" | "dark";
  height?: "compact" | "default" | "large";
};

const FALLBACK_IMAGE = "/images/placeholders/page-heroes/default-hero.svg";

const heightClasses = {
  compact:
    "min-h-[360px] md:min-h-[420px] lg:min-h-[480px]",
  default:
    "min-h-[400px] md:min-h-[480px] lg:min-h-[560px]",
  large:
    "min-h-[460px] md:min-h-[540px] lg:min-h-[640px]",
};

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  alt = "MOSAROMA Hero",
  variant = "dark",
  height = "default",
}: PageHeroProps) {
  const heroImage = image || FALLBACK_IMAGE;
  const isDark = variant === "dark";

  return (
    <section
      className={`relative overflow-hidden ${heightClasses[height]} flex items-end`}
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
              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.50) 35%, rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.10) 80%, transparent 100%)",
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

      <div className="relative w-full pb-12 md:pb-16 lg:pb-20 pt-40 md:pt-48 lg:pt-52">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          {eyebrow && (
            <div className="flex items-center gap-4 mb-5">
              <div
                className={`w-12 h-px ${isDark ? "bg-pumpkin" : "bg-pumpkin"}`}
              />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                {eyebrow}
              </p>
            </div>
          )}

          <h1
            className={`font-heading text-4xl md:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold tracking-tight leading-[1.08] ${
              isDark ? "text-white" : "text-anthracite"
            }`}
          >
            {title}
          </h1>

          {description && (
            <p
              className={`font-body text-base md:text-[1.0625rem] leading-[1.8] mt-6 max-w-2xl ${
                isDark ? "text-white/70" : "text-text-gray"
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
