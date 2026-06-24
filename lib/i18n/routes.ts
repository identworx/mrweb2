import type { Locale } from "./config";

interface RouteMapping {
  de: string;
  en: string;
}

const staticRoutes: RouteMapping[] = [
  { de: "/", en: "/en" },
  { de: "/ueber-uns", en: "/en/about-us" },
  { de: "/kollektionen", en: "/en/collections" },
  { de: "/kollektionen/ambiente", en: "/en/collections/ambiente" },
  { de: "/materialien", en: "/en/materials" },
  { de: "/materialien/stoffe-muster", en: "/en/materials/fabrics-samples" },
  { de: "/materialien/technische-daten", en: "/en/materials/technical-data" },
  { de: "/nerio", en: "/en/nerio" },
  { de: "/kataloge", en: "/en/catalogues" },
  { de: "/kataloge/produktmasse", en: "/en/catalogues/product-dimensions" },
  { de: "/kataloge/pflege-garantie", en: "/en/catalogues/care-warranty" },
  { de: "/kataloge/stoff-technische-daten", en: "/en/catalogues/fabric-technical-data" },
  { de: "/kontakt", en: "/en/contact" },
  { de: "/produktkategorien", en: "/en/product-categories" },
  { de: "/impressum", en: "/en/legal-notice" },
  { de: "/datenschutz", en: "/en/privacy-policy" },
  { de: "/agb", en: "/en/terms" },
  { de: "/neuigkeiten", en: "/en/news" },
];

const dynamicPrefixes: { de: string; en: string }[] = [
  { de: "/kollektionen/", en: "/en/collections/" },
  { de: "/produkte/", en: "/en/products/" },
  { de: "/produktkategorien/", en: "/en/product-categories/" },
  { de: "/neuigkeiten/", en: "/en/news/" },
];

const dynamicRoutePatterns: { de: string; en: string }[] = [
  { de: "/kollektionen/[slug]", en: "/en/collections/[slug]" },
  { de: "/produkte/[slug]", en: "/en/products/[slug]" },
  { de: "/produktkategorien/[slug]", en: "/en/product-categories/[slug]" },
  { de: "/neuigkeiten/[slug]", en: "/en/news/[slug]" },
];

export function localizedHref(dePath: string, locale: Locale): string {
  if (locale === "de") return dePath;

  for (const route of staticRoutes) {
    if (dePath === route.de) return route.en;
  }

  for (const prefix of dynamicPrefixes) {
    if (dePath.startsWith(prefix.de)) {
      return prefix.en + dePath.slice(prefix.de.length);
    }
  }

  return "/en" + dePath;
}

export function getAlternateRoute(
  currentPath: string,
  targetLocale: Locale,
): string {
  const sourceLocale: Locale = currentPath.startsWith("/en") ? "en" : "de";
  if (sourceLocale === targetLocale) return currentPath;

  for (const route of staticRoutes) {
    if (currentPath === route[sourceLocale]) {
      return route[targetLocale];
    }
  }

  for (const pattern of dynamicRoutePatterns) {
    const sourcePattern = pattern[sourceLocale];
    const targetPattern = pattern[targetLocale];

    const sourcePrefix = sourcePattern.replace("[slug]", "");
    if (currentPath.startsWith(sourcePrefix)) {
      const slug = currentPath.slice(sourcePrefix.length);
      return targetPattern.replace("[slug]", slug);
    }
  }

  if (targetLocale === "en") {
    return "/en" + currentPath;
  }
  return currentPath.replace(/^\/en/, "") || "/";
}

export function getDeRoute(enPath: string): string {
  return getAlternateRoute(enPath, "de");
}

export function getEnRoute(dePath: string): string {
  return getAlternateRoute(dePath, "en");
}

export function getAllAlternates(
  path: string,
): { locale: Locale; href: string }[] {
  const dePath = path.startsWith("/en")
    ? getAlternateRoute(path, "de")
    : path;
  const enPath = path.startsWith("/en")
    ? path
    : getAlternateRoute(path, "en");

  return [
    { locale: "de", href: dePath },
    { locale: "en", href: enPath },
  ];
}
