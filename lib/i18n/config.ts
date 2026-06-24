export type Locale = "de" | "en";

export const defaultLocale: Locale = "de";
export const supportedLocales: Locale[] = ["de", "en"];

export function isValidLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}
