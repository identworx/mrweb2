import type { Locale } from "./config";
import { getTranslationsForType } from "./get-translation";

const productTypeTranslations: Record<string, string> = {
  Hochlehner: "High-back Cushion",
  Niedriglehner: "Low-back Cushion",
  Sitzkissen: "Seat Cushion",
  Bankauflage: "Bench Cushion",
  Dekokissen: "Decorative Cushion",
  Tischset: "Placemat",
  Tischläufer: "Table Runner",
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
