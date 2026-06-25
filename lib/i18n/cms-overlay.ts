import "server-only";
import { getTranslations, getTranslationsForType } from "./get-translation";
import type { Locale } from "./config";
import { localizedHref } from "./routes";

/**
 * Overlay ContentTranslation on a single CMS entity's text fields.
 * Non-text fields (images, IDs, slugs, etc.) are never touched.
 */
export async function overlayCmsFields<T extends object>(
  entityType: string,
  entityId: string,
  obj: T,
  textFields: (keyof T & string)[],
  locale: Locale,
): Promise<T> {
  if (locale === "de") return obj;

  const translations = await getTranslations(entityType, entityId, locale);
  if (Object.keys(translations).length === 0) return obj;

  const result = { ...obj };
  for (const field of textFields) {
    if (translations[field]) {
      (result as Record<string, unknown>)[field] = translations[field];
    }
  }
  return result;
}

/**
 * Batch overlay: load all translations for an entityType at once,
 * then apply to each item. One DB query for the whole list.
 */
export async function overlayCmsBatch<T extends object>(
  entityType: string,
  items: T[],
  idField: keyof T & string,
  textFields: (keyof T & string)[],
  locale: Locale,
): Promise<T[]> {
  if (locale === "de" || items.length === 0) return items;

  const translationMap = await getTranslationsForType(entityType, locale);
  if (translationMap.size === 0) return items;

  return items.map((item) => {
    const id = String(item[idField] || "");
    const translations = translationMap.get(id);
    if (!translations) return item;

    const result = { ...item };
    for (const field of textFields) {
      if (translations[field]) {
        (result as Record<string, unknown>)[field] = translations[field];
      }
    }
    return result;
  });
}

/**
 * Localize internal hrefs in an object's specified fields.
 */
export function localizeHrefFields<T extends object>(
  obj: T,
  hrefFields: (keyof T & string)[],
  locale: Locale,
): T {
  if (locale === "de") return obj;

  const result = { ...obj };
  for (const field of hrefFields) {
    const val = obj[field];
    if (typeof val === "string" && val.startsWith("/")) {
      (result as Record<string, unknown>)[field] = localizedHref(val, locale);
    }
  }
  return result;
}

const HOMEPAGE_STYLE_MAP: Record<string, string> = {
  "home-hero": "hero",
  "value-props": "value-props",
  "image-text-feature": "technology",
  "collection-showcase": "collections",
  "sustainability-stats": "sustainability",
  "downloads-teaser": "downloads",
  "news-teaser": "news",
};

const STAT_KEY_INDEX: Record<string, number> = {
  water: 0,
  chemicals: 1,
  solar: 2,
};

/**
 * Overlay homepage section text fields + nested settings from ContentTranslation.
 * Handles dot-notation fields: card.X.title, bullet.N, stat.X.label, subheadline, secondaryLabel.
 */
export async function overlayHomepageSections<
  T extends {
    style: string;
    eyebrow: string | null;
    title: string | null;
    content: string | null;
    buttonLabel: string | null;
    buttonHref: string | null;
    settings: Record<string, unknown>;
  },
>(
  sections: T[],
  locale: Locale,
): Promise<T[]> {
  if (locale === "de") return sections;

  const translationMap = await getTranslationsForType("homepage", locale);
  if (translationMap.size === 0) return sections;

  return sections.map((section) => {
    const entityId = HOMEPAGE_STYLE_MAP[section.style] || section.style;
    const t = translationMap.get(entityId);
    if (!t) return section;

    const result = { ...section };

    if (t.eyebrow) result.eyebrow = t.eyebrow;
    if (t.title) result.title = t.title;
    if (t.content) result.content = t.content;
    if (t.buttonLabel) result.buttonLabel = t.buttonLabel;

    if (result.buttonHref) {
      result.buttonHref = localizedHref(result.buttonHref as string, locale);
    }

    const settings = JSON.parse(JSON.stringify(section.settings));

    if (t.subheadline) settings.subheadline = t.subheadline;
    if (t.secondaryLabel) settings.secondaryLabel = t.secondaryLabel;
    if (settings.secondaryHref && typeof settings.secondaryHref === "string") {
      settings.secondaryHref = localizedHref(settings.secondaryHref, locale);
    }

    if (Array.isArray(settings.cards)) {
      for (const [key, value] of Object.entries(t)) {
        const m = key.match(/^card\.(\w+)\.(\w+)$/);
        if (!m) continue;
        const card = (settings.cards as Record<string, string>[]).find(
          (c) => c.iconKey === m[1],
        );
        if (card) card[m[2]] = value;
      }
    }

    if (Array.isArray(settings.bullets)) {
      for (const [key, value] of Object.entries(t)) {
        const m = key.match(/^bullet\.(\d+)$/);
        if (!m) continue;
        const idx = parseInt(m[1]) - 1;
        if (idx >= 0 && idx < (settings.bullets as string[]).length) {
          (settings.bullets as string[])[idx] = value;
        }
      }
    }

    if (Array.isArray(settings.stats)) {
      for (const [key, value] of Object.entries(t)) {
        const m = key.match(/^stat\.(\w+)\.(\w+)$/);
        if (!m) continue;
        const idx = STAT_KEY_INDEX[m[1]];
        if (idx !== undefined && idx < (settings.stats as Record<string, unknown>[]).length) {
          (settings.stats as Record<string, string>[])[idx][m[2]] = value;
        }
      }
    }

    result.settings = settings;
    return result;
  });
}
