import type { Locale } from "./config";
import { getDictionary } from "./dictionary";

export interface NavLink {
  label: string;
  href: string;
}

export function getNavLinks(locale: Locale): NavLink[] {
  const t = getDictionary(locale);

  if (locale === "en") {
    return [
      { label: t.nav.collections, href: "/en/collections" },
      { label: t.nav.materials, href: "/en/materials" },
      { label: t.nav.aboutUs, href: "/en/about-us" },
      { label: t.nav.catalogues, href: "/en/catalogues" },
      { label: t.nav.news, href: "/en/news" },
      { label: t.nav.contact, href: "/en/contact" },
    ];
  }

  return [
    { label: t.nav.collections, href: "/kollektionen" },
    { label: t.nav.materials, href: "/materialien" },
    { label: t.nav.aboutUs, href: "/ueber-uns" },
    { label: t.nav.catalogues, href: "/kataloge" },
    { label: t.nav.news, href: "/neuigkeiten" },
    { label: t.nav.contact, href: "/kontakt" },
  ];
}

export function getFooterLegalLinks(
  locale: Locale,
): NavLink[] {
  const t = getDictionary(locale);

  if (locale === "en") {
    return [
      { label: t.footer.legalNotice, href: "/en/legal-notice" },
      { label: t.footer.privacyPolicy, href: "/en/privacy-policy" },
      { label: t.footer.terms, href: "/en/terms" },
    ];
  }

  return [
    { label: t.footer.legalNotice, href: "/impressum" },
    { label: t.footer.privacyPolicy, href: "/datenschutz" },
    { label: t.footer.terms, href: "/agb" },
  ];
}
