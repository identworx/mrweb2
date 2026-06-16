import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { ICON_REGISTRY, ICON_GROUPS } from "@/lib/cms/icon-registry";
import IconsAdmin from "@/components/admin/IconsAdmin";

export default async function IconsPage() {
  const dbSlots = await prisma.iconSlot.findMany({
    include: { media: true },
    orderBy: [{ groupName: "asc" }, { key: "asc" }],
  });

  const serialized = dbSlots.map((s) => ({
    id: s.id,
    key: s.key,
    label: s.label,
    description: s.description,
    groupName: s.groupName,
    defaultIcon: s.defaultIcon,
    iconType: s.iconType as "DEFAULT" | "LIBRARY" | "MEDIA",
    libraryIcon: s.libraryIcon,
    mediaId: s.mediaId,
    mediaUrl: s.media?.url ?? null,
    mediaAlt: s.media?.alt ?? null,
    sizeHint: s.sizeHint,
    colorMode: s.colorMode,
    isActive: s.isActive,
  }));

  const registryKeys = ICON_REGISTRY.map((r) => ({
    key: r.key,
    label: r.label,
    description: r.description,
    groupName: r.groupName,
    defaultIcon: r.defaultIcon,
    sizeHint: r.sizeHint,
  }));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          <Link
            href="/admin"
            className="hover:text-orange-600 transition-colors"
          >
            Dashboard
          </Link>
          {" > "}
          Icons
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mt-1">
          Icons verwalten
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {serialized.length} von {ICON_REGISTRY.length} Icon-Slots aktiv ·{" "}
          {ICON_GROUPS.length} Gruppen
        </p>
      </div>

      <IconsAdmin dbSlots={serialized} registryKeys={registryKeys} />
    </div>
  );
}
