import type { FrontendServiceSection } from "@/lib/cms/service-pages";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import CareCardPrint from "./CareCardPrint";

interface CareSymbol {
  key: string;
  label: string;
}

export default function CareSymbolsSection({
  section,
  className = "bg-white",
  icons = {},
}: {
  section: FrontendServiceSection;
  className?: string;
  icons?: Record<string, ResolvedIcon>;
}) {
  const symbols = Array.isArray(section.settings.symbols)
    ? (section.settings.symbols as CareSymbol[])
    : [];

  if (symbols.length === 0) return null;

  return (
    <section className={`section-padding ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {section.title && (
          <h2 className="font-heading text-anthracite text-2xl md:text-3xl font-bold tracking-tight mb-10 md:mb-14">
            {section.title}
          </h2>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-8 md:gap-6">
          {symbols.map((symbol) => (
            <figure key={symbol.key} className="text-center">
              <div className="w-16 h-16 mx-auto flex items-center justify-center border border-anthracite/15 text-anthracite mb-4" aria-hidden="true">
                <CmsIcon icon={icons[`care-${symbol.key}`]} width={32} height={32} />
              </div>
              <figcaption className="font-body text-text-gray text-xs leading-snug">
                {symbol.label}
              </figcaption>
            </figure>
          ))}
        </div>
        <CareCardPrint icons={icons} />
      </div>
    </section>
  );
}
