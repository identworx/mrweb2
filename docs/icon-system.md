# CMS Icon System

## Overview

The CMS icon system enables admin users to manage all public-facing icons via the admin panel at `/admin/icons`. Icons can be swapped between the built-in SVG default, a custom SVG markup, or a MediaAsset image from the media library.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Icon Registry (lib/cms/icon-registry.ts)               │
│  56 slots across 11 groups — definitions + defaults     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  IconSlot (Prisma model)                                │
│  DB rows with key, iconType, defaultIcon, media ref     │
└──────────────────────┬──────────────────────────────────┘
                       │
           ┌───────────┴───────────┐
           ▼                       ▼
  getIconSlots(keys[])      Admin UI (/admin/icons)
  → ResolvedIcon map        → PATCH /api/admin/icons
           │
           ▼
  CmsIcon component
  → renders SVG or <img>
```

## Key Files

| File | Purpose |
|------|---------|
| `prisma/schema.prisma` | `IconSlot` model + `IconType` enum |
| `lib/cms/icon-registry.ts` | Central registry of all 56 icon slots |
| `lib/cms/icons.ts` | Server-side `getIconSlots()` + `getAllIconSlots()` |
| `lib/cms/icon-key-map.ts` | Maps old CMS iconKey values to registry keys |
| `components/cms/CmsIcon.tsx` | Renders a resolved icon (SVG or media image) |
| `app/admin/icons/page.tsx` | Admin icon management page |
| `components/admin/IconsAdmin.tsx` | Client component for admin icon editing |
| `app/api/admin/icons/route.ts` | GET/PATCH API for icon slots |
| `scripts/backfill-icon-slots.ts` | Idempotent backfill script |

## Icon Groups

| Group | Count | Description |
|-------|-------|-------------|
| navigation | 4 | Arrows, chevrons, scroll indicator |
| ui | 8 | Search, grid, close, flip, placeholder, external link |
| homepage | 4 | Value proposition icons (comfort, quality, sustainability, design) |
| benefits | 5 | Collection benefit icons (sun, droplet, shield, star, fallback) |
| nerio | 6 | NERIO page icons (recycle, droplet, sun, shield, fabric, collection) |
| service | 3 | Service page icons (ruler, shield, fabric) |
| social | 5 | Footer social media icons |
| contact | 3 | Contact page icons (email, globe, clock) |
| downloads | 2 | Download card icons (PDF, book) |
| care | 6 | Laundry care symbols |
| categories | 10 | Product category icons (9 categories + default fallback) |

## Usage in Components

### Server Components

```tsx
import { getIconSlots } from "@/lib/cms/icons";
import CmsIcon from "@/components/cms/CmsIcon";

export default async function MyPage() {
  const icons = await getIconSlots(["arrow-right", "checkmark"]);

  return (
    <CmsIcon icon={icons["arrow-right"]} width={14} height={14} />
  );
}
```

### Passing to Child Components

```tsx
<MyComponent icons={icons} />
```

Child components accept `icons?: Record<string, ResolvedIcon>` and default to `{}`.

### Fallback Behavior

When an icon slot is not found in the database, `getIconSlots()` falls back to the registry default SVG. When neither exists, `CmsIcon` renders `null`.

## Icon Types

| Type | Description |
|------|-------------|
| `DEFAULT` | Uses the built-in SVG from the registry |
| `LIBRARY` | Uses custom SVG markup stored in `libraryIcon` field |
| `MEDIA` | Uses an uploaded image from MediaAsset (PNG, SVG, etc.) |

## Admin UI

The admin page at `/admin/icons` allows:
- Searching icons by key, label, or description
- Filtering by group
- Editing label, description, icon type, size hint, color mode
- Selecting a media asset via MediaPicker (for MEDIA type)
- Activating/deactivating icons
- Resetting to default

## Backfill Script

```bash
npx tsx scripts/backfill-icon-slots.ts          # dry-run
npx tsx scripts/backfill-icon-slots.ts --apply   # write to DB
```

Idempotent — skips existing slots by key.

## Revalidation

Icon changes trigger `revalidateIcons()` which calls `revalidateAllPublicPages()` via `revalidatePath("/", "layout")`.
