"use client";

import Image from "next/image";
import Link from "next/link";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

interface Props {
  swatches: Array<{
    id: string;
    slug: string;
    name: string;
    articleNumber: string;
    familyName: string;
    swatchImageUrl: string;
    colorHex: string;
  }>;
  icons?: Record<string, ResolvedIcon>;
}

export default function FabricLibraryPreview({ swatches, icons = {} }: Props) {
  const visible = swatches.slice(0, 6);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((swatch) => (
          <Link
            key={swatch.id}
            href="/materialien/stoffe-muster"
            className="group bg-white border border-black/[0.06] transition-all duration-500 motion-safe:hover:-translate-y-0.5 hover:border-black/[0.10]"
          >
            <div className="aspect-square overflow-hidden bg-[#FAF8F5] relative">
              {swatch.swatchImageUrl ? (
                <Image
                  src={swatch.swatchImageUrl}
                  alt={`${swatch.name} Stoffmuster`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : swatch.colorHex ? (
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: swatch.colorHex }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-anthracite/10 to-anthracite/5" />
              )}
            </div>

            <div className="p-4">
              <p className="font-accent text-pumpkin text-[10px] tracking-[0.15em] uppercase mb-1">
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
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/materialien/stoffe-muster"
          className="inline-flex items-center gap-2 font-heading text-pumpkin text-xs font-semibold uppercase tracking-[0.12em] hover:text-anthracite transition-colors duration-300"
        >
          <span>Alle Stoffe & Muster ansehen</span>
          <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="motion-safe:group-hover:translate-x-0.5 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}
