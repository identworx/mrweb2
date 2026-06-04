"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DangerZone from "./DangerZone";

interface MeasurementData {
  id: string;
  title: string;
  slug: string;
  groupSlug: string;
  drawingType: string;
  sourceNote: string;
  order: number;
  variants: string;
  notes: string;
}

export default function MeasurementEditForm({
  measurement,
  userRole = "VIEWER",
  isActive = true,
}: {
  measurement: MeasurementData;
  userRole?: string;
  isActive?: boolean;
}) {
  const router = useRouter();
  const [form, setForm] = useState<MeasurementData>(measurement);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update(field: keyof MeasurementData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    // Validate JSON fields before saving
    try {
      JSON.parse(form.variants);
    } catch {
      setMessage({ type: "error", text: "Ungültiges JSON im Feld Varianten" });
      setSaving(false);
      return;
    }

    try {
      JSON.parse(form.notes);
    } catch {
      setMessage({ type: "error", text: "Ungültiges JSON im Feld Hinweise" });
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/measurements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          order: typeof form.order === "number" ? form.order : parseInt(String(form.order)) || 0,
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Gruppe (groupSlug)</label>
            <input
              type="text"
              value={form.groupSlug}
              onChange={(e) => update("groupSlug", e.target.value)}
              placeholder='z.B. "stuhlauflagen", "tischdecken"'
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zeichnungstyp</label>
            <input
              type="text"
              value={form.drawingType}
              onChange={(e) => update("drawingType", e.target.value)}
              placeholder='z.B. "rectangular", "round"'
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quellenhinweis</label>
            <input
              type="text"
              value={form.sourceNote}
              onChange={(e) => update("sourceNote", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
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
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Varianten &amp; Hinweise</h2>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Varianten (JSON)</label>
            <textarea
              value={form.variants}
              onChange={(e) => update("variants", e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              JSON-Array mit Varianten, z.B. [{'"'}label{'"'}:{'"'}Standard{'"'},{'"'}width{'"'}:100,{'"'}height{'"'}:50{'}'}]
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hinweise (JSON)</label>
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              JSON-Array mit Hinweisen, z.B. [{'"'}Hinweis 1{'"'},{'"'}Hinweis 2{'"'}]
            </p>
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
