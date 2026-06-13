import Link from "next/link";
import ProductImageFrame from "./products/ProductImageFrame";
import type { FrontendProduct } from "@/lib/cms/products";

interface CollectionProductCardProps {
  product: FrontendProduct;
  collectionColors: string[];
}

export default function CollectionProductCard({
  product,
  collectionColors,
}: CollectionProductCardProps) {
  return (
    <Link
      href={`/produkte/${product.slug}`}
      className="group flex flex-col h-full bg-white border border-black/[0.06] transition-all duration-500 motion-safe:hover:-translate-y-0.5 hover:border-black/[0.10]"
    >
      <ProductImageFrame
        src={product.image}
        alt={product.alt}
        variant="card"
        collectionName={product.collectionName}
        collectionColors={collectionColors}
        productName={product.name}
      />

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
