-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FooterSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logoUrl" TEXT,
    "logoMediaId" TEXT,
    "description" TEXT,
    "copyrightText" TEXT,
    "socialLinks" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FooterSettings_logoMediaId_fkey" FOREIGN KEY ("logoMediaId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FooterSettings" ("copyrightText", "createdAt", "description", "id", "logoUrl", "socialLinks", "updatedAt") SELECT "copyrightText", "createdAt", "description", "id", "logoUrl", "socialLinks", "updatedAt" FROM "FooterSettings";
DROP TABLE "FooterSettings";
ALTER TABLE "new_FooterSettings" RENAME TO "FooterSettings";
CREATE TABLE "new_SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "siteName" TEXT,
    "logoDarkUrl" TEXT,
    "logoLightUrl" TEXT,
    "faviconUrl" TEXT,
    "logoMediaId" TEXT,
    "faviconMediaId" TEXT,
    "primaryColor" TEXT,
    "secondaryColor" TEXT,
    "contactEmail" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "socialLinks" JSONB,
    "defaultSeoTitle" TEXT,
    "defaultSeoDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SiteSettings_logoMediaId_fkey" FOREIGN KEY ("logoMediaId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SiteSettings_faviconMediaId_fkey" FOREIGN KEY ("faviconMediaId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SiteSettings" ("address", "contactEmail", "createdAt", "defaultSeoDescription", "defaultSeoTitle", "faviconUrl", "id", "logoDarkUrl", "logoLightUrl", "phone", "primaryColor", "secondaryColor", "siteName", "socialLinks", "updatedAt") SELECT "address", "contactEmail", "createdAt", "defaultSeoDescription", "defaultSeoTitle", "faviconUrl", "id", "logoDarkUrl", "logoLightUrl", "phone", "primaryColor", "secondaryColor", "siteName", "socialLinks", "updatedAt" FROM "SiteSettings";
DROP TABLE "SiteSettings";
ALTER TABLE "new_SiteSettings" RENAME TO "SiteSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
