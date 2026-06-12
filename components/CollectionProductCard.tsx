import Link from "next/link";
import Image from "next/image";
import type { FrontendProduct } from "@/lib/cms/products";

interface CollectionProductCardProps {
  product: FrontendProduct;
  collectionColors: string[];
}

function isPlaceholder(src: string) {
  return src.includes("/placeholders/") || src.endsWith(".svg");
}

function getPlaceholderGradient(colors: string[]) {
  if (colors.length >= 2) {
    return `linear-gradient(145deg, ${colors[0]} 0%, ${colors[Math.min(1, colors.length - 1)]} 50%, ${colors[Math.min(2, colors.length - 1)]} 100%)`;
  }
  return colors[0] || "#888";
}

export default function CollectionProductCard({
  product,
  collectionColors,
}: CollectionProductCardProps) {
  const hasImage = !isPlaceholder(product.image);

  return (
    <Link
      href={`/produkte/${product.slug}`}
      className="group flex flex-col h-full bg-white border border-black/[0.06] transition-all duration-500 motion-safe:hover:-translate-y-0.5 hover:border-black/[0.10]"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-light-gray">
        {hasImage ? (
          <Image
            src={product.image}
            alt={product.alt}
            fill
            className="object-cover transition-transform duration-[1.2s] ease-out motion-safe:group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 transition-transform duration-[1.2s] ease-out motion-safe:group-hover:scale-[1.03]"
              style={{ background: getPlaceholderGradient(collectionColors) }}
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
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 md:p-5">
        <p className="font-accent text-text-gray/50 text-[10px] tracking-[0.15em] uppercase">
          {product.productGroupName}
        </p>

        <h3 className="font-heading text-anthracite text-sm md:text-[15px] font-bold leading-snug mt-1 group-hover:text-pumpkin transition-colors duration-300">
          {product.name}
        </h3>

        <div className="mt-2 space-y-0.5 flex-1">
          {product.material && (
            <p className="font-body text-text-gray text-xs">{product.material}</p>
          )}
          {product.size && (
            <p className="font-body text-text-gray text-xs">{product.size}</p>
          )}
          {product.code && (
            <p className="font-accent text-text-gray/40 text-[10px] tracking-wider uppercase">
              Art. {product.code}
            </p>
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 text-pumpkin/70 group-hover:text-pumpkin transition-colors duration-300 mt-3 pt-3 border-t border-black/[0.04]">
          <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em]">
            Details
          </span>
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            className="motion-safe:group-hover:translate-x-0.5 transition-transform duration-300"
            aria-hidden="true"
          >
            <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
