import "server-only";
import { prisma } from "@/lib/db/prisma";

export type UsageEntry = { model: string; count: number };

export async function getMediaAssetUsage(id: string): Promise<UsageEntry[]> {
  const checks = [
    { model: "Seite (Hero)", query: prisma.page.count({ where: { heroImageId: id } }) },
    { model: "Seitenbereich", query: prisma.pageSection.count({ where: { imageId: id } }) },
    { model: "Kollektion (Hero)", query: prisma.collection.count({ where: { heroImageId: id } }) },
    { model: "Kollektion (Card)", query: prisma.collection.count({ where: { cardImageId: id } }) },
    { model: "Produktgruppe (Icon)", query: prisma.productGroup.count({ where: { iconId: id } }) },
    { model: "Produktgruppe (Bild)", query: prisma.productGroup.count({ where: { imageId: id } }) },
    { model: "Produkt (Hero)", query: prisma.product.count({ where: { heroImageId: id } }) },
    { model: "Produkt (Main)", query: prisma.product.count({ where: { mainImageId: id } }) },
    { model: "Produktbild", query: prisma.productImage.count({ where: { mediaAssetId: id } }) },
    { model: "Material", query: prisma.material.count({ where: { imageId: id } }) },
    { model: "Download", query: prisma.download.count({ where: { imageId: id } }) },
    { model: "News (Hero)", query: prisma.newsArticle.count({ where: { heroImageId: id } }) },
    { model: "News (Card)", query: prisma.newsArticle.count({ where: { cardImageId: id } }) },
    { model: "Messung", query: prisma.measurement.count({ where: { imageId: id } }) },
    { model: "Site-Logo", query: prisma.siteSettings.count({ where: { logoMediaId: id } }) },
    { model: "Site-Favicon", query: prisma.siteSettings.count({ where: { faviconMediaId: id } }) },
    { model: "Footer-Logo", query: prisma.footerSettings.count({ where: { logoMediaId: id } }) },
  ];

  const results = await Promise.all(checks.map((c) => c.query));
  const usage: UsageEntry[] = [];

  checks.forEach((check, i) => {
    if (results[i] > 0) {
      usage.push({ model: check.model, count: results[i] });
    }
  });

  return usage;
}

export async function canDeleteUser(
  targetId: string,
  currentUserId: string,
): Promise<{ allowed: boolean; reason?: string }> {
  if (targetId === currentUserId) {
    return { allowed: false, reason: "Du kannst dein eigenes Konto nicht löschen." };
  }

  const target = await prisma.user.findUnique({ where: { id: targetId }, select: { role: true } });
  if (!target) {
    return { allowed: false, reason: "Benutzer nicht gefunden." };
  }

  if (target.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return { allowed: false, reason: "Der letzte Admin kann nicht gelöscht werden." };
    }
  }

  return { allowed: true };
}

export async function canDeleteCollection(
  id: string,
): Promise<{ allowed: boolean; reason?: string; productCount?: number }> {
  const productCount = await prisma.product.count({ where: { collectionId: id } });
  if (productCount > 0) {
    return {
      allowed: false,
      reason: `Kollektion enthält ${productCount} Produkt(e). Bitte zuerst alle Produkte entfernen oder verschieben.`,
      productCount,
    };
  }
  return { allowed: true };
}

export async function canDeleteProductGroup(
  id: string,
): Promise<{ allowed: boolean; reason?: string; productCount?: number }> {
  const productCount = await prisma.product.count({ where: { productGroupId: id } });
  if (productCount > 0) {
    return {
      allowed: false,
      reason: `Produktgruppe enthält ${productCount} Produkt(e). Bitte zuerst alle Produkte entfernen oder verschieben.`,
      productCount,
    };
  }
  return { allowed: true };
}

export async function canDeleteMaterial(
  id: string,
): Promise<{ allowed: boolean; reason?: string; productCount?: number }> {
  const productCount = await prisma.product.count({ where: { materialId: id } });
  if (productCount > 0) {
    return {
      allowed: false,
      reason: `Material wird von ${productCount} Produkt(en) verwendet. Bitte zuerst die Zuordnung entfernen.`,
      productCount,
    };
  }
  return { allowed: true };
}
