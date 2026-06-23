import type { ResolvedIcon } from "@/lib/cms/icons";
import Link from "next/link";
import ProductImageFrame from "./products/ProductImageFrame";
import CmsIcon from "@/components/cms/CmsIcon";
import type { FrontendProduct } from "@/lib/cms/products";

interface CollectionProductCardProps {
  product: FrontendProduct;
  collectionColors: string[];
  icons?: Record<string, ResolvedIcon>;
}

export default function CollectionProductCard({
  product,
  collectionColors,
  icons = {},
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
        collectionSlug={product.collectionSlug}
        productName={product.name}
      />

      <div className="flex flex-col flex-1 p-4 md:p-5">
        <p className="font-accent text-text-muted text-[10px] tracking-[0.15em] uppercase">
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
            <p className="font-accent text-text-muted text-[10px] tracking-wider uppercase">
              Art. {product.code}
            </p>
          )}
        </div>

        <span className="inline-flex items-center gap-1.5 text-anthracite group-hover:text-pumpkin transition-colors duration-300 mt-3 pt-3 border-t border-black/[0.04]">
          <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em]">
            Details
          </span>
          <CmsIcon icon={icons["arrow-right"]} width={12} height={12} className="text-pumpkin motion-safe:group-hover:translate-x-0.5 transition-transform duration-300" />
        </span>
      </div>
    </Link>
  );
}
