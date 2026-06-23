import type { FrontendServiceSection } from "@/lib/cms/service-pages";

interface ComparisonRow {
  property: string;
  [key: string]: string;
}

export default function ComparisonTableSection({
  section,
  className = "bg-cream",
}: {
  section: FrontendServiceSection;
  className?: string;
}) {
  const columns = Array.isArray(section.settings.columns)
    ? (section.settings.columns as string[])
    : [];
  const rows = Array.isArray(section.settings.rows)
    ? (section.settings.rows as ComparisonRow[])
    : [];

  if (rows.length === 0 || columns.length === 0) return null;

  return (
    <section className={`section-padding ${className}`}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {section.eyebrow && (
          <div className="flex items-center gap-4 mb-5">
            <div className="accent-line" />
            <p className="font-accent text-pumpkin-accessible text-xs tracking-[0.3em] uppercase">
              {section.eyebrow}
            </p>
          </div>
        )}
        {section.title && (
          <h2 className="font-heading text-anthracite text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-10">
            {section.title}
          </h2>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border border-light-gray bg-white">
            <thead>
              <tr className="bg-anthracite">
                <th className="px-5 py-4 text-left font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">
                  Eigenschaft
                </th>
                {columns.map((col) => (
                  <th key={col} className="px-5 py-4 text-left font-heading text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-white" : "bg-cream/50"}
                >
                  <td className="px-5 py-4 font-heading text-anthracite text-sm font-semibold">
                    {row.property}
                  </td>
                  {columns.map((col) => (
                    <td key={col} className="px-5 py-4 font-body text-text-gray text-sm">
                      {row[col.toLowerCase()] || "–"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
