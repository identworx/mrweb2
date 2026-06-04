import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/mosaroma/products";

const categoryTitles: Record<string, string> = {
  dekokissen: "Dekokissen",
  hochlehner: "Hochlehner",
  niedriglehner: "Niedriglehner",
  sitzkissen: "Sitzkissen",
  sitzpolster: "Sitzpolster",
  bankauflagen: "Bankauflage",
  poufs: "Pouf",
  "tischsets-tischlaeufer": "Tischset & Tischläufer",
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

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produkte/${product.slug}`}
      className="group block bg-cream transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-light-gray overflow-hidden">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          className="object-cover img-zoom"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <p className="font-accent text-text-gray/40 text-[10px] tracking-[0.15em] uppercase">
          {collectionNames[product.collectionSlug] ?? product.collectionSlug} ·{" "}
          {categoryTitles[product.categorySlug] ?? product.categorySlug}
        </p>

        <h3 className="font-heading text-anthracite text-sm md:text-base font-bold leading-snug mt-1.5 group-hover:text-pumpkin transition-colors duration-300">
          {product.name}
        </h3>

        <div className="mt-2.5 space-y-1">
          <p className="font-body text-text-gray text-xs">
            {product.material}
          </p>
          {product.size && (
            <p className="font-body text-text-gray text-xs">{product.size}</p>
          )}
          {product.code && (
            <p className="font-accent text-text-gray/50 text-[10px] tracking-wider uppercase">
              Art. {product.code}
            </p>
          )}
        </div>

        {product.features && product.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {product.features.map((feature) => (
              <span
                key={feature}
                className="font-accent text-[9px] tracking-[0.08em] uppercase px-2 py-0.5 border border-pumpkin/20 text-pumpkin/60 bg-pumpkin/5"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        <span className="inline-flex items-center gap-2 text-pumpkin mt-3">
          <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em]">
            Produkt ansehen
          </span>
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            className="group-hover:translate-x-1 transition-transform duration-300"
          >
            <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
