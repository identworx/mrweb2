"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { FrontendFabricSwatch } from "@/lib/cms/fabric-library";

interface Props {
  swatch: FrontendFabricSwatch | null;
  onClose: () => void;
}

export default function FabricDetailDrawer({ swatch, onClose }: Props) {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!swatch) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [swatch, onClose]);

  useEffect(() => {
    if (swatch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [swatch]);

  if (!swatch) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={drawerRef}
        className="relative w-full max-w-lg bg-white overflow-y-auto animate-[slide-in-right_300ms_ease-out]"
        role="dialog"
        aria-label={`${swatch.name} Details`}
      >
        <button
          onClick={onClose}
          className="sticky top-0 right-0 z-10 float-right m-4 w-10 h-10 flex items-center justify-center bg-anthracite/5 hover:bg-anthracite/10 text-anthracite/60 transition-colors"
          aria-label="Schließen"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="aspect-square bg-[#FAF8F5] overflow-hidden">
          {swatch.swatchImageUrl ? (
            <Image
              src={swatch.swatchImageUrl}
              alt={`${swatch.name} Stoffmuster`}
              width={600}
              height={600}
              className="w-full h-full object-cover"
              priority
            />
          ) : swatch.colorHex ? (
            <div
              className="w-full h-full"
              style={{ backgroundColor: swatch.colorHex }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-anthracite/10 to-anthracite/5" />
          )}
        </div>

        <div className="p-6 md:p-8">
          <p className="font-accent text-pumpkin text-[10px] tracking-[0.2em] uppercase mb-2">
            {swatch.familyName}
          </p>

          <h2 className="font-heading text-anthracite text-xl md:text-2xl font-bold leading-tight">
            {swatch.name}
          </h2>

          {swatch.articleNumber && (
            <p className="font-accent text-text-gray/50 text-xs tracking-wider uppercase mt-1">
              Art. {swatch.articleNumber}
            </p>
          )}

          {(swatch.patternType || swatch.subtitle) && (
            <div className="mt-4 space-y-1">
              {swatch.patternType && (
                <p className="font-body text-text-gray text-sm">
                  <span className="font-heading text-[10px] font-semibold uppercase tracking-[0.1em] text-text-gray/60 mr-2">
                    Typ
                  </span>
                  {swatch.patternType}
                </p>
              )}
              {swatch.subtitle && (
                <p className="font-body text-text-gray text-sm">{swatch.subtitle}</p>
              )}
            </div>
          )}

          {swatch.description && (
            <p className="font-body text-text-gray text-sm leading-relaxed mt-4">
              {swatch.description}
            </p>
          )}

          {swatch.availableProductTypes.length > 0 && (
            <div className="mt-6 pt-6 border-t border-black/[0.06]">
              <p className="font-heading text-[10px] font-semibold uppercase tracking-[0.15em] text-anthracite/60 mb-3">
                Verfügbar als
              </p>
              <div className="space-y-2">
                {swatch.availableProductTypes.map((pt) => (
                  <div
                    key={pt.slug}
                    className="flex items-center justify-between p-3 bg-[#FAF8F5] border border-black/[0.04]"
                  >
                    <span className="font-body text-anthracite text-sm">
                      {pt.name}
                    </span>
                    {pt.note && (
                      <span className="font-accent text-text-gray/50 text-[10px] tracking-wider uppercase">
                        {pt.note}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 space-y-3">
            <Link
              href="/kontakt"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-pumpkin text-white font-heading text-sm font-semibold uppercase tracking-[0.08em] hover:bg-pumpkin/90 transition-colors duration-300"
            >
              Muster anfragen
            </Link>
            <Link
              href="/kataloge"
              className="flex items-center justify-center gap-2 w-full py-3.5 border border-anthracite/20 text-anthracite font-heading text-sm font-semibold uppercase tracking-[0.08em] hover:border-anthracite/40 transition-colors duration-300"
            >
              Katalog ansehen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
