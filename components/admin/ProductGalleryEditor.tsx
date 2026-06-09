"use client";

import { useState } from "react";
import MediaPickerModal from "./MediaPickerModal";

export interface GalleryImage {
  id?: string;
  mediaAssetId: string;
  url: string;
  alt: string | null;
  order: number;
}

interface Props {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
}

export default function ProductGalleryEditor({ images, onChange }: Props) {
  const [modalOpen, setModalOpen] = useState(false);

  function handleAdd(asset: { id: string; url: string; alt: string | null; filename: string }) {
    if (images.some((img) => img.mediaAssetId === asset.id)) return;
    const next = [...images, { mediaAssetId: asset.id, url: asset.url, alt: asset.alt, order: images.length }];
    onChange(next);
    setModalOpen(false);
  }

  function handleRemove(index: number) {
    const next = images.filter((_, i) => i !== index).map((img, i) => ({ ...img, order: i }));
    onChange(next);
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const next = [...images];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next.map((img, i) => ({ ...img, order: i })));
  }

  function handleMoveDown(index: number) {
    if (index >= images.length - 1) return;
    const next = [...images];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next.map((img, i) => ({ ...img, order: i })));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Galerie ({images.length} {images.length === 1 ? "Bild" : "Bilder"})
        </label>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="px-3 py-1.5 text-xs font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors"
        >
          Bild hinzufügen
        </button>
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="text-gray-300 mb-2">
            <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
          <p className="text-sm text-gray-400">Keine Galeriebilder vorhanden.</p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="mt-2 px-3 py-1.5 text-xs font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            Erstes Bild hinzufügen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div key={img.mediaAssetId} className="group relative border border-gray-200 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-50">
                <img
                  src={img.url}
                  alt={img.alt || `Galeriebild ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 bg-white rounded shadow text-gray-700 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Nach oben"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={index >= images.length - 1}
                  className="p-1 bg-white rounded shadow text-gray-700 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Nach unten"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1 bg-white rounded shadow text-red-500 hover:text-red-700"
                  title="Entfernen"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {index + 1}. {img.alt || "Ohne Beschreibung"}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <MediaPickerModal
          onSelect={handleAdd}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
