"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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
}

export default function FabricPatternCard({
  name,
  thumbnailUrl,
  colors,
  availableCategories = [],
  categoryIcons,
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
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 hover:bg-pumpkin hover:text-white text-anthracite/40 transition-all duration-300"
                aria-label="Verfügbare Produkte anzeigen"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 014-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 01-4 4H3" />
                </svg>
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
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </button>
            ) : (
              <div className="w-full aspect-[4/3] bg-light-gray flex items-center justify-center">
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
              <p className="font-accent text-text-gray/60 text-[10px] tracking-[0.1em] uppercase mt-2">
                {colors.length} {colors.length === 1 ? "Farbe" : "Farben"}
                {matchedCategories.length > 0 && (
                  <span className="text-text-gray/40">
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
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="p-5 flex flex-col h-full">
              <p className="font-heading text-white text-sm font-semibold mb-1">
                {name}
              </p>
              <p className="font-accent text-white/50 text-[10px] tracking-[0.15em] uppercase mb-4">
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
                      <CategoryPlaceholder slug={cat.categorySlug} />
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
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

function CategoryPlaceholder({ slug }: { slug: string }) {
  const cn = "w-8 h-8 text-white/50";

  switch (slug) {
    case "dekokissen":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn}>
          <rect x="4" y="8" width="24" height="16" rx="2" />
          <path d="M4 12c4-2 8-2 12 0s8 2 12 0" />
        </svg>
      );
    case "hochlehner":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn}>
          <rect x="8" y="2" width="16" height="28" rx="1" />
          <line x1="8" y1="20" x2="24" y2="20" />
        </svg>
      );
    case "niedriglehner":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn}>
          <rect x="8" y="8" width="16" height="22" rx="1" />
          <line x1="8" y1="20" x2="24" y2="20" />
        </svg>
      );
    case "sitzkissen":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn}>
          <rect x="4" y="12" width="24" height="10" rx="1" />
          <path d="M6 12v-2h20v2" />
        </svg>
      );
    case "sitzpolster":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn}>
          <rect x="4" y="14" width="24" height="6" rx="1" />
        </svg>
      );
    case "bankauflagen":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn}>
          <rect x="2" y="12" width="28" height="10" rx="1" />
          <path d="M8 12v-2M24 12v-2" />
        </svg>
      );
    case "poufs":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn}>
          <ellipse cx="16" cy="22" rx="12" ry="5" />
          <path d="M4 22V14c0-4 5.4-8 12-8s12 4 12 8v8" />
        </svg>
      );
    case "tischsets-tischlaeufer":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn}>
          <rect x="2" y="10" width="28" height="12" />
          <line x1="10" y1="10" x2="10" y2="22" strokeDasharray="2" />
          <line x1="22" y1="10" x2="22" y2="22" strokeDasharray="2" />
        </svg>
      );
    case "decken":
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn}>
          <path d="M6 6h20v20H6z" />
          <path d="M6 6l4 4M26 6l-4 4M6 26l4-4M26 26l-4-4" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.2" className={cn}>
          <rect x="4" y="4" width="24" height="24" />
        </svg>
      );
  }
}
