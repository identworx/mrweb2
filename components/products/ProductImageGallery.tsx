"use client";

import { useState } from "react";
import Image from "next/image";

export interface ProductGalleryItem {
  id: string;
  url: string;
  alt: string;
}

interface Props {
  items: ProductGalleryItem[];
  productName: string;
}

export default function ProductImageGallery({ items, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  const active = items[activeIndex];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square bg-light-gray overflow-hidden">
        <Image
          key={active.id}
          src={active.url}
          alt={active.alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={activeIndex === 0}
        />
      </div>

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
              className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-all ${
                i === activeIndex
                  ? "ring-2 ring-pumpkin ring-offset-1"
                  : "ring-1 ring-gray-200 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={item.url}
                alt={item.alt}
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
