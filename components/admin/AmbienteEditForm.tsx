"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DangerZone from "./DangerZone";
import MediaPickerField from "./MediaPickerField";

const AVAILABLE_WORLDS = [
  { value: "green", label: "Green" },
  { value: "blue", label: "Blue" },
  { value: "earth", label: "Earth & Grey" },
  { value: "golden", label: "Golden" },
];

const TEASER_SLOTS = [
  { value: "", label: "Nicht im Mosaik" },
  { value: "hero", label: "Großes Hauptbild" },
  { value: "portrait", label: "Hochformat" },
  { value: "wide", label: "Querformat oben" },
  { value: "smallA", label: "Klein unten links" },
  { value: "smallB", label: "Klein unten rechts" },
];

interface AmbienteFormData {
  id: string;
  title: string;
  caption: string;
  alt: string;
  colorWorlds: string[];
  featured: boolean;
  teaserSlot: string;
  isActive: boolean;
  order: number;
  mediaAssetId: string;
}

interface MediaOption {
  id: string;
  filename: string;
  url: string;
  alt: string | null;
}

interface SlotUsage {
  slot: string;
  title: string;
  id: string;
}

export default function AmbienteEditForm({
  image,
  mediaAssets,
  imagePreview,
  userRole = "VIEWER",
  existingSlots = [],
}: {
  image: AmbienteFormData;
  mediaAssets: MediaOption[];
  imagePreview: { url: string; alt: string | null } | null;
  userRole?: string;
  existingSlots?: SlotUsage[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<AmbienteFormData>(image);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function updateString(field: keyof AmbienteFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleWorld(world: string) {
    setForm((prev) => ({
      ...prev,
      colorWorlds: prev.colorWorlds.includes(world)
        ? prev.colorWorlds.filter((w) => w !== world)
        : [...prev.colorWorlds, world],
    }));
  }

  const slotConflict = form.teaserSlot
    ? existingSlots.find(
        (s) => s.slot === form.teaserSlot && s.id !== form.id,
      )
    : null;

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/ambiente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          teaserSlot: form.teaserSlot || null,
          colorWorlds: JSON.stringify(form.colorWorlds),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Speichern");
      }

      const saved = await res.json();
      setMessage({ type: "success", text: "Ambiente-Bild erfolgreich gespeichert." });

      if (!image.id) {
        router.push(`/admin/ambiente/${saved.id}`);
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

  const currentPreview = form.mediaAssetId
    ? (form.mediaAssetId === image.mediaAssetId
        ? imagePreview
        : mediaAssets.find((m) => m.id === form.mediaAssetId)) ?? null
    : null;

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
        <h2 className="text-lg font-semibold text-gray-900">Bild &amp; Inhalt</h2>

        <MediaPickerField
          label="Ambiente-Bild *"
          value={form.mediaAssetId}
          onChange={(id) => updateString("mediaAssetId", id)}
          previewUrl={currentPreview?.url}
          previewAlt={currentPreview?.alt}
        />

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt-Text</label>
            <input
              type="text"
              value={form.alt}
              onChange={(e) => updateString("alt", e.target.value)}
              placeholder="Bildbeschreibung für Screenreader"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bildunterschrift</label>
          <input
            type="text"
            value={form.caption}
            onChange={(e) => updateString("caption", e.target.value)}
            placeholder="z.B. Mediterraner Innenhof mit Mosaroma Green"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Mosaik &amp; Einstellungen</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mosaik-Position
          </label>
          <select
            value={form.teaserSlot}
            onChange={(e) => updateString("teaserSlot", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {TEASER_SLOTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Für das Mosaik auf /kollektionen sollten idealerweise genau 5 Bilder
            mit unterschiedlichen Positionen gepflegt werden.
          </p>
          {slotConflict && (
            <p className="text-xs text-orange-600 mt-1">
              Hinweis: Dieser Slot ist bereits von „{slotConflict.title}" belegt.
              Nur das erste Bild je Slot wird im Mosaik angezeigt.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Farbwelten (Mehrfachauswahl)
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_WORLDS.map((w) => (
              <button
                key={w.value}
                type="button"
                onClick={() => toggleWorld(w.value)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  form.colorWorlds.includes(w.value)
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-400"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reihenfolge</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={form.featured}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, featured: e.target.checked }))
              }
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              Featured
            </label>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Aktiv
            </label>
          </div>
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
          href="/admin/ambiente"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </Link>
      </div>

      {form.id && (
        <DangerZone
          entityId={form.id}
          entityName={form.title || "Ambiente-Bild"}
          apiEndpoint="/api/admin/ambiente"
          redirectTo="/admin/ambiente"
          deactivateAction={{ isActive: form.isActive }}
          deleteAction={{ enabled: true }}
          userRole={userRole}
        />
      )}
    </div>
  );
}
