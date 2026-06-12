"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MediaPickerField from "./MediaPickerField";

interface SocialLink {
  platform: string;
  url: string;
}

interface FooterData {
  logoMediaId: string;
  logoMediaUrl: string | null;
  logoMediaAlt: string | null;
  description: string;
  copyrightText: string;
  socialLinks: SocialLink[];
  ctaEnabled: boolean;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
  contactTitle: string;
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  postalCity: string;
  country: string;
  email: string;
  phone: string;
  contactButtonLabel: string;
  contactButtonHref: string;
  bottomNote: string;
}

export default function FooterEditForm({ settings }: { settings: FooterData }) {
  const router = useRouter();
  const [form, setForm] = useState<FooterData>(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function updateField<K extends keyof FooterData>(field: K, value: FooterData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateSocialLink(index: number, field: keyof SocialLink, value: string) {
    setForm((prev) => {
      const socialLinks = [...prev.socialLinks];
      socialLinks[index] = { ...socialLinks[index], [field]: value };
      return { ...prev, socialLinks };
    });
  }

  function addSocialLink() {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  }

  function removeSocialLink(index: number) {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/footer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Fehler beim Speichern");
      }

      setMessage({ type: "success", text: "Footer erfolgreich gespeichert." });
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

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent";

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

      {/* ── Allgemein ── */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Allgemein</h2>

        <MediaPickerField
          label="Footer-Logo"
          value={form.logoMediaId}
          onChange={(id) => updateField("logoMediaId", id)}
          previewUrl={form.logoMediaUrl}
          previewAlt={form.logoMediaAlt}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Copyright-Text</label>
          <input
            type="text"
            value={form.copyrightText}
            onChange={(e) => updateField("copyrightText", e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bottom-Hinweis</label>
          <input
            type="text"
            value={form.bottomNote}
            onChange={(e) => updateField("bottomNote", e.target.value)}
            placeholder="z.B. Made with ♥ in Germany"
            className={inputClass}
          />
          <p className="text-xs text-gray-400 mt-1">Optionaler Zusatztext neben dem Copyright.</p>
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Footer CTA</h2>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.ctaEnabled}
              onChange={(e) => updateField("ctaEnabled", e.target.checked)}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            Aktiviert
          </label>
        </div>

        {form.ctaEnabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
              <input
                type="text"
                value={form.ctaEyebrow}
                onChange={(e) => updateField("ctaEyebrow", e.target.value)}
                placeholder="Beratung & Muster"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titel</label>
              <input
                type="text"
                value={form.ctaTitle}
                onChange={(e) => updateField("ctaTitle", e.target.value)}
                placeholder="Unsicher bei Farbe, Material oder Format?"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
              <textarea
                rows={2}
                value={form.ctaText}
                onChange={(e) => updateField("ctaText", e.target.value)}
                placeholder="Fordern Sie ein Musterset an..."
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primär-Button Label</label>
                <input
                  type="text"
                  value={form.ctaPrimaryLabel}
                  onChange={(e) => updateField("ctaPrimaryLabel", e.target.value)}
                  placeholder="Muster anfordern"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primär-Button Link</label>
                <input
                  type="text"
                  value={form.ctaPrimaryHref}
                  onChange={(e) => updateField("ctaPrimaryHref", e.target.value)}
                  placeholder="/kontakt"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sekundär-Button Label</label>
                <input
                  type="text"
                  value={form.ctaSecondaryLabel}
                  onChange={(e) => updateField("ctaSecondaryLabel", e.target.value)}
                  placeholder="Kataloge ansehen"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sekundär-Button Link</label>
                <input
                  type="text"
                  value={form.ctaSecondaryHref}
                  onChange={(e) => updateField("ctaSecondaryHref", e.target.value)}
                  placeholder="/kataloge"
                  className={inputClass}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Kontakt ── */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900">Kontakt-Spalte</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Spalten-Titel</label>
          <input
            type="text"
            value={form.contactTitle}
            onChange={(e) => updateField("contactTitle", e.target.value)}
            placeholder="Kontakt"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Firmenname</label>
          <input
            type="text"
            value={form.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            placeholder="Mosaroma Industries GmbH"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresszeile 1</label>
            <input
              type="text"
              value={form.addressLine1}
              onChange={(e) => updateField("addressLine1", e.target.value)}
              placeholder="Rudolf-Diesel-Str. 11–13"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresszeile 2</label>
            <input
              type="text"
              value={form.addressLine2}
              onChange={(e) => updateField("addressLine2", e.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PLZ &amp; Stadt</label>
            <input
              type="text"
              value={form.postalCity}
              onChange={(e) => updateField("postalCity", e.target.value)}
              placeholder="28876 Oyten"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Land</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              placeholder="Deutschland"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="info@mosaroma.de"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Optional"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button-Label</label>
            <input
              type="text"
              value={form.contactButtonLabel}
              onChange={(e) => updateField("contactButtonLabel", e.target.value)}
              placeholder="Kontakt aufnehmen"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button-Link</label>
            <input
              type="text"
              value={form.contactButtonHref}
              onChange={(e) => updateField("contactButtonHref", e.target.value)}
              placeholder="/kontakt"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* ── Social Links ── */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Social Links</h2>
          <button
            type="button"
            onClick={addSocialLink}
            className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Hinzuf&uuml;gen
          </button>
        </div>

        {form.socialLinks.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-6">
            Keine Social Links vorhanden. Klicken Sie auf &quot;Hinzuf&uuml;gen&quot; um einen neuen Link zu erstellen.
          </p>
        )}

        <div className="space-y-4">
          {form.socialLinks.map((link, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plattform</label>
                  <input
                    type="text"
                    value={link.platform}
                    onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                    placeholder="z.B. instagram, facebook"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                    placeholder="https://..."
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors"
                >
                  Entfernen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-5 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Speichert..." : "Speichern"}
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Abbrechen
        </Link>
      </div>
    </div>
  );
}
