"use client";

import { useState, useMemo, useCallback } from "react";
import type {
  FabricLibraryData,
  FrontendFabricSwatch,
} from "@/lib/cms/fabric-library";
import FabricSwatchCard from "./FabricSwatchCard";
import FabricMatrixView from "./FabricMatrixView";
import FabricDetailDrawer from "./FabricDetailDrawer";

type ViewMode = "grid" | "matrix";

interface Props {
  data: FabricLibraryData;
  initialFamily?: string;
}

export default function FabricLibrary({ data, initialFamily }: Props) {
  const { families, swatches, productTypes } = data;

  const resolvedInitial =
    initialFamily && families.some((f) => f.slug === initialFamily)
      ? initialFamily
      : "all";
  const [activeFamily, setActiveFamily] = useState<string>(resolvedInitial);
  const [activeProductFilter, setActiveProductFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedSwatch, setSelectedSwatch] =
    useState<FrontendFabricSwatch | null>(null);

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

  const clearFilters = useCallback(() => {
    setActiveFamily("all");
    setActiveProductFilter("");
    setSearch("");
  }, []);

  const hasActiveFilters =
    activeFamily !== "all" || activeProductFilter !== "" || search.trim() !== "";

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
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveFamily("all")}
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
            onClick={() => setActiveFamily(f.slug)}
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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-anthracite/30"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Stoff suchen (Name, Artikelnummer…)"
            className="w-full pl-10 pr-4 py-2.5 border border-anthracite/15 bg-white font-body text-sm text-anthracite placeholder:text-anthracite/30 focus:outline-none focus:border-anthracite/30 transition-colors"
          />
        </div>

        <select
          value={activeProductFilter}
          onChange={(e) => setActiveProductFilter(e.target.value)}
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
              <line x1="8" y1="3" x2="8" y2="21" />
            </svg>
          </button>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="font-accent text-text-gray/50 text-[11px] tracking-[0.1em] uppercase">
          {filtered.length} {filtered.length === 1 ? "Stoff" : "Stoffe"}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((swatch) => (
            <FabricSwatchCard
              key={swatch.id}
              swatch={swatch}
              onSelect={setSelectedSwatch}
            />
          ))}
        </div>
      ) : (
        <FabricMatrixView
          swatches={filtered}
          productTypes={productTypes}
          onSelectSwatch={setSelectedSwatch}
        />
      )}

      {/* Detail Drawer */}
      <FabricDetailDrawer
        swatch={selectedSwatch}
        onClose={() => setSelectedSwatch(null)}
      />
    </div>
  );
}
