import Image from "next/image";
import type { FrontendMeasurement } from "@/lib/cms/measurements";
import MeasurementDrawing from "./MeasurementDrawing";
import type { DrawingType } from "@/lib/mosaroma/measurements";

export default function MeasurementImageCard({ item }: { item: FrontendMeasurement }) {
  return (
    <div className="bg-white border border-black/[0.06] h-full flex flex-col">
      <div className="flex items-center justify-center bg-[#FAF8F5] min-h-[220px] md:min-h-[260px] p-6 md:p-8">
        {item.imageUrl ? (
          <div className="relative w-full max-w-[220px] aspect-[4/3]">
            <Image
              src={item.imageUrl}
              alt={item.imageAlt || item.title}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="w-full max-w-[200px]">
            <MeasurementDrawing type={item.drawingType as DrawingType} />
          </div>
        )}
      </div>

      <div className="p-5 md:p-6 flex-1 flex flex-col">
        <h3 className="font-heading text-anthracite text-base md:text-lg font-bold mb-3">
          {item.title}
        </h3>

        {item.notes.length > 0 && (
          <div className="mb-3">
            {item.notes.map((note) => (
              <p
                key={note}
                className="font-body text-text-gray/70 text-xs leading-relaxed"
              >
                {note}
              </p>
            ))}
          </div>
        )}

        <div className="space-y-1.5 mt-auto pt-3 border-t border-black/[0.04]">
          {item.rows.map((row) => (
            <div key={row.label} className="flex items-baseline justify-between gap-3">
              <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.05em] text-text-gray/50 shrink-0">
                {row.label}
              </span>
              <span className="font-body text-anthracite text-sm font-medium text-right">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
