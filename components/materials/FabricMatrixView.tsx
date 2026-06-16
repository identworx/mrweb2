"use client";

import Image from "next/image";
import type { ResolvedIcon } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";
import type {
  FrontendFabricSwatch,
  FrontendFabricProductType,
} from "@/lib/cms/fabric-library";

interface Props {
  swatches: FrontendFabricSwatch[];
  productTypes: FrontendFabricProductType[];
  onSelectSwatch?: (swatch: FrontendFabricSwatch) => void;
  icons?: Record<string, ResolvedIcon>;
}

export default function FabricMatrixView({
  swatches,
  productTypes,
  onSelectSwatch,
  icons = {},
}: Props) {
  if (swatches.length === 0) return null;

  return (
    <>
      {/* Desktop matrix */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr>
              <th className="text-left font-accent text-[10px] font-normal uppercase tracking-[0.12em] text-anthracite/50 py-3 px-4 w-[280px]">
                Stoff
              </th>
              {productTypes.map((pt) => (
                <th
                  key={pt.slug}
                  className="text-center font-accent text-[10px] font-normal uppercase tracking-[0.1em] text-anthracite/50 py-3 px-2 min-w-[80px]"
                >
                  {pt.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {swatches.map((swatch, i) => {
              const availableSet = new Map(
                swatch.availableProductTypes.map((a) => [a.slug, a]),
              );
              return (
                <tr
                  key={swatch.id}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-[#FAF8F5]"} hover:bg-pumpkin/[0.03] transition-colors duration-200 cursor-pointer`}
                  onClick={() => onSelectSwatch?.(swatch)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex-shrink-0 overflow-hidden border border-black/[0.06]">
                        {swatch.swatchImageUrl ? (
                          <Image
                            src={swatch.swatchImageUrl}
                            alt={swatch.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : swatch.colorHex ? (
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: swatch.colorHex }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-anthracite/10 to-anthracite/5" />
                        )}
                      </div>
                      <div>
                        <p className="font-heading text-anthracite text-sm font-semibold leading-tight">
                          {swatch.name}
                        </p>
                        <p className="font-accent text-text-gray/40 text-[10px] tracking-wider uppercase">
                          {swatch.articleNumber && `Art. ${swatch.articleNumber}`}
                          {swatch.articleNumber && swatch.familyName && " · "}
                          {swatch.familyName}
                        </p>
                      </div>
                    </div>
                  </td>
                  {productTypes.map((pt) => {
                    const avail = availableSet.get(pt.slug);
                    return (
                      <td key={pt.slug} className="text-center py-3 px-2">
                        {avail ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <CmsIcon icon={icons["checkmark"]} width={16} height={16} className="text-pumpkin" />
                            {avail.note && (
                              <span className="font-accent text-[8px] text-text-gray/40 tracking-wide uppercase leading-tight">
                                {avail.note}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-anthracite/10">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {swatches.map((swatch) => (
          <button
            key={swatch.id}
            type="button"
            onClick={() => onSelectSwatch?.(swatch)}
            className="w-full text-left bg-white border border-black/[0.06] p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 flex-shrink-0 overflow-hidden border border-black/[0.06]">
                {swatch.swatchImageUrl ? (
                  <Image
                    src={swatch.swatchImageUrl}
                    alt={swatch.name}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : swatch.colorHex ? (
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: swatch.colorHex }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-anthracite/10 to-anthracite/5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-anthracite text-sm font-semibold leading-tight">
                  {swatch.name}
                </p>
                <p className="font-accent text-text-gray/40 text-[10px] tracking-wider uppercase mt-0.5">
                  {swatch.familyName}
                  {swatch.articleNumber && ` · Art. ${swatch.articleNumber}`}
                </p>
                {swatch.availableProductTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {swatch.availableProductTypes.map((pt) => (
                      <span
                        key={pt.slug}
                        className="font-accent text-[8px] tracking-[0.06em] uppercase px-1.5 py-0.5 bg-[#FAF8F5] text-text-gray/60 border border-black/[0.04]"
                      >
                        {pt.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
