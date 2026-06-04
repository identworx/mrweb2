import Link from "next/link";
import { fabricQualities } from "@/lib/mosaroma/materials";

const colorDots: Record<string, string> = {
  mackintosh: "#2D2D2D",
  "mackintosh-lite": "#6B5B4B",
  nerio: "#1B6B6D",
  basic: "#888888",
};

export default function MaterialQualityBox() {
  return (
    <div className="bg-white border border-light-gray p-6 md:p-8">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-px bg-pumpkin" />
        <p className="font-accent text-pumpkin text-xs tracking-[0.3em] uppercase">
          Vier Qualitäten
        </p>
      </div>

      <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold mb-2">
        Welcher Stoff für Outdoormöbel?
      </h3>

      <div className="space-y-3 mt-5">
        {fabricQualities.map((fabric) => (
          <div key={fabric.slug} className="flex items-start gap-3">
            <div
              className="w-3 h-3 rounded-sm mt-1 shrink-0"
              style={{ backgroundColor: colorDots[fabric.slug] ?? "#888" }}
            />
            <div>
              <span className="font-heading text-anthracite text-sm font-bold">
                {fabric.name}
              </span>
              <p className="font-body text-text-gray text-xs leading-relaxed">
                {fabric.material} · {fabric.weight}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/materialien"
        className="inline-flex items-center gap-3 text-pumpkin mt-6 group"
      >
        <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
          Alle Qualitäten im Detail
        </span>
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          className="group-hover:translate-x-1 transition-transform duration-300"
        >
          <path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5" />
        </svg>
      </Link>
    </div>
  );
}
