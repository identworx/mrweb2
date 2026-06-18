"use client";

import { useState, useEffect, useCallback } from "react";
import MediaUsageList from "./MediaUsageList";

interface UsageEntry {
  model: string;
  count: number;
}

interface MediaFolder {
  id: string;
  name: string;
  slug: string;
  assetCount: number;
}

interface MediaAsset {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  alt: string | null;
  title: string | null;
  caption: string | null;
  folder: string | null;
  folderId: string | null;
  createdAt: string;
  usage?: UsageEntry[];
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MediaDetailsPanel({
  assetId,
  onClose,
  onDeleted,
  onUpdated,
  userRole = "VIEWER",
  folders = [],
}: {
  assetId: string;
  onClose: () => void;
  onDeleted?: () => void;
  onUpdated?: () => void;
  userRole?: string;
  folders?: MediaFolder[];
}) {
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [usage, setUsage] = useState<UsageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [folderId, setFolderId] = useState("");

  const loadAsset = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    setConfirmDelete(false);
    try {
      const res = await fetch(`/api/admin/media?id=${assetId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAsset(data);
      setUsage(data.usage ?? []);
      setAlt(data.alt ?? "");
      setTitle(data.title ?? "");
      setCaption(data.caption ?? "");
      setFolderId(data.folderId ?? "");
    } catch {
      setMessage({ type: "error", text: "Fehler beim Laden." });
    } finally {
      setLoading(false);
    }
  }, [assetId]);

  useEffect(() => {
    loadAsset();
  }, [loadAsset]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/media?id=${assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alt: alt || null,
          title: title || null,
          caption: caption || null,
          folderId: folderId || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler");
      }
      const updated = await res.json();
      setAsset((prev) => (prev ? { ...prev, ...updated } : prev));
      setMessage({ type: "success", text: "Gespeichert." });
      onUpdated?.();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Fehler" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/media?id=${assetId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Löschen");
      }
      onDeleted?.();
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Fehler" });
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  }

  const canEdit = userRole !== "VIEWER";
  const canDelete = userRole === "ADMIN";

  return (
    <div className="bg-white border-l border-gray-200 w-full h-full overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h3 className="text-sm font-semibold text-gray-900 truncate">Details</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          Laden...
        </div>
      ) : !asset ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">
          Medium nicht gefunden.
        </div>
      ) : (
        <div className="p-5 space-y-5">
          {message && (
            <div
              className={`px-3 py-2 rounded-lg text-xs ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          {asset.mimeType.startsWith("image/") && (
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
              <img
                src={asset.url}
                alt={asset.alt ?? asset.filename}
                className="w-full h-auto max-h-64 object-contain"
              />
            </div>
          )}

          <div className="space-y-1.5 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Dateiname</span>
              <span className="text-gray-700 font-medium truncate ml-2 max-w-[60%] text-right">{asset.filename}</span>
            </div>
            <div className="flex justify-between">
              <span>Original</span>
              <span className="text-gray-700 truncate ml-2 max-w-[60%] text-right">{asset.originalName}</span>
            </div>
            <div className="flex justify-between">
              <span>Typ</span>
              <span className="text-gray-700">{asset.mimeType}</span>
            </div>
            <div className="flex justify-between">
              <span>Größe</span>
              <span className="text-gray-700">{formatFileSize(asset.size)}</span>
            </div>
            {asset.width && asset.height && (
              <div className="flex justify-between">
                <span>Abmessungen</span>
                <span className="text-gray-700">{asset.width} × {asset.height} px</span>
              </div>
            )}
            {asset.mimeType === "image/webp" && asset.originalName && !/\.webp$/i.test(asset.originalName) && (
              <div className="flex justify-between">
                <span>Optimierung</span>
                <span className="text-green-600 font-medium">Als WebP optimiert</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Hochgeladen</span>
              <span className="text-gray-700">{formatDate(asset.createdAt)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>URL</span>
              <button
                onClick={() => navigator.clipboard.writeText(asset.url)}
                className="text-orange-600 hover:text-orange-700 font-medium"
                title="URL kopieren"
              >
                Kopieren
              </button>
            </div>
          </div>

          {canEdit && (
            <>
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Alt-Text</label>
                  <input
                    type="text"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Titel</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Bildunterschrift</label>
                  <textarea
                    rows={2}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Ordner</label>
                  <select
                    value={folderId}
                    onChange={(e) => setFolderId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Kein Ordner</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full inline-flex items-center justify-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {saving ? "Speichert..." : "Metadaten speichern"}
                </button>
              </div>
            </>
          )}

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-semibold text-gray-600 mb-2">Verwendung</h4>
            <MediaUsageList usage={usage} />
          </div>

          {canDelete && (
            <div className="border-t border-gray-100 pt-4">
              {usage.length > 0 ? (
                <p className="text-xs text-gray-400">
                  Löschen nicht möglich — Medium wird noch verwendet.
                </p>
              ) : confirmDelete ? (
                <div className="space-y-2">
                  <p className="text-xs text-red-600 font-medium">
                    Medium endgültig löschen?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {deleting ? "Löscht..." : "Ja, löschen"}
                    </button>
                    <button
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full px-3 py-1.5 text-red-600 text-xs font-medium rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
                >
                  Medium löschen
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
