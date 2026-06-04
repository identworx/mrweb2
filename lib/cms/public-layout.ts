import "server-only";
import { getSiteSettings } from "./settings";
import { getHeaderNavigation, getFooterNavigation } from "./navigation";
import { getFooterSettings } from "./footer";
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
        .filter((item) => item.href)
        .map((item) => ({
          label: item.label,
          href: item.href!,
          target: item.target,
        }))
    : [];

  const logoUrl = settings?.logoDarkUrl || null;

  const footerColumns: FooterNavColumn[] = [];
  const legalLinks: { label: string; href: string; target?: string }[] = [];

  if (footerMenus && footerMenus.length > 0) {
    for (const menu of footerMenus) {
      if (menu.location === "LEGAL") {
        for (const item of menu.items) {
          if (item.href) {
            legalLinks.push({
              label: item.label,
              href: item.href,
              target: item.target !== "_self" ? item.target : undefined,
            });
          }
        }
      } else {
        footerColumns.push({
          title: menu.name,
          links: menu.items
            .filter((item) => item.href)
            .map((item) => ({
              label: item.label,
              href: item.href!,
              target: item.target !== "_self" ? item.target : undefined,
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
      logoUrl: footerSettings?.logoUrl || "/mosaroma_logo.png",
      siteName: settings?.siteName ?? null,
      columns: footerColumns,
      legalLinks,
      socialLinks,
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
