"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  code: string;
  colorName: string;
  patternName: string;
  status: string;
  collectionId: string;
  collectionName: string;
  productGroupId: string;
  productGroupName: string;
  materialId: string;
  materialName: string;
  mainImageUrl: string;
  galleryCount: number;
  updatedAt: string;
}

interface FilterOption {
  id: string;
  name: string;
}

interface Props {
  products: ProductRow[];
  collections: FilterOption[];
  productGroups: FilterOption[];
  materials: FilterOption[];
  userRole: string;
}

type SortKey = "name-asc" | "name-desc" | "updated" | "newest" | "code" | "collection" | "group";

const STATUS_OPTIONS = [
  { value: "all", label: "Alle" },
  { value: "PUBLISHED", label: "Veröffentlicht" },
  { value: "DRAFT", label: "Entwurf" },
  { value: "ARCHIVED", label: "Archiviert" },
];

const IMAGE_OPTIONS = [
  { value: "all", label: "Alle" },
  { value: "with-image", label: "Mit Hauptbild" },
  { value: "no-image", label: "Ohne Hauptbild" },
  { value: "with-gallery", label: "Mit Galerie" },
  { value: "no-gallery", label: "Ohne Galerie" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "updated", label: "Zuletzt geändert" },
  { value: "newest", label: "Neueste zuerst" },
  { value: "code", label: "Artikelnummer" },
  { value: "collection", label: "Kollektion" },
  { value: "group", label: "Produktgruppe" },
];

const PAGE_SIZES = [25, 50, 100];

const statusColors: Record<string, string> = {
  PUBLISHED: "bg-green-100 text-green-800",
  DRAFT: "bg-yellow-100 text-yellow-800",
  ARCHIVED: "bg-gray-100 text-gray-600",
};

export default function ProductAdminList({
  products,
  collections,
  productGroups,
  materials,
  userRole,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [collectionId, setCollectionId] = useState(searchParams.get("collection") || "all");
  const [groupId, setGroupId] = useState(searchParams.get("group") || "all");
  const [materialId, setMaterialId] = useState(searchParams.get("material") || "all");
  const [imageFilter, setImageFilter] = useState(searchParams.get("image") || "all");
  const [sort, setSort] = useState<SortKey>((searchParams.get("sort") as SortKey) || "name-asc");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [pageSize, setPageSize] = useState(Number(searchParams.get("pageSize")) || 50);

  const hasActiveFilters = query || status !== "all" || collectionId !== "all" || groupId !== "all" || materialId !== "all" || imageFilter !== "all";

  function resetFilters() {
    setQuery("");
    setStatus("all");
    setCollectionId("all");
    setGroupId("all");
    setMaterialId("all");
    setImageFilter("all");
    setSort("name-asc");
    setPage(1);
    router.replace("/admin/products", { scroll: false });
  }

  function updateUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams();
    const merged = {
      q: query,
      status,
      collection: collectionId,
      group: groupId,
      material: materialId,
      image: imageFilter,
      sort,
      page: String(page),
      pageSize: String(pageSize),
      ...overrides,
    };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "all" && v !== "1" && !(k === "pageSize" && v === "50") && !(k === "sort" && v === "name-asc")) {
        params.set(k, v);
      }
    }
    const qs = params.toString();
    router.replace(`/admin/products${qs ? `?${qs}` : ""}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    let result = products;

    if (q) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.colorName.toLowerCase().includes(q) ||
        p.patternName.toLowerCase().includes(q) ||
        p.collectionName.toLowerCase().includes(q) ||
        p.productGroupName.toLowerCase().includes(q) ||
        p.materialName.toLowerCase().includes(q)
      );
    }

    if (status !== "all") {
      result = result.filter((p) => p.status === status);
    }

    if (collectionId !== "all") {
      result = result.filter((p) => p.collectionId === collectionId);
    }

    if (groupId !== "all") {
      result = result.filter((p) => p.productGroupId === groupId);
    }

    if (materialId !== "all") {
      result = result.filter((p) => p.materialId === materialId);
    }

    if (imageFilter === "with-image") {
      result = result.filter((p) => p.mainImageUrl);
    } else if (imageFilter === "no-image") {
      result = result.filter((p) => !p.mainImageUrl);
    } else if (imageFilter === "with-gallery") {
      result = result.filter((p) => p.galleryCount > 0);
    } else if (imageFilter === "no-gallery") {
      result = result.filter((p) => p.galleryCount === 0);
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case "name-asc": return a.name.localeCompare(b.name, "de");
        case "name-desc": return b.name.localeCompare(a.name, "de");
        case "updated": return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "newest": return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "code": return (a.code || "").localeCompare(b.code || "", "de");
        case "collection": return a.collectionName.localeCompare(b.collectionName, "de");
        case "group": return a.productGroupName.localeCompare(b.productGroupName, "de");
        default: return 0;
      }
    });

    return result;
  }, [products, query, status, collectionId, groupId, materialId, imageFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function archiveProduct(id: string, currentStatus: string) {
    const newStatus = currentStatus === "ARCHIVED" ? "PUBLISHED" : "ARCHIVED";
    fetch(`/api/admin/products?id=${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).then(() => router.refresh());
  }

  function deleteProduct(id: string, name: string) {
    if (!confirm(`"${name}" endgültig löschen?`)) return;
    fetch(`/api/admin/products?id=${id}`, { method: "DELETE" })
      .then(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
              updateUrl({ q: e.target.value, page: "1" });
            }}
            placeholder="Suche: Name, Slug, Code, Farbe, Muster, Kollektion, Gruppe, Material..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <select
          value={sort}
          onChange={(e) => {
            const v = e.target.value as SortKey;
            setSort(v);
            updateUrl({ sort: v });
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex gap-1 flex-wrap">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setStatus(opt.value); setPage(1); updateUrl({ status: opt.value, page: "1" }); }}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                status === opt.value
                  ? "bg-orange-100 text-orange-800 border border-orange-200"
                  : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <span className="text-gray-300">|</span>

        <select
          value={collectionId}
          onChange={(e) => { setCollectionId(e.target.value); setPage(1); updateUrl({ collection: e.target.value, page: "1" }); }}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
            collectionId !== "all" ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-gray-50 text-gray-600 border-gray-200"
          }`}
        >
          <option value="all">Alle Kollektionen</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select
          value={groupId}
          onChange={(e) => { setGroupId(e.target.value); setPage(1); updateUrl({ group: e.target.value, page: "1" }); }}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
            groupId !== "all" ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-gray-50 text-gray-600 border-gray-200"
          }`}
        >
          <option value="all">Alle Produktgruppen</option>
          {productGroups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        <select
          value={materialId}
          onChange={(e) => { setMaterialId(e.target.value); setPage(1); updateUrl({ material: e.target.value, page: "1" }); }}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
            materialId !== "all" ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-gray-50 text-gray-600 border-gray-200"
          }`}
        >
          <option value="all">Alle Materialien</option>
          {materials.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        <select
          value={imageFilter}
          onChange={(e) => { setImageFilter(e.target.value); setPage(1); updateUrl({ image: e.target.value, page: "1" }); }}
          className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
            imageFilter !== "all" ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-gray-50 text-gray-600 border-gray-200"
          }`}
        >
          {IMAGE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-2.5 py-1 text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Results count + pagination controls */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          {filtered.length} {filtered.length === 1 ? "Produkt" : "Produkte"}
          {filtered.length !== products.length && ` von ${products.length}`}
        </span>
        <div className="flex items-center gap-3">
          <select
            value={pageSize}
            onChange={(e) => {
              const ps = Number(e.target.value);
              setPageSize(ps);
              setPage(1);
              updateUrl({ pageSize: String(ps), page: "1" });
            }}
            className="px-2 py-1 border border-gray-300 rounded text-xs"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>{s} pro Seite</option>
            ))}
          </select>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setPage(safePage - 1); updateUrl({ page: String(safePage - 1) }); }}
                disabled={safePage <= 1}
                className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-30 hover:bg-gray-50"
              >
                ←
              </button>
              <span className="text-xs px-2">{safePage} / {totalPages}</span>
              <button
                onClick={() => { setPage(safePage + 1); updateUrl({ page: String(safePage + 1) }); }}
                disabled={safePage >= totalPages}
                className="px-2 py-1 border border-gray-300 rounded text-xs disabled:opacity-30 hover:bg-gray-50"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">Bild</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kollektion</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gruppe</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Material</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bilder</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginated.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-400">
                  {hasActiveFilters ? "Keine Produkte für diese Filter gefunden." : "Keine Produkte vorhanden."}
                </td>
              </tr>
            )}
            {paginated.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5">
                  {p.mainImageUrl ? (
                    <img src={p.mainImageUrl} alt="" className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                      </svg>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <Link href={`/admin/products/${p.id}`} className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-colors">
                    {p.name}
                  </Link>
                  <p className="text-[11px] text-gray-400 mt-0.5">/{p.slug}</p>
                </td>
                <td className="px-3 py-2.5 text-sm text-gray-500">{p.code || "–"}</td>
                <td className="px-3 py-2.5 text-sm text-gray-500">{p.collectionName}</td>
                <td className="px-3 py-2.5 text-sm text-gray-500">{p.productGroupName}</td>
                <td className="px-3 py-2.5 text-sm text-gray-500">{p.materialName || "–"}</td>
                <td className="px-3 py-2.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${statusColors[p.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {p.status === "PUBLISHED" ? "Live" : p.status === "DRAFT" ? "Entwurf" : "Archiv"}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    {p.mainImageUrl ? (
                      <span className="w-2 h-2 rounded-full bg-green-400" title="Hauptbild vorhanden" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-red-300" title="Kein Hauptbild" />
                    )}
                    <span className="text-[11px] text-gray-400">
                      {p.galleryCount > 0 ? `${p.galleryCount} Gal.` : "–"}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${p.id}`} className="text-xs text-orange-600 hover:text-orange-700 font-medium">
                      Bearbeiten
                    </Link>
                    {p.status === "PUBLISHED" && (
                      <a href={`/produkte/${p.slug}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600">
                        ↗
                      </a>
                    )}
                    {userRole !== "VIEWER" && (
                      <button
                        onClick={() => archiveProduct(p.id, p.status)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                        title={p.status === "ARCHIVED" ? "Wiederherstellen" : "Archivieren"}
                      >
                        {p.status === "ARCHIVED" ? "↩" : "📦"}
                      </button>
                    )}
                    {userRole === "ADMIN" && (
                      <button
                        onClick={() => deleteProduct(p.id, p.name)}
                        className="text-xs text-red-400 hover:text-red-600"
                        title="Löschen"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-1">
          <button
            onClick={() => { setPage(safePage - 1); updateUrl({ page: String(safePage - 1) }); }}
            disabled={safePage <= 1}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs disabled:opacity-30 hover:bg-gray-50"
          >
            ← Zurück
          </button>
          <span className="px-3 py-1.5 text-xs text-gray-500">Seite {safePage} von {totalPages}</span>
          <button
            onClick={() => { setPage(safePage + 1); updateUrl({ page: String(safePage + 1) }); }}
            disabled={safePage >= totalPages}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs disabled:opacity-30 hover:bg-gray-50"
          >
            Weiter →
          </button>
        </div>
      )}
    </div>
  );
}
