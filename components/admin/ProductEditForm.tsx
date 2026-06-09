"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DangerZone from "./DangerZone";
import MediaPickerField from "./MediaPickerField";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  collectionId: string;
  productGroupId: string;
  materialId: string;
  shortDescription: string;
  description: string;
  code: string;
  size: string;
  colorName: string;
  patternName: string;
  features: string;
  heroImageId: string;
  mainImageId: string;
  status: string;
  seoTitle: string;
  seoDescription: string;
}

interface SelectOption {
  id: string;
  name: string;
}

interface MediaOption {
  id: string;
  filename: string;
  url: string;
  alt: string | null;
}

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function ProductEditForm({
  product,
  collections,
  productGroups,
  materials,
  mediaAssets,
  userRole = "VIEWER",
}: {
  product: ProductData;
  collections: SelectOption[];
  productGroups: SelectOption[];
  materials: SelectOption[];
  mediaAssets: MediaOption[];
  userRole?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ProductData>(product);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update(field: keyof ProductData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Speichern");
      }

      const saved = await res.json();
      if (!form.id && saved.id) {
        router.push(`/admin/products/${saved.id}`);
        return;
      }
      setMessage({ type: "success", text: "Produkt erfolgreich gespeichert." });
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

  const mainPreview = mediaAssets.find((m) => m.id === form.mainImageId);
  const heroPreview = mediaAssets.find((m) => m.id === form.heroImageId);

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => update("code", e.target.value)}
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kurzbeschreibung</label>
          <input
            type="text"
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Zuordnung</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kollektion</label>
            <select
              value={form.collectionId}
              onChange={(e) => update("collectionId", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Produktgruppe</label>
            <select
              value={form.productGroupId}
              onChange={(e) => update("productGroupId", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {productGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <select
              value={form.materialId}
              onChange={(e) => update("materialId", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">-- Kein Material --</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Bilder</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MediaPickerField
            label="Hauptbild"
            value={form.mainImageId}
            onChange={(id) => update("mainImageId", id)}
            previewUrl={mainPreview?.url}
            previewAlt={mainPreview?.alt}
          />
          <MediaPickerField
            label="Hero-Bild"
            value={form.heroImageId}
            onChange={(id) => update("heroImageId", id)}
            previewUrl={heroPreview?.url}
            previewAlt={heroPreview?.alt}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Groesse</label>
            <input
              type="text"
              value={form.size}
              onChange={(e) => update("size", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Farbname</label>
            <input
              type="text"
              value={form.colorName}
              onChange={(e) => update("colorName", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mustername</label>
            <input
              type="text"
              value={form.patternName}
              onChange={(e) => update("patternName", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Eigenschaften
            <span className="text-gray-400 font-normal ml-1">(eine pro Zeile)</span>
          </label>
          <textarea
            rows={4}
            value={form.features}
            onChange={(e) => update("features", e.target.value)}
            placeholder={"Eigenschaft 1\nEigenschaft 2\nEigenschaft 3"}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
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
          href="/admin/products"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </Link>
      </div>

      {form.id && (
        <DangerZone
          entityId={form.id}
          entityName={form.name || "Produkt"}
          apiEndpoint="/api/admin/products"
          redirectTo="/admin/products"
          archiveAction={{ currentStatus: form.status }}
          deleteAction={{ enabled: true }}
          userRole={userRole}
        />
      )}
    </div>
  );
}
