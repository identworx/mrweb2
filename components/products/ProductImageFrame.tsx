import Image from "next/image";

type Variant = "detail" | "thumbnail" | "card" | "related" | "compact";

interface ProductImageFrameProps {
  src?: string | null;
  alt: string;
  variant: Variant;
  collectionName?: string;
  collectionColors?: string[];
  productName?: string;
  className?: string;
  isActive?: boolean;
  priority?: boolean;
}

function isPlaceholder(src: string) {
  return src.includes("/placeholders/") || src.endsWith(".svg");
}

function getPlaceholderGradient(colors: string[]) {
  if (colors.length >= 2) {
    return `linear-gradient(145deg, ${colors[0]} 0%, ${colors[Math.min(1, colors.length - 1)]} 50%, ${colors[Math.min(2, colors.length - 1)]} 100%)`;
  }
  return colors[0] || "linear-gradient(145deg, #C4A882 0%, #A08060 50%, #887050 100%)";
}

const variantConfig: Record<Variant, {
  aspect: string;
  padding: string;
  sizes: string;
  maxClass?: string;
}> = {
  detail: {
    aspect: "aspect-square",
    padding: "p-6 sm:p-8 md:p-10 lg:p-14",
    sizes: "(max-width: 1024px) 100vw, 50vw",
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
  productName,
  className,
  isActive,
  priority,
}: ProductImageFrameProps) {
  const config = variantConfig[variant];
  const hasImage = src && !isPlaceholder(src);
  const colors = collectionColors || [];

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
