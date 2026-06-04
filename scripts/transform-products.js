const fs = require('fs');
const path = require('path');

// Read current products.ts
const content = fs.readFileSync(path.join(__dirname, '..', 'lib', 'mosaroma', 'products.ts'), 'utf8');

// Extract product entries using regex
const productRegex = /\{\s*name:\s*"([^"]+)",\s*collectionSlug:\s*"([^"]+)",\s*categorySlug:\s*"([^"]+)",\s*material:\s*"([^"]+)",\s*size:\s*"([^"]*)",\s*code:\s*"([^"]*)",\s*features:\s*\[([^\]]*)\]\s*\}/g;

const products = [];
let match;
while ((match = productRegex.exec(content)) !== null) {
  const [, name, collectionSlug, categorySlug, material, size, code, featuresStr] = match;
  const features = featuresStr.trim() ? featuresStr.split(',').map(f => f.trim().replace(/"/g, '')) : [];
  products.push({ name, collectionSlug, categorySlug, material, size, code, features });
}

console.log(`Found ${products.length} products`);

// Material slug mapping
function getMaterialSlug(material) {
  const map = {
    'Mackintosh®': 'mackintosh',
    'Mackintosh® Lite': 'mackintosh-lite',
    'Nerio': 'nerio',
    'Basic': 'basic',
    'Acryl': 'acryl',
    'Bambusfaser': 'bambusfaser',
  };
  return map[material] || material.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

// Slugify
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/ü/g, 'ue').replace(/ö/g, 'oe').replace(/ä/g, 'ae').replace(/ß/g, 'ss')
    .replace(/®/g, '').replace(/·/g, '').replace(/&/g, '-')
    .replace(/[^a-z0-9-\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Collection name mapping
const collectionNames = {
  green: 'Green', blue: 'Blue', red: 'Red', golden: 'Golden',
  'earth-grey': 'Earth & Grey', 'nerio-oceana': 'NERIO · Oceana', basic: 'Basic',
};

// Category title mapping
const categoryTitles = {
  dekokissen: 'Dekokissen', hochlehner: 'Hochlehner', niedriglehner: 'Niedriglehner',
  sitzkissen: 'Sitzkissen', sitzpolster: 'Sitzpolster', bankauflagen: 'Bankauflage',
  poufs: 'Pouf', 'tischsets-tischlaeufer': 'Tischset', decken: 'Decke',
};

// Collection color for fabric texture
const collectionTexture = {
  green: 'green', blue: 'blue', red: 'red', golden: 'golden',
  'earth-grey': 'earth-grey', 'nerio-oceana': 'green', basic: 'earth-grey',
};

// Extract colorName and patternName
function extractNames(name) {
  // Single word names
  if (!name.includes(' ') || ['Creme au Lait'].includes(name)) {
    return { colorName: name };
  }
  
  // Known pattern + color combinations
  const patterns = [
    'Rocky Mountain', 'St. Tropez', 'Rain Stripe', 'Longitude', 'Palmway',
    'Bean', 'Caribbean', 'Caravan', 'Vanity', 'Tartan', 'Outpost',
    'Parker Stripe', 'Cypress', 'Swazi Stripe', 'Monaco', 'Bouclé',
    'Birdeyes', 'Canvas', 'Midnight',
  ];
  
  for (const pat of patterns) {
    if (name.startsWith(pat + ' ')) {
      return { patternName: pat, colorName: name.slice(pat.length + 1) };
    }
  }
  
  // Basic patterned items
  const fullPatterns = ['Earthy Chevron', 'Striato Ink', 'Midnight Ogee', 'Jungle Canopy', 'Meadow Bloom', 'Red Bloom', 'Field Stripe', 'Timeless Stripe'];
  if (fullPatterns.includes(name)) {
    return { patternName: name };
  }
  
  // Basic colors like "Stone Blue", "Elder Purple", "Boletus Brown"
  const basicColors = ['Stone Blue', 'Elder Purple', 'Boletus Brown', 'Creme au Lait'];
  if (basicColors.includes(name)) {
    return { colorName: name };
  }
  
  // Decke names
  if (name.startsWith('Mora ') || name.startsWith('Creson ')) {
    const parts = name.split(' ');
    return { patternName: parts[0], colorName: parts.slice(1).join(' ') };
  }
  
  return { colorName: name };
}

// Generate slug for product
function generateSlug(product) {
  let nameSlug = slugify(product.name);
  let catSlug = product.categorySlug;
  let codePart = product.code.replace(/[.\s]/g, '');
  
  // Handle size variants
  if (product.size.includes('(klein)')) {
    catSlug += '-klein';
  } else if (product.size.includes('(groß)') || product.size.includes('(gross)')) {
    catSlug += '-gross';
  } else if (product.size.includes('(eckig)')) {
    catSlug += '-eckig';
  } else if (product.size.includes('(halbrund)')) {
    catSlug += '-halbrund';
  }
  
  // Handle bankauflagen size
  if (product.categorySlug === 'bankauflagen' && product.size.match(/^(S|M|L|XL):/)) {
    const sizeLabel = product.size.match(/^(S|M|L|XL):/)[1].toLowerCase();
    catSlug += '-' + sizeLabel;
  }
  
  let slug = codePart ? `${nameSlug}-${catSlug}-${codePart}` : `${nameSlug}-${catSlug}`;
  return slug;
}

// Split bankauflagen into individual sizes
function splitBankauflagen(product) {
  if (product.categorySlug !== 'bankauflagen' || !product.size.includes('S–XL')) {
    return [product];
  }
  
  const sizes = [
    { label: 'S', size: 'S: 50 × 49 × 7 cm' },
    { label: 'M', size: 'M: 110 × 49 × 7 cm' },
    { label: 'L', size: 'L: 140 × 49 × 7 cm' },
    { label: 'XL', size: 'XL: 170 × 49 × 7 cm' },
  ];
  
  return sizes.map(s => ({
    ...product,
    size: s.size,
  }));
}

// Process all products
const expandedProducts = [];
for (const p of products) {
  const split = splitBankauflagen(p);
  for (const sp of split) {
    expandedProducts.push(sp);
  }
}

console.log(`Expanded to ${expandedProducts.length} products (after bankauflagen split)`);

// Check for duplicate slugs
const slugs = new Set();
const processedProducts = expandedProducts.map(p => {
  const slug = generateSlug(p);
  let finalSlug = slug;
  let counter = 2;
  while (slugs.has(finalSlug)) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }
  slugs.add(finalSlug);
  
  const materialSlug = getMaterialSlug(p.material);
  const collName = collectionNames[p.collectionSlug] || p.collectionSlug;
  const catTitle = categoryTitles[p.categorySlug] || p.categorySlug;
  const texture = collectionTexture[p.collectionSlug] || 'earth-grey';
  const { colorName, patternName } = extractNames(p.name);
  
  return {
    slug: finalSlug,
    name: p.name,
    categorySlug: p.categorySlug,
    collectionSlug: p.collectionSlug,
    materialSlug,
    material: p.material,
    size: p.size,
    code: p.code,
    features: p.features,
    description: `${p.name} ${catTitle} aus der ${collName} Collection. Material: ${p.material}.`,
    image: `/images/placeholders/products/product-${p.collectionSlug}.svg`,
    gallery: [
      `/images/placeholders/products/${p.categorySlug}.svg`,
      `/images/placeholders/detail/fabric-texture-${texture}.svg`,
      `/images/placeholders/detail/outdoor-context-neutral.svg`,
    ],
    alt: `Mosaroma ${p.name} ${catTitle} – ${collName} Collection`,
    colorName: colorName || undefined,
    patternName: patternName || undefined,
  };
});

// Find which section each product belongs to by collecting comments
const sectionComments = {};
const commentRegex = /\/\/ ─── (.+?) ───/g;
let cmatch;
while ((cmatch = commentRegex.exec(content)) !== null) {
  sectionComments[cmatch.index] = cmatch[1];
}

// Generate output
let output = `export interface Product {
  slug: string;
  name: string;
  categorySlug: string;
  collectionSlug: string;
  materialSlug: string;
  material: string;
  size: string;
  code: string;
  features: string[];
  description: string;
  image: string;
  gallery: string[];
  alt: string;
  colorName?: string;
  patternName?: string;
}

export const products: Product[] = [\n`;

let currentCollection = '';
let currentCategory = '';

for (const p of processedProducts) {
  // Add collection section comment
  if (p.collectionSlug !== currentCollection) {
    currentCollection = p.collectionSlug;
    currentCategory = '';
    const collLabel = {
      green: 'GREEN COLLECTION (01)',
      blue: 'BLUE COLLECTION (02)',
      red: 'RED COLLECTION (03)',
      golden: 'GOLDEN COLLECTION (04)',
      'earth-grey': 'EARTH & GREY COLLECTION (05)',
      'nerio-oceana': 'NERIO OCEANA COLLECTION (06)',
      basic: 'BASIC COLLECTION (07)',
    }[p.collectionSlug] || p.collectionSlug.toUpperCase();
    output += `\n  // ─── ${collLabel} ${'─'.repeat(Math.max(0, 60 - collLabel.length))}\n`;
  }
  
  // Add category comment
  if (p.categorySlug !== currentCategory) {
    currentCategory = p.categorySlug;
    output += `\n  // ${categoryTitles[p.categorySlug] || p.categorySlug}\n`;
  }
  
  const colorLine = p.colorName ? `\n    colorName: "${p.colorName}",` : '';
  const patternLine = p.patternName ? `\n    patternName: "${p.patternName}",` : '';
  const featStr = p.features.length > 0 ? `[${p.features.map(f => `"${f}"`).join(', ')}]` : '[]';
  const todoComment = (!p.code && p.categorySlug === 'decken') ? ' // TODO: Artikelcode aus Katalog ergänzen' : '';
  // Check for St. Tropez Citron code discrepancy
  const citronTodo = (p.name === 'St. Tropez Citron' && p.code === '201.804') ? ' // TODO: Katalog S.64 zeigt 201.208 — prüfen ob 201.804 (S.14) korrekt' : '';
  
  output += `  {
    slug: "${p.slug}",
    name: "${p.name}",
    categorySlug: "${p.categorySlug}",
    collectionSlug: "${p.collectionSlug}",
    materialSlug: "${p.materialSlug}",
    material: "${p.material}",
    size: "${p.size}",
    code: "${p.code}",${todoComment}${citronTodo}
    features: ${featStr},
    description: "${p.description}",
    image: "${p.image}",
    gallery: ${JSON.stringify(p.gallery)},
    alt: "${p.alt}",${colorLine}${patternLine}
  },\n`;
}

output += `];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

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
`;

fs.writeFileSync(path.join(__dirname, '..', 'lib', 'mosaroma', 'products.ts'), output);
console.log(`Written ${processedProducts.length} products to products.ts`);

// Verify no duplicate slugs
const allSlugs = processedProducts.map(p => p.slug);
const dupes = allSlugs.filter((s, i) => allSlugs.indexOf(s) !== i);
if (dupes.length > 0) {
  console.log('DUPLICATE SLUGS:', [...new Set(dupes)]);
} else {
  console.log('No duplicate slugs - all unique');
}
