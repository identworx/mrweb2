"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DangerZone from "./DangerZone";
import MediaPickerField from "./MediaPickerField";

interface DownloadData {
  id: string;
  title: string;
  description: string;
  type: string;
  fileUrl: string;
  externalUrl: string;
  language: string;
  imageId: string;
  buttonLabel: string;
  opensInNewTab: boolean;
  order: number;
}

interface MediaOption {
  id: string;
  filename: string;
  url: string;
  alt: string | null;
}

export default function DownloadEditForm({
  download,
  mediaAssets,
  userRole = "VIEWER",
  isActive = true,
}: {
  download: DownloadData;
  mediaAssets: MediaOption[];
  userRole?: string;
  isActive?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<DownloadData>(download);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function updateString(field: keyof DownloadData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateNumber(field: keyof DownloadData, value: number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateBoolean(field: keyof DownloadData, value: boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Speichern");
      }

      const saved = await res.json();
      setMessage({ type: "success", text: "Download erfolgreich gespeichert." });

      if (!download.id) {
        router.push(`/admin/downloads/${saved.id}`);
      } else {
        router.refresh();
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

  const imagePreview = mediaAssets.find((m) => m.id === form.imageId);

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

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Allgemein</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateString("title", e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
            <input
              type="text"
              value={form.type}
              onChange={(e) => updateString("type", e.target.value)}
              placeholder="z.B. PDF, Katalog"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sprache</label>
            <input
              type="text"
              value={form.language}
              onChange={(e) => updateString("language", e.target.value)}
              placeholder="z.B. de, en"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reihenfolge</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => updateNumber("order", parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
          <textarea
            value={form.description}
            onChange={(e) => updateString("description", e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Links &amp; Medien</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Datei-URL</label>
            <input
              type="text"
              value={form.fileUrl}
              onChange={(e) => updateString("fileUrl", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Externe URL</label>
            <input
              type="text"
              value={form.externalUrl}
              onChange={(e) => updateString("externalUrl", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <MediaPickerField
            label="Bild"
            value={form.imageId}
            onChange={(id) => updateString("imageId", id)}
            previewUrl={imagePreview?.url}
            previewAlt={imagePreview?.alt}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button-Label</label>
            <input
              type="text"
              value={form.buttonLabel}
              onChange={(e) => updateString("buttonLabel", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="opensInNewTab"
            checked={form.opensInNewTab}
            onChange={(e) => updateBoolean("opensInNewTab", e.target.checked)}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          <label htmlFor="opensInNewTab" className="text-sm font-medium text-gray-700">
            In neuem Tab öffnen
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-5 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Speichert..." : "Speichern"}
        </button>
        <Link
          href="/admin/downloads"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </Link>
      </div>

      {form.id && (
        <DangerZone
          entityId={form.id}
          entityName={form.title || "Download"}
          apiEndpoint="/api/admin/downloads"
          redirectTo="/admin/downloads"
          deactivateAction={{ isActive }}
          deleteAction={{
            enabled: true,
          }}
          userRole={userRole}
        />
      )}
    </div>
  );
}
