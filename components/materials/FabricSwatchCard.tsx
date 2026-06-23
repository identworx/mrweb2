"use client";

import Image from "next/image";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import type { FrontendFabricSwatch } from "@/lib/cms/fabric-library";

interface Props {
  swatch: FrontendFabricSwatch;
  onSelect?: (swatch: FrontendFabricSwatch) => void;
  icons?: Record<string, ResolvedIcon>;
}

export default function FabricSwatchCard({ swatch, onSelect, icons = {} }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect?.(swatch)}
      className="group text-left bg-white border border-black/[0.06] transition-all duration-500 motion-safe:hover:-translate-y-0.5 hover:border-black/[0.10] w-full h-full flex flex-col"
    >
      <div className="aspect-[4/3] overflow-hidden bg-[#FAF8F5] relative">
        {swatch.swatchImageUrl ? (
          <Image
            src={swatch.swatchImageUrl}
            alt={`${swatch.name} Stoffmuster`}
            fill
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
          />
        ) : swatch.colorHex ? (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: swatch.colorHex }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-anthracite/10 to-anthracite/5 flex items-center justify-center">
            <CmsIcon icon={icons["ui-image-placeholder"]} width={28} height={28} className="text-anthracite/20" />
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="font-accent text-text-muted text-[10px] tracking-[0.15em] uppercase mb-0.5">
          {swatch.familyName}
        </p>
        <h3 className="font-heading text-anthracite text-[13px] font-semibold leading-snug group-hover:text-pumpkin transition-colors duration-300">
          {swatch.name}
        </h3>
        {swatch.articleNumber && (
          <p className="font-accent text-text-muted text-[10px] tracking-wider uppercase mt-0.5">
            Art. {swatch.articleNumber}
          </p>
        )}

        <div className="min-h-[36px] mt-2">
          {swatch.availableProductTypes.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {swatch.availableProductTypes.slice(0, 5).map((pt) => (
                <span
                  key={pt.slug}
                  className="font-accent text-[9px] tracking-[0.06em] uppercase px-1.5 py-0.5 bg-[#FAF8F5] text-text-muted border border-black/[0.04]"
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
        </div>

        <span className="inline-flex items-center gap-1.5 text-pumpkin/60 group-hover:text-pumpkin transition-colors duration-300 mt-auto pt-2 border-t border-black/[0.04]">
          <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.12em]">
            Details
          </span>
          <CmsIcon icon={icons["arrow-right"]} width={12} height={12} className="motion-safe:group-hover:translate-x-0.5 transition-transform duration-300" />
        </span>
      </div>
    </button>
  );
}
