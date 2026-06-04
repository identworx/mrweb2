export interface Product {
  name: string;
  collectionSlug: string;
  categorySlug: string;
  material: string;
  size: string;
  code: string;
  features?: string[];
}

export const products: Product[] = [
  // ─── GREEN COLLECTION (01) ────────────────────────────────────────────

  // Dekokissen
  { name: "Longitude Olive", collectionSlug: "green", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "401.226", features: [] },
  { name: "Palmway Olive", collectionSlug: "green", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "401.223", features: [] },
  { name: "St. Tropez Olive", collectionSlug: "green", categorySlug: "dekokissen", material: "Mackintosh® Lite", size: "48 × 48 cm", code: "403.804", features: ["mit Keder"] },
  { name: "Rocky Mountain Olive", collectionSlug: "green", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "405.813", features: ["mit Keder"] },
  { name: "Rain Stripe Moss & Ivory", collectionSlug: "green", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "401.816", features: [] },
  { name: "Outpost Autumn Green", collectionSlug: "green", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "403.222", features: [] },
  { name: "Caravan Lake", collectionSlug: "green", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "402.225", features: [] },
  { name: "Monaco Olive", collectionSlug: "green", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "401.233", features: [] },

  // Hochlehner
  { name: "Rocky Mountain Olive", collectionSlug: "green", categorySlug: "hochlehner", material: "Mackintosh®", size: "120 × 48 × 6 cm", code: "405.813", features: ["mit Keder"] },
  { name: "St. Tropez Olive", collectionSlug: "green", categorySlug: "hochlehner", material: "Mackintosh® Lite", size: "120 × 48 × 6 cm", code: "403.804", features: ["mit Keder"] },

  // Niedriglehner
  { name: "Rocky Mountain Olive", collectionSlug: "green", categorySlug: "niedriglehner", material: "Mackintosh®", size: "105 × 48 × 6 cm", code: "405.813", features: ["mit Keder"] },
  { name: "St. Tropez Olive", collectionSlug: "green", categorySlug: "niedriglehner", material: "Mackintosh® Lite", size: "105 × 48 × 6 cm", code: "403.804", features: ["mit Keder"] },

  // Sitzkissen
  { name: "Rocky Mountain Olive", collectionSlug: "green", categorySlug: "sitzkissen", material: "Mackintosh®", size: "46 × 45 × 7 cm", code: "405.813", features: ["mit Keder"] },
  { name: "St. Tropez Olive", collectionSlug: "green", categorySlug: "sitzkissen", material: "Mackintosh® Lite", size: "46 × 45 × 7 cm", code: "403.804", features: ["mit Keder"] },

  // Sitzpolster
  { name: "St. Tropez Olive", collectionSlug: "green", categorySlug: "sitzpolster", material: "Mackintosh® Lite", size: "40 × 40 × 2 cm (eckig)", code: "403.804", features: ["ohne Keder"] },
  { name: "St. Tropez Olive", collectionSlug: "green", categorySlug: "sitzpolster", material: "Mackintosh® Lite", size: "40 × 38 × 2 cm (halbrund)", code: "403.804", features: ["ohne Keder"] },

  // Bankauflagen
  { name: "St. Tropez Olive", collectionSlug: "green", categorySlug: "bankauflagen", material: "Mackintosh® Lite", size: "S–XL (50–170 × 49 × 7 cm)", code: "403.804", features: ["mit Keder"] },

  // Poufs
  { name: "Rocky Mountain Olive", collectionSlug: "green", categorySlug: "poufs", material: "Mackintosh®", size: "45 × 45 cm (klein)", code: "405.813", features: [] },
  { name: "Rocky Mountain Olive", collectionSlug: "green", categorySlug: "poufs", material: "Mackintosh®", size: "70 × 36 cm (groß)", code: "405.813", features: [] },

  // Tischsets & Tischläufer
  { name: "Rocky Mountain Olive", collectionSlug: "green", categorySlug: "tischsets-tischlaeufer", material: "Mackintosh®", size: "35 × 45 cm / Läufer 35 × 130 / 47,5 × 120 cm", code: "405.813", features: [] },

  // Decken
  { name: "Mora Green", collectionSlug: "green", categorySlug: "decken", material: "Acryl", size: "130 × 160 cm", code: "", features: [] }, // TODO: Artikelcode aus Katalog ergänzen

  // ─── BLUE COLLECTION (02) ─────────────────────────────────────────────

  // Dekokissen
  { name: "Caribbean Midnight", collectionSlug: "blue", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "502.209", features: [] },
  { name: "Bean Azure", collectionSlug: "blue", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "504.203", features: [] },
  { name: "Longitude Dazzling Blue", collectionSlug: "blue", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "501.226", features: [] },
  { name: "Midnight Marcie", collectionSlug: "blue", categorySlug: "dekokissen", material: "Mackintosh® Lite", size: "48 × 48 cm", code: "505.801", features: ["mit Keder"] },
  { name: "Rain Stripe Navy", collectionSlug: "blue", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "501.816", features: [] },
  { name: "Swazi Stripe Hills", collectionSlug: "blue", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "802.303", features: [] },
  { name: "Rocky Mountain Mist Gray", collectionSlug: "blue", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "703.813", features: ["mit Keder"] },
  { name: "Bouclé Nordic Fjord", collectionSlug: "blue", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "401.812", features: [] },

  // Hochlehner
  { name: "Midnight Marcie", collectionSlug: "blue", categorySlug: "hochlehner", material: "Mackintosh® Lite", size: "120 × 48 × 6 cm", code: "505.801", features: ["mit Keder"] },
  { name: "Rocky Mountain Mist Gray", collectionSlug: "blue", categorySlug: "hochlehner", material: "Mackintosh®", size: "120 × 48 × 6 cm", code: "703.813", features: ["mit Keder"] },

  // Niedriglehner
  { name: "Midnight Marcie", collectionSlug: "blue", categorySlug: "niedriglehner", material: "Mackintosh® Lite", size: "105 × 48 × 6 cm", code: "505.801", features: ["mit Keder"] },
  { name: "Rocky Mountain Mist Gray", collectionSlug: "blue", categorySlug: "niedriglehner", material: "Mackintosh®", size: "105 × 48 × 6 cm", code: "703.813", features: ["mit Keder"] },

  // Sitzkissen
  { name: "Midnight Marcie", collectionSlug: "blue", categorySlug: "sitzkissen", material: "Mackintosh® Lite", size: "46 × 45 × 7 cm", code: "505.801", features: ["mit Keder"] },
  { name: "Rocky Mountain Mist Gray", collectionSlug: "blue", categorySlug: "sitzkissen", material: "Mackintosh®", size: "46 × 45 × 7 cm", code: "703.813", features: ["mit Keder"] },

  // Sitzpolster
  { name: "Midnight Marcie", collectionSlug: "blue", categorySlug: "sitzpolster", material: "Mackintosh® Lite", size: "40 × 40 × 2 cm (eckig)", code: "505.801", features: ["ohne Keder"] },
  { name: "Midnight Marcie", collectionSlug: "blue", categorySlug: "sitzpolster", material: "Mackintosh® Lite", size: "40 × 38 × 2 cm (halbrund)", code: "505.801", features: ["ohne Keder"] },

  // Bankauflagen
  { name: "Midnight Marcie", collectionSlug: "blue", categorySlug: "bankauflagen", material: "Mackintosh® Lite", size: "S–XL (50–170 × 49 × 7 cm)", code: "505.801", features: ["mit Keder"] },

  // Poufs
  { name: "Rocky Mountain Mist Gray", collectionSlug: "blue", categorySlug: "poufs", material: "Mackintosh®", size: "45 × 45 cm (klein)", code: "703.813", features: [] },
  { name: "Rocky Mountain Mist Gray", collectionSlug: "blue", categorySlug: "poufs", material: "Mackintosh®", size: "70 × 36 cm (groß)", code: "703.813", features: [] },

  // Tischsets & Tischläufer
  { name: "Rocky Mountain Mist Gray", collectionSlug: "blue", categorySlug: "tischsets-tischlaeufer", material: "Mackintosh®", size: "35 × 45 cm / Läufer 35 × 130 / 47,5 × 120 cm", code: "703.813", features: [] },
  { name: "Bean Azure", collectionSlug: "blue", categorySlug: "tischsets-tischlaeufer", material: "Mackintosh®", size: "35 × 45 cm / Läufer 35 × 130 / 47,5 × 120 cm", code: "504.203", features: [] },

  // Decken
  { name: "Creson Blue", collectionSlug: "blue", categorySlug: "decken", material: "Bambusfaser", size: "130 × 160 cm", code: "", features: [] }, // TODO: Artikelcode aus Katalog ergänzen
  { name: "Mora Blue", collectionSlug: "blue", categorySlug: "decken", material: "Acryl", size: "130 × 160 cm", code: "", features: [] }, // TODO: Artikelcode aus Katalog ergänzen

  // ─── RED COLLECTION (03) ──────────────────────────────────────────────

  // Dekokissen
  { name: "Tartan Tuscan", collectionSlug: "red", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "201.208", features: [] },
  { name: "Bean Tuscon", collectionSlug: "red", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "202.203", features: [] },
  { name: "Longitude Warm Pigments", collectionSlug: "red", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "101.226", features: [] },
  { name: "Palmway Warm Pigments", collectionSlug: "red", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "101.223", features: [] },
  { name: "Rain Stripe Brick & Ivory", collectionSlug: "red", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "101.816", features: [] },
  { name: "Birdeyes Garnet", collectionSlug: "red", categorySlug: "dekokissen", material: "Mackintosh® Lite", size: "48 × 48 cm", code: "101.808", features: ["mit Keder"] },
  { name: "Parker Stripe Tuscon", collectionSlug: "red", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "202.201", features: [] },
  { name: "Rocky Mountain Crimson Red", collectionSlug: "red", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "101.813", features: ["mit Keder"] },
  { name: "Caravan Warm Pigments", collectionSlug: "red", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "101.225", features: [] },
  { name: "Rocky Mountain Rosebloom", collectionSlug: "red", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "104.813", features: ["mit Keder"] },

  // Hochlehner
  { name: "Rocky Mountain Rosebloom", collectionSlug: "red", categorySlug: "hochlehner", material: "Mackintosh®", size: "120 × 48 × 6 cm", code: "104.813", features: ["mit Keder"] },
  { name: "Rocky Mountain Crimson Red", collectionSlug: "red", categorySlug: "hochlehner", material: "Mackintosh®", size: "120 × 48 × 6 cm", code: "101.813", features: ["mit Keder"] },

  // Niedriglehner
  { name: "Rocky Mountain Rosebloom", collectionSlug: "red", categorySlug: "niedriglehner", material: "Mackintosh®", size: "105 × 48 × 6 cm", code: "104.813", features: ["mit Keder"] },
  { name: "Rocky Mountain Crimson Red", collectionSlug: "red", categorySlug: "niedriglehner", material: "Mackintosh®", size: "105 × 48 × 6 cm", code: "101.813", features: ["mit Keder"] },

  // Sitzkissen
  { name: "Rocky Mountain Crimson Red", collectionSlug: "red", categorySlug: "sitzkissen", material: "Mackintosh®", size: "46 × 45 × 7 cm", code: "101.813", features: ["mit Keder"] },
  { name: "Rocky Mountain Rosebloom", collectionSlug: "red", categorySlug: "sitzkissen", material: "Mackintosh®", size: "46 × 45 × 7 cm", code: "104.813", features: ["mit Keder"] },

  // Poufs
  { name: "Rocky Mountain Rosebloom", collectionSlug: "red", categorySlug: "poufs", material: "Mackintosh®", size: "45 × 45 cm (klein)", code: "104.813", features: [] },
  { name: "Rocky Mountain Crimson Red", collectionSlug: "red", categorySlug: "poufs", material: "Mackintosh®", size: "45 × 45 cm (klein)", code: "101.813", features: [] },
  { name: "Rocky Mountain Crimson Red", collectionSlug: "red", categorySlug: "poufs", material: "Mackintosh®", size: "70 × 36 cm (groß)", code: "101.813", features: [] },
  { name: "Rocky Mountain Rosebloom", collectionSlug: "red", categorySlug: "poufs", material: "Mackintosh®", size: "70 × 36 cm (groß)", code: "104.813", features: [] },

  // Tischsets & Tischläufer
  { name: "Rocky Mountain Crimson Red", collectionSlug: "red", categorySlug: "tischsets-tischlaeufer", material: "Mackintosh®", size: "35 × 45 cm / Läufer 35 × 130 / 47,5 × 120 cm", code: "101.813", features: [] },
  { name: "Bean Tuscon", collectionSlug: "red", categorySlug: "tischsets-tischlaeufer", material: "Mackintosh®", size: "35 × 45 cm / Läufer 35 × 130 / 47,5 × 120 cm", code: "202.203", features: [] },

  // ─── GOLDEN COLLECTION (04) ───────────────────────────────────────────

  // Dekokissen
  { name: "Caravan Retro Warmth", collectionSlug: "golden", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "201.225", features: [] },
  { name: "Tartan Tuscan", collectionSlug: "golden", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "201.208", features: [] },
  { name: "Rocky Mountain Yellow Jasmine", collectionSlug: "golden", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "302.813", features: ["mit Keder"] },
  { name: "Bean Citron", collectionSlug: "golden", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "302.203", features: [] },
  { name: "St. Tropez Citron", collectionSlug: "golden", categorySlug: "dekokissen", material: "Mackintosh® Lite", size: "48 × 48 cm", code: "201.804", features: ["mit Keder"] }, // TODO: Katalog S.64 zeigt 201.208 — prüfen ob 201.804 (S.14) korrekt

  // Hochlehner
  { name: "St. Tropez Citron", collectionSlug: "golden", categorySlug: "hochlehner", material: "Mackintosh® Lite", size: "120 × 48 × 6 cm", code: "201.804", features: ["mit Keder"] }, // TODO: Code prüfen (s.o.)
  { name: "Rocky Mountain Yellow Jasmine", collectionSlug: "golden", categorySlug: "hochlehner", material: "Mackintosh®", size: "120 × 48 × 6 cm", code: "302.813", features: ["mit Keder"] },

  // Niedriglehner
  { name: "St. Tropez Citron", collectionSlug: "golden", categorySlug: "niedriglehner", material: "Mackintosh® Lite", size: "105 × 48 × 6 cm", code: "201.804", features: ["mit Keder"] }, // TODO: Code prüfen (s.o.)
  { name: "Rocky Mountain Yellow Jasmine", collectionSlug: "golden", categorySlug: "niedriglehner", material: "Mackintosh®", size: "105 × 48 × 6 cm", code: "302.813", features: ["mit Keder"] },

  // Sitzkissen
  { name: "Rocky Mountain Yellow Jasmine", collectionSlug: "golden", categorySlug: "sitzkissen", material: "Mackintosh®", size: "46 × 45 × 7 cm", code: "302.813", features: ["mit Keder"] },
  { name: "St. Tropez Citron", collectionSlug: "golden", categorySlug: "sitzkissen", material: "Mackintosh® Lite", size: "46 × 45 × 7 cm", code: "201.804", features: ["mit Keder"] }, // TODO: Code prüfen (s.o.)

  // Sitzpolster
  { name: "St. Tropez Citron", collectionSlug: "golden", categorySlug: "sitzpolster", material: "Mackintosh® Lite", size: "40 × 40 × 2 cm (eckig)", code: "201.804", features: ["ohne Keder"] }, // TODO: Code prüfen (s.o.)
  { name: "St. Tropez Citron", collectionSlug: "golden", categorySlug: "sitzpolster", material: "Mackintosh® Lite", size: "40 × 38 × 2 cm (halbrund)", code: "201.804", features: ["ohne Keder"] }, // TODO: Code prüfen (s.o.)

  // Bankauflagen
  { name: "St. Tropez Citron", collectionSlug: "golden", categorySlug: "bankauflagen", material: "Mackintosh® Lite", size: "S–XL (50–170 × 49 × 7 cm)", code: "201.804", features: ["mit Keder"] }, // TODO: Code prüfen (s.o.)

  // Poufs
  { name: "Rocky Mountain Yellow Jasmine", collectionSlug: "golden", categorySlug: "poufs", material: "Mackintosh®", size: "45 × 45 cm (klein)", code: "302.813", features: [] },
  { name: "Rocky Mountain Yellow Jasmine", collectionSlug: "golden", categorySlug: "poufs", material: "Mackintosh®", size: "70 × 36 cm (groß)", code: "302.813", features: [] },

  // Tischsets & Tischläufer
  { name: "Rocky Mountain Yellow Jasmine", collectionSlug: "golden", categorySlug: "tischsets-tischlaeufer", material: "Mackintosh®", size: "35 × 45 cm / Läufer 35 × 130 / 47,5 × 120 cm", code: "302.813", features: [] },

  // Decken
  { name: "Creson Yellow", collectionSlug: "golden", categorySlug: "decken", material: "Bambusfaser", size: "130 × 160 cm", code: "", features: [] }, // TODO: Artikelcode aus Katalog ergänzen
  { name: "Mora Yellow", collectionSlug: "golden", categorySlug: "decken", material: "Acryl", size: "130 × 160 cm", code: "", features: [] }, // TODO: Artikelcode aus Katalog ergänzen

  // ─── EARTH & GREY COLLECTION (05) ─────────────────────────────────────

  // Dekokissen
  { name: "Canvas Wheat", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh® Lite", size: "48 × 48 cm", code: "603.800", features: ["mit Keder"] },
  { name: "Tartan Hemp", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "601.208.13", features: [] },
  { name: "Rocky Mountain Navajo White", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "603.813", features: ["mit Keder"] },
  { name: "Palmway Neutrals", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "601.223", features: [] },
  { name: "Monaco Peat", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "701.233", features: [] },
  { name: "St. Tropez Mushroom", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh® Lite", size: "48 × 48 cm", code: "605.804", features: ["mit Keder"] },
  { name: "Palmway Peat", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "701.223", features: [] },
  { name: "Vanity Charcoal", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "702.204.13", features: [] },
  { name: "Bean Charcoal", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "702.203", features: [] },
  { name: "Birdeyes Oatmeal", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh® Lite", size: "48 × 48 cm", code: "601.808", features: ["mit Keder"] },
  { name: "Bouclé Nordic Icebound", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "701.812", features: [] },
  { name: "Bouclé Glacial Mosaic", collectionSlug: "earth-grey", categorySlug: "dekokissen", material: "Mackintosh®", size: "48 × 48 cm", code: "601.812", features: [] },

  // Hochlehner
  { name: "Canvas Wheat", collectionSlug: "earth-grey", categorySlug: "hochlehner", material: "Mackintosh® Lite", size: "120 × 48 × 6 cm", code: "603.800", features: ["mit Keder"] },
  { name: "St. Tropez Mushroom", collectionSlug: "earth-grey", categorySlug: "hochlehner", material: "Mackintosh® Lite", size: "120 × 48 × 6 cm", code: "605.804", features: ["mit Keder"] },
  { name: "Rocky Mountain Navajo White", collectionSlug: "earth-grey", categorySlug: "hochlehner", material: "Mackintosh®", size: "120 × 48 × 6 cm", code: "603.813", features: ["mit Keder"] },

  // Niedriglehner
  { name: "Canvas Wheat", collectionSlug: "earth-grey", categorySlug: "niedriglehner", material: "Mackintosh® Lite", size: "105 × 48 × 6 cm", code: "603.800", features: ["mit Keder"] },
  { name: "St. Tropez Mushroom", collectionSlug: "earth-grey", categorySlug: "niedriglehner", material: "Mackintosh® Lite", size: "105 × 48 × 6 cm", code: "605.804", features: ["mit Keder"] },
  { name: "Rocky Mountain Navajo White", collectionSlug: "earth-grey", categorySlug: "niedriglehner", material: "Mackintosh®", size: "105 × 48 × 6 cm", code: "603.813", features: ["mit Keder"] },

  // Sitzkissen
  { name: "Canvas Wheat", collectionSlug: "earth-grey", categorySlug: "sitzkissen", material: "Mackintosh® Lite", size: "46 × 45 × 7 cm", code: "603.800", features: ["mit Keder"] },
  { name: "Rocky Mountain Navajo White", collectionSlug: "earth-grey", categorySlug: "sitzkissen", material: "Mackintosh®", size: "46 × 45 × 7 cm", code: "603.813", features: ["mit Keder"] },
  { name: "St. Tropez Mushroom", collectionSlug: "earth-grey", categorySlug: "sitzkissen", material: "Mackintosh® Lite", size: "46 × 45 × 7 cm", code: "605.804", features: ["mit Keder"] },

  // Sitzpolster
  { name: "Canvas Wheat", collectionSlug: "earth-grey", categorySlug: "sitzpolster", material: "Mackintosh® Lite", size: "40 × 40 × 2 cm (eckig)", code: "603.800", features: ["ohne Keder"] },
  { name: "Canvas Wheat", collectionSlug: "earth-grey", categorySlug: "sitzpolster", material: "Mackintosh® Lite", size: "40 × 38 × 2 cm (halbrund)", code: "603.800", features: ["ohne Keder"] },
  { name: "St. Tropez Mushroom", collectionSlug: "earth-grey", categorySlug: "sitzpolster", material: "Mackintosh® Lite", size: "40 × 40 × 2 cm (eckig)", code: "605.804", features: ["ohne Keder"] },
  { name: "St. Tropez Mushroom", collectionSlug: "earth-grey", categorySlug: "sitzpolster", material: "Mackintosh® Lite", size: "40 × 38 × 2 cm (halbrund)", code: "605.804", features: ["ohne Keder"] },

  // Bankauflagen
  { name: "Canvas Wheat", collectionSlug: "earth-grey", categorySlug: "bankauflagen", material: "Mackintosh® Lite", size: "S–XL (50–170 × 49 × 7 cm)", code: "603.800", features: ["mit Keder"] },
  { name: "St. Tropez Mushroom", collectionSlug: "earth-grey", categorySlug: "bankauflagen", material: "Mackintosh® Lite", size: "S–XL (50–170 × 49 × 7 cm)", code: "605.804", features: ["mit Keder"] },

  // Poufs
  { name: "Rocky Mountain Navajo White", collectionSlug: "earth-grey", categorySlug: "poufs", material: "Mackintosh®", size: "45 × 45 cm (klein)", code: "603.813", features: [] },
  { name: "Rocky Mountain Navajo White", collectionSlug: "earth-grey", categorySlug: "poufs", material: "Mackintosh®", size: "70 × 36 cm (groß)", code: "603.813", features: [] },

  // Tischsets & Tischläufer
  { name: "Rocky Mountain Navajo White", collectionSlug: "earth-grey", categorySlug: "tischsets-tischlaeufer", material: "Mackintosh®", size: "35 × 45 cm / Läufer 35 × 130 / 47,5 × 120 cm", code: "603.813", features: [] },

  // Decken
  { name: "Mora Carbon", collectionSlug: "earth-grey", categorySlug: "decken", material: "Acryl", size: "130 × 160 cm", code: "", features: [] }, // TODO: Artikelcode aus Katalog ergänzen

  // ─── NERIO OCEANA COLLECTION (06) ─────────────────────────────────────

  // Dekokissen
  { name: "Moss", collectionSlug: "nerio-oceana", categorySlug: "dekokissen", material: "Nerio", size: "48 × 48 cm", code: "401.815", features: ["mit Keder"] },
  { name: "Midnight", collectionSlug: "nerio-oceana", categorySlug: "dekokissen", material: "Nerio", size: "48 × 48 cm", code: "501.818", features: ["mit Keder"] },
  { name: "Chili", collectionSlug: "nerio-oceana", categorySlug: "dekokissen", material: "Nerio", size: "48 × 48 cm", code: "101.818", features: ["mit Keder"] },
  { name: "Terracotta", collectionSlug: "nerio-oceana", categorySlug: "dekokissen", material: "Nerio", size: "48 × 48 cm", code: "101.815", features: ["mit Keder"] },
  { name: "Hemp", collectionSlug: "nerio-oceana", categorySlug: "dekokissen", material: "Nerio", size: "48 × 48 cm", code: "601.818", features: ["mit Keder"] },
  { name: "Stone", collectionSlug: "nerio-oceana", categorySlug: "dekokissen", material: "Nerio", size: "48 × 48 cm", code: "702.818", features: ["mit Keder"] },
  { name: "Sailor Blue", collectionSlug: "nerio-oceana", categorySlug: "dekokissen", material: "Nerio", size: "48 × 48 cm", code: "501.819", features: ["ohne Keder"] },
  { name: "Rockstone", collectionSlug: "nerio-oceana", categorySlug: "dekokissen", material: "Nerio", size: "48 × 48 cm", code: "701.819", features: ["ohne Keder"] },

  // Hochlehner
  { name: "Chili", collectionSlug: "nerio-oceana", categorySlug: "hochlehner", material: "Nerio", size: "120 × 48 × 6 cm", code: "101.818", features: ["mit Keder"] },
  { name: "Hemp", collectionSlug: "nerio-oceana", categorySlug: "hochlehner", material: "Nerio", size: "120 × 48 × 6 cm", code: "601.818", features: ["mit Keder"] },
  { name: "Midnight", collectionSlug: "nerio-oceana", categorySlug: "hochlehner", material: "Nerio", size: "120 × 48 × 6 cm", code: "501.818", features: ["mit Keder"] },
  { name: "Stone", collectionSlug: "nerio-oceana", categorySlug: "hochlehner", material: "Nerio", size: "120 × 48 × 6 cm", code: "702.818", features: ["mit Keder"] },
  { name: "Moss", collectionSlug: "nerio-oceana", categorySlug: "hochlehner", material: "Nerio", size: "120 × 48 × 6 cm", code: "401.815", features: ["mit Keder"] },
  { name: "Terracotta", collectionSlug: "nerio-oceana", categorySlug: "hochlehner", material: "Nerio", size: "120 × 48 × 6 cm", code: "101.815", features: ["mit Keder"] },

  // Niedriglehner
  { name: "Chili", collectionSlug: "nerio-oceana", categorySlug: "niedriglehner", material: "Nerio", size: "105 × 48 × 6 cm", code: "101.818", features: ["mit Keder"] },
  { name: "Hemp", collectionSlug: "nerio-oceana", categorySlug: "niedriglehner", material: "Nerio", size: "105 × 48 × 6 cm", code: "601.818", features: ["mit Keder"] },
  { name: "Midnight", collectionSlug: "nerio-oceana", categorySlug: "niedriglehner", material: "Nerio", size: "105 × 48 × 6 cm", code: "501.818", features: ["mit Keder"] },
  { name: "Stone", collectionSlug: "nerio-oceana", categorySlug: "niedriglehner", material: "Nerio", size: "105 × 48 × 6 cm", code: "702.818", features: ["mit Keder"] },
  { name: "Moss", collectionSlug: "nerio-oceana", categorySlug: "niedriglehner", material: "Nerio", size: "105 × 48 × 6 cm", code: "401.815", features: ["mit Keder"] },
  { name: "Terracotta", collectionSlug: "nerio-oceana", categorySlug: "niedriglehner", material: "Nerio", size: "105 × 48 × 6 cm", code: "101.815", features: ["mit Keder"] },

  // Sitzkissen
  { name: "Chili", collectionSlug: "nerio-oceana", categorySlug: "sitzkissen", material: "Nerio", size: "46 × 45 × 7 cm", code: "101.818", features: ["mit Keder"] },
  { name: "Midnight", collectionSlug: "nerio-oceana", categorySlug: "sitzkissen", material: "Nerio", size: "46 × 45 × 7 cm", code: "501.818", features: ["mit Keder"] },
  { name: "Hemp", collectionSlug: "nerio-oceana", categorySlug: "sitzkissen", material: "Nerio", size: "46 × 45 × 7 cm", code: "601.818", features: ["mit Keder"] },
  { name: "Stone", collectionSlug: "nerio-oceana", categorySlug: "sitzkissen", material: "Nerio", size: "46 × 45 × 7 cm", code: "702.818", features: ["mit Keder"] },
  { name: "Terracotta", collectionSlug: "nerio-oceana", categorySlug: "sitzkissen", material: "Nerio", size: "46 × 45 × 7 cm", code: "101.815", features: ["mit Keder"] },
  { name: "Moss", collectionSlug: "nerio-oceana", categorySlug: "sitzkissen", material: "Nerio", size: "46 × 45 × 7 cm", code: "401.815", features: ["mit Keder"] },

  // Bankauflagen
  { name: "Chili", collectionSlug: "nerio-oceana", categorySlug: "bankauflagen", material: "Nerio", size: "S–XL (50–170 × 49 × 7 cm)", code: "101.818", features: ["mit Keder"] },
  { name: "Midnight", collectionSlug: "nerio-oceana", categorySlug: "bankauflagen", material: "Nerio", size: "S–XL (50–170 × 49 × 7 cm)", code: "501.818", features: ["mit Keder"] },
  { name: "Hemp", collectionSlug: "nerio-oceana", categorySlug: "bankauflagen", material: "Nerio", size: "S–XL (50–170 × 49 × 7 cm)", code: "601.818", features: ["mit Keder"] },
  { name: "Stone", collectionSlug: "nerio-oceana", categorySlug: "bankauflagen", material: "Nerio", size: "S–XL (50–170 × 49 × 7 cm)", code: "702.818", features: ["mit Keder"] },
  { name: "Moss", collectionSlug: "nerio-oceana", categorySlug: "bankauflagen", material: "Nerio", size: "S–XL (50–170 × 49 × 7 cm)", code: "401.815", features: ["mit Keder"] },
  { name: "Terracotta", collectionSlug: "nerio-oceana", categorySlug: "bankauflagen", material: "Nerio", size: "S–XL (50–170 × 49 × 7 cm)", code: "101.815", features: ["mit Keder"] },

  // ─── BASIC COLLECTION (07) ────────────────────────────────────────────

  // Dekokissen (Uni)
  { name: "Creme au Lait", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "15815809", features: [] },
  { name: "Stone Blue", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "15815834", features: [] },
  { name: "Elder Purple", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "15815805", features: [] },
  { name: "Boletus Brown", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "15815530", features: [] },
  { name: "Green", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "15815819", features: [] },
  { name: "Pink", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "15815735", features: [] },
  { name: "Yellow", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "15815850", features: [] },
  { name: "Blue", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "15815826", features: [] },

  // Dekokissen (Muster)
  { name: "Earthy Chevron", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "999.234.06", features: ["Muster"] },
  { name: "Striato Ink", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "999.234.05", features: ["Muster"] },
  { name: "Midnight Ogee", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "999.234.07", features: ["Muster"] },
  { name: "Jungle Canopy", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "999.234.02", features: ["Muster"] },
  { name: "Meadow Bloom", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "999.234.01", features: ["Muster"] },
  { name: "Red Bloom", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "999.233.09", features: ["Muster"] },
  { name: "Field Stripe", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "999.234.03", features: ["Muster"] },
  { name: "Timeless Stripe", collectionSlug: "basic", categorySlug: "dekokissen", material: "Basic", size: "45 × 45 cm", code: "999.234.04", features: ["Muster"] },

  // Hochlehner
  { name: "Boletus Brown", collectionSlug: "basic", categorySlug: "hochlehner", material: "Basic", size: "120 × 48 × 6 cm", code: "15815530", features: ["mit Keder"] },
  { name: "Creme au Lait", collectionSlug: "basic", categorySlug: "hochlehner", material: "Basic", size: "120 × 48 × 6 cm", code: "15815809", features: ["mit Keder"] },
  { name: "Elder Purple", collectionSlug: "basic", categorySlug: "hochlehner", material: "Basic", size: "120 × 48 × 6 cm", code: "15815805", features: ["mit Keder"] },
  { name: "Stone Blue", collectionSlug: "basic", categorySlug: "hochlehner", material: "Basic", size: "120 × 48 × 6 cm", code: "15815834", features: ["mit Keder"] },

  // Niedriglehner
  { name: "Boletus Brown", collectionSlug: "basic", categorySlug: "niedriglehner", material: "Basic", size: "105 × 48 × 6 cm", code: "15815530", features: ["mit Keder"] },
  { name: "Creme au Lait", collectionSlug: "basic", categorySlug: "niedriglehner", material: "Basic", size: "105 × 48 × 6 cm", code: "15815809", features: ["mit Keder"] },
  { name: "Elder Purple", collectionSlug: "basic", categorySlug: "niedriglehner", material: "Basic", size: "105 × 48 × 6 cm", code: "15815805", features: ["mit Keder"] },
  { name: "Stone Blue", collectionSlug: "basic", categorySlug: "niedriglehner", material: "Basic", size: "105 × 48 × 6 cm", code: "15815834", features: ["mit Keder"] },

  // Sitzkissen
  { name: "Elder Purple", collectionSlug: "basic", categorySlug: "sitzkissen", material: "Basic", size: "46 × 45 × 5 cm", code: "15815805", features: ["mit Keder"] },
  { name: "Boletus Brown", collectionSlug: "basic", categorySlug: "sitzkissen", material: "Basic", size: "46 × 45 × 5 cm", code: "15815530", features: ["mit Keder"] },
  { name: "Creme au Lait", collectionSlug: "basic", categorySlug: "sitzkissen", material: "Basic", size: "46 × 45 × 5 cm", code: "15815809", features: ["mit Keder"] },
  { name: "Stone Blue", collectionSlug: "basic", categorySlug: "sitzkissen", material: "Basic", size: "46 × 45 × 5 cm", code: "15815834", features: ["mit Keder"] },
];

export function getProductsByCollection(collectionSlug: string): Product[] {
  return products.filter((p) => p.collectionSlug === collectionSlug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsByCollectionAndCategory(
  collectionSlug: string,
  categorySlug: string,
): Product[] {
  return products.filter(
    (p) => p.collectionSlug === collectionSlug && p.categorySlug === categorySlug,
  );
}
