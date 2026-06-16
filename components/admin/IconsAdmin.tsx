"use client";

import { useState } from "react";
import MediaPickerField from "./MediaPickerField";

interface DbSlot {
  id: string;
  key: string;
  label: string;
  description: string | null;
  groupName: string;
  defaultIcon: string;
  iconType: "DEFAULT" | "LIBRARY" | "MEDIA";
  libraryIcon: string | null;
  mediaId: string | null;
  mediaUrl: string | null;
  mediaAlt: string | null;
  sizeHint: string;
  colorMode: string;
  isActive: boolean;
}

interface RegistryKey {
  key: string;
  label: string;
  description: string;
  groupName: string;
  defaultIcon: string;
  sizeHint: string;
}

interface Props {
  dbSlots: DbSlot[];
  registryKeys: RegistryKey[];
}

const GROUP_LABELS: Record<string, string> = {
  navigation: "Navigation",
  ui: "UI-Elemente",
  homepage: "Homepage",
  benefits: "Vorteile & Benefits",
  nerio: "NERIO",
  service: "Service-Seiten",
  social: "Social Media",
  contact: "Kontakt",
  downloads: "Downloads",
  care: "Pflege-Symbole",
  categories: "Produktkategorien",
};

export default function IconsAdmin({ dbSlots, registryKeys }: Props) {
  const [slots, setSlots] = useState(dbSlots);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const allGroups = Array.from(
    new Set([
      ...slots.map((s) => s.groupName),
      ...registryKeys.map((r) => r.groupName),
    ]),
  ).sort();

  const mergedSlots: Array<DbSlot | { registryOnly: true } & RegistryKey> = [];
  const dbKeys = new Set(slots.map((s) => s.key));

  for (const slot of slots) {
    mergedSlots.push(slot);
  }
  for (const reg of registryKeys) {
    if (!dbKeys.has(reg.key)) {
      mergedSlots.push({ ...reg, registryOnly: true } as DbSlot & {
        registryOnly: true;
      } & RegistryKey);
    }
  }

  const filtered = mergedSlots.filter((s) => {
    if (groupFilter && s.groupName !== groupFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.key.toLowerCase().includes(q) ||
        s.label.toLowerCase().includes(q) ||
        ("description" in s &&
          s.description?.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const groupedFiltered: Record<string, typeof filtered> = {};
  for (const slot of filtered) {
    const g = slot.groupName;
    if (!groupedFiltered[g]) groupedFiltered[g] = [];
    groupedFiltered[g].push(slot);
  }

  async function handleSave(id: string, data: Partial<DbSlot>) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/icons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSlots((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  ...data,
                  mediaUrl: updated.media?.url ?? null,
                  mediaAlt: updated.media?.alt ?? null,
                }
              : s,
          ),
        );
        setEditingId(null);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Icon suchen…"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Alle Gruppen</option>
          {allGroups.map((g) => (
            <option key={g} value={g}>
              {GROUP_LABELS[g] || g}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(groupedFiltered).map(([group, items]) => (
        <div key={group} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700">
              {GROUP_LABELS[group] || group}
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({items.length})
              </span>
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {items.map((slot) => {
              const isRegistryOnly = "registryOnly" in slot;
              const isEditing =
                !isRegistryOnly && editingId === (slot as DbSlot).id;

              return (
                <div
                  key={slot.key}
                  className="px-4 py-3 flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
                    <span
                      className="w-6 h-6 text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html: isRegistryOnly
                          ? (slot as RegistryKey).defaultIcon
                          : (slot as DbSlot).defaultIcon,
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {slot.label}
                      </span>
                      <code className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                        {slot.key}
                      </code>
                      {isRegistryOnly && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                          Noch nicht synchronisiert
                        </span>
                      )}
                      {!isRegistryOnly && !(slot as DbSlot).isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                          Inaktiv
                        </span>
                      )}
                    </div>
                    {slot.description && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {slot.description}
                      </p>
                    )}

                    {isEditing && (
                      <IconEditForm
                        slot={slot as DbSlot}
                        onSave={handleSave}
                        onCancel={() => setEditingId(null)}
                        saving={saving}
                      />
                    )}
                  </div>

                  {!isRegistryOnly && !isEditing && (
                    <button
                      onClick={() =>
                        setEditingId((slot as DbSlot).id)
                      }
                      className="text-xs text-orange-600 hover:text-orange-700 px-2 py-1 border border-orange-200 rounded hover:bg-orange-50 transition-colors"
                    >
                      Bearbeiten
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-400 py-12">
          Keine Icons gefunden.
        </p>
      )}
    </div>
  );
}

function IconEditForm({
  slot,
  onSave,
  onCancel,
  saving,
}: {
  slot: DbSlot;
  onSave: (id: string, data: Partial<DbSlot>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [label, setLabel] = useState(slot.label);
  const [description, setDescription] = useState(slot.description || "");
  const [iconType, setIconType] = useState(slot.iconType);
  const [mediaId, setMediaId] = useState(slot.mediaId || "");
  const [sizeHint, setSizeHint] = useState(slot.sizeHint);
  const [colorMode, setColorMode] = useState(slot.colorMode);
  const [isActive, setIsActive] = useState(slot.isActive);

  return (
    <div className="mt-3 space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Beschreibung
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Icon-Typ
          </label>
          <select
            value={iconType}
            onChange={(e) =>
              setIconType(e.target.value as "DEFAULT" | "LIBRARY" | "MEDIA")
            }
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="DEFAULT">Standard-SVG</option>
            <option value="MEDIA">Mediathek-Bild</option>
            <option value="LIBRARY">SVG-Markup</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Größe
          </label>
          <select
            value={sizeHint}
            onChange={(e) => setSizeHint(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="xs">XS (12px)</option>
            <option value="sm">SM (14px)</option>
            <option value="md">MD (24px)</option>
            <option value="lg">LG (28px)</option>
            <option value="xl">XL (32px)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Farbmodus
          </label>
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="inherit">Erben (currentColor)</option>
            <option value="original">Original</option>
            <option value="monochrome">Monochrom</option>
          </select>
        </div>
      </div>

      {iconType === "MEDIA" && (
        <MediaPickerField
          label="Icon-Bild"
          value={mediaId}
          onChange={setMediaId}
          previewUrl={slot.mediaUrl}
          previewAlt={slot.mediaAlt}
        />
      )}

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          Aktiv
        </label>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() =>
            onSave(slot.id, {
              label,
              description,
              iconType,
              mediaId: iconType === "MEDIA" ? mediaId : null,
              sizeHint,
              colorMode,
              isActive,
            })
          }
          disabled={saving}
          className="px-3 py-1.5 text-xs font-medium text-white bg-orange-600 rounded hover:bg-orange-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Speichern…" : "Speichern"}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </button>
        <button
          onClick={() =>
            onSave(slot.id, {
              iconType: "DEFAULT",
              mediaId: null,
              libraryIcon: null,
            })
          }
          disabled={saving}
          className="ml-auto px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-red-600 transition-colors"
        >
          Zurücksetzen
        </button>
      </div>
    </div>
  );
}
