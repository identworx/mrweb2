"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DangerZone from "./DangerZone";

interface MediaItem {
  id: string;
  url: string;
  alt: string | null;
  originalName: string;
}

interface CollectionData {
  id: string;
  name: string;
  slug: string;
  number: number;
  eyebrow: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  moodColors: string[];
  fabric: string;
  status: string;
  seoTitle: string;
  seoDescription: string;
  order: number;
  heroImageId: string;
  cardImageId: string;
}

interface Props {
  collection: CollectionData;
  mediaAssets: MediaItem[];
  userRole?: string;
  productCount?: number;
}

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const HEX_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export default function CollectionEditForm({ collection, mediaAssets, userRole = "VIEWER", productCount = 0 }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CollectionData>(collection);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [newColor, setNewColor] = useState("#");

  function update(field: keyof CollectionData, value: string | number | string[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addColor() {
    const trimmed = newColor.trim();
    if (!HEX_REGEX.test(trimmed)) return;
    update("moodColors", [...form.moodColors, trimmed]);
    setNewColor("#");
  }

  function removeColor(index: number) {
    update("moodColors", form.moodColors.filter((_, i) => i !== index));
  }

  function updateColor(index: number, value: string) {
    const updated = [...form.moodColors];
    updated[index] = value;
    update("moodColors", updated);
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          heroImageId: form.heroImageId || null,
          cardImageId: form.cardImageId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Speichern");
      }

      const saved = await res.json();
      if (!form.id && saved.id) {
        router.push(`/admin/collections/${saved.id}`);
        return;
      }
      setMessage({ type: "success", text: "Kollektion erfolgreich gespeichert." });
      router.refresh();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Fehler beim Speichern",
      });
    } finally {
      setSaving(false);
    }
  }

  const heroPreview = mediaAssets.find((m) => m.id === form.heroImageId);
  const cardPreview = mediaAssets.find((m) => m.id === form.cardImageId);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
        Name, Kurzbeschreibung, Hero-Bild, Card-Bild, Stimmungsfarben und SEO-Felder werden auf der öffentlichen Website unter /kollektionen und /kollektionen/[slug] angezeigt.
      </div>

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

      {/* General */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Allgemein</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nummer</label>
            <input
              type="number"
              value={form.number}
              onChange={(e) => update("number", parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reihenfolge</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => update("order", parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
          <input
            type="text"
            value={form.eyebrow}
            onChange={(e) => update("eyebrow", e.target.value)}
            placeholder="z.B. Kollektion 01"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-400 mt-1">Kleiner Text über dem Titel im Hero-Bereich. Wird automatisch aus Nummer generiert, wenn leer.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Untertitel</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => update("subtitle", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kurzbeschreibung</label>
          <textarea
            rows={2}
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Langbeschreibung</label>
          <textarea
            rows={4}
            value={form.longDescription}
            onChange={(e) => update("longDescription", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stoff</label>
            <input
              type="text"
              value={form.fabric}
              onChange={(e) => update("fabric", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">Nur veröffentlichte Kollektionen erscheinen öffentlich. Entwürfe und archivierte Kollektionen werden auf Detailseiten nicht ausgespielt.</p>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Bilder</h2>
        <p className="text-sm text-gray-500">
          Bilder können unter <Link href="/admin/media" className="text-orange-600 hover:underline">Medien</Link> hochgeladen werden.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hero Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hero-Bild</label>
            <select
              value={form.heroImageId}
              onChange={(e) => update("heroImageId", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">-- Kein Bild (Platzhalter) --</option>
              {mediaAssets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.originalName}{m.alt ? ` (${m.alt})` : ""}
                </option>
              ))}
            </select>
            {heroPreview && (
              <div className="mt-2 border border-gray-200 rounded overflow-hidden">
                <img
                  src={heroPreview.url}
                  alt={heroPreview.alt || "Hero-Vorschau"}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>

          {/* Card Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Card-Bild</label>
            <select
              value={form.cardImageId}
              onChange={(e) => update("cardImageId", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">-- Kein Bild (Platzhalter) --</option>
              {mediaAssets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.originalName}{m.alt ? ` (${m.alt})` : ""}
                </option>
              ))}
            </select>
            {cardPreview && (
              <div className="mt-2 border border-gray-200 rounded overflow-hidden">
                <img
                  src={cardPreview.url}
                  alt={cardPreview.alt || "Card-Vorschau"}
                  className="w-full h-32 object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mood Colors */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Stimmungsfarben</h2>

        {form.moodColors.length > 0 && (
          <div className="space-y-2">
            {form.moodColors.map((color, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: HEX_REGEX.test(color) ? color : "#ccc" }}
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => updateColor(i, e.target.value)}
                  className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="color"
                  value={HEX_REGEX.test(color) ? (color.length === 4 ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}` : color) : "#cccccc"}
                  onChange={(e) => updateColor(i, e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => removeColor(i)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
          <input
            type="text"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addColor()}
            placeholder="#000000"
            className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addColor}
            disabled={!HEX_REGEX.test(newColor.trim())}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Farbe hinzufügen
          </button>
        </div>

        {/* Preview strip */}
        {form.moodColors.length > 0 && (
          <div className="flex rounded overflow-hidden">
            {form.moodColors.map((color, i) => (
              <div
                key={i}
                className="flex-1 h-8"
                style={{ backgroundColor: HEX_REGEX.test(color) ? color : "#ccc" }}
              />
            ))}
          </div>
        )}
      </div>

      {/* SEO */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">SEO</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SEO Titel</label>
          <input
            type="text"
            value={form.seoTitle}
            onChange={(e) => update("seoTitle", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SEO Beschreibung</label>
          <textarea
            rows={2}
            value={form.seoDescription}
            onChange={(e) => update("seoDescription", e.target.value)}
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
          {saving ? "Speichert..." : "Speichern"}
        </button>
        <Link
          href="/admin/collections"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </Link>
        {form.slug && (
          <a
            href={`/kollektionen/${form.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2.5 text-gray-500 text-sm font-medium hover:text-orange-600 transition-colors ml-auto"
          >
            Öffentliche Seite ansehen ↗
          </a>
        )}
      </div>

      {form.id && (
        <DangerZone
          entityId={form.id}
          entityName={form.name || "Kollektion"}
          apiEndpoint="/api/admin/collections"
          redirectTo="/admin/collections"
          archiveAction={{ currentStatus: form.status }}
          deleteAction={{
            enabled: productCount === 0,
            disabledReason: productCount > 0
              ? `Kollektion enthält ${productCount} Produkt(e). Bitte zuerst alle Produkte entfernen oder verschieben.`
              : undefined,
          }}
          userRole={userRole}
        />
      )}
    </div>
  );
}
