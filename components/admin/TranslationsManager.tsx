"use client";

import { useState, useCallback } from "react";

interface Translation {
  id: string;
  entityType: string;
  entityId: string;
  fieldName: string;
  locale: string;
  sourceText: string;
  translatedText: string;
  status: string;
  updatedAt: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Entwurf", color: "bg-gray-100 text-gray-700" },
  REVIEWED: { label: "Geprüft", color: "bg-blue-100 text-blue-700" },
  PUBLISHED: { label: "Veröffentlicht", color: "bg-green-100 text-green-700" },
  STALE: { label: "Veraltet", color: "bg-yellow-100 text-yellow-700" },
};

const ENTITY_TYPE_LABELS: Record<string, string> = {
  dictionary: "Wörterbuch (UI-Texte)",
  homepage: "Startseite",
  page: "Seite",
  collection: "Kollektion",
  product: "Produkt",
  productGroup: "Produktgruppe",
  productType: "Produktart",
  material: "Material",
  fabricQuality: "Stoffqualität",
  technicalData: "Technische Daten",
  glossary: "Glossar",
  news: "Neuigkeit",
  download: "Download",
  navigation: "Navigation",
  footer: "Footer",
  settings: "Einstellungen",
};

export default function TranslationsManager({
  initialTranslations,
}: {
  initialTranslations: Translation[];
}) {
  const [translations, setTranslations] = useState(initialTranslations);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);

  const [newEntry, setNewEntry] = useState({
    entityType: "",
    entityId: "",
    fieldName: "",
    sourceText: "",
    translatedText: "",
  });
  const [showNew, setShowNew] = useState(false);

  const filtered = translations.filter((t) => {
    const matchesSearch =
      !filter ||
      t.entityType.toLowerCase().includes(filter.toLowerCase()) ||
      t.fieldName.toLowerCase().includes(filter.toLowerCase()) ||
      t.sourceText.toLowerCase().includes(filter.toLowerCase()) ||
      t.translatedText.toLowerCase().includes(filter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const grouped = filtered.reduce(
    (acc, t) => {
      const key = t.entityType;
      if (!acc[key]) acc[key] = [];
      acc[key].push(t);
      return acc;
    },
    {} as Record<string, Translation[]>,
  );

  const startEdit = useCallback((t: Translation) => {
    setEditingId(t.id);
    setEditText(t.translatedText);
  }, []);

  const saveEdit = useCallback(
    async (id: string) => {
      setSaving(true);
      try {
        const res = await fetch("/api/admin/translations", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, translatedText: editText }),
        });
        if (res.ok) {
          const updated = await res.json();
          setTranslations((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...updated } : t)),
          );
          setEditingId(null);
        }
      } finally {
        setSaving(false);
      }
    },
    [editText],
  );

  const updateStatus = useCallback(
    async (id: string, status: string) => {
      const res = await fetch("/api/admin/translations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTranslations((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        );
      }
    },
    [],
  );

  const createNew = useCallback(async () => {
    if (!newEntry.entityType || !newEntry.fieldName || !newEntry.translatedText) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEntry,
          locale: "en",
          status: "DRAFT",
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setTranslations((prev) => [...prev, created]);
        setNewEntry({
          entityType: "",
          entityId: "",
          fieldName: "",
          sourceText: "",
          translatedText: "",
        });
        setShowNew(false);
      }
    } finally {
      setSaving(false);
    }
  }, [newEntry]);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Suchen…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Alle Status</option>
          <option value="DRAFT">Entwurf</option>
          <option value="REVIEWED">Geprüft</option>
          <option value="PUBLISHED">Veröffentlicht</option>
          <option value="STALE">Veraltet</option>
        </select>
        <button
          onClick={() => setShowNew(!showNew)}
          className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 transition-colors"
        >
          + Neue Übersetzung
        </button>
      </div>

      {/* New entry form */}
      {showNew && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Neue Übersetzung</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Entitätstyp (z.B. page, collection)"
              value={newEntry.entityType}
              onChange={(e) => setNewEntry({ ...newEntry, entityType: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="text"
              placeholder="Entitäts-ID (optional)"
              value={newEntry.entityId}
              onChange={(e) => setNewEntry({ ...newEntry, entityId: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="text"
              placeholder="Feldname"
              value={newEntry.fieldName}
              onChange={(e) => setNewEntry({ ...newEntry, fieldName: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Deutsch (Quelle)</label>
              <textarea
                placeholder="Deutscher Text"
                value={newEntry.sourceText}
                onChange={(e) => setNewEntry({ ...newEntry, sourceText: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">English (Übersetzung)</label>
              <textarea
                placeholder="English translation"
                value={newEntry.translatedText}
                onChange={(e) => setNewEntry({ ...newEntry, translatedText: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={createNew}
              disabled={saving}
              className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-md hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Speichern…" : "Erstellen"}
            </button>
            <button
              onClick={() => setShowNew(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="flex gap-4 text-sm text-gray-500">
        <span>{translations.length} Übersetzungen gesamt</span>
        <span>{translations.filter((t) => t.status === "PUBLISHED").length} veröffentlicht</span>
        <span>{translations.filter((t) => t.status === "DRAFT").length} Entwürfe</span>
      </div>

      {/* Translation groups */}
      {Object.keys(grouped).length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 text-sm">
            {translations.length === 0
              ? "Noch keine Übersetzungen vorhanden. Erstellen Sie die erste Übersetzung."
              : "Keine Übersetzungen gefunden, die dem Filter entsprechen."}
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([entityType, items]) => (
          <div key={entityType} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700">
                {ENTITY_TYPE_LABELS[entityType] || entityType}
                <span className="ml-2 text-gray-400 font-normal">({items.length})</span>
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {items.map((t) => (
                <div key={t.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                        {t.fieldName}
                      </span>
                      {t.entityId && (
                        <span className="text-gray-400">ID: {t.entityId}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          STATUS_LABELS[t.status]?.color || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {STATUS_LABELS[t.status]?.label || t.status}
                      </span>
                      <select
                        value={t.status}
                        onChange={(e) => updateStatus(t.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-1 py-0.5"
                      >
                        <option value="DRAFT">Entwurf</option>
                        <option value="REVIEWED">Geprüft</option>
                        <option value="PUBLISHED">Veröffentlicht</option>
                        <option value="STALE">Veraltet</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                        DE (Quelle)
                      </label>
                      <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100 min-h-[40px]">
                        {t.sourceText || <span className="italic text-gray-400">–</span>}
                      </p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">
                        EN (Übersetzung)
                      </label>
                      {editingId === t.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="w-full px-2 py-1.5 text-sm border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(t.id)}
                              disabled={saving}
                              className="px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded hover:bg-orange-700 disabled:opacity-50"
                            >
                              {saving ? "…" : "Speichern"}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-50"
                            >
                              Abbrechen
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p
                          onClick={() => startEdit(t)}
                          className="text-sm text-gray-900 bg-white p-2 rounded border border-gray-100 min-h-[40px] cursor-pointer hover:border-orange-300 transition-colors"
                        >
                          {t.translatedText || <span className="italic text-gray-400">Klicken zum Bearbeiten</span>}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
