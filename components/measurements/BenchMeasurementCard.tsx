import Image from "next/image";
import type { FrontendMeasurement } from "@/lib/cms/measurements";
import MeasurementDrawing from "./MeasurementDrawing";
import type { DrawingType } from "@/lib/mosaroma/measurements";

export default function BenchMeasurementCard({ item }: { item: FrontendMeasurement }) {
  const sizeRows = item.rows.filter((r) => ["S", "M", "L", "XL"].includes(r.label));
  const otherRows = item.rows.filter((r) => !["S", "M", "L", "XL"].includes(r.label));

  return (
    <div className="bg-white border border-black/[0.06]">
      <div className="flex items-center justify-center bg-[#FAF8F5] min-h-[280px] md:min-h-[340px] px-6 py-8 md:px-12 md:py-10">
        <div className="w-full max-w-[800px] md:max-w-[1000px]">
          {item.imageUrl ? (
            <div className="relative w-full aspect-[4/1]">
              <Image
                src={item.imageUrl}
                alt={item.imageAlt || item.title}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
          ) : (
            <MeasurementDrawing type={item.drawingType as DrawingType} />
          )}
        </div>
      </div>

      <div className="p-6 md:p-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          {sizeRows.map((row) => (
            <div
              key={row.label}
              className="text-center py-5 px-4 border border-black/[0.06] bg-[#FDFCFB]"
            >
              <span className="block font-heading text-pumpkin text-xl md:text-2xl font-bold mb-1.5 tracking-tight">
                {row.label}
              </span>
              <span className="block font-body text-anthracite text-sm md:text-base font-medium">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {(item.notes.length > 0 || otherRows.length > 0) && (
          <div className="mt-6 pt-5 border-t border-black/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-center gap-x-8 gap-y-2 text-center">
            {item.notes.map((note) => (
              <p key={note} className="font-body text-text-gray/70 text-sm">
                {note}
              </p>
            ))}
            {otherRows.map((row) => (
              <p key={row.label} className="font-body text-text-gray/70 text-sm">
                {row.label}: {row.value}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
