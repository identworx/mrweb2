"use client";

import Image from "next/image";
import type { FrontendFabricSwatch } from "@/lib/cms/fabric-library";

interface Props {
  swatch: FrontendFabricSwatch;
  onSelect?: (swatch: FrontendFabricSwatch) => void;
}

export default function FabricSwatchCard({ swatch, onSelect }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(swatch)}
      className="group text-left bg-white border border-black/[0.06] transition-all duration-500 motion-safe:hover:-translate-y-0.5 hover:border-black/[0.10] w-full"
    >
      <div className="aspect-square overflow-hidden bg-[#FAF8F5] relative">
        {swatch.swatchImageUrl ? (
          <Image
            src={swatch.swatchImageUrl}
            alt={`${swatch.name} Stoffmuster`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : swatch.colorHex ? (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: swatch.colorHex }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-anthracite/10 to-anthracite/5 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-anthracite/20"
            >
              <rect x="3" y="3" width="18" height="18" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="font-accent text-text-gray/50 text-[10px] tracking-[0.15em] uppercase mb-1">
          {swatch.familyName}
        </p>
        <h3 className="font-heading text-anthracite text-sm font-semibold leading-snug group-hover:text-pumpkin transition-colors duration-300">
          {swatch.name}
        </h3>
        {swatch.articleNumber && (
          <p className="font-accent text-text-gray/40 text-[10px] tracking-wider uppercase mt-0.5">
            Art. {swatch.articleNumber}
          </p>
        )}

        {swatch.availableProductTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {swatch.availableProductTypes.slice(0, 5).map((pt) => (
              <span
                key={pt.slug}
                className="font-accent text-[9px] tracking-[0.06em] uppercase px-1.5 py-0.5 bg-[#FAF8F5] text-text-gray/60 border border-black/[0.04]"
              >
                {pt.name}
              </span>
            ))}
            {swatch.availableProductTypes.length > 5 && (
              <span className="font-accent text-[9px] tracking-[0.06em] uppercase px-1.5 py-0.5 text-pumpkin/60">
                +{swatch.availableProductTypes.length - 5}
              </span>
            )}
          </div>
        )}

        <span className="inline-flex items-center gap-1.5 text-pumpkin/60 group-hover:text-pumpkin transition-colors duration-300 mt-3 pt-3 border-t border-black/[0.04]">
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
    </button>
  );
}
