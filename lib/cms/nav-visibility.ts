import "server-only";
import { prisma } from "@/lib/db/prisma";
import { pageSlugToPublicPath } from "./page-paths";
import type { Locale } from "@/lib/i18n/config";
import { getDeRoute } from "@/lib/i18n/routes";
import { cache } from "react";

const LEGAL_DE_PATHS = new Set(["/impressum", "/datenschutz", "/agb"]);

const SECTION_STYLE_TO_NAV_TARGET: Record<string, string> = {
  "collection-showcase": "/kollektionen",
  "homepage-ambiente-teaser": "/kollektionen",
  "image-text-feature": "/materialien",
  "downloads-teaser": "/kataloge",
  "news-teaser": "/neuigkeiten",
};

/**
 * Returns the set of disabled DE base paths from inactive header/footer/service
 * navigation items. Legal-menu items are excluded — legal pages are only gated
 * by their own CMS page status, not navigation visibility.
 *
 * Result is React-request-cached: one DB query per render, shared across all
 * server components in a single request.
 */
export const getDisabledNavTargets = cache(async (): Promise<Set<string>> => {
  try {
    const allItems = await prisma.navigationItem.findMany({
      where: { isActive: false },
      select: {
        href: true,
        linkType: true,
        linkedPage: { select: { slug: true } },
        menu: { select: { location: true } },
      },
    });

    const disabled = new Set<string>();

    for (const item of allItems) {
      if (item.menu.location === "LEGAL") continue;

      let dePath: string | null = null;

      if (item.linkType === "PAGE" && item.linkedPage) {
        dePath = pageSlugToPublicPath(item.linkedPage.slug);
      } else if (item.linkType === "SYSTEM_ROUTE" && item.href) {
        dePath = item.href;
      } else if (item.linkType === "CUSTOM_URL" && item.href) {
        const href = item.href;
        if (href.startsWith("/") && !href.startsWith("/en")) {
          dePath = href;
        }
      }

      if (dePath && dePath !== "/") {
        disabled.add(dePath);
      }
    }

    return disabled;
  } catch (error) {
    console.error("nav-visibility: getDisabledNavTargets failed", error);
    return new Set();
  }
});

function toDePath(path: string): string {
  if (path.startsWith("/en/") || path === "/en") {
    return getDeRoute(path);
  }
  return path;
}

/**
 * Check if a path (DE or EN) is disabled by navigation.
 * Parent paths disable their children: /kollektionen disabled → /kollektionen/green disabled.
 * Legal paths (/impressum, /datenschutz, /agb) are never disabled by navigation.
 * Homepage (/, /en) is never disabled.
 */
export function isPathDisabled(
  path: string,
  disabledTargets: Set<string>,
): boolean {
  if (disabledTargets.size === 0) return false;
  if (path === "/" || path === "/en") return false;

  const dePath = toDePath(path);

  if (LEGAL_DE_PATHS.has(dePath)) return false;

  if (disabledTargets.has(dePath)) return true;

  for (const target of disabledTargets) {
    if (dePath.startsWith(target + "/")) return true;
  }

  return false;
}

/**
 * Async convenience wrapper: queries disabled targets + checks the path.
 */
export async function isPublicPathEnabled(
  path: string,
): Promise<boolean> {
  const disabled = await getDisabledNavTargets();
  return !isPathDisabled(path, disabled);
}

/**
 * Filter homepage sections by removing those whose primary navigation target
 * is disabled. Uses both section style mapping and buttonHref.
 */
export function filterHomepageSections<
  T extends { style: string; buttonHref: string | null },
>(sections: T[], disabledTargets: Set<string>): T[] {
  if (disabledTargets.size === 0) return sections;

  return sections.filter((section) => {
    const navTarget = SECTION_STYLE_TO_NAV_TARGET[section.style];
    if (navTarget && disabledTargets.has(navTarget)) return false;

    if (section.buttonHref) {
      const dePath = toDePath(section.buttonHref);
      if (isPathDisabled(dePath, disabledTargets)) return false;
    }

    return true;
  });
}

/**
 * Check if a specific href should be shown (for CTA buttons, cards, etc.).
 * External URLs and empty hrefs are always enabled.
 */
export function isHrefEnabled(
  href: string,
  disabledTargets: Set<string>,
): boolean {
  if (!href || !href.startsWith("/")) return true;
  return !isPathDisabled(href, disabledTargets);
}

/**
 * Filter an array of routes for sitemap generation.
 */
export function filterSitemapRoutes(
  routes: string[],
  disabledTargets: Set<string>,
): string[] {
  if (disabledTargets.size === 0) return routes;
  return routes.filter((route) => !isPathDisabled(route, disabledTargets));
}
