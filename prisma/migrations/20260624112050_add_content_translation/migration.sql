-- CreateTable
CREATE TABLE "ContentTranslation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL DEFAULT '',
    "fieldName" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "sourceText" TEXT NOT NULL,
    "translatedText" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "ContentTranslation_entityType_locale_idx" ON "ContentTranslation"("entityType", "locale");

-- CreateIndex
CREATE INDEX "ContentTranslation_entityType_entityId_locale_idx" ON "ContentTranslation"("entityType", "entityId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "ContentTranslation_entityType_entityId_fieldName_locale_key" ON "ContentTranslation"("entityType", "entityId", "fieldName", "locale");
