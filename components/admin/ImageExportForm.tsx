"use client";

import { useState } from "react";

interface Props {
  collections: { id: string; name: string }[];
  productGroups: { id: string; name: string }[];
}

export default function ImageExportForm({
  collections,
  productGroups,
}: Props) {
  const [mainOnly, setMainOnly] = useState(true);
  const [publishedOnly, setPublishedOnly] = useState(true);
  const [collectionId, setCollectionId] = useState("");
  const [productGroupId, setProductGroupId] = useState("");
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleExport() {
    setExporting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/products/export-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mainOnly,
          publishedOnly,
          collectionId: collectionId || undefined,
          productGroupId: productGroupId || undefined,
        }),
      });

      if (!res.ok) {
        let errorText = `Fehler ${res.status}`;
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const data = await res.json();
            errorText = data?.error || errorText;
          } else {
            const text = await res.text();
            if (text) errorText = text.slice(0, 500);
          }
        } catch {}
        setMessage({ type: "error", text: errorText });
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mosaroma-product-images-png.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setMessage({
        type: "success",
        text: "Export erfolgreich heruntergeladen.",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: "Netzwerkfehler beim Export.",
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-900">
          Bildauswahl
        </h2>

        <fieldset className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="imageScope"
              checked={mainOnly}
              onChange={() => setMainOnly(true)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">
              Nur Hauptbilder exportieren
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="imageScope"
              checked={!mainOnly}
              onChange={() => setMainOnly(false)}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm text-gray-700">
              Alle Produktbilder exportieren
            </span>
          </label>
        </fieldset>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={publishedOnly}
            onChange={(e) => setPublishedOnly(e.target.checked)}
            className="h-4 w-4 rounded text-orange-600 focus:ring-orange-500"
          />
          <span className="text-sm text-gray-700">
            Nur veröffentlichte Produkte
          </span>
        </label>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <h2 className="text-sm font-semibold text-gray-900">
          Filter (optional)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="collection"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Kollektion
            </label>
            <select
              id="collection"
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Alle Kollektionen</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="productGroup"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Produktart
            </label>
            <select
              id="productGroup"
              value={productGroupId}
              onChange={(e) => setProductGroupId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Alle Produktarten</option>
              {productGroups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center px-5 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          {exporting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Exportiere…
            </>
          ) : (
            "Produktbilder als PNG-ZIP exportieren"
          )}
        </button>
      </div>

      {message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 text-xs text-gray-500 space-y-1">
        <p>
          <strong>Dateiformat:</strong> PNG mit Alpha-Kanal (Transparenz
          bleibt erhalten).
        </p>
        <p>
          <strong>Dateinamen:</strong>{" "}
          Artikelnummer_Produktart_Name.png — Umlaute werden normalisiert.
        </p>
        <p>
          <strong>Hinweis:</strong> Bei vielen Produkten kann der Export
          einige Sekunden dauern. Das ZIP enthält eine export-report.json
          mit Zusammenfassung.
        </p>
      </div>
    </div>
  );
}
