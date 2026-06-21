"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import type { FrontendAmbienteImage } from "@/lib/cms/ambiente";

const FILTER_OPTIONS = [
  { value: "all", label: "Alle" },
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "earth", label: "Earth & Grey" },
  { value: "golden", label: "Golden" },
];

interface Props {
  images: FrontendAmbienteImage[];
}

export default function AmbienteGalleryClient({ images }: Props) {
  const [filter, setFilter] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const filtered =
    filter === "all"
      ? images
      : images.filter((img) => img.colorWorlds.includes(filter));

  const counts = FILTER_OPTIONS.map((opt) => ({
    ...opt,
    count:
      opt.value === "all"
        ? images.length
        : images.filter((img) => img.colorWorlds.includes(opt.value)).length,
  }));

  const openLightbox = useCallback((index: number, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    triggerRef.current?.focus();
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % filtered.length : null,
    );
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + filtered.length) % filtered.length : null,
    );
  }, [filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  const currentImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <>
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-10 md:mb-14">
        {counts.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 text-sm font-heading font-semibold tracking-wide transition-colors duration-200 ${
              filter === opt.value
                ? "bg-anthracite text-white"
                : "bg-white text-anthracite border border-black/10 hover:border-anthracite/30"
            }`}
          >
            {opt.label}
            <span className="ml-1.5 text-xs opacity-60">{opt.count}</span>
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <p className="font-body text-text-gray text-base py-12 text-center">
          Keine Bilder in dieser Farbwelt vorhanden.
        </p>
      ) : (
        <div
          className="gap-3 md:gap-4"
          style={{
            columns: "1",
            columnGap: "1rem",
          }}
        >
          <style>{`
            @media (min-width: 640px) { .amb-masonry { columns: 2 !important; } }
            @media (min-width: 1024px) { .amb-masonry { columns: 3 !important; } }
          `}</style>
          <div className="amb-masonry" style={{ columns: "1" }}>
            {filtered.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={(e) => openLightbox(i, e.currentTarget)}
                className="group relative w-full mb-3 md:mb-4 break-inside-avoid block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pumpkin overflow-hidden"
                style={{ breakInside: "avoid" }}
              >
                <Image
                  src={img.imageUrl}
                  alt={img.alt || img.title}
                  width={img.width || 800}
                  height={img.height || 600}
                  className="w-full h-auto object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading={i < 3 ? "eager" : "lazy"}
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 40%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 motion-reduce:translate-y-0 motion-reduce:opacity-100">
                  {img.colorWorlds.length > 0 && (
                    <p className="font-accent text-pumpkin text-[10px] tracking-[0.2em] uppercase mb-1">
                      {img.colorWorlds
                        .map((w) => FILTER_OPTIONS.find((f) => f.value === w)?.label || w)
                        .join(" · ")}
                    </p>
                  )}
                  <p className="font-heading text-white text-sm font-semibold">
                    {img.caption || img.title}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {currentImage && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={currentImage.title}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-pumpkin"
            aria-label="Schließen"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 font-accent text-white/50 text-xs tracking-wider">
            {lightboxIndex + 1} / {filtered.length}
          </div>

          {/* Prev */}
          {filtered.length > 1 && (
            <button
              onClick={goPrev}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-pumpkin"
              aria-label="Vorheriges Bild"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center">
            <Image
              src={currentImage.imageUrl}
              alt={currentImage.alt || currentImage.title}
              width={currentImage.width || 1500}
              height={currentImage.height || 1000}
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next */}
          {filtered.length > 1 && (
            <button
              onClick={goNext}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-pumpkin"
              aria-label="Nächstes Bild"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}

          {/* Caption */}
          {(currentImage.caption || currentImage.title) && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center max-w-lg px-4">
              <p className="font-heading text-white text-sm md:text-base font-medium">
                {currentImage.caption || currentImage.title}
              </p>
              {currentImage.colorWorlds.length > 0 && (
                <p className="font-accent text-pumpkin/70 text-[10px] tracking-[0.2em] uppercase mt-1">
                  {currentImage.colorWorlds
                    .map((w) => FILTER_OPTIONS.find((f) => f.value === w)?.label || w)
                    .join(" · ")}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
