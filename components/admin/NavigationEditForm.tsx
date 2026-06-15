"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LINK_TYPES, SYSTEM_ROUTES, type LinkType } from "@/lib/cms/nav-constants";

interface PageOption {
  id: string;
  slug: string;
  title: string;
  status: string;
}

interface NavigationItemData {
  id?: string;
  label: string;
  linkType: LinkType;
  href: string;
  linkedPageId: string;
  order: number;
  openInNewTab: boolean;
  isActive: boolean;
  pageStatus?: string | null;
  badgeText: string;
  badgeVariant: string;
}

interface MenuData {
  id: string;
  name: string;
  location: string;
  items: NavigationItemData[];
}

const NAV_LOCATIONS = ["HEADER", "FOOTER", "SERVICE", "LEGAL"];

const locationLabels: Record<string, string> = {
  HEADER: "Header",
  FOOTER: "Footer",
  SERVICE: "Service",
  LEGAL: "Rechtliches",
};

function getStatusBadge(item: NavigationItemData, pages: PageOption[]) {
  if (item.linkType === "PAGE") {
    if (!item.linkedPageId) {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">Keine Seite</span>;
    }
    const page = pages.find((p) => p.id === item.linkedPageId);
    if (!page) {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">Seite fehlt</span>;
    }
    if (page.status === "DRAFT") {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800">Entwurf</span>;
    }
    if (page.status === "ARCHIVED") {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">Archiviert</span>;
    }
    return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">OK</span>;
  }
  if (item.linkType === "SYSTEM_ROUTE") {
    const valid = SYSTEM_ROUTES.some((r) => r.path === item.href);
    return valid
      ? <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">OK</span>
      : <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">Ungültig</span>;
  }
  if (item.linkType === "PAGE_SLUG") {
    if (!item.href) {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">Kein Slug</span>;
    }
    return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">Geplant</span>;
  }
  if (item.linkType === "CUSTOM_URL") {
    if (!item.href) {
      return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">Kein Link</span>;
    }
    return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800">OK</span>;
  }
  return null;
}

export default function NavigationEditForm({
  menu,
  pages = [],
}: {
  menu: MenuData;
  pages?: PageOption[];
}) {
  const router = useRouter();
  const [form, setForm] = useState<MenuData>(menu);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function updateField(field: "name" | "location", value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateItem(index: number, field: keyof NavigationItemData, value: string | number | boolean) {
    setForm((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], [field]: value };
      if (field === "linkType") {
        items[index].href = "";
        items[index].linkedPageId = "";
      }
      if (field === "linkedPageId" && value) {
        const page = pages.find((p) => p.id === value);
        if (page) {
          items[index].pageStatus = page.status;
        }
      }
      return { ...prev, items };
    });
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          label: "",
          linkType: "CUSTOM_URL" as LinkType,
          href: "",
          linkedPageId: "",
          order: prev.items.length > 0 ? Math.max(...prev.items.map((i) => i.order)) + 1 : 0,
          openInNewTab: false,
          isActive: true,
          badgeText: "",
          badgeVariant: "blue",
        },
      ],
    }));
  }

  function removeItem(index: number) {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const sortedItems = [...form.items].sort((a, b) => a.order - b.order);

      const res = await fetch("/api/admin/navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id,
          name: form.name,
          location: form.location,
          items: sortedItems,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Speichern");
      }

      setMessage({ type: "success", text: "Navigation erfolgreich gespeichert." });
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
        Header- und Footer-Navigation wird direkt auf der öffentlichen Website verwendet. Änderungen werden nach kurzer Verzögerung sichtbar.
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Allgemein</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <select
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              {NAV_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {locationLabels[loc]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Einträge</h2>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Element hinzufügen
          </button>
        </div>

        {form.items.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            Keine Einträge vorhanden. Klicken Sie auf &quot;Element hinzufügen&quot; um einen neuen Eintrag zu erstellen.
          </p>
        )}

        <div className="space-y-4">
          {form.items.map((item, index) => (
            <div
              key={index}
              className={`border rounded-lg p-4 space-y-3 ${item.isActive ? "border-gray-200" : "border-gray-200 bg-gray-50 opacity-60"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-mono">#{item.order}</span>
                  {getStatusBadge(item, pages)}
                  {item.badgeText && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800">Badge: {item.badgeText}</span>
                  )}
                  {!item.isActive && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-500">Inaktiv</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={item.isActive}
                      onChange={(e) => updateItem(index, "isActive", e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    Aktiv
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-xs text-red-600 hover:text-red-800 transition-colors"
                  >
                    Entfernen
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => updateItem(index, "label", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Linktyp</label>
                  <select
                    value={item.linkType}
                    onChange={(e) => updateItem(index, "linkType", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {LINK_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4">
                  {item.linkType === "PAGE" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CMS-Seite</label>
                      <select
                        value={item.linkedPageId}
                        onChange={(e) => updateItem(index, "linkedPageId", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">-- Seite wählen --</option>
                        {pages.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} — /{p.slug} — {p.status}
                          </option>
                        ))}
                      </select>
                      {item.linkedPageId && item.pageStatus && item.pageStatus !== "PUBLISHED" && (
                        <p className="mt-1 text-xs text-yellow-700">
                          Diese Seite ist nicht veröffentlicht. Der Link wird öffentlich nicht angezeigt.
                        </p>
                      )}
                    </div>
                  ) : item.linkType === "PAGE_SLUG" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seiten-Slug</label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => updateItem(index, "href", e.target.value)}
                        placeholder="z.B. impressum"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-blue-700">
                        Geplante Seite — wird öffentlich erst angezeigt, wenn eine CMS-Seite mit diesem Slug erstellt und verknüpft wird.
                      </p>
                    </div>
                  ) : item.linkType === "SYSTEM_ROUTE" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                      <select
                        value={item.href}
                        onChange={(e) => updateItem(index, "href", e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">-- Route wählen --</option>
                        {SYSTEM_ROUTES.map((r) => (
                          <option key={r.path} value={r.path}>
                            {r.label} ({r.path})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => updateItem(index, "href", e.target.value)}
                        placeholder="/seite oder https://..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nr.</label>
                  <input
                    type="number"
                    value={item.order}
                    onChange={(e) => updateItem(index, "order", parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2 flex items-end pb-1">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={item.openInNewTab}
                      onChange={(e) => updateItem(index, "openInNewTab", e.target.checked)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    Neues Tab
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-gray-100">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge-Text</label>
                  <input
                    type="text"
                    value={item.badgeText}
                    onChange={(e) => updateItem(index, "badgeText", e.target.value)}
                    placeholder="z.B. NEU, Sale, 2027"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Badge-Farbe</label>
                  <select
                    value={item.badgeVariant}
                    onChange={(e) => updateItem(index, "badgeVariant", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="blue">Blau</option>
                    <option value="orange">Orange</option>
                    <option value="dark">Dunkel</option>
                    <option value="light">Hell</option>
                  </select>
                </div>
                {item.badgeText && (
                  <div className="md:col-span-4 flex items-end pb-1.5">
                    <span className="text-xs text-gray-500">Vorschau: {item.label} <span className={`inline-flex items-center px-1.5 py-[1px] text-[9px] font-bold uppercase tracking-wide leading-none rounded-[3px] ${
                      item.badgeVariant === "orange" ? "bg-orange-500 text-white"
                      : item.badgeVariant === "dark" ? "bg-gray-800 text-white"
                      : item.badgeVariant === "light" ? "bg-gray-100 text-gray-800"
                      : "bg-[#2F7195] text-white"
                    }`}>{item.badgeText}</span></span>
                  </div>
                )}
              </div>
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
          href="/admin/navigation"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </Link>
      </div>
    </div>
  );
}
