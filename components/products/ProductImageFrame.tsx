import Image from "next/image";

type Variant = "detail" | "thumbnail" | "card" | "related" | "compact";

interface ProductImageFrameProps {
  src?: string | null;
  alt: string;
  variant: Variant;
  collectionName?: string;
  collectionColors?: string[];
  collectionSlug?: string;
  productName?: string;
  className?: string;
  isActive?: boolean;
  priority?: boolean;
}

function isPlaceholder(src: string) {
  return src.includes("/placeholders/") || src.endsWith(".svg");
}

const COLLECTION_COLOR_FALLBACKS: Record<string, string[]> = {
  green: ["#4A7C59", "#6B8F71", "#8FB996"],
  blue: ["#2C5F7C", "#4A8BAD", "#7AB3CC"],
  red: ["#8B2500", "#C0392B", "#E67E73"],
  golden: ["#B8860B", "#DAA520", "#F0C75E"],
  "earth-grey": ["#6B5B4B", "#8B7D6B", "#A69B8D"],
  "nerio-oceana": ["#1B6B6D", "#2E8B8B", "#5CACAC"],
  basic: ["#555555", "#888888", "#AAAAAA"],
};

function resolveColors(
  collectionColors?: string[],
  collectionSlug?: string,
): string[] {
  if (collectionColors && collectionColors.length > 0) return collectionColors;
  if (collectionSlug && COLLECTION_COLOR_FALLBACKS[collectionSlug]) {
    return COLLECTION_COLOR_FALLBACKS[collectionSlug];
  }
  return [];
}

function getPlaceholderGradient(colors: string[]) {
  if (colors.length >= 2) {
    return `linear-gradient(145deg, ${colors[0]} 0%, ${colors[Math.min(1, colors.length - 1)]} 50%, ${colors[Math.min(2, colors.length - 1)]} 100%)`;
  }
  return colors[0] || "linear-gradient(145deg, #888 0%, #AAA 50%, #CCC 100%)";
}

const variantConfig: Record<Variant, {
  aspect: string;
  padding: string;
  sizes: string;
}> = {
  detail: {
    aspect: "aspect-square",
    padding: "p-5 sm:p-7 md:p-8 lg:p-10",
    sizes: "(max-width: 1024px) 100vw, 45vw",
  },
  thumbnail: {
    aspect: "aspect-square",
    padding: "p-2 md:p-2.5",
    sizes: "96px",
  },
  card: {
    aspect: "aspect-[4/5]",
    padding: "p-5 md:p-6",
    sizes: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  },
  related: {
    aspect: "aspect-[4/5]",
    padding: "p-4 md:p-5",
    sizes: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  },
  compact: {
    aspect: "aspect-square",
    padding: "p-3",
    sizes: "(max-width: 640px) 33vw, 20vw",
  },
};

export default function ProductImageFrame({
  src,
  alt,
  variant,
  collectionName,
  collectionColors,
  collectionSlug,
  productName,
  className,
  isActive,
  priority,
}: ProductImageFrameProps) {
  const config = variantConfig[variant];
  const hasImage = src && !isPlaceholder(src);
  const colors = resolveColors(collectionColors, collectionSlug);

  const thumbnailRing = variant === "thumbnail"
    ? isActive
      ? "ring-2 ring-pumpkin ring-offset-1"
      : "ring-1 ring-black/[0.06] opacity-70 hover:opacity-100"
    : "";

  return (
    <div
      className={[
        "relative overflow-hidden bg-[#FAF8F5]",
        config.aspect,
        thumbnailRing,
        className,
      ].filter(Boolean).join(" ")}
    >
      {hasImage ? (
        <div className={["absolute inset-0 flex items-center justify-center", config.padding].join(" ")}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes={config.sizes}
            priority={priority}
          />
        </div>
      ) : (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{ background: getPlaceholderGradient(colors) }}
          />
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px), repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.25) 3px, rgba(255,255,255,0.25) 4px)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.15) 100%)",
            }}
          />
          {(collectionName || productName) && variant !== "thumbnail" && variant !== "compact" && (
            <div className="absolute inset-0 flex items-end p-4 md:p-5">
              <span className="font-accent text-white/50 text-[10px] tracking-[0.15em] uppercase">
                {collectionName || productName}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
