"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

interface PatternColor {
  name: string;
  hex: string;
}

interface CategoryIcon {
  categorySlug: string;
  categoryName: string;
  iconUrl?: string;
}

interface Props {
  name: string;
  thumbnailUrl?: string;
  colors: PatternColor[];
  availableCategories?: string[];
  categoryIcons: CategoryIcon[];
  icons?: Record<string, ResolvedIcon>;
}

export default function FabricPatternCard({
  name,
  thumbnailUrl,
  colors,
  availableCategories = [],
  categoryIcons,
  icons = {},
}: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const matchedCategories = categoryIcons.filter((c) =>
    availableCategories.includes(c.categorySlug),
  );

  return (
    <>
      <div style={{ perspective: "1000px" }}>
        <div
          className="relative motion-reduce:!transition-none"
          style={{
            transition: "transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="bg-cream"
            style={{ backfaceVisibility: "hidden" }}
          >
            {matchedCategories.length > 0 && (
              <button
                onClick={() => setIsFlipped(true)}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-pumpkin hover:text-white text-text-muted transition-all duration-300"
                aria-label="Verfügbare Produkte anzeigen"
              >
                <CmsIcon icon={icons["ui-flip"]} width={14} height={14} />
              </button>
            )}

            {thumbnailUrl ? (
              <button
                onClick={() => dialogRef.current?.showModal()}
                className="block w-full aspect-[4/3] overflow-hidden cursor-zoom-in"
              >
                <Image
                  src={thumbnailUrl}
                  alt={`${name} Stoffmuster`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-500 motion-safe:hover:scale-105"
                />
              </button>
            ) : (
              <div className="w-full aspect-[4/3] bg-light-gray flex items-center justify-center">
                <CmsIcon icon={icons["ui-image-placeholder"]} width={32} height={32} className="text-anthracite/20" />
              </div>
            )}

            <div className="p-4">
              <p className="font-heading text-anthracite text-sm font-semibold mb-3 leading-tight">
                {name}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {colors.map((color) => (
                  <div key={color.name} className="group/swatch relative">
                    <div
                      className="w-5 h-5 border border-black/10"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-anthracite text-white text-[10px] font-body whitespace-nowrap opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>
              <p className="font-accent text-text-muted text-[10px] tracking-[0.1em] uppercase mt-2">
                {colors.length} {colors.length === 1 ? "Farbe" : "Farben"}
                {matchedCategories.length > 0 && (
                  <span className="text-text-muted">
                    {" · "}
                    {matchedCategories.length}{" "}
                    {matchedCategories.length === 1 ? "Produkt" : "Produkte"}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-anthracite text-white flex flex-col"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <button
              onClick={() => setIsFlipped(false)}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/60 transition-all duration-300"
              aria-label="Zurück zur Vorderseite"
            >
              <CmsIcon icon={icons["ui-close"]} width={14} height={14} />
            </button>

            <div className="p-5 flex flex-col h-full">
              <p className="font-heading text-white text-sm font-semibold mb-1">
                {name}
              </p>
              <p className="font-accent text-white/70 text-[10px] tracking-[0.15em] uppercase mb-4">
                Verfügbar als
              </p>

              <div className="grid grid-cols-3 gap-2 flex-1 content-start">
                {matchedCategories.map((cat) => (
                  <Link
                    key={cat.categorySlug}
                    href={`/produktkategorien/${cat.categorySlug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-col items-center gap-1.5 p-2 bg-white/5 hover:bg-white/10 transition-colors duration-300"
                  >
                    {cat.iconUrl ? (
                      <Image
                        src={cat.iconUrl}
                        alt={cat.categoryName}
                        width={32}
                        height={32}
                        className="w-8 h-8 object-contain invert opacity-70"
                      />
                    ) : (
                      <CmsIcon icon={icons[`category-${cat.categorySlug}`] ?? icons["category-default"]} width={32} height={32} className="w-8 h-8 text-white/70" />
                    )}
                    <span className="font-accent text-white/70 text-[9px] tracking-[0.05em] uppercase text-center leading-tight">
                      {cat.categoryName}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {thumbnailUrl && (
        <dialog
          ref={dialogRef}
          onClick={() => dialogRef.current?.close()}
          className="backdrop:bg-black/80 bg-transparent p-0 max-w-[90vw] max-h-[90vh] open:animate-[fade-in_200ms_ease-out]"
        >
          <button
            onClick={() => dialogRef.current?.close()}
            className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white transition-colors"
            aria-label="Schließen"
          >
            <CmsIcon icon={icons["ui-close"]} width={16} height={16} />
          </button>
          <Image
            src={thumbnailUrl}
            alt={`${name} Stoffmuster — Großansicht`}
            width={800}
            height={600}
            className="w-auto h-auto max-w-full max-h-[85vh] object-contain"
          />
        </dialog>
      )}
    </>
  );
}

