-- CreateTable
CREATE TABLE "IconSlot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "groupName" TEXT NOT NULL,
    "defaultIcon" TEXT NOT NULL,
    "iconType" TEXT NOT NULL DEFAULT 'DEFAULT',
    "libraryIcon" TEXT,
    "mediaId" TEXT,
    "sizeHint" TEXT NOT NULL DEFAULT 'md',
    "colorMode" TEXT NOT NULL DEFAULT 'inherit',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "IconSlot_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "IconSlot_key_key" ON "IconSlot"("key");
