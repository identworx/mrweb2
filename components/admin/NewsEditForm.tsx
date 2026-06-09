"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DangerZone from "./DangerZone";
import MediaPickerField from "./MediaPickerField";

interface MediaItem {
  id: string;
  url: string;
  alt: string | null;
  originalName: string;
}

interface ArticleData {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  excerpt: string;
  content: string;
  heroImageId: string;
  cardImageId: string;
  category: string;
  status: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
}

interface Props {
  article: ArticleData;
  mediaAssets: MediaItem[];
  userRole?: string;
}

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function NewsEditForm({ article, mediaAssets, userRole = "VIEWER" }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ArticleData>(article);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update(field: keyof ArticleData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/news", {
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
        router.push(`/admin/news/${saved.id}`);
        return;
      }
      setMessage({ type: "success", text: "Artikel erfolgreich gespeichert." });
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
            <input
              type="text"
              value={form.eyebrow}
              onChange={(e) => update("eyebrow", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategorie</label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Veröffentlicht am</label>
            <input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) => update("publishedAt", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Inhalt */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Inhalt</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Auszug</label>
          <textarea
            rows={3}
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inhalt</label>
          <textarea
            rows={8}
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Bilder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Bilder</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MediaPickerField
            label="Hero-Bild"
            value={form.heroImageId}
            onChange={(id) => update("heroImageId", id)}
            previewUrl={heroPreview?.url}
            previewAlt={heroPreview?.alt}
          />
          <MediaPickerField
            label="Card-Bild"
            value={form.cardImageId}
            onChange={(id) => update("cardImageId", id)}
            previewUrl={cardPreview?.url}
            previewAlt={cardPreview?.alt}
          />
        </div>
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
          href="/admin/news"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </Link>
      </div>

      {form.id && (
        <DangerZone
          entityId={form.id}
          entityName={form.title || "Artikel"}
          apiEndpoint="/api/admin/news"
          redirectTo="/admin/news"
          archiveAction={{ currentStatus: form.status }}
          deleteAction={{ enabled: true }}
          userRole={userRole}
        />
      )}
    </div>
  );
}
