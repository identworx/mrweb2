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
    "ctaEnabled" BOOLEAN NOT NULL DEFAULT false,
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
INSERT INTO "new_FooterSettings" ("addressLine1", "addressLine2", "bottomNote", "companyName", "contactButtonHref", "contactButtonLabel", "contactTitle", "copyrightText", "country", "createdAt", "ctaEnabled", "ctaEyebrow", "ctaPrimaryHref", "ctaPrimaryLabel", "ctaSecondaryHref", "ctaSecondaryLabel", "ctaText", "ctaTitle", "description", "email", "id", "logoMediaId", "logoUrl", "phone", "postalCity", "socialLinks", "updatedAt") SELECT "addressLine1", "addressLine2", "bottomNote", "companyName", "contactButtonHref", "contactButtonLabel", "contactTitle", "copyrightText", "country", "createdAt", "ctaEnabled", "ctaEyebrow", "ctaPrimaryHref", "ctaPrimaryLabel", "ctaSecondaryHref", "ctaSecondaryLabel", "ctaText", "ctaTitle", "description", "email", "id", "logoMediaId", "logoUrl", "phone", "postalCity", "socialLinks", "updatedAt" FROM "FooterSettings";
DROP TABLE "FooterSettings";
ALTER TABLE "new_FooterSettings" RENAME TO "FooterSettings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
