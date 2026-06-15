import "server-only";
import { pageSlugToPublicPath, isExternalUrl, SYSTEM_ROUTES } from "./page-paths";

export type LinkStatus =
  | "ok"
  | "missing_page"
  | "draft_page"
  | "archived_page"
  | "invalid_url";

export type LinkSource =
  | "page"
  | "planned_page"
  | "system_route"
  | "custom_url"
  | "legacy_url";

export interface ResolvedLink {
  href: string | null;
  label: string;
  target?: string;
  rel?: string;
  status: LinkStatus;
  source: LinkSource;
  badgeText?: string | null;
  badgeVariant?: string;
}

interface NavigationItemInput {
  label: string;
  linkType: string;
  href?: string | null;
  target?: string;
  linkedPageId?: string | null;
  linkedPage?: { slug: string; status: string } | null;
  isActive?: boolean;
  badgeText?: string | null;
  badgeVariant?: string;
}

export function resolveNavigationLink(item: NavigationItemInput): ResolvedLink {
  const base = {
    label: item.label,
    badgeText: item.badgeText || null,
    badgeVariant: item.badgeVariant || "blue",
  };
  const targetProps = resolveTarget(item.target, item.href);

  switch (item.linkType) {
    case "PAGE": {
      if (!item.linkedPage) {
        return { ...base, href: item.href || null, status: "missing_page", source: "page", ...targetProps };
      }
      const path = pageSlugToPublicPath(item.linkedPage.slug);
      const status = pageStatusToLinkStatus(item.linkedPage.status);
      return { ...base, href: path, status, source: "page", ...targetProps };
    }

    case "PAGE_SLUG": {
      const slug = item.href;
      if (!slug) {
        return { ...base, href: null, status: "invalid_url", source: "planned_page", ...targetProps };
      }
      return { ...base, href: pageSlugToPublicPath(slug), status: "missing_page", source: "planned_page", ...targetProps };
    }

    case "SYSTEM_ROUTE": {
      const route = item.href;
      if (!route || !SYSTEM_ROUTES.some((r) => r.path === route)) {
        return { ...base, href: route || null, status: "invalid_url", source: "system_route", ...targetProps };
      }
      return { ...base, href: route, status: "ok", source: "system_route", ...targetProps };
    }

    case "CUSTOM_URL":
    default: {
      if (!item.href) {
        return { ...base, href: null, status: "invalid_url", source: item.linkType === "CUSTOM_URL" ? "custom_url" : "legacy_url", ...targetProps };
      }
      return { ...base, href: item.href, status: "ok", source: "custom_url", ...targetProps };
    }
  }
}

function pageStatusToLinkStatus(status: string): LinkStatus {
  if (status === "PUBLISHED") return "ok";
  if (status === "DRAFT") return "draft_page";
  if (status === "ARCHIVED") return "archived_page";
  return "missing_page";
}

function resolveTarget(target?: string, href?: string | null): { target?: string; rel?: string } {
  if (target === "_blank") {
    return { target: "_blank", rel: "noopener noreferrer" };
  }
  if (href && isExternalUrl(href)) {
    return { target: "_blank", rel: "noopener noreferrer" };
  }
  return {};
}

export function getLinkStatusLabel(status: LinkStatus): string {
  switch (status) {
    case "ok": return "OK";
    case "missing_page": return "Seite fehlt";
    case "draft_page": return "Entwurf";
    case "archived_page": return "Archiviert";
    case "invalid_url": return "Ungültig";
  }
}

export function getLinkStatusColor(status: LinkStatus): string {
  switch (status) {
    case "ok": return "bg-green-100 text-green-800";
    case "missing_page": return "bg-red-100 text-red-800";
    case "draft_page": return "bg-yellow-100 text-yellow-800";
    case "archived_page": return "bg-gray-100 text-gray-600";
    case "invalid_url": return "bg-red-100 text-red-800";
  }
}
