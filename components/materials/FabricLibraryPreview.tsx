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
  limit?: number;
}

export default function FabricLibraryPreview({ swatches, icons = {}, limit = 10 }: Props) {
  const visible = swatches.slice(0, limit);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
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
                  className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
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

            <div className="p-3">
              <p className="font-accent text-pumpkin text-[10px] tracking-[0.15em] uppercase mb-0.5">
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
