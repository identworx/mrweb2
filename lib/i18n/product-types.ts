import type { Locale } from "./config";
import { getTranslationsForType } from "./get-translation";

const productTypeTranslations: Record<string, string> = {
  Hochlehner: "High-Back Cushion",
  Niedriglehner: "Low-Back Cushion",
  Sitzkissen: "Seat Cushion",
  Bankauflage: "Bench Cushion",
  Bankauflagen: "Bench Cushions",
  Dekokissen: "Decorative Cushion",
  "Deko-Kissen": "Decorative Cushion",
  Tischset: "Placemat",
  Tischläufer: "Table Runner",
  "Tischsets & Tischläufer": "Placemats & Table Runners",
  Sitzpolster: "Seat Pad",
  Decke: "Blanket",
  Pouf: "Pouf",
};

export function translateProductType(
  germanName: string,
  locale: Locale,
): string {
  if (locale === "de") return germanName;
  return productTypeTranslations[germanName] || germanName;
}

export function getProductTypeMap(): Record<string, string> {
  return { ...productTypeTranslations };
}

export function translateProductDisplayName(
  name: string,
  locale: Locale,
): string {
  if (locale === "de") return name;
  let result = name;
  for (const [de, en] of Object.entries(productTypeTranslations)) {
    if (result.includes(de)) {
      result = result.replace(de, en);
    }
  }
  return result;
}

export async function translateProductTypeAsync(
  germanName: string,
  locale: Locale,
): Promise<string> {
  if (locale === "de") return germanName;

  try {
    const dbMap = await getTranslationsForType("productType", locale);
    const fields = dbMap.get("");
    if (fields && fields[germanName]) return fields[germanName];
  } catch {
    // fall through to static
  }

  return productTypeTranslations[germanName] || germanName;
}
