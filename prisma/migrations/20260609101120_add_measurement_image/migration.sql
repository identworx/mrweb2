/*
  Warnings:

  - You are about to alter the column `meta` on the `FormSubmission` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FormSubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "formId" TEXT NOT NULL,
    "data" JSONB,
    "meta" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_FormSubmission" ("createdAt", "data", "formId", "id", "isRead", "meta") SELECT "createdAt", "data", "formId", "id", "isRead", "meta" FROM "FormSubmission";
DROP TABLE "FormSubmission";
ALTER TABLE "new_FormSubmission" RENAME TO "FormSubmission";
CREATE TABLE "new_Measurement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "groupSlug" TEXT,
    "drawingType" TEXT,
    "imageId" TEXT,
    "imageAlt" TEXT,
    "variants" JSONB,
    "notes" JSONB,
    "sourceNote" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Measurement_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Measurement" ("createdAt", "drawingType", "groupSlug", "id", "isActive", "notes", "order", "slug", "sourceNote", "title", "updatedAt", "variants") SELECT "createdAt", "drawingType", "groupSlug", "id", "isActive", "notes", "order", "slug", "sourceNote", "title", "updatedAt", "variants" FROM "Measurement";
DROP TABLE "Measurement";
ALTER TABLE "new_Measurement" RENAME TO "Measurement";
CREATE UNIQUE INDEX "Measurement_slug_key" ON "Measurement"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
