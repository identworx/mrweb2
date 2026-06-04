import type { Product } from "@/lib/mosaroma/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-cream p-5 md:p-6 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(0,0,0,0.05)]">
      <p className="font-heading text-anthracite text-sm md:text-base font-bold leading-snug">
        {product.name}
      </p>

      <div className="mt-3 space-y-1.5">
        <p className="font-body text-text-gray text-xs md:text-sm">
          {product.material}
        </p>
        <p className="font-body text-text-gray text-xs md:text-sm">
          {product.size}
        </p>
        {product.code && (
          <p className="font-accent text-text-gray/60 text-[11px] tracking-wider uppercase">
            Art. {product.code}
          </p>
        )}
      </div>

      {product.features && product.features.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {product.features.map((feature) => (
            <span
              key={feature}
              className="font-accent text-[10px] tracking-[0.08em] uppercase px-2.5 py-1 border border-pumpkin/25 text-pumpkin/70 bg-pumpkin/5"
            >
              {feature}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
