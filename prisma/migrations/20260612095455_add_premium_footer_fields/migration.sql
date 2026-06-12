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
    "ctaEnabled" BOOLEAN NOT NULL DEFAULT true,
    "ctaEyebrow" TEXT,
    "ctaTitle" TEXT,
    "ctaText" TEXT,
    "ctaPrimaryLabel" TEXT,
    "ctaPrimaryHref" TEXT,
    "ctaSecondaryLabel" TEXT,
    "ctaSecondaryHref" TEXT,
    "contactTitle" TEXT,
    "companyName" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "postalCity" TEXT,
    "country" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "contactButtonLabel" TEXT,
    "contactButtonHref" TEXT,
    "bottomNote" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FooterSettings_logoMediaId_fkey" FOREIGN KEY ("logoMediaId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FooterSettings" ("copyrightText", "createdAt", "description", "id", "logoMediaId", "logoUrl", "socialLinks", "updatedAt") SELECT "copyrightText", "createdAt", "description", "id", "logoMediaId", "logoUrl", "socialLinks", "updatedAt" FROM "FooterSettings";
DROP TABLE "FooterSettings";
ALTER TABLE "new_FooterSettings" RENAME TO "FooterSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
