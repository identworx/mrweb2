"use client";

import { useState } from "react";
import { SECTION_STYLES, getStyleDef, isHelperSection } from "@/lib/admin/page-section-schemas";
import RichTextEditor from "./RichTextEditor";
import MediaPickerField from "./MediaPickerField";

interface SectionData {
  id?: string;
  type: string;
  title: string;
  eyebrow: string;
  content: string;
  buttonLabel: string;
  buttonHref: string;
  imageId?: string;
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
  const helper = isHelperSection(form.settings);

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
    if (helper) return;
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
      {helper && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-700 uppercase tracking-wider">
              Helper-Section
            </span>
            <span className="text-xs text-blue-600 font-mono">{style}</span>
          </div>
          <p className="text-xs text-blue-700 leading-relaxed">
            Diese Section dient als Datenquelle und wird nicht direkt als eigener Seitenblock gerendert.
          </p>
        </div>
      )}

      {!helper && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Style</label>
            <select
              value={style}
              onChange={(e) => handleStyleChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">— Kein Style —</option>
              {SECTION_STYLES.filter((s) => !isHelperSection(s.defaultSettings)).map((s) => (
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
      )}

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

      {(style === "cross-link" || style === "cta" || style === "text" || style === "home-hero" || style === "image-text-feature" || style === "collection-showcase" || style === "sustainability-stats" || style === "downloads-teaser" || style === "news-teaser" || style === "process-chain" || style === "fabric-pattern-overview" || style === "collection-consultation-card" || style === "collection-benefits" || style === "collection-cta" || style === "materials-catalog-cta" || style === "materials-technology" || style === "materials-olefin" || style === "materials-oceancycle" || style === "nerio-story" || style === "nerio-oceancycle" || style === "nerio-promise" || style === "nerio-highlights" || style === "nerio-technical-facts" || style === "nerio-products-preview" || style === "nerio-videos" || style === "nerio-final-cta" || !style) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inhalt</label>
          <RichTextEditor
            value={form.content}
            onChange={(html) => updateField("content", html)}
            placeholder="Inhalt eingeben..."
          />
        </div>
      )}

      {(style === "cross-link" || style === "highlight-cards" || style === "image-text-feature" || style === "value-props" || style === "collection-showcase" || style === "sustainability-stats" || style === "downloads-teaser" || style === "news-teaser" || style === "collection-consultation-card" || style === "materials-catalog-cta" || style === "nerio-final-cta" || !style) && (
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

      {(style === "home-hero" || style === "image-text-feature" || style === "materials-olefin" || style === "nerio-story") && (
        <MediaPickerField
          label="Bild"
          value={form.imageId || ""}
          onChange={(id) => updateField("imageId", id || undefined)}
        />
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
      {style === "process-chain" && <ProcessChainFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "fabric-pattern-overview" && <FabricPatternOverviewFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "collection-consultation-card" && (
        <CollectionConsultationCardFields
          settings={form.settings}
          updateSettings={updateSettings}
        />
      )}
      {style === "collection-benefits" && (
        <CollectionBenefitsFields
          settings={form.settings}
          updateSettings={updateSettings}
        />
      )}
      {style === "collection-cta" && (
        <CtaFields
          buttonLabel={form.buttonLabel}
          buttonHref={form.buttonHref}
          settings={form.settings}
          updateField={updateField}
          updateSettings={updateSettings}
        />
      )}
      {style === "materials-technology" && <MaterialsTechnologyFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "materials-olefin" && <MaterialsOlefinFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "materials-oceancycle" && <MaterialsOceanCycleFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "nerio-oceancycle" && <NerioOceanCycleFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "nerio-promise" && <NerioPromiseFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "nerio-highlights" && <NerioHighlightsFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "nerio-technical-facts" && <NerioTechnicalFactsFields settings={form.settings} updateSettings={updateSettings} />}
      {style === "nerio-videos" && <NerioVideosFields settings={form.settings} updateSettings={updateSettings} />}

      {helper && (
        <details className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <summary className="text-xs font-medium text-gray-500 cursor-pointer select-none">
            Settings JSON (geschützt)
          </summary>
          <pre className="mt-2 text-xs text-gray-400 font-mono whitespace-pre-wrap break-words">
            {JSON.stringify(form.settings, null, 2)}
          </pre>
        </details>
      )}

      {!styleDef && style !== "" && !helper && (
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

interface ProcessStep {
  title: string;
  description: string;
}

function ProcessChainFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const steps = Array.isArray(settings.steps) ? (settings.steps as ProcessStep[]) : [];
  const highlights = Array.isArray(settings.highlights) ? (settings.highlights as string[]) : [];

  function updateStep(index: number, field: keyof ProcessStep, value: string) {
    const next = steps.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    updateSettings("steps", next);
  }

  function addStep() {
    updateSettings("steps", [...steps, { title: "", description: "" }]);
  }

  function removeStep(index: number) {
    updateSettings("steps", steps.filter((_, i) => i !== index));
  }

  function updateHighlight(index: number, value: string) {
    const next = [...highlights];
    next[index] = value;
    updateSettings("highlights", next);
  }

  function addHighlight() {
    updateSettings("highlights", [...highlights, ""]);
  }

  function removeHighlight(index: number) {
    updateSettings("highlights", highlights.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Schritte ({steps.length})</p>
          <button type="button" onClick={addStep} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Schritt</button>
        </div>
        {steps.map((step, i) => (
          <div key={i} className="p-4 bg-white rounded border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{step.title || `Schritt ${i + 1}`}</span>
              <button type="button" onClick={() => removeStep(i)} className="text-gray-400 hover:text-red-500 text-xs">Entfernen</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Titel</label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(i, "title", e.target.value)}
                  className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Beschreibung</label>
                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => updateStep(i, "description", e.target.value)}
                  className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highlights ({highlights.length})</p>
          <button type="button" onClick={addHighlight} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Highlight</button>
        </div>
        {highlights.map((hl, i) => (
          <div key={i} className="flex items-start gap-2">
            <input
              type="text"
              value={hl}
              onChange={(e) => updateHighlight(i, e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button type="button" onClick={() => removeHighlight(i)} className="text-gray-400 hover:text-red-500 text-sm" title="Entfernen">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PatternColor {
  name: string;
  hex: string;
}

interface PatternEntry {
  name: string;
  thumbnailUrl?: string;
  colors: PatternColor[];
  availableCategories?: string[];
}

interface PatternGroupEntry {
  name: string;
  quality: string;
  description: string;
  patterns: PatternEntry[];
}

interface CategoryIconEntry {
  categorySlug: string;
  categoryName: string;
  iconUrl?: string;
}

function FabricPatternOverviewFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const groups = Array.isArray(settings.groups) ? (settings.groups as PatternGroupEntry[]) : [];
  const categoryIcons = Array.isArray(settings.categoryIcons) ? (settings.categoryIcons as CategoryIconEntry[]) : [];

  /* ---- Category Icons ---- */
  function updateCategoryIcon(ci: number, field: keyof CategoryIconEntry, value: string) {
    const next = categoryIcons.map((c, i) => (i === ci ? { ...c, [field]: value } : c));
    updateSettings("categoryIcons", next);
  }

  function addCategoryIcon() {
    updateSettings("categoryIcons", [...categoryIcons, { categorySlug: "", categoryName: "", iconUrl: "" }]);
  }

  function removeCategoryIcon(ci: number) {
    updateSettings("categoryIcons", categoryIcons.filter((_, i) => i !== ci));
  }

  /* ---- Groups ---- */
  function updateGroup(gi: number, field: keyof Omit<PatternGroupEntry, "patterns">, value: string) {
    const next = groups.map((g, i) => (i === gi ? { ...g, [field]: value } : g));
    updateSettings("groups", next);
  }

  function addGroup() {
    updateSettings("groups", [
      ...groups,
      { name: "", quality: "", description: "", patterns: [] },
    ]);
  }

  function removeGroup(gi: number) {
    updateSettings("groups", groups.filter((_, i) => i !== gi));
  }

  /* ---- Patterns ---- */
  function updatePattern(gi: number, pi: number, field: string, value: unknown) {
    const next = groups.map((g, i) => {
      if (i !== gi) return g;
      const patterns = g.patterns.map((p, j) => (j === pi ? { ...p, [field]: value } : p));
      return { ...g, patterns };
    });
    updateSettings("groups", next);
  }

  function addPattern(gi: number) {
    const next = groups.map((g, i) => {
      if (i !== gi) return g;
      return { ...g, patterns: [...g.patterns, { name: "", thumbnailUrl: "", colors: [{ name: "", hex: "#000000" }], availableCategories: [] }] };
    });
    updateSettings("groups", next);
  }

  function removePattern(gi: number, pi: number) {
    const next = groups.map((g, i) => {
      if (i !== gi) return g;
      return { ...g, patterns: g.patterns.filter((_, j) => j !== pi) };
    });
    updateSettings("groups", next);
  }

  function toggleCategory(gi: number, pi: number, slug: string) {
    const next = groups.map((g, i) => {
      if (i !== gi) return g;
      const patterns = g.patterns.map((p, j) => {
        if (j !== pi) return p;
        const cats = p.availableCategories || [];
        const updated = cats.includes(slug) ? cats.filter((c) => c !== slug) : [...cats, slug];
        return { ...p, availableCategories: updated };
      });
      return { ...g, patterns };
    });
    updateSettings("groups", next);
  }

  /* ---- Colors ---- */
  function updateColor(gi: number, pi: number, ci: number, field: keyof PatternColor, value: string) {
    const next = groups.map((g, i) => {
      if (i !== gi) return g;
      const patterns = g.patterns.map((p, j) => {
        if (j !== pi) return p;
        const colors = p.colors.map((c, k) => (k === ci ? { ...c, [field]: value } : c));
        return { ...p, colors };
      });
      return { ...g, patterns };
    });
    updateSettings("groups", next);
  }

  function addColor(gi: number, pi: number) {
    const next = groups.map((g, i) => {
      if (i !== gi) return g;
      const patterns = g.patterns.map((p, j) => {
        if (j !== pi) return p;
        return { ...p, colors: [...p.colors, { name: "", hex: "#000000" }] };
      });
      return { ...g, patterns };
    });
    updateSettings("groups", next);
  }

  function removeColor(gi: number, pi: number, ci: number) {
    const next = groups.map((g, i) => {
      if (i !== gi) return g;
      const patterns = g.patterns.map((p, j) => {
        if (j !== pi) return p;
        return { ...p, colors: p.colors.filter((_, k) => k !== ci) };
      });
      return { ...g, patterns };
    });
    updateSettings("groups", next);
  }

  const inputCn = "w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent";

  return (
    <div className="space-y-6">
      {/* Category Icons */}
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Produkt-Zeichnungen ({categoryIcons.length})</p>
          <button type="button" onClick={addCategoryIcon} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Kategorie</button>
        </div>
        <p className="text-[11px] text-gray-400">Strichzeichnungen der Produktkategorien. Bilder in der Mediathek hochladen und URL hier einfügen.</p>
        {categoryIcons.map((cat, ci) => (
          <div key={ci} className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200">
            {cat.iconUrl && (
              <img src={cat.iconUrl} alt="" className="w-8 h-8 object-contain border border-gray-200 bg-gray-50 p-0.5" />
            )}
            <input type="text" value={cat.categoryName} onChange={(e) => updateCategoryIcon(ci, "categoryName", e.target.value)} placeholder="Name" className="w-28 rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            <input type="text" value={cat.categorySlug} onChange={(e) => updateCategoryIcon(ci, "categorySlug", e.target.value)} placeholder="slug" className="w-28 rounded border border-gray-300 px-2 py-1 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            <input type="text" value={cat.iconUrl || ""} onChange={(e) => updateCategoryIcon(ci, "iconUrl", e.target.value)} placeholder="Bild-URL" className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            <button type="button" onClick={() => removeCategoryIcon(ci)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
          </div>
        ))}
      </div>

      {/* Groups */}
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stoffgruppen ({groups.length})</p>
          <button type="button" onClick={addGroup} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Gruppe</button>
        </div>

        {groups.map((group, gi) => (
          <div key={gi} className="p-4 bg-white rounded border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{group.name || `Gruppe ${gi + 1}`}</span>
              <button type="button" onClick={() => removeGroup(gi)} className="text-gray-400 hover:text-red-500 text-xs">Entfernen</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Name</label>
                <input type="text" value={group.name} onChange={(e) => updateGroup(gi, "name", e.target.value)} className={inputCn} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Qualität</label>
                <input type="text" value={group.quality} onChange={(e) => updateGroup(gi, "quality", e.target.value)} className={inputCn} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Beschreibung</label>
                <input type="text" value={group.description} onChange={(e) => updateGroup(gi, "description", e.target.value)} className={inputCn} />
              </div>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Muster ({group.patterns.length})</span>
                <button type="button" onClick={() => addPattern(gi)} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Muster</button>
              </div>
              {group.patterns.map((pattern, pi) => (
                <div key={pi} className="p-3 bg-gray-50 rounded border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <input type="text" value={pattern.name} onChange={(e) => updatePattern(gi, pi, "name", e.target.value)} placeholder="Mustername" className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                    <button type="button" onClick={() => removePattern(gi, pi)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                  </div>

                  {/* Thumbnail */}
                  <div>
                    <label className="block text-[11px] text-gray-500 mb-0.5">Stoff-Thumbnail URL</label>
                    <div className="flex items-center gap-2">
                      <input type="text" value={pattern.thumbnailUrl || ""} onChange={(e) => updatePattern(gi, pi, "thumbnailUrl", e.target.value)} placeholder="/api/media/..." className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                      {pattern.thumbnailUrl && (
                        <img src={pattern.thumbnailUrl} alt="" className="w-10 h-8 object-cover border border-gray-200" />
                      )}
                    </div>
                  </div>

                  {/* Available Categories */}
                  {categoryIcons.length > 0 && (
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">Verfügbar als</label>
                      <div className="flex flex-wrap gap-1.5">
                        {categoryIcons.map((cat) => {
                          const checked = (pattern.availableCategories || []).includes(cat.categorySlug);
                          return (
                            <label key={cat.categorySlug} className={`flex items-center gap-1 px-2 py-1 text-[11px] border cursor-pointer transition-colors ${checked ? "bg-orange-50 border-orange-300 text-orange-700" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                              <input type="checkbox" checked={checked} onChange={() => toggleCategory(gi, pi, cat.categorySlug)} className="sr-only" />
                              {cat.categoryName}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  <div className="flex flex-wrap gap-2">
                    {pattern.colors.map((color, ci) => (
                      <div key={ci} className="flex items-center gap-1">
                        <input type="color" value={color.hex} onChange={(e) => updateColor(gi, pi, ci, "hex", e.target.value)} className="w-6 h-6 rounded border border-gray-300 cursor-pointer" />
                        <input type="text" value={color.name} onChange={(e) => updateColor(gi, pi, ci, "name", e.target.value)} placeholder="Farbe" className="w-24 rounded border border-gray-300 px-1.5 py-0.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                        <button type="button" onClick={() => removeColor(gi, pi, ci)} className="text-gray-400 hover:text-red-500 text-[10px]">✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => addColor(gi, pi)} className="text-[10px] text-orange-600 hover:text-orange-700 font-medium px-1">+ Farbe</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollectionConsultationCardFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sekundärer Link</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sekundär Label</label>
          <input
            type="text"
            value={(settings.secondaryLabel as string) || ""}
            onChange={(e) => updateSettings("secondaryLabel", e.target.value)}
            placeholder="z.B. Kontakt aufnehmen"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sekundär Href</label>
          <input
            type="text"
            value={(settings.secondaryHref as string) || ""}
            onChange={(e) => updateSettings("secondaryHref", e.target.value)}
            placeholder="z.B. /kontakt"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}

interface CollectionBenefitItem {
  iconKey: string;
  title: string;
  text: string;
}

const BENEFIT_ICON_OPTIONS = [
  { value: "sun", label: "Sonne (UV)" },
  { value: "droplet", label: "Tropfen (Wasser)" },
  { value: "shield", label: "Schild (Schutz)" },
  { value: "star", label: "Stern (Garantie)" },
];

function CollectionBenefitsFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const items = Array.isArray(settings.items) ? (settings.items as CollectionBenefitItem[]) : [];

  function updateItem(index: number, field: keyof CollectionBenefitItem, value: string) {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    updateSettings("items", next);
  }

  function addItem() {
    updateSettings("items", [...items, { iconKey: "shield", title: "", text: "" }]);
  }

  function removeItem(index: number) {
    updateSettings("items", items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Benefits ({items.length})</p>
        <button type="button" onClick={addItem} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Benefit</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="p-4 bg-white rounded border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{item.title || `Benefit ${i + 1}`}</span>
            <button type="button" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 text-xs">Entfernen</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Icon</label>
              <select
                value={item.iconKey}
                onChange={(e) => updateItem(i, "iconKey", e.target.value)}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                {BENEFIT_ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Titel</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(i, "title", e.target.value)}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Text</label>
              <textarea
                rows={2}
                value={item.text}
                onChange={(e) => updateItem(i, "text", e.target.value)}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface TechStep {
  title: string;
  label: string;
  description: string;
}

function MaterialsTechnologyFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const steps = Array.isArray(settings.steps) ? (settings.steps as TechStep[]) : [];
  const benefits = Array.isArray(settings.benefits) ? (settings.benefits as string[]) : [];

  function updateStep(index: number, field: keyof TechStep, value: string) {
    const next = steps.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    updateSettings("steps", next);
  }

  function addStep() {
    updateSettings("steps", [...steps, { title: "", label: "", description: "" }]);
  }

  function removeStep(index: number) {
    updateSettings("steps", steps.filter((_, i) => i !== index));
  }

  function updateBenefit(index: number, value: string) {
    const next = [...benefits];
    next[index] = value;
    updateSettings("benefits", next);
  }

  function addBenefit() {
    updateSettings("benefits", [...benefits, ""]);
  }

  function removeBenefit(index: number) {
    updateSettings("benefits", benefits.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Schritte ({steps.length})</p>
          <button type="button" onClick={addStep} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Schritt</button>
        </div>
        {steps.map((step, i) => (
          <div key={i} className="p-4 bg-white rounded border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{step.title || `Schritt ${i + 1}`}</span>
              <button type="button" onClick={() => removeStep(i)} className="text-gray-400 hover:text-red-500 text-xs">Entfernen</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Titel</label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(i, "title", e.target.value)}
                  placeholder="z.B. Granulat"
                  className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Label</label>
                <input
                  type="text"
                  value={step.label}
                  onChange={(e) => updateStep(i, "label", e.target.value)}
                  placeholder="z.B. 100 % PP"
                  className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs text-gray-500 mb-0.5">Beschreibung</label>
                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => updateStep(i, "description", e.target.value)}
                  className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vorteile ({benefits.length})</p>
          <button type="button" onClick={addBenefit} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Vorteil</button>
        </div>
        {benefits.map((b, i) => (
          <div key={i} className="flex items-start gap-2">
            <input
              type="text"
              value={b}
              onChange={(e) => updateBenefit(i, e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button type="button" onClick={() => removeBenefit(i)} className="text-gray-400 hover:text-red-500 text-sm" title="Entfernen">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaterialsOlefinFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const tags = Array.isArray(settings.tags) ? (settings.tags as string[]) : [];

  function updateTag(index: number, value: string) {
    const next = [...tags];
    next[index] = value;
    updateSettings("tags", next);
  }

  function addTag() {
    updateSettings("tags", [...tags, ""]);
  }

  function removeTag(index: number) {
    updateSettings("tags", tags.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags ({tags.length})</p>
        <button type="button" onClick={addTag} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Tag</button>
      </div>
      {tags.map((tag, i) => (
        <div key={i} className="flex items-start gap-2">
          <input
            type="text"
            value={tag}
            onChange={(e) => updateTag(i, e.target.value)}
            placeholder="z.B. Flexibel"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <button type="button" onClick={() => removeTag(i)} className="text-gray-400 hover:text-red-500 text-sm" title="Entfernen">✕</button>
        </div>
      ))}
    </div>
  );
}

function MaterialsOceanCycleFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const steps = Array.isArray(settings.steps) ? (settings.steps as ProcessStep[]) : [];
  const highlights = Array.isArray(settings.highlights) ? (settings.highlights as string[]) : [];

  function updateStep(index: number, field: keyof ProcessStep, value: string) {
    const next = steps.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    updateSettings("steps", next);
  }

  function addStep() {
    updateSettings("steps", [...steps, { title: "", description: "" }]);
  }

  function removeStep(index: number) {
    updateSettings("steps", steps.filter((_, i) => i !== index));
  }

  function updateHighlight(index: number, value: string) {
    const next = [...highlights];
    next[index] = value;
    updateSettings("highlights", next);
  }

  function addHighlight() {
    updateSettings("highlights", [...highlights, ""]);
  }

  function removeHighlight(index: number) {
    updateSettings("highlights", highlights.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Schritte ({steps.length})</p>
          <button type="button" onClick={addStep} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Schritt</button>
        </div>
        {steps.map((step, i) => (
          <div key={i} className="p-4 bg-white rounded border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{step.title || `Schritt ${i + 1}`}</span>
              <button type="button" onClick={() => removeStep(i)} className="text-gray-400 hover:text-red-500 text-xs">Entfernen</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Titel</label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(i, "title", e.target.value)}
                  placeholder="z.B. Sammlung"
                  className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Beschreibung</label>
                <textarea
                  rows={2}
                  value={step.description}
                  onChange={(e) => updateStep(i, "description", e.target.value)}
                  className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highlights ({highlights.length})</p>
          <button type="button" onClick={addHighlight} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Highlight</button>
        </div>
        {highlights.map((hl, i) => (
          <div key={i} className="flex items-start gap-2">
            <input
              type="text"
              value={hl}
              onChange={(e) => updateHighlight(i, e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <button type="button" onClick={() => removeHighlight(i)} className="text-gray-400 hover:text-red-500 text-sm" title="Entfernen">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NerioOceanCycleFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const steps = Array.isArray(settings.steps) ? (settings.steps as ProcessStep[]) : [];
  const highlights = Array.isArray(settings.highlights) ? (settings.highlights as string[]) : [];

  function updateStep(index: number, field: keyof ProcessStep, value: string) {
    const next = steps.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    updateSettings("steps", next);
  }
  function addStep() { updateSettings("steps", [...steps, { title: "", description: "" }]); }
  function removeStep(index: number) { updateSettings("steps", steps.filter((_, i) => i !== index)); }
  function updateHighlight(index: number, value: string) {
    const next = [...highlights]; next[index] = value; updateSettings("highlights", next);
  }
  function addHighlight() { updateSettings("highlights", [...highlights, ""]); }
  function removeHighlight(index: number) { updateSettings("highlights", highlights.filter((_, i) => i !== index)); }

  return (
    <div className="space-y-4">
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">OceanCycle Schritte ({steps.length})</p>
          <button type="button" onClick={addStep} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Schritt</button>
        </div>
        {steps.map((step, i) => (
          <div key={i} className="p-4 bg-white rounded border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{step.title || `Schritt ${i + 1}`}</span>
              <button type="button" onClick={() => removeStep(i)} className="text-gray-400 hover:text-red-500 text-xs">Entfernen</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Titel</label>
                <input type="text" value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Beschreibung</label>
                <textarea rows={2} value={step.description} onChange={(e) => updateStep(i, "description", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highlights ({highlights.length})</p>
          <button type="button" onClick={addHighlight} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Highlight</button>
        </div>
        {highlights.map((hl, i) => (
          <div key={i} className="flex items-start gap-2">
            <input type="text" value={hl} onChange={(e) => updateHighlight(i, e.target.value)} className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            <button type="button" onClick={() => removeHighlight(i)} className="text-gray-400 hover:text-red-500 text-sm" title="Entfernen">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface NerioPromiseItem {
  iconKey: string;
  title: string;
  text: string;
}

const NERIO_ICON_OPTIONS = [
  { value: "recycle", label: "Recycling" },
  { value: "droplet", label: "Tropfen (PFAS-frei)" },
  { value: "sun", label: "Sonne (Solution-Dyed)" },
  { value: "shield", label: "Schild (Langlebig)" },
];

function NerioPromiseFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const items = Array.isArray(settings.items) ? (settings.items as NerioPromiseItem[]) : [];

  function updateItem(index: number, field: keyof NerioPromiseItem, value: string) {
    const next = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    updateSettings("items", next);
  }
  function addItem() { updateSettings("items", [...items, { iconKey: "shield", title: "", text: "" }]); }
  function removeItem(index: number) { updateSettings("items", items.filter((_, i) => i !== index)); }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Versprechen ({items.length})</p>
        <button type="button" onClick={addItem} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Versprechen</button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="p-4 bg-white rounded border border-gray-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{item.title || `Versprechen ${i + 1}`}</span>
            <button type="button" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500 text-xs">Entfernen</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Icon</label>
              <select value={item.iconKey} onChange={(e) => updateItem(i, "iconKey", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                {NERIO_ICON_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Titel</label>
              <input type="text" value={item.title} onChange={(e) => updateItem(i, "title", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Text</label>
              <textarea rows={2} value={item.text} onChange={(e) => updateItem(i, "text", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface NerioStat {
  value: string;
  label: string;
  detail: string;
}

function NerioHighlightsFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const stats = Array.isArray(settings.stats) ? (settings.stats as NerioStat[]) : [];

  function updateStat(index: number, field: keyof NerioStat, value: string) {
    const next = stats.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    updateSettings("stats", next);
  }
  function addStat() { updateSettings("stats", [...stats, { value: "", label: "", detail: "" }]); }
  function removeStat(index: number) { updateSettings("stats", stats.filter((_, i) => i !== index)); }

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
              <input type="text" value={stat.value} onChange={(e) => updateStat(si, "value", e.target.value)} placeholder="z.B. 50 %" className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Label</label>
              <input type="text" value={stat.label} onChange={(e) => updateStat(si, "label", e.target.value)} placeholder="z.B. recyceltes Ozean-PP" className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Detail</label>
              <input type="text" value={stat.detail} onChange={(e) => updateStat(si, "detail", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface TechFact {
  label: string;
  value: string;
}

function NerioTechnicalFactsFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const facts = Array.isArray(settings.facts) ? (settings.facts as TechFact[]) : [];

  function updateFact(index: number, field: keyof TechFact, value: string) {
    const next = facts.map((f, i) => (i === index ? { ...f, [field]: value } : f));
    updateSettings("facts", next);
  }
  function addFact() { updateSettings("facts", [...facts, { label: "", value: "" }]); }
  function removeFact(index: number) { updateSettings("facts", facts.filter((_, i) => i !== index)); }

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Technische Fakten ({facts.length})</p>
        <button type="button" onClick={addFact} className="text-xs text-orange-600 hover:text-orange-700 font-medium">+ Fakt</button>
      </div>
      {facts.map((fact, i) => (
        <div key={i} className="flex items-start gap-2">
          <input type="text" value={fact.label} onChange={(e) => updateFact(i, "label", e.target.value)} placeholder="Eigenschaft" className="w-1/3 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          <input type="text" value={fact.value} onChange={(e) => updateFact(i, "value", e.target.value)} placeholder="Wert" className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
          <button type="button" onClick={() => removeFact(i)} className="text-gray-400 hover:text-red-500 text-sm" title="Entfernen">✕</button>
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

interface NerioVideoEntry {
  enabled: boolean;
  order: number;
  youtubeUrl: string;
  title: string;
  description: string;
  startSeconds: number | null;
  thumbnailMediaId: string | null;
  label: string;
}

const EMPTY_VIDEO: NerioVideoEntry = {
  enabled: true,
  order: 1,
  youtubeUrl: "",
  title: "",
  description: "",
  startSeconds: null,
  thumbnailMediaId: null,
  label: "",
};

function NerioVideosFields({
  settings,
  updateSettings,
}: {
  settings: Record<string, unknown>;
  updateSettings: (key: string, value: unknown) => void;
}) {
  const videos = Array.isArray(settings.videos)
    ? (settings.videos as NerioVideoEntry[])
    : [{ ...EMPTY_VIDEO }, { ...EMPTY_VIDEO, order: 2 }, { ...EMPTY_VIDEO, order: 3 }];

  function updateVideo(index: number, field: keyof NerioVideoEntry, value: unknown) {
    const next = videos.map((v, i) =>
      i === index ? { ...v, [field]: value } : v,
    );
    updateSettings("videos", next);
  }

  function addVideo() {
    const maxOrder = videos.reduce((m, v) => Math.max(m, v.order), 0);
    updateSettings("videos", [...videos, { ...EMPTY_VIDEO, order: maxOrder + 1 }]);
  }

  function removeVideo(index: number) {
    if (videos.length <= 1) return;
    updateSettings(
      "videos",
      videos.filter((_, i) => i !== index),
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Videos ({videos.length})
        </p>
        <button
          type="button"
          onClick={addVideo}
          className="text-xs text-orange-600 hover:text-orange-700 font-medium"
        >
          + Video
        </button>
      </div>

      {videos.map((video, i) => (
        <div
          key={i}
          className={`p-4 rounded-lg border space-y-3 ${video.enabled ? "bg-white border-gray-200" : "bg-gray-100 border-gray-200 opacity-60"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={video.enabled}
                  onChange={(e) => updateVideo(i, "enabled", e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="font-medium text-gray-700">
                  {video.title || `Video ${i + 1}`}
                </span>
              </label>
              {video.label && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-teal-50 text-teal-700 border border-teal-200">
                  {video.label}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeVideo(i)}
              className="text-gray-400 hover:text-red-500 text-xs"
              title="Entfernen"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">YouTube URL</label>
              <input
                type="text"
                value={video.youtubeUrl}
                onChange={(e) => updateVideo(i, "youtubeUrl", e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Startzeit (Sek.)</label>
                <input
                  type="number"
                  min={0}
                  value={video.startSeconds ?? ""}
                  onChange={(e) =>
                    updateVideo(
                      i,
                      "startSeconds",
                      e.target.value ? parseInt(e.target.value, 10) : null,
                    )
                  }
                  placeholder="0"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-0.5">Reihenfolge</label>
                <input
                  type="number"
                  min={1}
                  value={video.order}
                  onChange={(e) =>
                    updateVideo(i, "order", parseInt(e.target.value, 10) || 1)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Titel</label>
            <input
              type="text"
              value={video.title}
              onChange={(e) => updateVideo(i, "title", e.target.value)}
              placeholder="Deutscher Videotitel"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-0.5">Beschreibung</label>
            <textarea
              rows={2}
              value={video.description}
              onChange={(e) => updateVideo(i, "description", e.target.value)}
              placeholder="Kurze Beschreibung des Videos"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Label (optional)</label>
              <input
                type="text"
                value={video.label}
                onChange={(e) => updateVideo(i, "label", e.target.value)}
                placeholder="z.B. Prozessvideo, Recycling"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <MediaPickerField
              label="Vorschaubild (optional)"
              value={video.thumbnailMediaId || ""}
              onChange={(id) => updateVideo(i, "thumbnailMediaId", id || null)}
              placeholder="Kein Vorschaubild"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
