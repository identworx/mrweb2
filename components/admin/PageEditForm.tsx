"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DangerZone from "./DangerZone";
import MediaPickerField from "./MediaPickerField";

interface MediaOption {
  id: string;
  filename: string;
  url: string;
  alt: string | null;
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  eyebrow: string;
  headline: string;
  introText: string;
  heroImageId: string;
  status: string;
  type: string;
  seoTitle: string;
  seoDescription: string;
}

const PAGE_STATUSES: { value: string; label: string }[] = [
  { value: "DRAFT", label: "Entwurf" },
  { value: "PUBLISHED", label: "Veröffentlicht" },
  { value: "ARCHIVED", label: "Archiviert" },
];
const PAGE_TYPES: { value: string; label: string }[] = [
  { value: "HOME", label: "Startseite" },
  { value: "STANDARD", label: "Standardseite" },
  { value: "COLLECTION_INDEX", label: "Kollektionsübersicht" },
  { value: "COLLECTION_DETAIL", label: "Kollektionsdetail" },
  { value: "MATERIAL_INDEX", label: "Materialübersicht" },
  { value: "CATALOG_INDEX", label: "Katalogübersicht" },
  { value: "SERVICE", label: "Serviceseite" },
  { value: "NEWS_INDEX", label: "Neuigkeiten" },
  { value: "CONTACT", label: "Kontaktseite" },
  { value: "LEGAL", label: "Rechtliche Seite" },
];

export default function PageEditForm({ page, mediaAssets = [], userRole = "VIEWER" }: { page: PageData; mediaAssets?: MediaOption[]; userRole?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<PageData>(page);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update(field: keyof PageData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          heroImageId: form.heroImageId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Speichern");
      }

      const saved = await res.json();
      if (!form.id && saved.id) {
        router.push(`/admin/pages/${saved.id}`);
        return;
      }
      setMessage({ type: "success", text: "Seite erfolgreich gespeichert." });
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

      {page.type === "LEGAL" && (
        <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-sm text-amber-900 flex items-start gap-2">
          <span className="shrink-0 mt-0.5">⚠</span>
          <span>Rechtlich erforderliche Seite. Diese Seite muss dauerhaft veröffentlicht bleiben und kann nicht archiviert oder gelöscht werden.</span>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
        Eyebrow, Headline, Einleitungstext und Hero-Bild steuern den Hero-Bereich der öffentlichen Seite. SEO-Titel und -Beschreibung steuern die Metadaten. Nur veröffentlichte Seiten werden öffentlich angezeigt.
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Allgemein</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">URL-Teil, z.B. green-collection. Nur Kleinbuchstaben, Zahlen und Bindestriche.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
            <input
              type="text"
              value={form.eyebrow}
              onChange={(e) => update("eyebrow", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">Kleiner Text über der Überschrift im Hero-Bereich.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => update("headline", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Einleitungstext</label>
          <textarea
            rows={3}
            value={form.introText}
            onChange={(e) => update("introText", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <MediaPickerField
            label="Hero-Bild"
            value={form.heroImageId}
            onChange={(id) => update("heroImageId", id)}
            previewUrl={mediaAssets.find((m) => m.id === form.heroImageId)?.url}
            previewAlt={mediaAssets.find((m) => m.id === form.heroImageId)?.alt}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              disabled={page.type === "LEGAL"}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              {(page.type === "LEGAL"
                ? PAGE_STATUSES.filter((s) => s.value === "PUBLISHED")
                : PAGE_STATUSES
              ).map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
            <select
              value={form.type}
              onChange={(e) => update("type", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {PAGE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
          href="/admin/pages"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </Link>
      </div>

      {form.id && (
        <DangerZone
          entityId={form.id}
          entityName={form.title || "Seite"}
          apiEndpoint="/api/admin/pages"
          redirectTo="/admin/pages"
          archiveAction={page.type !== "LEGAL" ? { currentStatus: form.status } : undefined}
          deleteAction={page.type === "LEGAL"
            ? { enabled: false, disabledReason: "Rechtlich erforderliche Seiten können nicht gelöscht werden." }
            : { enabled: true }
          }
          userRole={userRole}
        />
      )}
    </div>
  );
}
