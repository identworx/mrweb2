import type { FrontendServiceSection } from "@/lib/cms/service-pages";

interface CareSymbol {
  key: string;
  label: string;
}

const CARE_ICONS: Record<string, React.ReactNode> = {
  "wash-30": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 12c0-2 2-4 4-4h12c2 0 4 2 4 4v6c0 1-1 2-2 2H8c-1 0-2-1-2-2v-6z" />
      <path d="M6 12h20" />
      <text x="16" y="18.5" textAnchor="middle" fill="currentColor" stroke="none" fontSize="6" fontWeight="600" fontFamily="system-ui">30°</text>
      <path d="M4 20h24" />
    </svg>
  ),
  "bleach-dilute": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 6L28 26H4L16 6z" />
      <path d="M12 19h8" />
      <path d="M13 16h6" />
    </svg>
  ),
  "no-dryer": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="16" cy="16" r="10" />
      <path d="M10 10l12 12" />
    </svg>
  ),
  "line-dry": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="8" y="8" width="16" height="16" />
      <path d="M16 10v12" />
    </svg>
  ),
  "no-heat": (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="16" cy="14" r="6" />
      <path d="M16 4v2" />
      <path d="M24 14h2" />
      <path d="M6 14h2" />
      <path d="M21.7 8.3l1.4-1.4" />
      <path d="M8.9 8.3L7.5 6.9" />
      <path d="M10 26h12" />
      <path d="M12 23h8" />
    </svg>
  ),
};

export default function CareSymbolsSection({
  section,
  className = "bg-white",
}: {
  section: FrontendServiceSection;
  className?: string;
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-6">
          {symbols.map((symbol) => (
            <div key={symbol.key} className="text-center">
              <div className="w-16 h-16 mx-auto flex items-center justify-center border border-anthracite/15 text-anthracite mb-4">
                {CARE_ICONS[symbol.key] || null}
              </div>
              <p className="font-body text-text-gray text-xs leading-snug">
                {symbol.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
