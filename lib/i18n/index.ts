export { type Locale, defaultLocale, supportedLocales, isValidLocale } from "./config";
export { getDictionary, type Dictionary } from "./dictionary";
export { getAlternateRoute, getDeRoute, getEnRoute, getAllAlternates } from "./routes";
export { getNavLinks, getFooterLegalLinks } from "./navigation";
export { translateProductType, getProductTypeMap } from "./product-types";
export {
  getTranslation,
  getTranslations,
  getTranslationsForType,
  upsertTranslation,
  getAllTranslations,
  type TranslationStatus,
} from "./get-translation";
