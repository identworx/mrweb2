import "server-only";

import { prisma } from "@/lib/db/prisma";
import { getMediaUrl } from "@/lib/cms/media-url";
import { getRegistrySlot, ICON_REGISTRY } from "@/lib/cms/icon-registry";

export interface ResolvedIcon {
  key: string;
  svgMarkup: string | null;
  mediaUrl: string | null;
  isMedia: boolean;
  sizeHint: string;
  colorMode: string;
}

export async function getIconSlots(
  keys: string[],
): Promise<Record<string, ResolvedIcon>> {
  if (keys.length === 0) return {};

  const rows = await prisma.iconSlot.findMany({
    where: { key: { in: keys }, isActive: true },
    include: { media: true },
  });

  const result: Record<string, ResolvedIcon> = {};

  for (const key of keys) {
    const row = rows.find((r) => r.key === key);
    const registryDef = getRegistrySlot(key);

    if (row) {
      if (row.iconType === "MEDIA" && row.media) {
        result[key] = {
          key,
          svgMarkup: null,
          mediaUrl: getMediaUrl(row.media, ""),
          isMedia: true,
          sizeHint: row.sizeHint,
          colorMode: row.colorMode,
        };
      } else if (row.iconType === "LIBRARY" && row.libraryIcon) {
        result[key] = {
          key,
          svgMarkup: row.libraryIcon,
          mediaUrl: null,
          isMedia: false,
          sizeHint: row.sizeHint,
          colorMode: row.colorMode,
        };
      } else {
        result[key] = {
          key,
          svgMarkup: row.defaultIcon,
          mediaUrl: null,
          isMedia: false,
          sizeHint: row.sizeHint,
          colorMode: row.colorMode,
        };
      }
    } else if (registryDef) {
      result[key] = {
        key,
        svgMarkup: registryDef.defaultIcon,
        mediaUrl: null,
        isMedia: false,
        sizeHint: registryDef.sizeHint,
        colorMode: "inherit",
      };
    }
  }

  return result;
}

export async function getAllIconSlots() {
  return prisma.iconSlot.findMany({
    include: { media: true },
    orderBy: [{ groupName: "asc" }, { key: "asc" }],
  });
}
