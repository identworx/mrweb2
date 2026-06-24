import type { Locale } from "./config";

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
