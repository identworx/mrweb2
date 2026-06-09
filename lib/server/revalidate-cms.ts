import "server-only";
import { revalidatePath } from "next/cache";

function safeRevalidate(path: string, type?: "layout" | "page") {
  try {
    revalidatePath(path, type);
  } catch (error) {
    console.warn(`[revalidate] Failed for ${path}:`, error);
  }
}

const PAGE_SLUG_TO_PATH: Record<string, string> = {
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

export function revalidateAllPublicPages() {
  safeRevalidate("/", "layout");
}

export function revalidateNavigation() {
  revalidateAllPublicPages();
}

export function revalidateFooter() {
  revalidateAllPublicPages();
}

export function revalidateSettings() {
  revalidateAllPublicPages();
}

export function revalidatePage(slug: string) {
  const publicPath = PAGE_SLUG_TO_PATH[slug];
  if (publicPath) {
    safeRevalidate(publicPath);
  } else {
    revalidateAllPublicPages();
  }
}

export function revalidatePageSection(pageSlug: string) {
  revalidatePage(pageSlug);
}

export function revalidateCollection(slug?: string) {
  safeRevalidate("/");
  safeRevalidate("/kollektionen");
  if (slug) {
    safeRevalidate(`/kollektionen/${slug}`);
  }
}

export function revalidateProduct(
  slug?: string,
  collectionSlug?: string,
  productGroupSlug?: string,
) {
  if (slug) safeRevalidate(`/produkte/${slug}`);
  safeRevalidate("/kollektionen");
  if (collectionSlug) safeRevalidate(`/kollektionen/${collectionSlug}`);
  safeRevalidate("/produktkategorien");
  if (productGroupSlug)
    safeRevalidate(`/produktkategorien/${productGroupSlug}`);
}

export function revalidateProductGroup(slug?: string) {
  safeRevalidate("/produktkategorien");
  if (slug) safeRevalidate(`/produktkategorien/${slug}`);
}

export function revalidateMaterials() {
  safeRevalidate("/materialien");
}

export function revalidateDownloads() {
  safeRevalidate("/kataloge");
}

export function revalidateMeasurements() {
  safeRevalidate("/kataloge/produktmasse");
}

export function revalidateNews(slug?: string) {
  safeRevalidate("/neuigkeiten");
  if (slug) safeRevalidate(`/neuigkeiten/${slug}`);
}

export function revalidateContactForm() {
  safeRevalidate("/kontakt");
}
