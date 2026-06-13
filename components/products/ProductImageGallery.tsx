"use client";

import { useState } from "react";
import ProductImageFrame from "./ProductImageFrame";

export interface ProductGalleryItem {
  id: string;
  url: string;
  alt: string;
}

interface Props {
  items: ProductGalleryItem[];
  productName: string;
  collectionName?: string;
  collectionColors?: string[];
}

export default function ProductImageGallery({
  items,
  productName,
  collectionName,
  collectionColors,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const active = items[activeIndex];

  return (
    <div className="space-y-3">
      <ProductImageFrame
        key={active.id}
        src={active.url}
        alt={active.alt}
        variant="detail"
        productName={productName}
        collectionName={collectionName}
        collectionColors={collectionColors}
        priority={activeIndex === 0}
      />

      {items.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
          role="list"
          aria-label={`${productName} – Bildauswahl`}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`${item.alt} anzeigen`}
              aria-current={i === activeIndex ? "true" : undefined}
              className="relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 transition-all"
            >
              <ProductImageFrame
                src={item.url}
                alt={item.alt}
                variant="thumbnail"
                isActive={i === activeIndex}
                collectionColors={collectionColors}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
