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
  "Pflege & Garantie": "Care & Warranty",
  Produktmaße: "Product Dimensions",
  "Stoff- & technische Daten": "Fabric & Technical Data",
  "Kontakt aufnehmen": "Contact us",
  "Mehr erfahren": "Learn more",
  Service: "Service",
};

function localizeLabel(label: string, locale: Locale): string {
  if (locale === "de") return label;
  return NAV_LABEL_EN[label] || label;
}

export async function getPublicLayoutData(locale: Locale = "de"): Promise<LayoutData> {
  const [settings, headerNav, footerMenus, footerSettings, layoutIcons, dictionary] = await Promise.all([
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
  ]);

  const headerItems: HeaderNavItem[] = headerNav?.items
    ? headerNav.items
        .map((item) => resolveNavigationLink(item))
        .filter((link) => link.href && link.status === "ok")
        .map((link) => ({
          label: localizeLabel(link.label, locale),
          href: localizedHref(link.href!, locale),
          target: link.target,
          badgeText: link.badgeText,
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
        .filter((link) => link.href && link.status === "ok");

      if (menu.location === "LEGAL") {
        for (const link of resolved) {
          legalLinks.push({
            label: localizeLabel(link.label, locale),
            href: localizedHref(link.href!, locale),
            target: link.target,
          });
        }
      } else {
        footerColumns.push({
          title: localizeLabel(menu.name, locale),
          links: resolved.map((link) => ({
            label: localizeLabel(link.label, locale),
            href: localizedHref(link.href!, locale),
            target: link.target,
          })),
        });
      }
    }
  }

  let socialLinks: { platform: string; url: string }[] | null = null;
  const rawSocial = settings?.socialLinks ?? footerSettings?.socialLinks;
  if (rawSocial && Array.isArray(rawSocial)) {
    socialLinks = rawSocial as { platform: string; url: string }[];
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
      description: footerSettings?.description ?? null,
      copyrightText: footerSettings?.copyrightText ?? null,
      logoUrl: footerSettings?.logoMedia?.url || footerSettings?.logoUrl || "/mosaroma_logo.png",
      siteName: settings?.siteName ?? null,
      columns: footerColumns,
      legalLinks,
      socialLinks,
      ctaEnabled: footerSettings?.ctaEnabled ?? false,
      ctaEyebrow: footerSettings?.ctaEyebrow ?? null,
      ctaTitle: footerSettings?.ctaTitle ?? null,
      ctaText: footerSettings?.ctaText ?? null,
      ctaPrimaryLabel: footerSettings?.ctaPrimaryLabel ?? null,
      ctaPrimaryHref: footerSettings?.ctaPrimaryHref ? localizedHref(footerSettings.ctaPrimaryHref, locale) : null,
      ctaSecondaryLabel: footerSettings?.ctaSecondaryLabel ?? null,
      ctaSecondaryHref: footerSettings?.ctaSecondaryHref ? localizedHref(footerSettings.ctaSecondaryHref, locale) : null,
      contactTitle: footerSettings?.contactTitle ?? null,
      companyName: footerSettings?.companyName ?? null,
      addressLine1: footerSettings?.addressLine1 ?? null,
      addressLine2: footerSettings?.addressLine2 ?? null,
      postalCity: footerSettings?.postalCity ?? null,
      country: footerSettings?.country ?? null,
      email: footerSettings?.email ?? null,
      phone: footerSettings?.phone ?? null,
      contactButtonLabel: footerSettings?.contactButtonLabel ? localizeLabel(footerSettings.contactButtonLabel, locale) : null,
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
