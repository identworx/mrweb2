"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DangerZone from "./DangerZone";

interface MediaAssetData {
  id: string;
  filename: string;
  url: string;
  alt: string;
  caption: string;
  mimeType: string;
  size: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UsageEntry {
  model: string;
  count: number;
}

export default function MediaEditForm({
  asset,
  userRole = "VIEWER",
  mediaUsage = [],
}: {
  asset: MediaAssetData | null;
  userRole?: string;
  mediaUsage?: UsageEntry[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState(asset?.alt ?? "");
  const [caption, setCaption] = useState(asset?.caption ?? "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setMessage({ type: "error", text: "Datei darf maximal 15 MB groß sein." });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setMessage(null);

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      if (asset) {
        const res = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: asset.id, alt, caption }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Fehler beim Speichern");
        }

        setMessage({ type: "success", text: "Medium erfolgreich aktualisiert." });
        router.refresh();
      } else {
        if (!selectedFile) {
          setMessage({ type: "error", text: "Bitte eine Datei auswählen." });
          setSaving(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("alt", alt);
        formData.append("caption", caption);

        const res = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Fehler beim Hochladen");
        }

        const saved = await res.json();
        setMessage({ type: "success", text: "Medium erfolgreich hochgeladen." });
        router.push(`/admin/media/${saved.id}`);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Fehler beim Speichern",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {asset && asset.mimeType.startsWith("image/") && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vorschau</h2>
          <div className="max-w-md">
            <img
              src={asset.url}
              alt={asset.alt ?? asset.filename}
              className="rounded-lg border border-gray-200"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {asset.filename} ({formatFileSize(asset.size)})
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">
          {asset ? "Metadaten" : "Datei hochladen"}
        </h2>

        {!asset && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datei</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            <p className="text-xs text-gray-400 mt-1">
              Bilder (JPEG, PNG, GIF, WebP, AVIF). Maximal 15 MB. JPEG/PNG werden automatisch zu WebP optimiert.
            </p>
            {preview && (
              <div className="mt-3 max-w-xs">
                <img src={preview} alt="Vorschau" className="rounded-lg border border-gray-200" />
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Alt-Text</label>
          <input
            type="text"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bildunterschrift</label>
          <textarea
            rows={2}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-5 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Speichert..." : asset ? "Speichern" : "Hochladen"}
        </button>
        <Link
          href="/admin/media"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </Link>
      </div>

      {asset && (
        <>
          {mediaUsage.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800">
              <p className="font-medium mb-1">Dieses Medium wird verwendet in:</p>
              <ul className="space-y-0.5">
                {mediaUsage.map((u, i) => (
                  <li key={i}>• {u.model}: {u.count}x</li>
                ))}
              </ul>
            </div>
          )}
          <DangerZone
            entityId={asset.id}
            entityName={asset.filename}
            apiEndpoint="/api/admin/media"
            redirectTo="/admin/media"
            deleteAction={{
              enabled: mediaUsage.length === 0,
              disabledReason: mediaUsage.length > 0
                ? "Medium wird noch verwendet. Bitte zuerst alle Verknüpfungen entfernen."
                : undefined,
            }}
            userRole={userRole}
          />
        </>
      )}
    </div>
  );
}
