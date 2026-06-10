"use client";

import { useState } from "react";
import { SECTION_STYLES, getStyleDef } from "@/lib/admin/page-section-schemas";
import RichTextEditor from "./RichTextEditor";

interface SectionData {
  id?: string;
  type: string;
  title: string;
  eyebrow: string;
  content: string;
  buttonLabel: string;
  buttonHref: string;
  settings: Record<string, unknown>;
  order: number;
  isActive: boolean;
}

interface Props {
  section: SectionData;
  onSave: (data: SectionData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

export default function PageSectionEditForm({ section, onSave, onCancel, saving }: Props) {
  const [form, setForm] = useState<SectionData>({ ...section });
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState("");

  const style = (form.settings.style as string) || "";
  const styleDef = getStyleDef(style);

  function updateField(field: keyof SectionData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateSettings(key: string, value: unknown) {
    setForm((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }));
  }

  function handleStyleChange(newStyle: string) {
    const def = getStyleDef(newStyle);
    if (def) {
      setForm((prev) => ({
        ...prev,
        type: def.sectionType,
        settings: { ...def.defaultSettings },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        settings: { ...prev.settings, style: newStyle },
      }));
    }
  }

  function handleSubmit() {
    setJsonError(null);
    onSave(form);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
          <select
            value={style}
            onChange={(e) => handleStyleChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">— Kein Style —</option>
            {SECTION_STYLES.map((s) => (
              <option key={s.style} value={s.style}>
                {s.label}
              </option>
            ))}
          </select>
          {styleDef && (
            <p className="text-xs text-gray-400 mt-1">{styleDef.description}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Typ (intern)</label>
          <input
            type="text"
            value={form.type}
            readOnly
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
          <input
            type="text"
            value={form.eyebrow}
            onChange={(e) => updateField("eyebrow", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {(style === "cross-link" || style === "cta" || style === "text" || style === "home-hero" || style === "image-text-feature" || style === "collection-showcase" || style === "sustainability-stats" || style === "downloads-teaser" || style === "news-teaser" || !style) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inhalt</label>
          <RichTextEditor
            value={form.content}
            onChange={(html) => updateField("content", html)}
            placeholder="Inhalt eingeben..."
          />
        </div>
      )}

      {(style === "cross-link" || style === "highlight-cards" || style === "image-text-feature" || style === "collection-showcase" || style === "sustainability-stats" || style === "downloads-teaser" || style === "news-teaser" || !style) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Label</label>
            <input
              type="text"
              value={form.buttonLabel}
              onChange={(e) => updateField("buttonLabel", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Href</label>
            <input
              type="text"
              value={form.buttonHref}
              onChange={(e) => updateField("buttonHref", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {style === "cta" && (
        <CtaFields
          buttonLabel={form.buttonLabel}
          buttonHref={form.buttonHref}
          settings={form.settings}
          updateField={updateField}
          updateSettings={updateSettings}
        />
      )}
      {style === "care-list" && <CareListFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "highlight-cards" && <HighlightCardsFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "fabric-cards" && <FabricCardsFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "comparison-table" && <ComparisonTableFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "home-hero" && (
        <HomeHeroFields
          settings={form.settings}
          buttonLabel={form.buttonLabel}
          buttonHref={form.buttonHref}
          updateSettings={updateSettings}
          updateField={updateField}
        />
      )}
      {style === "value-props" && <ValuePropsFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "image-text-feature" && <BulletsFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "sustainability-stats" && <SustainabilityStatsFields settings={form.settings} updateSettings={updateSettings} />}

      {!styleDef && style !== "" && (
        <JsonFallbackField
          settings={form.settings}
          onChange={(s) => updateField("settings", s)}
          error={jsonError}
          setError={setJsonError}
          jsonText={jsonText}
          setJsonText={setJsonText}
        />
      )}

      <div className="flex items-center gap-2 pt-2">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => updateField("isActive", e.target.checked)}
            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
          />
          Aktiv
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={saving || !!jsonError}
          className="inline-flex items-center px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Speichert..." : "Sektion speichern"}
        </button>
        <button
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </div>
  );
}

function CtaFields({
  buttonLabel,
  buttonHref,
  settings,
  updateField,
  updateSettings,
}: {
  buttonLabel: string;
  buttonHref: string;
  settings: Record<string, unknown>;
  updateField: (field: "buttonLabel" | "buttonHref", value: string) => void;
  updateSettings: (key: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CTA Buttons</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primär Label</label>
          <input
            type="text"
            value={buttonLabel}
            onChange={(e) => updateField("buttonLabel", e.target.value)}
            placeholder="z.B. Kontakt aufnehmen"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primär Href</label>
          <input
            type="text"
            value={buttonHref}
            onChange={(e) => updateField("buttonHref", e.target.value)}
            placeholder="z.B. /kontakt"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sekundär Label</label>
          <input
            type="text"
            value={(settings.secondaryLabel as string) || ""}
            onChange={(e) => updateSettings("secondaryLabel", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sekundär Href</label>
          <input
            type="text"
            value={(settings.secondaryHref as string) || ""}
            onChange={(e) => updateSettings("secondaryHref", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

function CareListFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const items = Array.isArray(settings.items) ? (settings.items as string[]) : [];

  function updateItem(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    updateSettings("items", next);
  }

  function addItem() {
    updateSettings("items", [...items, ""]);
  }

  function removeItem(index: number) {
    updateSettings("items", items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Einträge ({items.length})</p>
        <button
          type="button"
          onClick={addItem}
          className="text-xs text-orange-600 hover:text-orange-700 font-medium"
        >
          + Eintrag
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1">
            <RichTextEditor
              value={item}
              onChange={(html) => updateItem(i, html)}
              placeholder="Eintrag..."
            />
          </div>
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="mt-1 text-gray-400 hover:text-red-500 text-sm"
            title="Entfernen"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

function HighlightCardsFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const items = Array.isArray(settings.items) ? (settings.items as string[]) : [];

  function updateItem(index: number, value: string) {
    const next = [...items];
    next[index] = value;
    updateSettings("items", next);
  }

  function addItem() {
    updateSettings("items", [...items, ""]);
  }

  function removeItem(index: number) {
    updateSettings("items", items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highlights ({items.length})</p>
        <button
          type="button"
          onClick={addItem}
          className="text-xs text-orange-600 hover:text-orange-700 font-medium"
        >
          + Highlight
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="text-gray-400 hover:text-red-500 text-sm"
            title="Entfernen"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

interface FabricCard {
  name: string;
  subtitle?: string;
  material: string;
  weight: string;
  dyeing: string;
  comfort: string;
  cushionThickness?: string;
  description?: string;
}

function FabricCardsFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const cards = Array.isArray(settings.cards) ? (settings.cards as FabricCard[]) : [];

  function updateCard(index: number, field: keyof FabricCard, value: string) {
    const next = cards.map((c, i) => (i === index ? { ...c, [field]: value } : c));
    updateSettings("cards", next);
  }

  function addCard() {
    updateSettings("cards", [
      ...cards,
      { name: "", material: "", weight: "", dyeing: "", comfort: "" },
    ]);
  }

  function removeCard(index: number) {
    updateSettings("cards", cards.filter((_, i) => i !== index));
  }

  const fields: { key: keyof FabricCard; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "subtitle", label: "Untertitel" },
    { key: "material", label: "Material" },
    { key: "weight", label: "Gewicht" },
    { key: "dyeing", label: "Färbung" },
    { key: "comfort", label: "Komfort" },
    { key: "cushionThickness", label: "Auflagenstärke" },
    { key: "description", label: "Beschreibung" },
  ];

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stoff-Karten ({cards.length})</p>
        <button
          type="button"
          onClick={addCard}
          className="text-xs text-orange-600 hover:text-orange-700 font-medium"
        >
          + Karte
        </button>
      </div>
      {cards.map((card, ci) => (
        <div key={ci} className="p-4 bg-white rounded border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {card.name || `Karte ${ci + 1}`}
            </span>
            <button
              type="button"
              onClick={() => removeCard(ci)}
              className="text-gray-400 hover:text-red-500 text-xs"
            >
              Entfernen
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs text-gray-500 mb-0.5">{f.label}</label>
                <input
                  type="text"
                  value={card[f.key] ?? ""}
                  onChange={(e) => updateCard(ci, f.key, e.target.value)}
                  className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ComparisonRow {
  property: string;
  [key: string]: string;
}

function ComparisonTableFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const columns = Array.isArray(settings.columns) ? (settings.columns as string[]) : [];
  const rows = Array.isArray(settings.rows) ? (settings.rows as ComparisonRow[]) : [];

  function updateColumn(index: number, value: string) {
    const oldName = columns[index];
    const next = [...columns];
    next[index] = value;
    updateSettings("columns", next);
    const newKey = value.toLowerCase();
    const oldKey = oldName.toLowerCase();
    if (newKey !== oldKey) {
      const updatedRows = rows.map((r) => {
        const row = { ...r };
        row[newKey] = row[oldKey] || "";
        delete row[oldKey];
        return row;
      });
      updateSettings("rows", updatedRows);
    }
  }

  function addColumn() {
    const name = `Spalte ${columns.length + 1}`;
    updateSettings("columns", [...columns, name]);
    updateSettings(
      "rows",
      rows.map((r) => ({ ...r, [name.toLowerCase()]: "" })),
    );
  }

  function removeColumn(index: number) {
    const key = columns[index].toLowerCase();
    updateSettings(
      "columns",
      columns.filter((_, i) => i !== index),
    );
    updateSettings(
      "rows",
      rows.map((r) => {
        const row = { ...r };
        delete row[key];
        return row;
      }),
    );
  }

  function updateRow(ri: number, key: string, value: string) {
    const next = rows.map((r, i) => (i === ri ? { ...r, [key]: value } : r));
    updateSettings("rows", next);
  }

  function addRow() {
    const row: ComparisonRow = { property: "" };
    columns.forEach((c) => {
      row[c.toLowerCase()] = "";
    });
    updateSettings("rows", [...rows, row]);
  }

  function removeRow(index: number) {
    updateSettings("rows", rows.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vergleichstabelle</p>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Spalten ({columns.length})</span>
          <button
            type="button"
            onClick={addColumn}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            + Spalte
          </button>
        </div>
        {columns.map((col, ci) => (
          <div key={ci} className="flex items-center gap-2">
            <input
              type="text"
              value={col}
              onChange={(e) => updateColumn(ci, e.target.value)}
              className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => removeColumn(ci)}
              className="text-gray-400 hover:text-red-500 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Zeilen ({rows.length})</span>
          <button
            type="button"
            onClick={addRow}
            className="text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            + Zeile
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-xs text-gray-500 pb-1 pr-2">Eigenschaft</th>
                {columns.map((c) => (
                  <th key={c} className="text-left text-xs text-gray-500 pb-1 pr-2">{c}</th>
                ))}
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  <td className="pr-2 pb-1">
                    <input
                      type="text"
                      value={row.property}
                      onChange={(e) => updateRow(ri, "property", e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </td>
                  {columns.map((c) => (
                    <td key={c} className="pr-2 pb-1">
                      <input
                        type="text"
                        value={row[c.toLowerCase()] || ""}
                        onChange={(e) => updateRow(ri, c.toLowerCase(), e.target.value)}
                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </td>
                  ))}
                  <td className="pb-1">
                    <button type="button" onClick={() => removeRow(ri)} className="text-gray-400 hover:text-red-500 text-xs">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function HomeHeroFields({
  settings,
  buttonLabel,
  buttonHref,
  updateSettings,
  updateField,
}: {
  settings: Record<string, unknown>;
  buttonLabel: string;
  buttonHref: string;
  updateSettings: (key: string, value: unknown) => void;
  updateField: (field: "buttonLabel" | "buttonHref", value: string) => void;
}) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hero Einstellungen</p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subheadline</label>
        <input
          type="text"
          value={(settings.subheadline as string) || ""}
          onChange={(e) => updateSettings("subheadline", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA 1 Label</label>
          <input
            type="text"
            value={buttonLabel}
            onChange={(e) => updateField("buttonLabel", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA 1 Href</label>
          <input
            type="text"
            value={buttonHref}
            onChange={(e) => updateField("buttonHref", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA 2 Label</label>
          <input
            type="text"
            value={(settings.secondaryLabel as string) || ""}
            onChange={(e) => updateSettings("secondaryLabel", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">CTA 2 Href</label>
          <input
            type="text"
            value={(settings.secondaryHref as string) || ""}
            onChange={(e) => updateSettings("secondaryHref", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

interface ValuePropCard {
  iconKey: string;
  title: string;
  text: string;
}

function ValuePropsFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const cards = Array.isArray(settings.cards) ? (settings.cards as ValuePropCard[]) : [];

  function updateCard(index: number, field: keyof ValuePropCard, value: string) {
    const next = cards.map((c, i) => (i === index ? { ...c, [field]: value } : c));
    updateSettings("cards", next);
  }

  function addCard() {
    updateSettings("cards", [...cards, { iconKey: "comfort", title: "", text: "" }]);
  }

  function removeCard(index: number) {
    updateSettings("cards", cards.filter((_, i) => i !== index));
  }

  const iconOptions = ["comfort", "quality", "sustainability", "design"];

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Feature Cards ({cards.length})</p>
        <button type="button" onClick={addCard} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Karte</button>
      </div>
      {cards.map((card, ci) => (
        <div key={ci} className="p-4 bg-white rounded border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{card.title || `Karte ${ci + 1}`}</span>
            <button type="button" onClick={() => removeCard(ci)} className="text-gray-400 hover:text-red-500 text-xs">Entfernen</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Icon</label>
              <select
                value={card.iconKey}
                onChange={(e) => updateCard(ci, "iconKey", e.target.value)}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {iconOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Titel</label>
              <input
                type="text"
                value={card.title}
                onChange={(e) => updateCard(ci, "title", e.target.value)}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs text-gray-500 mb-0.5">Text</label>
              <textarea
                rows={2}
                value={card.text}
                onChange={(e) => updateCard(ci, "text", e.target.value)}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BulletsFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const bullets = Array.isArray(settings.bullets) ? (settings.bullets as string[]) : [];

  function updateItem(index: number, value: string) {
    const next = [...bullets];
    next[index] = value;
    updateSettings("bullets", next);
  }

  function addItem() {
    updateSettings("bullets", [...bullets, ""]);
  }

  function removeItem(index: number) {
    updateSettings("bullets", bullets.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Bulletpoints ({bullets.length})</p>
        <button type="button" onClick={addItem} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Punkt</button>
      </div>
      {bullets.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateItem(i, e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button type="button" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 text-sm" title="Entfernen">✕</button>
        </div>
      ))}
    </div>
  );
}

interface StatItem {
  value: string;
  label: string;
  detail: string;
}

function SustainabilityStatsFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const stats = Array.isArray(settings.stats) ? (settings.stats as StatItem[]) : [];

  function updateStat(index: number, field: keyof StatItem, value: string) {
    const next = stats.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    updateSettings("stats", next);
  }

  function addStat() {
    updateSettings("stats", [...stats, { value: "", label: "", detail: "" }]);
  }

  function removeStat(index: number) {
    updateSettings("stats", stats.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Statistiken ({stats.length})</p>
        <button type="button" onClick={addStat} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Statistik</button>
      </div>
      {stats.map((stat, si) => (
        <div key={si} className="p-4 bg-white rounded border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{stat.value || `Statistik ${si + 1}`}</span>
            <button type="button" onClick={() => removeStat(si)} className="text-gray-400 hover:text-red-500 text-xs">Entfernen</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Wert</label>
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateStat(si, "value", e.target.value)}
                placeholder="z.B. 42 %"
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Label</label>
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(si, "label", e.target.value)}
                placeholder="z.B. weniger Wasser"
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Detail</label>
              <input
                type="text"
                value={stat.detail}
                onChange={(e) => updateStat(si, "detail", e.target.value)}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function JsonFallbackField({
  settings,
  onChange,
  error,
  setError,
  jsonText,
  setJsonText,
}: {
  settings: Record<string, unknown>;
  onChange: (s: Record<string, unknown>) => void;
  error: string | null;
  setError: (e: string | null) => void;
  jsonText: string;
  setJsonText: (t: string) => void;
}) {
  const initialText = jsonText || JSON.stringify(settings, null, 2);

  function handleChange(text: string) {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        setError("Settings muss ein JSON-Objekt sein");
        return;
      }
      setError(null);
      onChange(parsed);
    } catch {
      setError("Ungültiges JSON");
    }
  }

  return (
    <div className="space-y-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
      <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider">
        Settings JSON (Fallback)
      </p>
      <textarea
        rows={8}
        defaultValue={initialText}
        onChange={(e) => handleChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
          error ? "border-red-300 bg-red-50" : "border-gray-300"
        }`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
