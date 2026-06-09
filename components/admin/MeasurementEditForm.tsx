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

interface MeasurementRow {
  label: string;
  value: string;
}

interface MeasurementFormData {
  id: string;
  title: string;
  slug: string;
  groupSlug: string;
  drawingType: string;
  imageId: string;
  imageAlt: string;
  sourceNote: string;
  order: number;
  rows: MeasurementRow[];
  notes: string[];
}

const GROUP_OPTIONS = [
  { value: "kissen-auflagen", label: "Kissen & Auflagen" },
  { value: "lehner", label: "Lehner" },
  { value: "bankauflagen", label: "Bankauflagen" },
  { value: "poufs", label: "Poufs" },
  { value: "tischsets", label: "Tischsets & Tischläufer" },
];

export default function MeasurementEditForm({
  measurement,
  mediaAssets,
  userRole = "VIEWER",
  isActive = true,
}: {
  measurement: MeasurementFormData;
  mediaAssets: MediaItem[];
  userRole?: string;
  isActive?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<MeasurementFormData>(measurement);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update<K extends keyof MeasurementFormData>(field: K, value: MeasurementFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateRow(index: number, field: keyof MeasurementRow, value: string) {
    setForm((prev) => {
      const rows = [...prev.rows];
      rows[index] = { ...rows[index], [field]: value };
      return { ...prev, rows };
    });
  }

  function addRow() {
    setForm((prev) => ({ ...prev, rows: [...prev.rows, { label: "", value: "" }] }));
  }

  function removeRow(index: number) {
    setForm((prev) => ({ ...prev, rows: prev.rows.filter((_, i) => i !== index) }));
  }

  function moveRow(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= form.rows.length) return;
    setForm((prev) => {
      const rows = [...prev.rows];
      [rows[index], rows[target]] = [rows[target], rows[index]];
      return { ...prev, rows };
    });
  }

  function updateNote(index: number, value: string) {
    setForm((prev) => {
      const notes = [...prev.notes];
      notes[index] = value;
      return { ...prev, notes };
    });
  }

  function addNote() {
    setForm((prev) => ({ ...prev, notes: [...prev.notes, ""] }));
  }

  function removeNote(index: number) {
    setForm((prev) => ({ ...prev, notes: prev.notes.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    if (!form.title.trim() || !form.slug.trim()) {
      setMessage({ type: "error", text: "Titel und Slug sind Pflichtfelder." });
      setSaving(false);
      return;
    }

    const invalidRows = form.rows.some((r) => !r.label.trim() || !r.value.trim());
    if (invalidRows) {
      setMessage({ type: "error", text: "Alle Maßzeilen benötigen Label und Wert." });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id || undefined,
          title: form.title,
          slug: form.slug,
          groupSlug: form.groupSlug || null,
          drawingType: form.drawingType || null,
          imageId: form.imageId || null,
          imageAlt: form.imageAlt || null,
          sourceNote: form.sourceNote || null,
          order: typeof form.order === "number" ? form.order : parseInt(String(form.order)) || 0,
          variants: JSON.stringify(form.rows.filter((r) => r.label.trim() && r.value.trim())),
          notes: JSON.stringify(form.notes.filter((n) => n.trim())),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Speichern");
      }

      const saved = await res.json();
      setMessage({ type: "success", text: "Produktmaß erfolgreich gespeichert." });

      if (!measurement.id) {
        router.push(`/admin/measurements/${saved.id}`);
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

      {/* Allgemein */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Allgemein</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gruppe</label>
            <select
              value={form.groupSlug}
              onChange={(e) => update("groupSlug", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">-- Gruppe wählen --</option>
              {GROUP_OPTIONS.map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reihenfolge</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => update("order", parseInt(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zeichnungstyp <span className="text-gray-400">(Legacy-Fallback)</span>
            </label>
            <input
              type="text"
              value={form.drawingType}
              onChange={(e) => update("drawingType", e.target.value)}
              placeholder="z.B. square-cushion, high-back"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Bild */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Bemaßtes Bild</h2>
        <p className="text-sm text-gray-500">
          Bilder unter{" "}
          <Link href="/admin/media" className="text-orange-600 hover:underline">Medien</Link>{" "}
          hochladen und hier zuweisen. Ohne Bild wird die Legacy-Zeichnung angezeigt.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bild</label>
            <select
              value={form.imageId}
              onChange={(e) => update("imageId", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">-- Kein Bild (Legacy-Zeichnung) --</option>
              {mediaAssets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.originalName}{m.alt ? ` (${m.alt})` : ""}
                </option>
              ))}
            </select>
            {imagePreview && (
              <div className="mt-2 border border-gray-200 rounded overflow-hidden">
                <img
                  src={imagePreview.url}
                  alt={imagePreview.alt || "Vorschau"}
                  className="w-full h-40 object-contain bg-gray-50"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt-Text</label>
            <input
              type="text"
              value={form.imageAlt}
              onChange={(e) => update("imageAlt", e.target.value)}
              placeholder="Beschreibung des bemaßten Bildes"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Maßzeilen */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Maßzeilen</h2>
          <button
            type="button"
            onClick={addRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-lg hover:bg-orange-100 transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14m-7-7h14" />
            </svg>
            Zeile hinzufügen
          </button>
        </div>

        {form.rows.length === 0 && (
          <p className="text-sm text-gray-400 italic">Noch keine Maßzeilen vorhanden.</p>
        )}

        <div className="space-y-3">
          {form.rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveRow(i, -1)}
                  disabled={i === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Nach oben"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveRow(i, 1)}
                  disabled={i === form.rows.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Nach unten"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={row.label}
                onChange={(e) => updateRow(i, "label", e.target.value)}
                placeholder="Label (z.B. MACK. & LITE)"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <input
                type="text"
                value={row.value}
                onChange={(e) => updateRow(i, "value", e.target.value)}
                placeholder="Wert (z.B. 48 × 48 cm)"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="p-2 text-red-400 hover:text-red-600 transition-colors"
                title="Zeile entfernen"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Hinweise */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Hinweise</h2>
          <button
            type="button"
            onClick={addNote}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-lg hover:bg-orange-100 transition-colors"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14m-7-7h14" />
            </svg>
            Hinweis hinzufügen
          </button>
        </div>

        {form.notes.length === 0 && (
          <p className="text-sm text-gray-400 italic">Keine Hinweise vorhanden.</p>
        )}

        <div className="space-y-2">
          {form.notes.map((note, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => updateNote(i, e.target.value)}
                placeholder="z.B. Grundmaß: 46 × 45 cm"
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => removeNote(i)}
                className="p-2 text-red-400 hover:text-red-600 transition-colors"
                title="Hinweis entfernen"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
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
          href="/admin/measurements"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </Link>
      </div>

      {form.id && (
        <DangerZone
          entityId={form.id}
          entityName={form.title || "Produktmaß"}
          apiEndpoint="/api/admin/measurements"
          redirectTo="/admin/measurements"
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
