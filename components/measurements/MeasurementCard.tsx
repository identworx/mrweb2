import type { MeasurementItem } from "@/lib/mosaroma/measurements";
import MeasurementDrawing from "./MeasurementDrawing";

export default function MeasurementCard({ item }: { item: MeasurementItem }) {
  return (
    <div className="bg-white border border-light-gray p-5 md:p-6">
      <div className="bg-cream/50 p-4 mb-5">
        <MeasurementDrawing type={item.drawingType} />
      </div>

      <h3 className="font-heading text-anthracite text-base md:text-lg font-bold mb-3">
        {item.title}
      </h3>

      {item.notes && (
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
        {item.variants.map((v) => (
          <div key={v.label} className="flex items-baseline justify-between gap-3">
            <span className="font-heading text-[11px] font-semibold uppercase tracking-[0.05em] text-text-muted shrink-0">
              {v.label}
            </span>
            <span className="font-body text-anthracite text-sm font-medium">
              {v.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
