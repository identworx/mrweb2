"use client";

import { useState, useCallback } from "react";
import { getStyleLabel } from "@/lib/admin/page-section-schemas";
import PageSectionEditForm from "./PageSectionEditForm";

interface SectionRow {
  id: string;
  type: string;
  title: string | null;
  eyebrow: string | null;
  content: string | null;
  buttonLabel: string | null;
  buttonHref: string | null;
  imageId: string | null;
  settings: Record<string, unknown>;
  order: number;
  isActive: boolean;
}

interface Props {
  pageId: string;
  initialSections: SectionRow[];
  userRole: string;
}

export default function PageSectionsEditor({ pageId, initialSections, userRole }: Props) {
  const [sections, setSections] = useState<SectionRow[]>(initialSections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const canEdit = userRole !== "VIEWER";
  const canDelete = userRole === "ADMIN";

  const reload = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/page-sections?pageId=${pageId}`);
      if (res.ok) {
        const data = await res.json();
        setSections(
          data.map((s: Record<string, unknown>) => ({
            ...s,
            settings: parseSettings(s.settings),
          })),
        );
      }
    } catch { /* ignore */ }
  }, [pageId]);

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleCreate(data: {
    type: string;
    title: string;
    eyebrow: string;
    content: string;
    buttonLabel: string;
    buttonHref: string;
    settings: Record<string, unknown>;
    order: number;
    isActive: boolean;
  }) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/page-sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, pageId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Fehler");
      }
      await reload();
      setCreating(false);
      showMessage("success", "Sektion erstellt.");
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "Fehler beim Erstellen");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string, data: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/page-sections?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Fehler");
      }
      await reload();
      setEditingId(null);
      showMessage("success", "Sektion gespeichert.");
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Sektion "${title || "Ohne Titel"}" endgültig löschen?`)) return;
    try {
      const res = await fetch(`/api/admin/page-sections?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Fehler");
      }
      await reload();
      showMessage("success", "Sektion gelöscht.");
    } catch (err) {
      showMessage("error", err instanceof Error ? err.message : "Fehler beim Löschen");
    }
  }

  async function handleToggleActive(id: string, currentActive: boolean) {
    await handleUpdate(id, { isActive: !currentActive });
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const idx = sections.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sections.length) return;

    const a = sections[idx];
    const b = sections[swapIdx];

    setSaving(true);
    try {
      await fetch(`/api/admin/page-sections?id=${a.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: b.order }),
      });
      await fetch(`/api/admin/page-sections?id=${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: a.order }),
      });
      await reload();
    } catch {
      showMessage("error", "Fehler beim Sortieren");
    } finally {
      setSaving(false);
    }
  }

  async function handleDuplicate(section: SectionRow) {
    const maxOrder = sections.reduce((max, s) => Math.max(max, s.order), 0);
    await handleCreate({
      type: section.type,
      title: section.title ? `${section.title} (Kopie)` : "",
      eyebrow: section.eyebrow || "",
      content: section.content || "",
      buttonLabel: section.buttonLabel || "",
      buttonHref: section.buttonHref || "",
      settings: { ...section.settings },
      order: maxOrder + 1,
      isActive: false,
    });
  }

  const newSectionData = {
    type: "CUSTOM" as string,
    title: "",
    eyebrow: "",
    content: "",
    buttonLabel: "",
    buttonHref: "",
    settings: { style: "" } as Record<string, unknown>,
    order: sections.length > 0 ? Math.max(...sections.map((s) => s.order)) + 1 : 0,
    isActive: true,
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Seitenbereiche ({sections.length})
        </h2>
        {canEdit && !creating && !editingId && (
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            + Sektion
          </button>
        )}
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

      {creating && (
        <div className="border border-orange-200 rounded-lg p-5 bg-orange-50/30">
          <p className="text-sm font-semibold text-gray-700 mb-4">Neue Sektion</p>
          <PageSectionEditForm
            section={newSectionData}
            onSave={async (data) => handleCreate(data)}
            onCancel={() => setCreating(false)}
            saving={saving}
          />
        </div>
      )}

      {sections.length === 0 && !creating && (
        <p className="text-sm text-gray-400 py-4 text-center">
          Noch keine Sektionen vorhanden.
        </p>
      )}

      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`border rounded-lg overflow-hidden ${
              section.isActive
                ? "border-gray-200"
                : "border-gray-200 bg-gray-50 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleMove(section.id, "up")}
                  disabled={idx === 0 || !canEdit || saving}
                  className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                  title="Nach oben"
                >
                  ▲
                </button>
                <button
                  onClick={() => handleMove(section.id, "down")}
                  disabled={idx === sections.length - 1 || !canEdit || saving}
                  className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                  title="Nach unten"
                >
                  ▼
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {section.title || "(Ohne Titel)"}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    #{section.order}
                  </span>
                  {!section.isActive && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-600">
                      Inaktiv
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-orange-600 font-medium">
                    {getStyleLabel((section.settings?.style as string) || "")}
                  </span>
                  <span className="text-xs text-gray-400">{section.type}</span>
                </div>
              </div>

              {canEdit && editingId !== section.id && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setEditingId(section.id)}
                    className="px-2 py-1 text-xs text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleToggleActive(section.id, section.isActive)}
                    disabled={saving}
                    className="px-2 py-1 text-xs text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                  >
                    {section.isActive ? "Deaktivieren" : "Aktivieren"}
                  </button>
                  <button
                    onClick={() => handleDuplicate(section)}
                    disabled={saving}
                    className="px-2 py-1 text-xs text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                  >
                    Duplizieren
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(section.id, section.title || "")}
                      disabled={saving}
                      className="px-2 py-1 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Löschen
                    </button>
                  )}
                </div>
              )}
            </div>

            {editingId === section.id && (
              <div className="border-t border-gray-200 p-5 bg-gray-50/50">
                <PageSectionEditForm
                  section={{
                    id: section.id,
                    type: section.type,
                    title: section.title || "",
                    eyebrow: section.eyebrow || "",
                    content: section.content || "",
                    buttonLabel: section.buttonLabel || "",
                    buttonHref: section.buttonHref || "",
                    settings: section.settings || {},
                    order: section.order,
                    isActive: section.isActive,
                  }}
                  onSave={async (data) => {
                    const { ...rest } = data;
                    await handleUpdate(section.id, rest);
                  }}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function parseSettings(raw: unknown): Record<string, unknown> {
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    return raw as Record<string, unknown>;
  }
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) return parsed;
    } catch { /* ignore */ }
  }
  return {};
}
