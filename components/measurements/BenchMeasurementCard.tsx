import Image from "next/image";
import type { FrontendMeasurement } from "@/lib/cms/measurements";
import MeasurementDrawing from "./MeasurementDrawing";
import type { DrawingType } from "@/lib/mosaroma/measurements";

export default function BenchMeasurementCard({ item }: { item: FrontendMeasurement }) {
  return (
    <div className="bg-white border border-light-gray p-6 md:p-10">
      <div className="bg-cream/50 p-6 md:p-8 mb-8">
        <div className="max-w-2xl mx-auto">
          {item.imageUrl ? (
            <div className="relative w-full aspect-[5/1]">
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
        {item.rows
          .filter((r) => ["S", "M", "L", "XL"].includes(r.label))
          .map((row) => (
            <div
              key={row.label}
              className="text-center p-4 border border-light-gray"
            >
              <span className="block font-heading text-pumpkin text-lg md:text-xl font-bold mb-1">
                {row.label}
              </span>
              <span className="block font-body text-anthracite text-sm font-medium">
                {row.value}
              </span>
            </div>
          ))}
      </div>

      {item.notes.length > 0 && (
        <p className="font-body text-text-gray text-sm text-center">
          {item.notes.join(" · ")}
        </p>
      )}

      {item.rows
        .filter((r) => !["S", "M", "L", "XL"].includes(r.label))
        .length > 0 && (
        <div className="mt-4 space-y-1 text-center">
          {item.rows
            .filter((r) => !["S", "M", "L", "XL"].includes(r.label))
            .map((row) => (
              <p key={row.label} className="font-body text-text-gray text-sm">
                {row.label}: {row.value}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}
