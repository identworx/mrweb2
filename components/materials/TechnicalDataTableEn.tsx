import ScrollReveal from "@/components/ScrollReveal";

interface PropertyRow {
  property: string;
  standard: string;
  olefin: string;
  polyester: string;
}

const propertiesComparisonEn: PropertyRow[] = [
  {
    property: "Lightfastness",
    standard: "BS EN ISO 105-B02 / B04",
    olefin: "7–8",
    polyester: "5–6",
  },
  {
    property: "Rubbing Fastness",
    standard: "BS EN ISO 105-X12",
    olefin: "Dry/Wet: 4–5",
    polyester: "Dry: 4+ / Wet: 3.5+",
  },
  {
    property: "Wash Fastness",
    standard: "BS EN ISO 105-C06",
    olefin: "4–5",
    polyester: "4",
  },
  {
    property: "Seawater Fastness",
    standard: "BS EN ISO 105-E02",
    olefin: "4–5",
    polyester: "3.5",
  },
  {
    property: "Flammability",
    standard: "BS EN 1021-1",
    olefin: "Pass",
    polyester: "Pass",
  },
  {
    property: "Mould Resistance",
    standard: "AATCC 147",
    olefin: "Pass",
    polyester: "Pass",
  },
  {
    property: "Water Repellency",
    standard: "AATCC 22",
    olefin: "90",
    polyester: "80",
  },
  {
    property: "Pilling Resistance",
    standard: "BS EN ISO 12945-2",
    olefin: "4–5 after 5,000 cycles",
    polyester: "4–5 after 5,000 cycles",
  },
  {
    property: "Abrasion Resistance",
    standard: "BS EN ISO 12947-2",
    olefin: "15,000–56,000 cycles",
    polyester: "15,000–25,000 cycles",
  },
  {
    property: "Total Fluorine / PFAS",
    standard: "EN 14582:2016",
    olefin: "Not detected",
    polyester: "Not detected",
  },
  {
    property: "Production / Sustainability",
    standard: "—",
    olefin: "Lower energy consumption in production",
    polyester: "—",
  },
  {
    property: "Hand Feel",
    standard: "—",
    olefin: "Very soft, textile-like",
    polyester: "—",
  },
];

interface TechnicalDataTableEnProps {
  className?: string;
  variant?: "default" | "compact";
}

const thBase =
  "text-left font-accent text-[11px] font-normal uppercase tracking-[0.12em]";

export default function TechnicalDataTableEn({
  className = "",
  variant = "default",
}: TechnicalDataTableEnProps) {
  const isCompact = variant === "compact";
  const cellPadding = isCompact ? "py-3 px-4" : "py-4 px-5";

  return (
    <ScrollReveal>
      <div className={`overflow-x-auto ${className}`}>
        <table className="w-full min-w-[700px]">
          <thead>
            <tr>
              <th className={`${thBase} text-text-muted ${cellPadding}`}>
                Property
              </th>
              <th className={`${thBase} text-text-muted ${cellPadding}`}>
                Test Standard
              </th>
              <th className={`${thBase} text-pumpkin-accessible ${cellPadding}`}>
                Solution Dyed Olefin
              </th>
              <th className={`${thBase} text-text-muted ${cellPadding}`}>
                Piece Dyed Polyester
              </th>
            </tr>
          </thead>
          <tbody>
            {propertiesComparisonEn.map((row, i) => (
              <tr
                key={row.property}
                className={i % 2 === 0 ? "bg-white" : "bg-transparent"}
              >
                <td
                  className={`font-body text-anthracite text-sm font-medium ${cellPadding}`}
                >
                  {row.property}
                </td>
                <td
                  className={`font-body text-text-muted text-sm ${cellPadding}`}
                >
                  {row.standard}
                </td>
                <td
                  className={`font-body text-anthracite text-sm font-semibold ${cellPadding}`}
                >
                  {row.olefin}
                </td>
                <td
                  className={`font-body text-text-gray text-sm ${cellPadding}`}
                >
                  {row.polyester}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-1">
        <p className="font-body text-text-muted text-xs">
          {"¹ Ratings are on a scale of 1–8, where 1 is the poorest and 8 the best rating."}
        </p>
        <p className="font-body text-text-muted text-xs">
          {"² Wash fastness and rubbing fastness are rated on a scale of 1–5, where 1 is the poorest and 5 the best rating."}
        </p>
      </div>
    </ScrollReveal>
  );
}
