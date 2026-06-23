import type { ResolvedIcon } from "@/lib/cms/icons";
import Link from "next/link";
import CmsIcon from "@/components/cms/CmsIcon";
import { fabricQualities } from "@/lib/mosaroma/materials";

const colorDots: Record<string, string> = {
  mackintosh: "#2D2D2D",
  "mackintosh-lite": "#6B5B4B",
  nerio: "#1B6B6D",
  basic: "#888888",
};

export default function MaterialQualityBox({ icons = {} }: { icons?: Record<string, ResolvedIcon> }) {
  return (
    <div className="bg-white border border-light-gray p-6 md:p-8">
      <div className="flex items-center gap-4 mb-5">
        <div className="w-12 h-px bg-pumpkin" />
        <p className="font-accent text-text-muted text-xs tracking-[0.3em] uppercase">
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
        className="inline-flex items-center gap-3 text-anthracite hover:text-pumpkin mt-6 group"
      >
        <span className="font-heading text-[12px] font-semibold uppercase tracking-[0.12em]">
          Alle Qualitäten im Detail
        </span>
        <CmsIcon icon={icons["arrow-right"]} width={14} height={14} className="text-pumpkin motion-safe:group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  );
}
