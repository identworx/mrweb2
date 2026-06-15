-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NavigationItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "menuId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "linkType" TEXT NOT NULL DEFAULT 'CUSTOM_URL',
    "href" TEXT,
    "target" TEXT NOT NULL DEFAULT '_self',
    "order" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "parentId" TEXT,
    "linkedPageId" TEXT,
    "badgeText" TEXT,
    "badgeVariant" TEXT NOT NULL DEFAULT 'blue',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "NavigationItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "NavigationMenu" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "NavigationItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavigationItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "NavigationItem_linkedPageId_fkey" FOREIGN KEY ("linkedPageId") REFERENCES "Page" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_NavigationItem" ("createdAt", "href", "id", "isActive", "label", "linkType", "linkedPageId", "menuId", "order", "parentId", "target", "updatedAt") SELECT "createdAt", "href", "id", "isActive", "label", "linkType", "linkedPageId", "menuId", "order", "parentId", "target", "updatedAt" FROM "NavigationItem";
DROP TABLE "NavigationItem";
ALTER TABLE "new_NavigationItem" RENAME TO "NavigationItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
