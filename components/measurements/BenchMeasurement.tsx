import type { MeasurementItem } from "@/lib/mosaroma/measurements";
import MeasurementDrawing from "./MeasurementDrawing";

export default function BenchMeasurement({ item }: { item: MeasurementItem }) {
  return (
    <div className="bg-white border border-light-gray p-6 md:p-10">
      <div className="bg-cream/50 p-6 md:p-8 mb-8">
        <div className="max-w-2xl mx-auto">
          <MeasurementDrawing type={item.drawingType} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-6">
        {item.variants.map((v) => (
          <div
            key={v.label}
            className="text-center p-4 border border-light-gray"
          >
            <span className="block font-heading text-pumpkin text-lg md:text-xl font-bold mb-1">
              {v.label}
            </span>
            <span className="block font-body text-anthracite text-sm font-medium">
              {v.value}
            </span>
          </div>
        ))}
      </div>

      {item.notes && (
        <p className="font-body text-text-gray text-sm text-center">
          {item.notes.join(" · ")}
        </p>
      )}

      {item.sourceNote && (
        <p className="font-body text-pumpkin/60 text-xs text-center mt-2 italic">
          {item.sourceNote}
        </p>
      )}
    </div>
  );
}
