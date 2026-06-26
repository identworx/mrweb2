import "server-only";
import { getSiteSettings } from "./settings";
import { getHeaderNavigation, getFooterNavigation } from "./navigation";
import { getFooterSettings } from "./footer";
import { resolveNavigationLink } from "./link-resolver";
import { getIconSlots, type ResolvedIcon } from "./icons";
import type { HeaderNavItem } from "@/components/Header";
import type { FooterNavColumn, FooterProps } from "@/components/Footer";
import type { Locale } from "@/lib/i18n/config";
import { getDictionaryAsync } from "@/lib/i18n/dictionary-async";
import type { Dictionary } from "@/lib/i18n/dictionary";
import { localizedHref } from "@/lib/i18n/routes";
import { getTranslations } from "@/lib/i18n/get-translation";
import { getDisabledNavTargets, isPathDisabled } from "./nav-visibility";

interface LayoutData {
  header: {
    navItems: HeaderNavItem[];
    logoUrl: string | null;
    siteName: string | null;
    icons: Record<string, ResolvedIcon>;
    locale: Locale;
    dictionary?: Dictionary;
  };
  footer: FooterProps;
  siteSettings: {
    siteName: string | null;
    defaultSeoTitle: string | null;
    defaultSeoDescription: string | null;
    contactEmail: string | null;
    phone: string | null;
    address: string | null;
  };
}

const NAV_LABEL_EN: Record<string, string> = {
  Kollektionen: "Collections",
  Materialien: "Materials",
  "Über uns": "About Us",
  Kataloge: "Catalogues",
  Neuigkeiten: "News",
  Kontakt: "Contact",
  NERIO: "NERIO",
  Impressum: "Legal Notice",
  Datenschutz: "Privacy Policy",
  AGB: "Terms & Conditions",
  "Allgemeine Geschäftsbedingungen": "Terms & Conditions",
  "Cookie-Einstellungen": "Cookie Settings",
  "Datenschutz & Cookies": "Privacy & Cookies",
  "Neue Kollektionen Saison 2027": "New Collections Season 2027",
  "Pflege & Garantie": "Care & Warranty",
  Produktmaße: "Product Dimensions",
  "Stoff- & technische Daten": "Fabric & Technical Data",
  "Kontakt aufnehmen": "Contact us",
  "Mehr erfahren": "Learn more",
  Service: "Service",
  Nachhaltigkeit: "Sustainability",
  "Stoffe & Muster": "Fabrics & Samples",
  "Technische Daten": "Technical Data",
  Produkte: "Products",
  Produktkategorien: "Product Categories",
  NEU: "NEW",
};

function localizeLabel(label: string, locale: Locale): string {
  if (locale === "de") return label;
  return NAV_LABEL_EN[label] || label;
}

export async function getPublicLayoutData(locale: Locale = "de"): Promise<LayoutData> {
  const [settings, headerNav, footerMenus, footerSettings, layoutIcons, dictionary, disabledTargets] = await Promise.all([
    getSiteSettings(),
    getHeaderNavigation(),
    getFooterNavigation(),
    getFooterSettings(),
    getIconSlots([
      "chevron-right",
      "arrow-right",
      "social-facebook",
      "social-instagram",
      "social-pinterest",
      "social-youtube",
      "social-linkedin",
      "social-houzz",
    ]),
    getDictionaryAsync(locale),
    getDisabledNavTargets(),
  ]);

  const headerItems: HeaderNavItem[] = headerNav?.items
    ? headerNav.items
        .map((item) => resolveNavigationLink(item))
        .filter((link) => link.href && link.status === "ok")
        .map((link) => ({
          label: localizeLabel(link.label, locale),
          href: localizedHref(link.href!, locale),
          target: link.target,
          badgeText: link.badgeText ? localizeLabel(link.badgeText, locale) : link.badgeText,
          badgeVariant: link.badgeVariant,
        }))
    : [];

  const logoUrl = settings?.logoMedia?.url || settings?.logoDarkUrl || null;

  const footerColumns: FooterNavColumn[] = [];
  const legalLinks: { label: string; href: string; target?: string }[] = [];

  if (footerMenus && footerMenus.length > 0) {
    for (const menu of footerMenus) {
      const resolved = menu.items
        .map((item) => resolveNavigationLink(item))
        .filter((link) => link.href && link.status === "ok")
        .filter((link) => !isPathDisabled(link.href!, disabledTargets));

      if (menu.location === "LEGAL") {
        for (const link of resolved) {
          legalLinks.push({
            label: localizeLabel(link.label, locale),
            href: localizedHref(link.href!, locale),
            target: link.target,
          });
        }
      } else {
        const links = resolved.map((link) => ({
          label: localizeLabel(link.label, locale),
          href: localizedHref(link.href!, locale),
          target: link.target,
        }));
        if (links.length > 0) {
          footerColumns.push({
            title: localizeLabel(menu.name, locale),
            links,
          });
        }
      }
    }
  }

  let socialLinks: { platform: string; url: string }[] | null = null;
  const rawSocial = settings?.socialLinks ?? footerSettings?.socialLinks;
  if (rawSocial && Array.isArray(rawSocial)) {
    socialLinks = rawSocial as { platform: string; url: string }[];
  }

  // Overlay footer CMS text fields with ContentTranslation for non-DE
  const footerTranslations = locale !== "de"
    ? await getTranslations("footer", "", locale)
    : {};

  function ft(cmsValue: string | null | undefined, fieldName: string, dictFallback?: string): string | null {
    if (!cmsValue) return dictFallback ?? null;
    if (locale === "de") return cmsValue;
    return footerTranslations[fieldName] || dictFallback || cmsValue;
  }

  return {
    header: {
      navItems: headerItems,
      logoUrl,
      siteName: settings?.siteName ?? null,
      icons: layoutIcons,
      locale,
      dictionary,
    },
    footer: {
      description: ft(footerSettings?.description, "description"),
      copyrightText: footerSettings?.copyrightText ?? null,
      logoUrl: footerSettings?.logoMedia?.url || footerSettings?.logoUrl || "/mosaroma_logo.png",
      siteName: settings?.siteName ?? null,
      columns: footerColumns,
      legalLinks,
      socialLinks,
      ctaEnabled: footerSettings?.ctaEnabled ?? false,
      ctaEyebrow: ft(footerSettings?.ctaEyebrow, "ctaEyebrow", dictionary.footer.ctaEyebrow),
      ctaTitle: ft(footerSettings?.ctaTitle, "ctaTitle", dictionary.footer.ctaTitle),
      ctaText: ft(footerSettings?.ctaText, "ctaText", dictionary.footer.ctaText),
      ctaPrimaryLabel: ft(footerSettings?.ctaPrimaryLabel, "ctaPrimaryLabel", dictionary.footer.ctaPrimary),
      ctaPrimaryHref: footerSettings?.ctaPrimaryHref ? localizedHref(footerSettings.ctaPrimaryHref, locale) : null,
      ctaSecondaryLabel: ft(footerSettings?.ctaSecondaryLabel, "ctaSecondaryLabel", dictionary.footer.ctaSecondary),
      ctaSecondaryHref: footerSettings?.ctaSecondaryHref ? localizedHref(footerSettings.ctaSecondaryHref, locale) : null,
      contactTitle: ft(footerSettings?.contactTitle, "contactTitle", dictionary.footer.contactTitle),
      companyName: footerSettings?.companyName ?? null,
      addressLine1: footerSettings?.addressLine1 ?? null,
      addressLine2: footerSettings?.addressLine2 ?? null,
      postalCity: footerSettings?.postalCity ?? null,
      country: ft(footerSettings?.country, "country", dictionary.common.country),
      email: footerSettings?.email ?? null,
      phone: footerSettings?.phone ?? null,
      contactButtonLabel: ft(footerSettings?.contactButtonLabel, "contactButtonLabel", dictionary.footer.contactButton),
      contactButtonHref: footerSettings?.contactButtonHref ? localizedHref(footerSettings.contactButtonHref, locale) : null,
      bottomNote: footerSettings?.bottomNote ?? null,
      icons: layoutIcons,
      locale,
      dictionary,
    },
    siteSettings: {
      siteName: settings?.siteName ?? null,
      defaultSeoTitle: settings?.defaultSeoTitle ?? null,
      defaultSeoDescription: settings?.defaultSeoDescription ?? null,
      contactEmail: settings?.contactEmail ?? null,
      phone: settings?.phone ?? null,
      address: settings?.address ?? null,
    },
  };
}
