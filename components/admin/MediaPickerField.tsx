"use client";

import { useState } from "react";
import MediaPickerModal from "./MediaPickerModal";

interface Props {
  label: string;
  value: string;
  onChange: (id: string) => void;
  previewUrl?: string | null;
  previewAlt?: string | null;
  placeholder?: string;
}

export default function MediaPickerField({
  label,
  value,
  onChange,
  previewUrl,
  previewAlt,
  placeholder = "Kein Bild gewählt",
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [pickedAsset, setPickedAsset] = useState<{
    id: string;
    url: string;
    alt: string | null;
  } | null>(null);

  const preview =
    pickedAsset && pickedAsset.id === value
      ? { url: pickedAsset.url, alt: pickedAsset.alt }
      : value && previewUrl
        ? { url: previewUrl, alt: previewAlt || null }
        : null;

  function handleSelect(asset: {
    id: string;
    url: string;
    alt: string | null;
    filename: string;
  }) {
    setPickedAsset({ id: asset.id, url: asset.url, alt: asset.alt });
    onChange(asset.id);
    setModalOpen(false);
  }

  function handleClear() {
    setPickedAsset(null);
    onChange("");
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {value && preview ? (
        <div className="space-y-2">
          <div className="relative group border border-gray-200 rounded-lg overflow-hidden max-w-xs">
            <img
              src={preview.url}
              alt={preview.alt || label}
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Ändern
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 transition-colors"
            >
              Entfernen
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-300">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">{placeholder}</p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 text-xs font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Bild wählen
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <MediaPickerModal
          onSelect={handleSelect}
          onClose={() => setModalOpen(false)}
          currentId={value || undefined}
        />
      )}
    </div>
  );
}
