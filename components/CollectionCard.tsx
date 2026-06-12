import Link from "next/link";
import Image from "next/image";

interface CollectionCardProps {
  name: string;
  slug: string;
  description: string;
  moodColors: string[];
  fabric: string;
  image: string;
  alt: string;
}

const MOOD_PALETTES: Record<string, { from: string; to: string; accent: string }> = {
  green: { from: "#3D5A3A", to: "#6B8F5E", accent: "rgba(107,143,94,0.35)" },
  blue: { from: "#1E4D6B", to: "#4A8BAD", accent: "rgba(74,139,173,0.35)" },
  red: { from: "#6B1E1E", to: "#B8503A", accent: "rgba(184,80,58,0.35)" },
  golden: { from: "#7A6017", to: "#C9A230", accent: "rgba(201,162,48,0.35)" },
  "earth-grey": { from: "#4A3F34", to: "#8B7D6B", accent: "rgba(139,125,107,0.35)" },
  "nerio-oceana": { from: "#0E4A4C", to: "#2E8B8B", accent: "rgba(46,139,139,0.35)" },
  basic: { from: "#3A3A3A", to: "#6B6B6B", accent: "rgba(107,107,107,0.35)" },
};

function getPlaceholderStyle(slug: string, moodColors: string[]) {
  const palette = MOOD_PALETTES[slug];
  if (palette) {
    return {
      background: `linear-gradient(145deg, ${palette.from} 0%, ${palette.to} 100%)`,
    };
  }
  if (moodColors.length >= 2) {
    return {
      background: `linear-gradient(145deg, ${moodColors[0]} 0%, ${moodColors[moodColors.length - 1]} 100%)`,
    };
  }
  return { background: moodColors[0] || "#555" };
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
}: CollectionCardProps) {
  const hasRealImage = !isPlaceholder(image);

  return (
    <Link
      href={`/kollektionen/${slug}`}
      className="group relative flex flex-col bg-white border border-black/[0.06] transition-all duration-500 motion-safe:hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-black/[0.10]"
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        {hasRealImage ? (
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 transition-transform duration-700 motion-safe:group-hover:scale-[1.04]">
            <div className="absolute inset-0" style={getPlaceholderStyle(slug, moodColors)} />
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 8px, currentColor 8px, currentColor 8.5px), repeating-linear-gradient(-45deg, transparent, transparent 8px, currentColor 8.5px, currentColor 9px)",
                color: "white",
              }}
            />
          </div>
        )}

        <div
          className="absolute inset-0"
          style={{
            background: hasRealImage
              ? "linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.10) 50%, transparent 100%)"
              : "linear-gradient(to top, rgba(0,0,0,0.30) 0%, transparent 60%)",
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-heading text-white text-lg md:text-xl font-bold tracking-tight leading-tight">
            {name}
          </h3>
        </div>
      </div>

      <div className="flex">
        {moodColors.map((color, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 transition-all duration-500 group-hover:h-2"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="flex flex-col flex-1 p-5 pt-4">
        <p className="font-body text-text-gray text-sm leading-[1.7] line-clamp-2 flex-1">
          {description}
        </p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/[0.06]">
          <span className="font-accent text-[9px] font-medium uppercase tracking-[0.12em] text-anthracite/45 group-hover:text-pumpkin/60 transition-colors duration-500">
            {fabric}
          </span>

          <span className="flex items-center gap-1.5 text-pumpkin opacity-70 group-hover:opacity-100 transition-opacity duration-300">
            <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em]">
              Entdecken
            </span>
            <svg
              width="12"
              height="12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              className="motion-safe:group-hover:translate-x-1 transition-transform duration-300"
              aria-hidden="true"
            >
              <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
