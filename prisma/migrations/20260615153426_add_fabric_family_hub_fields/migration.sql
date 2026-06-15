-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FabricFamily" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "eyebrow" TEXT,
    "subtitle" TEXT,
    "material" TEXT,
    "weight" TEXT,
    "dyeing" TEXT,
    "comfort" TEXT,
    "cushionThickness" TEXT,
    "hubHighlights" TEXT,
    "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_FabricFamily" ("createdAt", "description", "eyebrow", "id", "isActive", "name", "order", "slug", "updatedAt") SELECT "createdAt", "description", "eyebrow", "id", "isActive", "name", "order", "slug", "updatedAt" FROM "FabricFamily";
DROP TABLE "FabricFamily";
ALTER TABLE "new_FabricFamily" RENAME TO "FabricFamily";
CREATE UNIQUE INDEX "FabricFamily_slug_key" ON "FabricFamily"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
