import Image from "next/image";
import Link from "next/link";
import type { FrontendAmbienteImage, TeaserSlot } from "@/lib/cms/ambiente";
import ScrollReveal from "@/components/ScrollReveal";

interface Props {
  slots: Record<TeaserSlot, FrontendAmbienteImage | null>;
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
  priority = false,
}: {
  image: FrontendAmbienteImage;
  area: string;
  priority?: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-lg border border-black/[0.04] bg-[#FAF8F5] group"
      style={{ gridArea: area }}
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
    </div>
  );
}

export default function AmbienteTeaser({ slots }: Props) {
  const { hero, portrait, wide, smallA, smallB } = slots;

  const filled = [hero, portrait, wide, smallA, smallB].filter(
    (img): img is FrontendAmbienteImage => img !== null,
  );
  if (filled.length === 0) return null;

  const hasFiveSlots = hero && portrait && wide && smallA && smallB;

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <ScrollReveal>
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-4 mb-4">
              <div className="accent-line" />
              <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
                Ambiente
              </p>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-heading text-anthracite text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight leading-tight">
                Mosaroma im Einsatz.
              </h2>
              <Link
                href="/kollektionen/ambiente"
                className="inline-flex items-center gap-2 font-heading text-pumpkin text-sm font-semibold tracking-wide hover:text-burnt-orange transition-colors duration-300"
              >
                Alle Ambiente-Bilder
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </ScrollReveal>

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
              <TeaserTile image={hero} area="hero" priority />
              <TeaserTile image={portrait} area="portrait" />
              <TeaserTile image={wide} area="wide" />
              <TeaserTile image={smallA} area="smallA" />
              <TeaserTile image={smallB} area="smallB" />
            </div>
          )}

          {/* Tablet fallback (sm–lg): simple grid when we have 5 slots */}
          {hasFiveSlots && (
            <div className="hidden sm:grid lg:hidden grid-cols-2 gap-3">
              {filled.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative overflow-hidden rounded-lg border border-black/[0.04] bg-[#FAF8F5] ${
                    i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.alt || img.title}
                    fill
                    className="object-cover"
                    sizes={i === 0 ? "100vw" : "50vw"}
                    priority={i === 0}
                  />
                </div>
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
                  priority={i === 0}
                />
              ))}
            </div>
          )}

          {/* Mobile: stacked */}
          <div className={hasFiveSlots ? "flex flex-col gap-3 sm:hidden" : "flex flex-col gap-3 sm:hidden"}>
            {filled.slice(0, 3).map((img, i) => (
              <div
                key={img.id}
                className="relative overflow-hidden rounded-lg border border-black/[0.04] bg-[#FAF8F5]"
                style={{ height: i === 0 ? "280px" : "200px" }}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.alt || img.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority={i === 0}
                />
              </div>
            ))}
            {filled.length > 3 && (
              <div className="grid grid-cols-2 gap-3">
                {filled.slice(3).map((img) => (
                  <div
                    key={img.id}
                    className="relative overflow-hidden rounded-lg border border-black/[0.04] bg-[#FAF8F5]"
                    style={{ height: "160px" }}
                  >
                    <Image
                      src={img.imageUrl}
                      alt={img.alt || img.title}
                      fill
                      className="object-cover"
                      sizes="50vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
