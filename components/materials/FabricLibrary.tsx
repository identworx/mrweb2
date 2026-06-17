"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import type {
  FabricLibraryData,
  FrontendFabricSwatch,
} from "@/lib/cms/fabric-library";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import FabricSwatchCard from "./FabricSwatchCard";
import FabricMatrixView from "./FabricMatrixView";
import FabricDetailDrawer from "./FabricDetailDrawer";

type ViewMode = "grid" | "matrix";
const PAGE_SIZE = 24;

interface Props {
  data: FabricLibraryData;
  initialFamily?: string;
  icons?: Record<string, ResolvedIcon>;
}

export default function FabricLibrary({ data, initialFamily, icons = {} }: Props) {
  const { families, swatches, productTypes } = data;

  const resolvedInitial =
    initialFamily && families.some((f) => f.slug === initialFamily)
      ? initialFamily
      : "all";
  const [activeFamily, setActiveFamily] = useState<string>(resolvedInitial);
  const [activeProductFilter, setActiveProductFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedSwatch, setSelectedSwatch] =
    useState<FrontendFabricSwatch | null>(null);

  const controlsRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const el = controlsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const filtered = useMemo(() => {
    let result = swatches;

    if (activeFamily !== "all") {
      result = result.filter((s) => s.familySlug === activeFamily);
    }

    if (activeProductFilter) {
      result = result.filter((s) =>
        s.availableProductTypes.some((pt) => pt.slug === activeProductFilter),
      );
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.articleNumber.toLowerCase().includes(q) ||
          s.familyName.toLowerCase().includes(q) ||
          s.patternType.toLowerCase().includes(q),
      );
    }

    return result;
  }, [swatches, activeFamily, activeProductFilter, search]);

  const visibleSwatches = useMemo(
    () => (viewMode === "grid" ? filtered.slice(0, visibleCount) : filtered),
    [filtered, visibleCount, viewMode],
  );

  const hasMore = viewMode === "grid" && visibleCount < filtered.length;

  const handleFamilyChange = useCallback((slug: string) => {
    setActiveFamily(slug);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFamily("all");
    setActiveProductFilter("");
    setSearch("");
    setVisibleCount(PAGE_SIZE);
  }, []);

  const hasActiveFilters =
    activeFamily !== "all" || activeProductFilter !== "" || search.trim() !== "";

  const activeDesc = useMemo(() => {
    if (activeFamily === "all") return null;
    return families.find((f) => f.slug === activeFamily);
  }, [activeFamily, families]);

  if (swatches.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-body text-text-gray/60 text-base">
          Noch keine Stoffe in der Bibliothek vorhanden.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Sentinel for sticky detection */}
      <div ref={controlsRef} className="h-0" aria-hidden="true" />

      {/* Sticky controls */}
      <div
        className={`sticky top-0 z-30 transition-shadow duration-300 -mx-5 md:-mx-10 px-5 md:px-10 pb-4 pt-2 ${
          isSticky
            ? "bg-white/95 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            : "bg-white"
        }`}
      >
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleFamilyChange("all")}
            className={`font-heading text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2 border transition-colors duration-200 ${
              activeFamily === "all"
                ? "bg-anthracite text-white border-anthracite"
                : "bg-white text-anthracite border-anthracite/15 hover:border-anthracite/30"
            }`}
          >
            Alle
          </button>
          {families.map((f) => (
            <button
              key={f.slug}
              type="button"
              onClick={() => handleFamilyChange(f.slug)}
              className={`font-heading text-xs font-semibold uppercase tracking-[0.1em] px-4 py-2 border transition-colors duration-200 ${
                activeFamily === f.slug
                  ? "bg-anthracite text-white border-anthracite"
                  : "bg-white text-anthracite border-anthracite/15 hover:border-anthracite/30"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Search + Filter + View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-anthracite/30">
              <CmsIcon icon={icons["ui-search"]} width={16} height={16} />
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Stoff suchen (Name, Artikelnummer…)"
              className="w-full pl-10 pr-4 py-2.5 border border-anthracite/15 bg-white font-body text-sm text-anthracite placeholder:text-anthracite/30 focus:outline-none focus:border-anthracite/30 transition-colors"
            />
          </div>

          <select
            value={activeProductFilter}
            onChange={(e) => {
              setActiveProductFilter(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            className="border border-anthracite/15 bg-white px-3 py-2.5 font-body text-sm text-anthracite focus:outline-none focus:border-anthracite/30 transition-colors"
          >
            <option value="">Alle Produktarten</option>
            {productTypes.map((pt) => (
              <option key={pt.slug} value={pt.slug}>
                {pt.name}
              </option>
            ))}
          </select>

          <div className="flex border border-anthracite/15">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 transition-colors duration-200 ${
                viewMode === "grid"
                  ? "bg-anthracite text-white"
                  : "bg-white text-anthracite/50 hover:text-anthracite"
              }`}
              aria-label="Kachelansicht"
            >
              <CmsIcon icon={icons["ui-grid"]} width={18} height={18} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`px-3 py-2 border-l border-anthracite/15 transition-colors duration-200 ${
                viewMode === "matrix"
                  ? "bg-anthracite text-white"
                  : "bg-white text-anthracite/50 hover:text-anthracite"
              }`}
              aria-label="Matrixansicht"
            >
              <CmsIcon icon={icons["ui-matrix"]} width={18} height={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Family context */}
      {activeDesc && (
        <div className="mb-6 mt-2">
          {activeDesc.description && (
            <p className="font-body text-text-gray/70 text-sm leading-relaxed max-w-2xl">
              {activeDesc.description}
            </p>
          )}
          {activeFamily === "nerio" && (
            <Link
              href="/nerio"
              className="inline-flex items-center gap-1.5 mt-3 font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-pumpkin hover:text-pumpkin/80 transition-colors duration-200"
            >
              Mehr zur NERIO Materialstory
              <CmsIcon icon={icons["arrow-right"]} width={12} height={12} />
            </Link>
          )}
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-accent text-text-gray/50 text-[11px] tracking-[0.1em] uppercase">
          {filtered.length} {filtered.length === 1 ? "Stoff" : "Stoffe"}
          {viewMode === "grid" && filtered.length > visibleCount && (
            <span className="text-text-gray/30">
              {" "}· {visibleCount} angezeigt
            </span>
          )}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="font-accent text-pumpkin/70 hover:text-pumpkin text-[11px] tracking-[0.1em] uppercase transition-colors duration-200"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-[#FAF8F5] border border-black/[0.04]">
          <p className="font-body text-text-gray/60 text-sm">
            Keine Stoffe gefunden.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="font-heading text-pumpkin text-xs font-semibold uppercase tracking-[0.1em] mt-3 hover:text-pumpkin/80 transition-colors"
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleSwatches.map((swatch) => (
              <FabricSwatchCard
                key={swatch.id}
                swatch={swatch}
                onSelect={setSelectedSwatch}
                icons={icons}
              />
            ))}
          </div>
          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="font-heading text-sm font-semibold uppercase tracking-[0.08em] px-8 py-3 border border-anthracite/20 text-anthracite hover:border-anthracite/40 transition-colors duration-300"
              >
                Mehr anzeigen ({Math.min(PAGE_SIZE, filtered.length - visibleCount)} weitere)
              </button>
            </div>
          )}
        </>
      ) : (
        <FabricMatrixView
          swatches={filtered}
          productTypes={productTypes}
          onSelectSwatch={setSelectedSwatch}
          icons={icons}
        />
      )}

      {/* Detail Drawer */}
      <FabricDetailDrawer
        swatch={selectedSwatch}
        onClose={() => setSelectedSwatch(null)}
        icons={icons}
      />
    </div>
  );
}
