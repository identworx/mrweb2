"use client";

import type { ResolvedIcon } from "@/lib/cms/icons";
import type { Locale } from "@/lib/i18n/config";
import CmsIcon from "@/components/cms/CmsIcon";

export default function CareCardPrint({ icons = {}, locale = "de" }: { icons?: Record<string, ResolvedIcon>; locale?: Locale }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 font-accent text-xs tracking-[0.15em] uppercase text-anthracite/70 hover:text-anthracite transition-colors mt-10 print:hidden"
    >
      <CmsIcon icon={icons["care-print"]} width={16} height={16} />
      {locale === "en" ? "Print care card" : "Pflegekarte drucken"}
    </button>
  );
}
