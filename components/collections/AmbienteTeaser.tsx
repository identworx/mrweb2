import Image from "next/image";
import Link from "next/link";
import type { FrontendAmbienteImage, TeaserSlot } from "@/lib/cms/ambiente";
import ScrollReveal from "@/components/ScrollReveal";

interface Props {
  slots: Record<TeaserSlot, FrontendAmbienteImage | null>;
  eyebrow?: string;
  title?: string;
  intro?: string;
  ctaLabel?: string;
  ctaHref?: string;
  showHeader?: boolean;
  ctaPlacement?: "top-right" | "below-right";
  className?: string;
  variant?: "default" | "homepage";
}

const COLOR_WORLD_LABELS: Record<string, string> = {
  green: "Green",
  blue: "Blue",
  earth: "Earth & Grey",
  golden: "Golden",
};

function worldLabel(worlds: string[]): string {
  if (worlds.length === 0) return "";
  return worlds.map((w) => COLOR_WORLD_LABELS[w] || w).join(" · ");
}

function TeaserTile({
  image,
  area,
  href,
  priority = false,
}: {
  image: FrontendAmbienteImage;
  area: string;
  href: string;
  priority?: boolean;
}) {
  return (
    <Link
      href={href}
      className="relative overflow-hidden border border-black/[0.04] bg-[#FAF8F5] group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin"
      style={{ gridArea: area }}
      aria-label={`Ambiente-Galerie: ${image.caption || image.title}`}
    >
      <Image
        src={image.imageUrl}
        alt={image.alt || image.title}
        fill
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]"
        sizes={
          area === "hero"
            ? "(max-width: 1024px) 100vw, 50vw"
            : area === "portrait"
              ? "(max-width: 1024px) 50vw, 22vw"
              : "(max-width: 1024px) 50vw, 25vw"
        }
        priority={priority}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.12) 50%, transparent 100%)",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 motion-reduce:translate-y-0 motion-reduce:opacity-100">
        {image.colorWorlds.length > 0 && (
          <p className="font-accent text-pumpkin text-[10px] tracking-[0.2em] uppercase mb-1">
            {worldLabel(image.colorWorlds)}
          </p>
        )}
        <p className="font-heading text-white text-sm md:text-base font-semibold leading-snug">
          {image.caption || image.title}
        </p>
      </div>
    </Link>
  );
}

export default function AmbienteTeaser({
  slots,
  eyebrow = "Ambiente",
  title = "Mosaroma im Einsatz.",
  intro,
  ctaLabel = "Alle Ambiente-Bilder",
  ctaHref = "/kollektionen/ambiente",
  showHeader = true,
  ctaPlacement = "top-right",
  className,
  variant = "default",
}: Props) {
  const { hero, portrait, wide, smallA, smallB } = slots;

  const filled = [hero, portrait, wide, smallA, smallB].filter(
    (img): img is FrontendAmbienteImage => img !== null,
  );
  if (filled.length === 0) return null;

  const hasFiveSlots = hero && portrait && wide && smallA && smallB;
  const isHomepage = variant === "homepage";
  const sectionPadding = isHomepage ? "pt-10 md:pt-14 pb-6 md:pb-8" : "py-16 md:py-24";
  const sectionBg = isHomepage ? "bg-white" : "bg-cream";
  const tileHref = ctaHref || "/kollektionen/ambiente";

  const ctaLink = ctaLabel && ctaHref ? (
    <Link
      href={ctaHref}
      className="inline-flex items-center gap-2 font-heading text-anthracite text-sm font-semibold tracking-wide hover:text-pumpkin transition-colors duration-300"
    >
      {ctaLabel}
      <span aria-hidden="true" className="text-pumpkin">&rarr;</span>
    </Link>
  ) : null;

  return (
    <section className={`${sectionPadding} ${sectionBg} ${className ?? ""}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {showHeader && (
          <ScrollReveal>
            <div className="mb-10 md:mb-14">
              <div className="flex items-center gap-4 mb-4">
                <div className="accent-line" />
                <p className="font-accent text-text-muted text-xs tracking-[0.3em] uppercase">
                  {eyebrow}
                </p>
              </div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
                  {title}
                </h2>
                {ctaPlacement === "top-right" && ctaLink}
              </div>
              {intro && (
                <p className="font-body text-text-gray text-base md:text-[1.0625rem] leading-[1.8] max-w-[56ch] mt-4">
                  {intro}
                </p>
              )}
            </div>
          </ScrollReveal>
        )}

        <ScrollReveal>
          {/* Desktop mosaic (lg+): 5-slot curated grid */}
          {hasFiveSlots && (
            <div
              className="hidden lg:grid gap-3 md:gap-4"
              style={{
                gridTemplateColumns: "2.2fr 0.95fr 1fr 1fr",
                gridTemplateRows: "repeat(2, minmax(190px, 1fr))",
                gridTemplateAreas: `"hero portrait wide wide" "hero portrait smallA smallB"`,
                height: "clamp(420px, 42vw, 620px)",
              }}
            >
              <TeaserTile image={hero} area="hero" href={tileHref} priority />
              <TeaserTile image={portrait} area="portrait" href={tileHref} />
              <TeaserTile image={wide} area="wide" href={tileHref} />
              <TeaserTile image={smallA} area="smallA" href={tileHref} />
              <TeaserTile image={smallB} area="smallB" href={tileHref} />
            </div>
          )}

          {/* Tablet fallback (sm–lg): simple grid when we have 5 slots */}
          {hasFiveSlots && (
            <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3">
              {filled.map((img, i) => (
                <Link
                  key={img.id}
                  href={tileHref}
                  className={`relative overflow-hidden border border-black/[0.04] bg-[#FAF8F5] block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin ${
                    i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                  aria-label={`Ambiente-Galerie: ${img.caption || img.title}`}
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.alt || img.title}
                    fill
                    className="object-cover"
                    sizes={i === 0 ? "100vw" : "50vw"}
                    priority={i === 0}
                  />
                </Link>
              ))}
            </div>
          )}

          {/* Fewer than 5 images: simple responsive grid for sm+ */}
          {!hasFiveSlots && filled.length >= 3 && (
            <div
              className="hidden sm:grid gap-3"
              style={{
                gridTemplateColumns: "2fr 1fr 1fr",
                gridTemplateRows: "1fr",
                height: "clamp(320px, 34vw, 480px)",
              }}
            >
              {filled.slice(0, 3).map((img, i) => (
                <TeaserTile
                  key={img.id}
                  image={img}
                  area="auto"
                  href={tileHref}
                  priority={i === 0}
                />
              ))}
            </div>
          )}

          {!hasFiveSlots && filled.length > 0 && filled.length < 3 && (
            <div
              className="hidden sm:grid gap-3"
              style={{
                gridTemplateColumns: filled.length === 1 ? "1fr" : "1fr 1fr",
                gridTemplateRows: "1fr",
                height: "clamp(280px, 30vw, 420px)",
              }}
            >
              {filled.map((img, i) => (
                <TeaserTile
                  key={img.id}
                  image={img}
                  area="auto"
                  href={tileHref}
                  priority={i === 0}
                />
              ))}
            </div>
          )}

          {/* Mobile: stacked */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filled.slice(0, 3).map((img, i) => (
              <Link
                key={img.id}
                href={tileHref}
                className="relative overflow-hidden border border-black/[0.04] bg-[#FAF8F5] block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin"
                style={{ height: i === 0 ? "280px" : "200px" }}
                aria-label={`Ambiente-Galerie: ${img.caption || img.title}`}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.alt || img.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                />
              </Link>
            ))}
            {filled.length > 3 && (
              <div className="grid grid-cols-2 gap-3">
                {filled.slice(3).map((img) => (
                  <Link
                    key={img.id}
                    href={tileHref}
                    className="relative overflow-hidden border border-black/[0.04] bg-[#FAF8F5] block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin"
                    style={{ height: "160px" }}
                    aria-label={`Ambiente-Galerie: ${img.caption || img.title}`}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.alt || img.title}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* CTA below mosaic */}
        {ctaPlacement === "below-right" && ctaLink && (
          <div className="flex justify-end mt-5 md:mt-6">
            {ctaLink}
          </div>
        )}
      </div>
    </section>
  );
}
