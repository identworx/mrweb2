"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  alt: string | null;
  size: number;
}

interface Props {
  onSelect: (asset: {
    id: string;
    url: string;
    alt: string | null;
    filename: string;
  }) => void;
  onClose: () => void;
  currentId?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaPickerModal({
  onSelect,
  onClose,
  currentId,
}: Props) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(
    currentId || null,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadAssets = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      const url = `/api/admin/media${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        setAssets(await res.json());
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        loadAssets(search || undefined);
      },
      search ? 300 : 0,
    );
    return () => clearTimeout(timer);
  }, [search, loadAssets]);

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
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Hochladen");
      }
      const asset = await res.json();
      setSelectedId(asset.id);
      await loadAssets(search || undefined);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Fehler beim Hochladen",
      );
    } finally {
      setUploading(false);
    }
  }

  function handleConfirm() {
    const asset = assets.find((a) => a.id === selectedId);
    if (asset) {
      onSelect({
        id: asset.id,
        url: asset.url,
        alt: asset.alt,
        filename: asset.filename,
      });
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const selectedAsset = assets.find((a) => a.id === selectedId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Bild wählen</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suchen..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              autoFocus
            />
          </div>
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
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
          >
            {uploading ? "Lädt..." : "Hochladen"}
          </button>
        </div>

        {uploadError && (
          <div className="mx-6 mt-3 px-3 py-2 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {uploadError}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400">
              Laden...
            </div>
          ) : assets.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-sm text-gray-400">
              {search
                ? "Keine Ergebnisse gefunden."
                : "Keine Medien vorhanden."}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {assets.map((asset) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() =>
                    setSelectedId(asset.id === selectedId ? null : asset.id)
                  }
                  className={`relative border-2 rounded-lg overflow-hidden text-left transition-all ${
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
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-gray-700 truncate">
                      {asset.filename}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {formatFileSize(asset.size)}
                    </p>
                  </div>
                  {selectedId === asset.id && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg
                        width="12"
                        height="12"
                        fill="none"
                        stroke="white"
                        strokeWidth="2.5"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <p className="text-sm text-gray-500 truncate max-w-[50%]">
            {selectedAsset ? selectedAsset.filename : "Kein Bild gewählt"}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedId}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Übernehmen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
