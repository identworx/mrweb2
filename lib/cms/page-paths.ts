import "server-only";
export { SYSTEM_ROUTES } from "./nav-constants";

export const PAGE_SLUG_TO_PATH: Record<string, string> = {
  home: "/",
  kollektionen: "/kollektionen",
  materialien: "/materialien",
  "ueber-uns": "/ueber-uns",
  kataloge: "/kataloge",
  produktmasse: "/kataloge/produktmasse",
  "pflege-garantie": "/kataloge/pflege-garantie",
  "stoff-technische-daten": "/kataloge/stoff-technische-daten",
  neuigkeiten: "/neuigkeiten",
  kontakt: "/kontakt",
};

export function pageSlugToPublicPath(slug: string): string {
  return PAGE_SLUG_TO_PATH[slug] ?? `/${slug}`;
}

export function isExternalUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}
