import type { ResolvedIcon } from "@/lib/cms/icons";
import Link from "next/link";
import ProductImageFrame from "./products/ProductImageFrame";
import CmsIcon from "@/components/cms/CmsIcon";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routes";

interface ProductCardProps {
  slug: string;
  name: string;
  categorySlug: string;
  collectionSlug: string;
  material: string;
  size: string;
  code: string;
  features: string[];
  image: string;
  alt: string;
  collectionName?: string;
  productGroupName?: string;
}

const categoryTitles: Record<string, string> = {
  dekokissen: "Dekokissen",
  hochlehner: "Hochlehner",
  niedriglehner: "Niedriglehner",
  sitzkissen: "Sitzkissen",
  sitzpolster: "Sitzpolster",
  bankauflagen: "Bankauflage",
  poufs: "Pouf",
  "tischsets-tischlaeufer": "Tischset & Tischläufer",
  "tischsets-tischlaufer": "Tischset & Tischläufer",
  decken: "Decke",
};

const collectionNames: Record<string, string> = {
  green: "Green",
  blue: "Blue",
  red: "Red",
  golden: "Golden",
  "earth-grey": "Earth & Grey",
  "nerio-oceana": "NERIO · Oceana",
  basic: "Basic",
};

export default function ProductCard({ product, icons = {}, locale = "de" }: { product: ProductCardProps; icons?: Record<string, ResolvedIcon>; locale?: Locale }) {
  const displayCollection =
    product.collectionName || collectionNames[product.collectionSlug] || product.collectionSlug;
  const displayCategory =
    product.productGroupName || categoryTitles[product.categorySlug] || product.categorySlug;

  return (
    <Link
      href={localizedHref(`/produkte/${product.slug}`, locale)}
      className="group block bg-white border border-black/[0.06] transition-all duration-500 motion-safe:hover:-translate-y-0.5 hover:border-black/[0.10]"
    >
      <ProductImageFrame
        src={product.image}
        alt={product.alt}
        variant="card"
        collectionName={displayCollection}
        collectionSlug={product.collectionSlug}
        productName={product.name}
      />

      <div className="p-4 md:p-5">
        <p className="font-accent text-text-muted text-[10px] tracking-[0.15em] uppercase">
          {displayCollection} · {displayCategory}
        </p>

        <h3 className="font-heading text-anthracite text-sm md:text-base font-bold leading-snug mt-1.5 group-hover:text-pumpkin transition-colors duration-300">
          {product.name}
        </h3>

        <div className="mt-2.5 space-y-1">
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

        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {product.features.map((feature) => (
              <span
                key={feature}
                className="font-accent text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 border border-pumpkin/20 text-text-muted bg-pumpkin/5"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        <span className="inline-flex items-center gap-2 text-anthracite mt-3">
          <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em]">
            {locale === "en" ? "View product" : "Produkt ansehen"}
          </span>
          <CmsIcon icon={icons["arrow-right"]} width={12} height={12} className="text-pumpkin motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </div>
    </Link>
  );
}
