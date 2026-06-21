import Image from "next/image";
import Link from "next/link";
import type { FrontendAmbienteImage } from "@/lib/cms/ambiente";
import ScrollReveal from "@/components/ScrollReveal";

interface Props {
  images: FrontendAmbienteImage[];
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

function TeaserTile({ image, priority = false, className = "" }: { image: FrontendAmbienteImage; priority?: boolean; className?: string }) {
  return (
    <button
      type="button"
      className={`group relative overflow-hidden block w-full h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin ${className}`}
      aria-label={`${image.title} – ${image.caption || ""}`}
      tabIndex={0}
    >
      <Image
        src={image.imageUrl}
        alt={image.alt || image.title}
        fill
        className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.04]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.15) 50%, transparent 100%)",
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
    </button>
  );
}

export default function AmbienteTeaser({ images }: Props) {
  if (images.length === 0) return null;

  const [a, b, c, d, e] = images;

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
          {images.length >= 5 ? (
            <div className="grid grid-cols-6 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-2 md:gap-3 h-[500px] md:h-[560px] lg:h-[620px]">
              <div className="col-span-6 sm:col-span-3 row-span-2">
                <TeaserTile image={a} priority />
              </div>
              <div className="col-span-3 sm:col-span-2 row-span-2 hidden sm:block">
                <TeaserTile image={b} />
              </div>
              <div className="col-span-6 sm:col-span-1 row-span-1 hidden sm:block">
                <TeaserTile image={c} />
              </div>
              <div className="col-span-3 sm:col-span-1 row-span-1 hidden sm:block">
                {d && <TeaserTile image={d} />}
              </div>
            </div>
          ) : images.length >= 3 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3 h-[300px] md:h-[400px] lg:h-[480px]">
              {images.slice(0, 3).map((img, i) => (
                <div key={img.id} className={i === 0 ? "col-span-2 sm:col-span-1" : ""}>
                  <TeaserTile image={img} priority={i === 0} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 h-[300px] md:h-[400px]">
              {images.map((img, i) => (
                <div key={img.id}>
                  <TeaserTile image={img} priority={i === 0} />
                </div>
              ))}
            </div>
          )}

          {/* Show 5th image in a separate row on mobile when we have 5 */}
          {images.length >= 5 && e && (
            <div className="mt-2 md:mt-3 sm:hidden h-[200px]">
              <TeaserTile image={e} />
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
