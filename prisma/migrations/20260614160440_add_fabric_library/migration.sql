-- CreateTable
CREATE TABLE "FabricFamily" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "eyebrow" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "FabricSwatch" (
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
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FabricSwatch_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "FabricFamily" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FabricSwatch_swatchImageId_fkey" FOREIGN KEY ("swatchImageId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FabricProductType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "iconKey" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "FabricAvailability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "swatchId" TEXT NOT NULL,
    "productTypeId" TEXT NOT NULL,
    "note" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "FabricAvailability_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "FabricSwatch" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FabricAvailability_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "FabricProductType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "FabricFamily_slug_key" ON "FabricFamily"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FabricSwatch_slug_key" ON "FabricSwatch"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FabricProductType_slug_key" ON "FabricProductType"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FabricAvailability_swatchId_productTypeId_key" ON "FabricAvailability"("swatchId", "productTypeId");
