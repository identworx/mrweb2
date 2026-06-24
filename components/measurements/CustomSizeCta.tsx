import type { ResolvedIcon } from "@/lib/cms/icons";
import Link from "next/link";
import CmsIcon from "@/components/cms/CmsIcon";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/routes";

export default function CustomSizeCta({ icons = {}, locale = "de" }: { icons?: Record<string, ResolvedIcon>; locale?: Locale }) {
  return (
    <div className="bg-pumpkin p-8 md:p-10 text-white">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-px bg-white/40" />
        <p className="font-accent text-white/70 text-xs tracking-[0.3em] uppercase">
          {locale === "en" ? "Custom Sizes" : "Maßanfertigung"}
        </p>
      </div>

      <h3 className="font-heading text-white text-xl md:text-2xl font-bold tracking-tight mb-3">
        {locale === "en" ? "Your size not listed?" : "Ihr Maß nicht dabei?"}
      </h3>

      <p className="font-body text-white/80 text-sm md:text-base leading-[1.8] mb-2">
        {locale === "en" ? "We manufacture any shape in custom dimensions on request." : "Wir fertigen jede Form auf Wunsch in Sondermaßen."}
      </p>

      <p className="font-body text-white/70 text-sm mb-6">
        sales@mosaroma.de
      </p>

      <Link
        href={localizedHref("/kontakt", locale)}
        className="inline-flex items-center gap-3 font-heading text-[12px] font-semibold uppercase tracking-[0.12em] px-6 py-3 bg-white text-pumpkin-accessible hover:bg-white/90 transition-colors duration-300"
      >
        {locale === "en" ? "Get in touch" : "Kontakt aufnehmen"}
        <CmsIcon icon={icons["arrow-right"]} width={14} height={14} />
      </Link>
    </div>
  );
}
