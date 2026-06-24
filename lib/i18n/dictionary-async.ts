import "server-only";
import type { Locale } from "./config";
import { getDictionary, type Dictionary } from "./dictionary";
import { getTranslationsForType } from "./get-translation";

export async function getDictionaryAsync(locale: Locale): Promise<Dictionary> {
  const base = getDictionary(locale);
  if (locale === "de") return base;

  try {
    const dbMap = await getTranslationsForType("dictionary", locale);
    if (dbMap.size === 0) return base;

    const merged = JSON.parse(JSON.stringify(base)) as Record<string, Record<string, unknown>>;

    for (const [entityId, fields] of dbMap) {
      if (!merged[entityId]) continue;
      for (const [fieldName, value] of Object.entries(fields)) {
        if (!value) continue;
        if (fieldName.includes(".")) {
          const [parent, child] = fieldName.split(".");
          const nest = merged[entityId][parent];
          if (nest && typeof nest === "object") {
            (nest as Record<string, string>)[child] = value;
          }
        } else if (fieldName in (merged[entityId] as object)) {
          merged[entityId][fieldName] = value;
        }
      }
    }

    return merged as unknown as Dictionary;
  } catch {
    return base;
  }
}
