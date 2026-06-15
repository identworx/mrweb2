-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FabricSwatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "familyId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "articleNumber" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "swatchImageId" TEXT,
    "colorHex" TEXT,
    "patternType" TEXT,
    "featuredOnMaterials" BOOLEAN NOT NULL DEFAULT false,
    "materialsPreviewOrder" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FabricSwatch_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "FabricFamily" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FabricSwatch_swatchImageId_fkey" FOREIGN KEY ("swatchImageId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FabricSwatch" ("articleNumber", "colorHex", "createdAt", "description", "familyId", "id", "isActive", "name", "order", "patternType", "slug", "subtitle", "swatchImageId", "updatedAt") SELECT "articleNumber", "colorHex", "createdAt", "description", "familyId", "id", "isActive", "name", "order", "patternType", "slug", "subtitle", "swatchImageId", "updatedAt" FROM "FabricSwatch";
DROP TABLE "FabricSwatch";
ALTER TABLE "new_FabricSwatch" RENAME TO "FabricSwatch";
CREATE UNIQUE INDEX "FabricSwatch_slug_key" ON "FabricSwatch"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
