import "server-only";
import { getSiteSettings } from "./settings";
import { getHeaderNavigation, getFooterNavigation } from "./navigation";
import { getFooterSettings } from "./footer";
import { resolveNavigationLink } from "./link-resolver";
import type { HeaderNavItem } from "@/components/Header";
import type { FooterNavColumn, FooterProps } from "@/components/Footer";

interface LayoutData {
  header: {
    navItems: HeaderNavItem[];
    logoUrl: string | null;
    siteName: string | null;
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

export async function getPublicLayoutData(): Promise<LayoutData> {
  const [settings, headerNav, footerMenus, footerSettings] = await Promise.all([
    getSiteSettings(),
    getHeaderNavigation(),
    getFooterNavigation(),
    getFooterSettings(),
  ]);

  const headerItems: HeaderNavItem[] = headerNav?.items
    ? headerNav.items
        .map((item) => resolveNavigationLink(item))
        .filter((link) => link.href && link.status === "ok")
        .map((link) => ({
          label: link.label,
          href: link.href!,
          target: link.target,
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
            label: link.label,
            href: link.href!,
            target: link.target,
          });
        }
      } else {
        footerColumns.push({
          title: menu.name,
          links: resolved.map((link) => ({
            label: link.label,
            href: link.href!,
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
      ctaPrimaryHref: footerSettings?.ctaPrimaryHref ?? null,
      ctaSecondaryLabel: footerSettings?.ctaSecondaryLabel ?? null,
      ctaSecondaryHref: footerSettings?.ctaSecondaryHref ?? null,
      contactTitle: footerSettings?.contactTitle ?? null,
      companyName: footerSettings?.companyName ?? null,
      addressLine1: footerSettings?.addressLine1 ?? null,
      addressLine2: footerSettings?.addressLine2 ?? null,
      postalCity: footerSettings?.postalCity ?? null,
      country: footerSettings?.country ?? null,
      email: footerSettings?.email ?? null,
      phone: footerSettings?.phone ?? null,
      contactButtonLabel: footerSettings?.contactButtonLabel ?? null,
      contactButtonHref: footerSettings?.contactButtonHref ?? null,
      bottomNote: footerSettings?.bottomNote ?? null,
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
