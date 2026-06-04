"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FormField {
  id?: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
}

interface FormData {
  id: string;
  slug: string;
  name: string;
  title: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
  recipientEmail: string;
  privacyText: string;
  fields: FormField[];
}

const FIELD_TYPES = ["TEXT", "EMAIL", "PHONE", "TEXTAREA", "CONSENT", "SELECT"];

const defaultForm: FormData = {
  id: "",
  slug: "contact",
  name: "Kontaktformular",
  title: "",
  submitLabel: "Absenden",
  successMessage: "",
  errorMessage: "",
  recipientEmail: "",
  privacyText: "",
  fields: [],
};

export default function ContactFormEditor({ form }: { form: FormData | null }) {
  const router = useRouter();
  const [data, setData] = useState<FormData>(form ?? defaultForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function updateField(key: keyof Omit<FormData, "fields">, value: string) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateFormField(index: number, key: keyof FormField, value: string | boolean | number) {
    setData((prev) => {
      const fields = [...prev.fields];
      fields[index] = { ...fields[index], [key]: value };
      return { ...prev, fields };
    });
  }

  function addField() {
    setData((prev) => ({
      ...prev,
      fields: [
        ...prev.fields,
        {
          label: "",
          name: "",
          type: "TEXT",
          required: false,
          order: prev.fields.length,
        },
      ],
    }));
  }

  function removeField(index: number) {
    setData((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index).map((f, i) => ({ ...f, order: i })),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Fehler beim Speichern");
      }

      setMessage({ type: "success", text: "Formular erfolgreich gespeichert." });
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

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Allgemein</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button-Text</label>
            <input
              type="text"
              value={data.submitLabel}
              onChange={(e) => updateField("submitLabel", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empfänger E-Mail</label>
            <input
              type="email"
              value={data.recipientEmail}
              onChange={(e) => updateField("recipientEmail", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Erfolgsmeldung</label>
          <textarea
            rows={2}
            value={data.successMessage}
            onChange={(e) => updateField("successMessage", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fehlermeldung</label>
          <textarea
            rows={2}
            value={data.errorMessage}
            onChange={(e) => updateField("errorMessage", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Datenschutzhinweis</label>
          <textarea
            rows={3}
            value={data.privacyText}
            onChange={(e) => updateField("privacyText", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Felder</h2>
          <button
            type="button"
            onClick={addField}
            className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Feld hinzufügen
          </button>
        </div>

        {data.fields.length === 0 && (
          <p className="text-sm text-gray-400">Keine Felder vorhanden.</p>
        )}

        {data.fields.map((field, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Feld {index + 1}</span>
              <button
                type="button"
                onClick={() => removeField(index)}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Entfernen
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateFormField(index, "label", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => updateFormField(index, "name", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Typ</label>
                <select
                  value={field.type}
                  onChange={(e) => updateFormField(index, "type", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => updateFormField(index, "required", e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                Pflichtfeld
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Reihenfolge</label>
                <input
                  type="number"
                  value={field.order}
                  onChange={(e) => updateFormField(index, "order", parseInt(e.target.value) || 0)}
                  className="w-20 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-5 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Speichert..." : "Speichern"}
        </button>
        <a
          href="/admin"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </a>
      </div>
    </div>
  );
}
