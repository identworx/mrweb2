import type { ResolvedIcon } from "@/lib/cms/icons";
import Link from "next/link";
import Image from "next/image";
import CmsIcon from "@/components/cms/CmsIcon";

interface CollectionCardProps {
  name: string;
  slug: string;
  description: string;
  moodColors: string[];
  fabric: string;
  image: string;
  alt: string;
  icons?: Record<string, ResolvedIcon>;
}

const MOOD_PALETTES: Record<string, { from: string; via: string; to: string }> = {
  green: { from: "#2E4A2A", via: "#4A6E3E", to: "#6B8F5E" },
  blue: { from: "#162F45", via: "#2A5F7E", to: "#5A9AB8" },
  red: { from: "#4A1A14", via: "#8B3A2A", to: "#C06050" },
  golden: { from: "#4A3810", via: "#8A6B1E", to: "#C9A230" },
  "earth-grey": { from: "#332C24", via: "#5E5244", to: "#8B7D6B" },
  "nerio-oceana": { from: "#0A3234", via: "#1A6060", to: "#3A9898" },
  basic: { from: "#282828", via: "#484848", to: "#707070" },
};

function getPlaceholderStyle(slug: string, moodColors: string[]) {
  const palette = MOOD_PALETTES[slug];
  if (palette) {
    return {
      background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.via} 45%, ${palette.to} 100%)`,
    };
  }
  if (moodColors.length >= 2) {
    return {
      background: `linear-gradient(160deg, ${moodColors[0]} 0%, ${moodColors[moodColors.length - 1]} 100%)`,
    };
  }
  return { background: moodColors[0] || "#444" };
}

function isPlaceholder(image: string) {
  return image.includes("/placeholders/") || image.endsWith(".svg");
}

export default function CollectionCard({
  name,
  slug,
  description,
  moodColors,
  fabric,
  image,
  alt,
  icons = {},
}: CollectionCardProps) {
  const hasRealImage = !isPlaceholder(image);

  return (
    <Link
      href={`/kollektionen/${slug}`}
      className="group relative flex flex-col h-full bg-white border border-black/[0.06] transition-all duration-500 motion-safe:hover:-translate-y-0.5 hover:border-black/[0.12]"
    >
      <div className="relative overflow-hidden aspect-[3/4]">
        {hasRealImage ? (
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover transition-transform duration-[1.2s] ease-out motion-safe:group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out motion-safe:group-hover:scale-[1.03]">
            <div className="absolute inset-0" style={getPlaceholderStyle(slug, moodColors)} />
            {/* Woven fiber texture */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.25) 3px, rgba(255,255,255,0.25) 4px)",
              }}
            />
            {/* Diagonal highlight */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.15) 100%)",
              }}
            />
          </div>
        )}

        {/* Unified gradient overlay for both real and placeholder images */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0.04) 70%, transparent 100%)",
          }}
        />

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5 pb-4">
          <p className="font-accent text-white/70 text-[9px] tracking-[0.2em] uppercase mb-1.5">
            {fabric}
          </p>
          <h3 className="font-heading text-white text-xl md:text-[1.375rem] font-bold tracking-tight leading-tight">
            {name}
          </h3>
        </div>
      </div>

      {/* Mood color strip */}
      <div className="flex">
        {moodColors.map((color, i) => (
          <div
            key={i}
            className="flex-1 h-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 pt-4">
        <p className="font-body text-text-gray text-[13px] leading-[1.75] line-clamp-2 flex-1">
          {description}
        </p>

        <div className="flex items-center justify-end mt-4 pt-3 border-t border-black/[0.05]">
          <span className="flex items-center gap-1.5 text-pumpkin/70 group-hover:text-pumpkin transition-colors duration-500">
            <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.14em]">
              Entdecken
            </span>
            <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </Link>
  );
}
