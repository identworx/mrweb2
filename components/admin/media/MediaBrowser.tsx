"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import MediaDetailsPanel from "./MediaDetailsPanel";

interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  alt: string | null;
  folder: string | null;
  createdAt: string;
}

interface PaginatedResponse {
  items: MediaAsset[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  folders: string[];
  mimeTypes: string[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaBrowser({ userRole = "VIEWER" }: { userRole?: string }) {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [folderFilter, setFolderFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const limit = 24;

  const loadAssets = useCallback(async (p: number, q: string, type: string, folder: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(p));
      params.set("limit", String(limit));
      if (q) params.set("q", q);
      if (type) params.set("type", type);
      if (folder) params.set("folder", folder);

      const res = await fetch(`/api/admin/media?${params}`);
      if (!res.ok) throw new Error();
      const json: PaginatedResponse = await res.json();
      setData(json);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssets(page, search, typeFilter, folderFilter);
  }, [page, typeFilter, folderFilter, loadAssets, search]);

  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setPage(1);
    }, 300);
  }

  function resetFilters() {
    setSearch("");
    setTypeFilter("");
    setFolderFilter("");
    setPage(1);
  }

  async function handleUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Datei darf maximal 5 MB groß sein.");
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Fehler beim Hochladen");
      }
      const asset = await res.json();
      setSelectedId(asset.id);
      setPage(1);
      loadAssets(1, search, typeFilter, folderFilter);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Fehler beim Hochladen");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }

  const canUpload = userRole !== "VIEWER";
  const items = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const total = data?.total ?? 0;
  const folders = data?.folders ?? [];
  const hasFilters = search || typeFilter || folderFilter;

  return (
    <div className="flex gap-0 h-[calc(100vh-12rem)]">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex-1 min-w-[200px] relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Suchen..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Alle Typen</option>
            <option value="image">Bilder</option>
          </select>
          {folders.length > 0 && (
            <select
              value={folderFilter}
              onChange={(e) => { setFolderFilter(e.target.value); setPage(1); }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Alle Ordner</option>
              {folders.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          )}
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Zurücksetzen
            </button>
          )}
          {canUpload && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                  e.target.value = "";
                }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                {uploading ? "Lädt..." : "Hochladen"}
              </button>
            </>
          )}
        </div>

        {uploadError && (
          <div className="mb-3 px-3 py-2 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {uploadError}
          </div>
        )}

        <div
          className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white"
          onDragOver={(e) => { if (canUpload) e.preventDefault(); }}
          onDrop={canUpload ? handleDrop : undefined}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full text-sm text-gray-400">
              Laden...
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-sm text-gray-400 py-16">
              {hasFilters ? (
                <>
                  <p>Keine Ergebnisse gefunden.</p>
                  <button onClick={resetFilters} className="text-orange-600 hover:text-orange-700 mt-1 text-xs font-medium">
                    Filter zurücksetzen
                  </button>
                </>
              ) : (
                <>
                  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="text-gray-300 mb-3">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <p>Keine Medien vorhanden.</p>
                  {canUpload && (
                    <p className="text-xs mt-1">Bild hierher ziehen oder hochladen.</p>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {items.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSelectedId(selectedId === asset.id ? null : asset.id)}
                    className={`relative rounded-lg overflow-hidden text-left transition-all border-2 ${
                      selectedId === asset.id
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                      {asset.mimeType.startsWith("image/") ? (
                        <img
                          src={asset.url}
                          alt={asset.alt || asset.filename}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs font-medium">
                          {asset.mimeType.split("/")[1]?.toUpperCase() ?? "Datei"}
                        </span>
                      )}
                    </div>
                    <div className="px-2 py-1.5 bg-white">
                      <p className="text-xs text-gray-700 truncate">{asset.filename}</p>
                      <p className="text-[10px] text-gray-400">{formatFileSize(asset.size)}</p>
                    </div>
                    {selectedId === asset.id && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3 text-sm">
            <span className="text-gray-500">
              {total} Medien — Seite {page} von {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Zurück
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Weiter
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedId && (
        <div className="w-80 flex-shrink-0 ml-4">
          <MediaDetailsPanel
            key={selectedId}
            assetId={selectedId}
            onClose={() => setSelectedId(null)}
            onDeleted={() => {
              setSelectedId(null);
              loadAssets(page, search, typeFilter, folderFilter);
            }}
            onUpdated={() => {
              loadAssets(page, search, typeFilter, folderFilter);
            }}
            userRole={userRole}
            folders={folders}
          />
        </div>
      )}
    </div>
  );
}
