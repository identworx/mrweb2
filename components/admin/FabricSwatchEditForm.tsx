"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaPickerField from "./MediaPickerField";

interface AvailabilityRow {
  productTypeId: string;
  productTypeName: string;
  isAvailable: boolean;
  note: string;
}

interface SwatchData {
  id: string;
  name: string;
  slug: string;
  familyId: string;
  articleNumber: string;
  subtitle: string;
  description: string;
  swatchImageId: string;
  swatchImageUrl: string;
  colorHex: string;
  patternType: string;
  order: number;
  isActive: boolean;
  availabilities: AvailabilityRow[];
}

interface Props {
  swatch: SwatchData | null;
  families: { id: string; name: string }[];
  productTypes: { id: string; name: string; slug: string }[];
  userRole: string;
}

export default function FabricSwatchEditForm({
  swatch,
  families,
  productTypes,
  userRole,
}: Props) {
  const router = useRouter();
  const isNew = !swatch;

  const [name, setName] = useState(swatch?.name || "");
  const [slug, setSlug] = useState(swatch?.slug || "");
  const [familyId, setFamilyId] = useState(swatch?.familyId || (families[0]?.id || ""));
  const [articleNumber, setArticleNumber] = useState(swatch?.articleNumber || "");
  const [subtitle, setSubtitle] = useState(swatch?.subtitle || "");
  const [description, setDescription] = useState(swatch?.description || "");
  const [swatchImageId, setSwatchImageId] = useState(swatch?.swatchImageId || "");
  const [colorHex, setColorHex] = useState(swatch?.colorHex || "");
  const [patternType, setPatternType] = useState(swatch?.patternType || "");
  const [order, setOrder] = useState(swatch?.order || 0);
  const [isActive, setIsActive] = useState(swatch?.isActive ?? true);
  const [saving, setSaving] = useState(false);

  const existingMap = new Map<string, AvailabilityRow>();
  if (swatch) {
    for (const a of swatch.availabilities) {
      existingMap.set(a.productTypeId, a);
    }
  }

  const [availabilities, setAvailabilities] = useState<
    { productTypeId: string; isAvailable: boolean; note: string }[]
  >(
    productTypes.map((pt) => {
      const existing = existingMap.get(pt.id);
      return {
        productTypeId: pt.id,
        isAvailable: existing?.isAvailable ?? false,
        note: existing?.note || "",
      };
    }),
  );

  function toggleAvailability(ptId: string) {
    setAvailabilities((prev) =>
      prev.map((a) =>
        a.productTypeId === ptId ? { ...a, isAvailable: !a.isAvailable } : a,
      ),
    );
  }

  function setNote(ptId: string, note: string) {
    setAvailabilities((prev) =>
      prev.map((a) => (a.productTypeId === ptId ? { ...a, note } : a)),
    );
  }

  async function save() {
    if (!name.trim()) {
      alert("Name ist Pflicht.");
      return;
    }
    if (!familyId) {
      alert("Bitte Familie auswählen.");
      return;
    }

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        entity: "swatch",
        name,
        slug: slug || undefined,
        familyId,
        articleNumber,
        subtitle,
        description,
        swatchImageId: swatchImageId || null,
        colorHex,
        patternType,
        order,
        isActive,
        availabilities: availabilities
          .filter((a) => a.isAvailable)
          .map((a) => ({
            productTypeId: a.productTypeId,
            isAvailable: true,
            note: a.note,
          })),
      };
      if (swatch) body.id = swatch.id;

      const res = await fetch("/api/admin/fabrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Fehler beim Speichern");
        return;
      }

      const result = await res.json();
      if (isNew) {
        router.push(`/admin/fabrics/${result.id}`);
      } else {
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!swatch) return;
    if (!confirm(`"${swatch.name}" wirklich löschen?`)) return;
    const res = await fetch(`/api/admin/fabrics?entity=swatches&id=${swatch.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Fehler beim Löschen");
      return;
    }
    router.push("/admin/fabrics");
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? "Neuer Stoff" : `Stoff: ${swatch.name}`}
        </h1>
        <button
          onClick={() => router.push("/admin/fabrics")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Zurück
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Grunddaten</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Familie *</label>
              <select value={familyId} onChange={(e) => setFamilyId(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                {families.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Artikelnummer</label>
              <input value={articleNumber} onChange={(e) => setArticleNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mustertyp</label>
              <input value={patternType} onChange={(e) => setPatternType(e.target.value)} placeholder="z.B. Dobby, Jacquard, Uni" className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Farbe (Hex)</label>
              <div className="flex gap-2">
                <input type="color" value={colorHex || "#888888"} onChange={(e) => setColorHex(e.target.value)} className="w-10 h-10 border border-gray-300 rounded cursor-pointer" />
                <input value={colorHex} onChange={(e) => setColorHex(e.target.value)} placeholder="#FF0000" className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Untertitel</label>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reihenfolge</label>
              <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-300 rounded text-sm" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4" />
                <span className="text-sm text-gray-700">Aktiv</span>
              </label>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Stoffbild</h2>
          <MediaPickerField
            label="Swatch-Bild"
            value={swatchImageId}
            onChange={setSwatchImageId}
            previewUrl={swatch?.swatchImageUrl || null}
          />
        </div>

        {/* Availabilities */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Verfügbare Produktarten</h2>
          <div className="space-y-2">
            {productTypes.map((pt) => {
              const avail = availabilities.find((a) => a.productTypeId === pt.id);
              if (!avail) return null;
              return (
                <div key={pt.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={avail.isAvailable}
                    onChange={() => toggleAvailability(pt.id)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-900 w-40">{pt.name}</span>
                  {avail.isAvailable && (
                    <input
                      value={avail.note}
                      onChange={(e) => setNote(pt.id, e.target.value)}
                      placeholder="Hinweis (z.B. mit Keder)"
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 bg-orange-600 text-white text-sm font-medium rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {saving ? "Speichern…" : "Speichern"}
          </button>

          {!isNew && userRole === "ADMIN" && (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 text-sm hover:text-red-700"
            >
              Stoff löschen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
