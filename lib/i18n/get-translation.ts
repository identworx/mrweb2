import { prisma } from "@/lib/db/prisma";
import type { Locale } from "./config";

export type TranslationStatus =
  | "DRAFT"
  | "REVIEWED"
  | "PUBLISHED"
  | "STALE";

export interface ContentTranslation {
  id: string;
  entityType: string;
  entityId: string | null;
  fieldName: string;
  locale: string;
  sourceText: string;
  translatedText: string;
  status: TranslationStatus;
  updatedAt: Date;
  createdAt: Date;
}

export async function getTranslation(
  entityType: string,
  entityId: string | null,
  fieldName: string,
  locale: Locale,
  fallback: string,
): Promise<string> {
  if (locale === "de") return fallback;

  try {
    const translation = await prisma.contentTranslation.findFirst({
      where: {
        entityType,
        entityId: entityId ?? "",
        fieldName,
        locale,
        status: "PUBLISHED",
      },
    });

    return translation?.translatedText || fallback;
  } catch {
    return fallback;
  }
}

export async function getTranslations(
  entityType: string,
  entityId: string | null,
  locale: Locale,
): Promise<Record<string, string>> {
  if (locale === "de") return {};

  try {
    const translations = await prisma.contentTranslation.findMany({
      where: {
        entityType,
        entityId: entityId ?? "",
        locale,
        status: "PUBLISHED",
      },
    });

    const map: Record<string, string> = {};
    for (const t of translations) {
      map[t.fieldName] = t.translatedText;
    }
    return map;
  } catch {
    return {};
  }
}

export async function getTranslationsForType(
  entityType: string,
  locale: Locale,
): Promise<Map<string, Record<string, string>>> {
  if (locale === "de") return new Map();

  try {
    const translations = await prisma.contentTranslation.findMany({
      where: {
        entityType,
        locale,
        status: "PUBLISHED",
      },
    });

    const map = new Map<string, Record<string, string>>();
    for (const t of translations) {
      const key = t.entityId || "";
      if (!map.has(key)) map.set(key, {});
      map.get(key)![t.fieldName] = t.translatedText;
    }
    return map;
  } catch {
    return new Map();
  }
}

export async function upsertTranslation(params: {
  entityType: string;
  entityId?: string | null;
  fieldName: string;
  locale: string;
  sourceText: string;
  translatedText: string;
  status?: TranslationStatus;
}): Promise<ContentTranslation> {
  const {
    entityType,
    entityId,
    fieldName,
    locale,
    sourceText,
    translatedText,
    status = "DRAFT",
  } = params;

  const existing = await prisma.contentTranslation.findFirst({
    where: {
      entityType,
      entityId: entityId ?? "",
      fieldName,
      locale,
    },
  });

  if (existing) {
    return prisma.contentTranslation.update({
      where: { id: existing.id },
      data: {
        sourceText,
        translatedText,
        status,
      },
    }) as unknown as ContentTranslation;
  }

  return prisma.contentTranslation.create({
    data: {
      entityType,
      entityId: entityId ?? "",
      fieldName,
      locale,
      sourceText,
      translatedText,
      status,
    },
  }) as unknown as ContentTranslation;
}

export async function getAllTranslations(
  locale: string,
): Promise<ContentTranslation[]> {
  return prisma.contentTranslation.findMany({
    where: { locale },
    orderBy: [{ entityType: "asc" }, { fieldName: "asc" }],
  }) as unknown as ContentTranslation[];
}
