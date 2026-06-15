import { propertiesComparison } from "@/lib/mosaroma/materials";
import ScrollReveal from "@/components/ScrollReveal";

interface TechnicalDataTableProps {
  className?: string;
  variant?: "default" | "compact";
}

const thBase =
  "text-left font-accent text-[11px] font-normal uppercase tracking-[0.12em]";

export default function TechnicalDataTable({
  className = "",
  variant = "default",
}: TechnicalDataTableProps) {
  const isCompact = variant === "compact";
  const cellPadding = isCompact ? "py-3 px-4" : "py-4 px-5";

  return (
    <ScrollReveal>
      <div className={`overflow-x-auto ${className}`}>
        <table className="w-full min-w-[700px]">
          <thead>
            <tr>
              <th className={`${thBase} text-anthracite/50 ${cellPadding}`}>
                Eigenschaft
              </th>
              <th className={`${thBase} text-anthracite/50 ${cellPadding}`}>
                Prüfnorm
              </th>
              <th className={`${thBase} text-pumpkin ${cellPadding}`}>
                Solution Dyed Olefin
              </th>
              <th className={`${thBase} text-anthracite/50 ${cellPadding}`}>
                Piece Dyed Polyester
              </th>
            </tr>
          </thead>
          <tbody>
            {propertiesComparison.map((row, i) => (
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
                  className={`font-body text-text-gray/60 text-sm ${cellPadding}`}
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
        <p className="font-body text-text-gray/50 text-xs">
          {"¹ Die Bewertung erfolgt auf einer Skala von 1–8, wobei 1 die schlechteste und 8 die beste Bewertung darstellt."}
        </p>
        <p className="font-body text-text-gray/50 text-xs">
          {"² Die Bewertung der Waschechtheit und der Reibungsfestigkeit erfolgt auf einer Skala von 1–5, wobei 1 die schlechteste und 5 die beste Bewertung ist."}
        </p>
      </div>
    </ScrollReveal>
  );
}
