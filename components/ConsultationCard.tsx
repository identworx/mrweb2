import Link from "next/link";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

interface ConsultationCardProps {
  title?: string;
  content?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  icons?: Record<string, ResolvedIcon>;
}

export default function ConsultationCard({
  title = "Welche Farbwelt passt zu Ihnen?",
  content = "Wir beraten Sie persönlich und senden passende Muster für Ihr Projekt.",
  primaryLabel = "Muster & Beratung",
  primaryHref = "/kontakt",
  secondaryLabel = "Kontakt aufnehmen",
  secondaryHref = "/kontakt",
  icons = {},
}: ConsultationCardProps) {
  return (
    <div className="relative flex flex-col h-full border border-black/[0.06] bg-cream overflow-hidden">
      {/* Fine linen texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 7px, currentColor 7px, currentColor 7.3px), repeating-linear-gradient(90deg, transparent, transparent 7px, currentColor 7px, currentColor 7.3px)",
          color: "#2D2D2D",
        }}
      />

      <div className="relative flex flex-col flex-1 p-6 md:p-8">
        <div className="flex-1">
          <div className="w-8 h-px bg-pumpkin mb-6" />

          <h3 className="font-heading text-anthracite text-lg md:text-xl font-bold tracking-tight leading-tight mb-3">
            {title}
          </h3>

          <p className="font-body text-text-gray text-[13px] leading-[1.75] mb-8">
            {content}
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <Link href={primaryHref} className="btn-primary text-center">
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center gap-2 font-heading text-anthracite/50 text-[10px] font-semibold uppercase tracking-[0.12em] hover:text-pumpkin transition-colors duration-300"
          >
            {secondaryLabel}
            <CmsIcon icon={icons["arrow-right"]} width={12} height={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
