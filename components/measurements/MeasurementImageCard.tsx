import Image from "next/image";
import type { FrontendMeasurement } from "@/lib/cms/measurements";
import MeasurementDrawing from "./MeasurementDrawing";
import type { DrawingType } from "@/lib/mosaroma/measurements";

export default function MeasurementImageCard({ item }: { item: FrontendMeasurement }) {
  return (
    <div className="bg-white border border-light-gray overflow-hidden">
      <div className="bg-cream/50 p-4 flex items-center justify-center min-h-[180px]">
        {item.imageUrl ? (
          <div className="relative w-full aspect-[4/3]">
            <Image
              src={item.imageUrl}
              alt={item.imageAlt || item.title}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <MeasurementDrawing type={item.drawingType as DrawingType} />
        )}
      </div>

      <div className="p-5 md:p-6">
        <h3 className="font-heading text-anthracite text-base md:text-lg font-bold mb-3">
          {item.title}
        </h3>

        {item.notes.length > 0 && (
          <div className="mb-3">
            {item.notes.map((note) => (
              <p
                key={note}
                className="font-body text-text-gray text-xs leading-relaxed"
              >
                {note}
              </p>
            ))}
          </div>
        )}

        <div className="space-y-1.5">
          {item.rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3">
              <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.05em] text-text-gray/60 shrink-0">
                {row.label}
              </span>
              <span className="font-body text-anthracite text-sm font-medium">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
