#!/usr/bin/env node
/**
 * MOSAROMA SVG Placeholder Generator
 * Generates premium branded SVG placeholder images for the MOSAROMA website.
 */

const fs = require('fs');
const path = require('path');

// ── Brand Colors ──────────────────────────────────────────────
const BRAND = {
  pumpkin: '#E07B12',
  anthracite: '#2D2D2D',
  cream: '#FAF8F5',
  lightGray: '#F5F5F5',
  mediumGray: '#B8B8B8',
  textGray: '#555555',
};

// ── Collection Mood Colors ────────────────────────────────────
const COLLECTIONS = {
  green:        ['#42523F', '#69785C', '#9AA381', '#D8D2B8'],
  blue:         ['#2C5F7C', '#4A8BAD', '#7AB3CC', '#B5D5E2'],
  red:          ['#8B2500', '#C0392B', '#E67E73', '#F5C6C1'],
  golden:       ['#B8860B', '#DAA520', '#F0C75E', '#F5E1A4'],
  'earth-grey': ['#6B5B4B', '#8B7D6B', '#A69B8D', '#C4BEB5'],
  'nerio-oceana': ['#1B6B6D', '#2E8B8B', '#5CACAC', '#96D4D4'],
  basic:        ['#555555', '#888888', '#AAAAAA', '#D5D5D5'],
};

const BASE = path.join(__dirname, '..', 'public', 'images', 'placeholders');

// ── SVG Helpers ───────────────────────────────────────────────

function weavePattern(id, strokeColor = 'rgba(255,255,255,0.07)', strokeColor2 = 'rgba(0,0,0,0.04)') {
  return `
  <defs>
    <pattern id="${id}" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="20" stroke="${strokeColor}" stroke-width="0.8"/>
      <line x1="10" y1="0" x2="10" y2="20" stroke="${strokeColor2}" stroke-width="0.5"/>
    </pattern>
    <pattern id="${id}-h" patternUnits="userSpaceOnUse" width="24" height="24" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="24" stroke="${strokeColor}" stroke-width="0.6"/>
      <line x1="12" y1="0" x2="12" y2="24" stroke="${strokeColor2}" stroke-width="0.4"/>
    </pattern>
  </defs>`;
}

function fabricOverlay(id, w, h) {
  return `
  <rect width="${w}" height="${h}" fill="url(#${id})" opacity="1"/>
  <rect width="${w}" height="${h}" fill="url(#${id}-h)" opacity="0.7"/>`;
}

function accentLine(w, h, thickness = 3) {
  const y = h - 40;
  const margin = w * 0.15;
  return `<line x1="${margin}" y1="${y}" x2="${w - margin}" y2="${y}" stroke="${BRAND.pumpkin}" stroke-width="${thickness}" stroke-linecap="round" opacity="0.85"/>`;
}

function brandingText(w, h, labelColor = 'rgba(255,255,255,0.5)') {
  return `<text x="${w / 2}" y="${h - 18}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="11" letter-spacing="4" fill="${labelColor}" text-anchor="middle" font-variant="small-caps">MOSAROMA</text>`;
}

function mainLabel(text, w, h, color = 'rgba(255,255,255,0.85)', fontSize = 28) {
  const y = h / 2 + fontSize / 3;
  // Handle multi-line if text is long
  return `<text x="${w / 2}" y="${y}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif" font-size="${fontSize}" font-weight="300" fill="${color}" text-anchor="middle" letter-spacing="2">${escapeXml(text)}</text>`;
}

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function gradientBg(id, c1, c2, direction = 'vertical') {
  if (direction === 'vertical') {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient>`;
  }
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient>`;
}

function svgWrap(w, h, innerDefs, innerContent) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
${innerDefs}
${innerContent}
</svg>`;
}

// ── Generic Premium Placeholder ───────────────────────────────

function premiumPlaceholder({ w = 800, h = 600, bgColor1, bgColor2, label, labelColor, brandColor, accentThickness = 3, patternStroke1, patternStroke2, extraShapes = '' }) {
  bgColor2 = bgColor2 || bgColor1;
  labelColor = labelColor || 'rgba(255,255,255,0.85)';
  brandColor = brandColor || 'rgba(255,255,255,0.45)';
  patternStroke1 = patternStroke1 || 'rgba(255,255,255,0.07)';
  patternStroke2 = patternStroke2 || 'rgba(0,0,0,0.04)';

  const pid = 'weave-' + Math.random().toString(36).slice(2, 8);
  const gid = 'bg-' + Math.random().toString(36).slice(2, 8);

  const defs = `<defs>
    ${gradientBg(gid, bgColor1, bgColor2, 'diagonal')}
    <pattern id="${pid}" patternUnits="userSpaceOnUse" width="20" height="20" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="20" stroke="${patternStroke1}" stroke-width="0.8"/>
      <line x1="10" y1="0" x2="10" y2="20" stroke="${patternStroke2}" stroke-width="0.5"/>
    </pattern>
    <pattern id="${pid}-h" patternUnits="userSpaceOnUse" width="24" height="24" patternTransform="rotate(-45)">
      <line x1="0" y1="0" x2="0" y2="24" stroke="${patternStroke1}" stroke-width="0.6"/>
      <line x1="12" y1="0" x2="12" y2="24" stroke="${patternStroke2}" stroke-width="0.4"/>
    </pattern>
  </defs>`;

  const content = `
  <rect width="${w}" height="${h}" fill="url(#${gid})"/>
  <rect width="${w}" height="${h}" fill="url(#${pid})"/>
  <rect width="${w}" height="${h}" fill="url(#${pid}-h)" opacity="0.7"/>
  ${extraShapes}
  ${accentLine(w, h, accentThickness)}
  ${mainLabel(label, w, h - 30, labelColor)}
  ${brandingText(w, h, brandColor)}`;

  return svgWrap(w, h, defs, content);
}

// ── Category Shape Silhouettes ────────────────────────────────

function categoryShape(name, w, h) {
  const cx = w / 2;
  const cy = h / 2 - 40;
  const stroke = 'rgba(255,255,255,0.12)';
  const fill = 'rgba(255,255,255,0.04)';

  const shapes = {
    dekokissen: `<rect x="${cx-60}" y="${cy-60}" width="120" height="120" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="${cx-40}" y1="${cy}" x2="${cx+40}" y2="${cy}" stroke="${stroke}" stroke-width="0.8"/>`,

    hochlehner: `<rect x="${cx-40}" y="${cy-90}" width="80" height="180" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="${cx-40}" y1="${cy+20}" x2="${cx+40}" y2="${cy+20}" stroke="${stroke}" stroke-width="0.8" stroke-dasharray="4,3"/>`,

    niedriglehner: `<rect x="${cx-45}" y="${cy-50}" width="90" height="120" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="${cx-45}" y1="${cy+10}" x2="${cx+45}" y2="${cy+10}" stroke="${stroke}" stroke-width="0.8" stroke-dasharray="4,3"/>`,

    sitzkissen: `<rect x="${cx-55}" y="${cy-55}" width="110" height="110" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`,

    sitzpolster: `<rect x="${cx-65}" y="${cy-25}" width="130" height="50" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`,

    bankauflagen: `<rect x="${cx-100}" y="${cy-25}" width="200" height="50" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy-25}" x2="${cx}" y2="${cy+25}" stroke="${stroke}" stroke-width="0.6" stroke-dasharray="3,3"/>`,

    poufs: `<ellipse cx="${cx}" cy="${cy+20}" rx="55" ry="25" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
      <rect x="${cx-50}" y="${cy-40}" width="100" height="60" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <ellipse cx="${cx}" cy="${cy-40}" rx="50" ry="18" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,

    'tischsets-tischlaeufer': `<rect x="${cx-80}" y="${cy-30}" width="160" height="60" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <rect x="${cx-70}" y="${cy-22}" width="140" height="44" rx="2" fill="none" stroke="${stroke}" stroke-width="0.6"/>`,

    decken: `<path d="M${cx-50},${cy+40} L${cx-50},${cy-30} Q${cx-50},${cy-50} ${cx-30},${cy-50} L${cx+40},${cy-50} Q${cx+60},${cy-50} ${cx+60},${cy-30} L${cx+60},${cy+40} Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <path d="M${cx-50},${cy+40} Q${cx-20},${cy+20} ${cx+10},${cy+40} Q${cx+35},${cy+55} ${cx+60},${cy+40}" fill="none" stroke="${stroke}" stroke-width="1"/>`,
  };

  return shapes[name] || '';
}

// ── Product Shape Silhouettes (square, slightly different) ────

function productShape(name, w, h) {
  const cx = w / 2;
  const cy = h / 2 - 30;
  const stroke = 'rgba(255,255,255,0.15)';
  const fill = 'rgba(255,255,255,0.05)';

  const shapes = {
    dekokissen: `<rect x="${cx-70}" y="${cy-70}" width="140" height="140" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="${cx-50}" y1="${cy}" x2="${cx+50}" y2="${cy}" stroke="${stroke}" stroke-width="0.8"/>
      <line x1="${cx}" y1="${cy-50}" x2="${cx}" y2="${cy+50}" stroke="${stroke}" stroke-width="0.8"/>`,

    hochlehner: `<rect x="${cx-45}" y="${cy-100}" width="90" height="200" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="${cx-45}" y1="${cy+20}" x2="${cx+45}" y2="${cy+20}" stroke="${stroke}" stroke-width="0.8"/>`,

    niedriglehner: `<rect x="${cx-50}" y="${cy-60}" width="100" height="140" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="${cx-50}" y1="${cy+15}" x2="${cx+50}" y2="${cy+15}" stroke="${stroke}" stroke-width="0.8"/>`,

    sitzkissen: `<rect x="${cx-65}" y="${cy-65}" width="130" height="130" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`,

    sitzpolster: `<rect x="${cx-75}" y="${cy-20}" width="150" height="55" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`,

    bankauflagen: `<rect x="${cx-110}" y="${cy-20}" width="220" height="55" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="${cx}" y1="${cy-20}" x2="${cx}" y2="${cy+35}" stroke="${stroke}" stroke-width="0.6" stroke-dasharray="3,3"/>`,

    poufs: `<ellipse cx="${cx}" cy="${cy+25}" rx="65" ry="30" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
      <rect x="${cx-58}" y="${cy-45}" width="116" height="70" rx="14" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <ellipse cx="${cx}" cy="${cy-45}" rx="58" ry="22" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`,

    'tischsets-tischlaeufer': `<rect x="${cx-90}" y="${cy-35}" width="180" height="70" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <rect x="${cx-80}" y="${cy-27}" width="160" height="54" rx="2" fill="none" stroke="${stroke}" stroke-width="0.6"/>`,

    decken: `<path d="M${cx-60},${cy+50} L${cx-60},${cy-35} Q${cx-60},${cy-60} ${cx-35},${cy-60} L${cx+45},${cy-60} Q${cx+70},${cy-60} ${cx+70},${cy-35} L${cx+70},${cy+50} Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <path d="M${cx-60},${cy+50} Q${cx-25},${cy+25} ${cx+15},${cy+50} Q${cx+42},${cy+70} ${cx+70},${cy+50}" fill="none" stroke="${stroke}" stroke-width="1"/>`,
  };

  return shapes[name] || '';
}

// ── Hero Specific ─────────────────────────────────────────────

function heroOutdoorLiving() {
  const w = 1200, h = 800;
  return premiumPlaceholder({
    w, h,
    bgColor1: '#E8DFD0',
    bgColor2: '#C9BAA3',
    label: 'Outdoor Living',
    labelColor: BRAND.anthracite,
    brandColor: 'rgba(45,45,45,0.35)',
    patternStroke1: 'rgba(0,0,0,0.04)',
    patternStroke2: 'rgba(255,255,255,0.06)',
    extraShapes: `
      <rect x="0" y="0" width="${w}" height="${h}" fill="rgba(250,248,245,0.15)"/>
      <!-- Subtle sun circle -->
      <circle cx="${w * 0.75}" cy="${h * 0.25}" r="80" fill="rgba(224,123,18,0.06)" stroke="rgba(224,123,18,0.08)" stroke-width="1"/>
      <circle cx="${w * 0.75}" cy="${h * 0.25}" r="60" fill="rgba(224,123,18,0.04)"/>
      <!-- Horizon line -->
      <line x1="0" y1="${h * 0.6}" x2="${w}" y2="${h * 0.6}" stroke="rgba(0,0,0,0.04)" stroke-width="0.8"/>
    `,
  });
}

function heroWaterDrops() {
  const w = 1200, h = 800;
  // Water drop circles
  let drops = '';
  const dropPositions = [
    [300, 200, 8], [450, 280, 6], [700, 180, 10], [850, 320, 7],
    [200, 350, 5], [550, 150, 9], [900, 250, 6], [350, 400, 4],
    [650, 350, 8], [1000, 200, 5], [150, 250, 6], [780, 400, 7],
  ];
  for (const [x, y, r] of dropPositions) {
    drops += `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>`;
    drops += `<circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.3}" fill="rgba(255,255,255,0.1)"/>`;
  }

  return premiumPlaceholder({
    w, h,
    bgColor1: '#2C5F7C',
    bgColor2: '#4A8BAD',
    label: 'Mackintosh® Technology',
    labelColor: 'rgba(255,255,255,0.9)',
    brandColor: 'rgba(255,255,255,0.4)',
    extraShapes: drops,
  });
}

// ── Category Placeholders ─────────────────────────────────────

function categoryPlaceholder(filename, label) {
  const name = filename.replace('.svg', '');
  return premiumPlaceholder({
    w: 800, h: 600,
    bgColor1: '#5A5A5A',
    bgColor2: '#3D3D3D',
    label,
    extraShapes: categoryShape(name, 800, 600),
  });
}

// ── Collection Placeholders ───────────────────────────────────

function collectionPlaceholder(key, label) {
  const colors = COLLECTIONS[key];
  return premiumPlaceholder({
    w: 800, h: 600,
    bgColor1: colors[0],
    bgColor2: colors[1],
    label,
    extraShapes: `
      <!-- Color swatches -->
      <rect x="280" y="160" width="60" height="60" rx="4" fill="${colors[0]}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <rect x="345" y="160" width="60" height="60" rx="4" fill="${colors[1]}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <rect x="410" y="160" width="60" height="60" rx="4" fill="${colors[2]}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <rect x="475" y="160" width="60" height="60" rx="4" fill="${colors[3]}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
    `,
  });
}

// ── Material Placeholders ─────────────────────────────────────

function materialPlaceholder(label, bgColor1, bgColor2, extraShapes = '') {
  return premiumPlaceholder({
    w: 800, h: 600,
    bgColor1, bgColor2, label,
    extraShapes: extraShapes + `
      <!-- Fabric threads -->
      <line x1="200" y1="180" x2="600" y2="180" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
      <line x1="200" y1="195" x2="600" y2="195" stroke="rgba(255,255,255,0.04)" stroke-width="0.6"/>
      <line x1="200" y1="210" x2="600" y2="210" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
    `,
  });
}

// ── Download Placeholders ─────────────────────────────────────

function downloadPlaceholder(label) {
  const w = 800, h = 600;
  return premiumPlaceholder({
    w, h,
    bgColor1: '#F0EDE8',
    bgColor2: '#E0DBD2',
    label,
    labelColor: BRAND.anthracite,
    brandColor: 'rgba(45,45,45,0.3)',
    patternStroke1: 'rgba(0,0,0,0.03)',
    patternStroke2: 'rgba(0,0,0,0.02)',
    extraShapes: `
      <!-- Document icon -->
      <rect x="${w/2-30}" y="${h/2-100}" width="60" height="75" rx="3" fill="none" stroke="rgba(45,45,45,0.15)" stroke-width="1.5"/>
      <path d="M${w/2+10},${h/2-100} L${w/2+30},${h/2-80}" fill="none" stroke="rgba(45,45,45,0.15)" stroke-width="1"/>
      <line x1="${w/2-18}" y1="${h/2-75}" x2="${w/2+18}" y2="${h/2-75}" stroke="rgba(45,45,45,0.1)" stroke-width="0.8"/>
      <line x1="${w/2-18}" y1="${h/2-65}" x2="${w/2+18}" y2="${h/2-65}" stroke="rgba(45,45,45,0.1)" stroke-width="0.8"/>
      <line x1="${w/2-18}" y1="${h/2-55}" x2="${w/2+18}" y2="${h/2-55}" stroke="rgba(45,45,45,0.08)" stroke-width="0.8"/>
    `,
  });
}

// ── News Placeholders ─────────────────────────────────────────

function newsPlaceholder(label, bgColor1, bgColor2) {
  return premiumPlaceholder({
    w: 800, h: 600,
    bgColor1, bgColor2, label,
  });
}

// ── Detail / Texture Placeholders ─────────────────────────────

function fabricTexture(collectionKey) {
  const colors = COLLECTIONS[collectionKey];
  const w = 800, h = 600;

  // Denser weave pattern for textures
  let weaveLines = '';
  for (let i = 0; i < w + h; i += 8) {
    const opacity = (i % 16 === 0) ? 0.08 : 0.04;
    weaveLines += `<line x1="0" y1="${i}" x2="${i}" y2="0" stroke="rgba(255,255,255,${opacity})" stroke-width="0.6"/>`;
  }
  for (let i = 0; i < w + h; i += 10) {
    const opacity = (i % 20 === 0) ? 0.06 : 0.03;
    weaveLines += `<line x1="${w}" y1="${i}" x2="${w - i}" y2="0" stroke="rgba(0,0,0,${opacity})" stroke-width="0.5"/>`;
  }

  return premiumPlaceholder({
    w, h,
    bgColor1: colors[0],
    bgColor2: colors[1],
    label: '',
    extraShapes: weaveLines,
    accentThickness: 2,
  });
}

function outdoorContext(bgColor1, bgColor2, label) {
  const w = 800, h = 600;
  return premiumPlaceholder({
    w, h,
    bgColor1, bgColor2,
    label: '',
    extraShapes: `
      <!-- Abstract outdoor: horizon + ground plane -->
      <rect x="0" y="${h * 0.55}" width="${w}" height="${h * 0.45}" fill="rgba(0,0,0,0.06)"/>
      <line x1="0" y1="${h * 0.55}" x2="${w}" y2="${h * 0.55}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <!-- Abstract chair silhouette -->
      <rect x="${w/2-35}" y="${h*0.35}" width="70" height="100" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <rect x="${w/2-30}" y="${h*0.58}" width="60" height="8" rx="2" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
    `,
  });
}

// ── Product Placeholders (600x600 square) ─────────────────────

function productCategoryPlaceholder(name, label) {
  return premiumPlaceholder({
    w: 600, h: 600,
    bgColor1: '#4A4A4A',
    bgColor2: '#363636',
    label,
    extraShapes: productShape(name, 600, 600),
  });
}

function productCollectionPlaceholder(collectionKey) {
  const colors = COLLECTIONS[collectionKey];
  const label = collectionKey.split('-').map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
  return premiumPlaceholder({
    w: 600, h: 600,
    bgColor1: colors[0],
    bgColor2: colors[1],
    label,
    extraShapes: `
      <!-- Abstract product shape -->
      <rect x="220" y="180" width="160" height="160" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1.2"/>
      <rect x="230" y="190" width="140" height="140" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" stroke-width="0.8"/>
    `,
  });
}

// ── Collection+Category Mappings ──────────────────────────────

const COLLECTION_CATEGORIES = {
  green: ['dekokissen', 'hochlehner', 'niedriglehner', 'sitzkissen', 'sitzpolster', 'bankauflagen', 'poufs', 'tischsets-tischlaeufer', 'decken'],
  blue: ['dekokissen', 'hochlehner', 'niedriglehner', 'sitzkissen', 'sitzpolster', 'bankauflagen', 'poufs', 'tischsets-tischlaeufer', 'decken'],
  red: ['dekokissen', 'hochlehner', 'niedriglehner', 'sitzkissen', 'poufs', 'tischsets-tischlaeufer'],
  golden: ['dekokissen', 'hochlehner', 'niedriglehner', 'sitzkissen', 'sitzpolster', 'bankauflagen', 'poufs', 'tischsets-tischlaeufer', 'decken'],
  'earth-grey': ['dekokissen', 'hochlehner', 'niedriglehner', 'sitzkissen', 'sitzpolster', 'bankauflagen', 'poufs', 'tischsets-tischlaeufer', 'decken'],
  'nerio-oceana': ['dekokissen', 'hochlehner', 'niedriglehner', 'sitzkissen', 'bankauflagen'],
  basic: ['dekokissen', 'hochlehner', 'niedriglehner', 'sitzkissen'],
};

const COLLECTION_NAMES = {
  green: 'Green',
  blue: 'Blue',
  red: 'Red',
  golden: 'Golden',
  'earth-grey': 'Earth & Grey',
  'nerio-oceana': 'NERIO · Oceana',
  basic: 'Basic',
};

const CATEGORY_TITLES = {
  dekokissen: 'Dekokissen',
  hochlehner: 'Hochlehner',
  niedriglehner: 'Niedriglehner',
  sitzkissen: 'Sitzkissen',
  sitzpolster: 'Sitzpolster',
  bankauflagen: 'Bankauflagen',
  poufs: 'Poufs',
  'tischsets-tischlaeufer': 'Tischsets & Tischläufer',
  decken: 'Decken',
};

// ── Collection Hero Placeholders (wide, 1200x500) ────────────

function collectionHeroPlaceholder(key, label) {
  const colors = COLLECTIONS[key];
  const w = 1200, h = 500;

  // Wide color band at top
  const bandHeight = 6;
  const bandWidth = w / 4;
  let colorBand = '';
  colors.forEach((c, i) => {
    colorBand += `<rect x="${i * bandWidth}" y="0" width="${bandWidth}" height="${bandHeight}" fill="${c}"/>`;
  });

  return premiumPlaceholder({
    w, h,
    bgColor1: colors[0],
    bgColor2: colors[1],
    label,
    extraShapes: `
      ${colorBand}
      <!-- Large color swatches -->
      <rect x="${w/2 - 140}" y="120" width="65" height="65" rx="4" fill="${colors[0]}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
      <rect x="${w/2 - 65}" y="120" width="65" height="65" rx="4" fill="${colors[1]}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
      <rect x="${w/2 + 10}" y="120" width="65" height="65" rx="4" fill="${colors[2]}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
      <rect x="${w/2 + 85}" y="120" width="65" height="65" rx="4" fill="${colors[3]}" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    `,
  });
}

// ── Subcategory Hero Placeholders (wide, 1200x400) ───────────

function subcategoryHeroPlaceholder(collectionKey, categoryName, label) {
  const colors = COLLECTIONS[collectionKey];
  const w = 1200, h = 400;

  // Scale category shape for wider format
  const cx = w / 2;
  const cy = h / 2 - 20;
  const stroke = 'rgba(255,255,255,0.12)';
  const fill = 'rgba(255,255,255,0.04)';

  const shapes = {
    dekokissen: `<rect x="${cx-50}" y="${cy-50}" width="100" height="100" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`,
    hochlehner: `<rect x="${cx-30}" y="${cy-75}" width="60" height="150" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="${cx-30}" y1="${cy+15}" x2="${cx+30}" y2="${cy+15}" stroke="${stroke}" stroke-width="0.8" stroke-dasharray="4,3"/>`,
    niedriglehner: `<rect x="${cx-35}" y="${cy-40}" width="70" height="100" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <line x1="${cx-35}" y1="${cy+10}" x2="${cx+35}" y2="${cy+10}" stroke="${stroke}" stroke-width="0.8" stroke-dasharray="4,3"/>`,
    sitzkissen: `<rect x="${cx-45}" y="${cy-45}" width="90" height="90" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`,
    sitzpolster: `<rect x="${cx-55}" y="${cy-18}" width="110" height="40" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`,
    bankauflagen: `<rect x="${cx-80}" y="${cy-18}" width="160" height="40" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`,
    poufs: `<ellipse cx="${cx}" cy="${cy+15}" rx="45" ry="20" fill="${fill}" stroke="${stroke}" stroke-width="1"/>
      <rect x="${cx-40}" y="${cy-30}" width="80" height="45" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`,
    'tischsets-tischlaeufer': `<rect x="${cx-65}" y="${cy-22}" width="130" height="48" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`,
    decken: `<path d="M${cx-40},${cy+30} L${cx-40},${cy-20} Q${cx-40},${cy-38} ${cx-22},${cy-38} L${cx+30},${cy-38} Q${cx+48},${cy-38} ${cx+48},${cy-20} L${cx+48},${cy+30} Z" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`,
  };

  const shape = shapes[categoryName] || '';

  return premiumPlaceholder({
    w, h,
    bgColor1: colors[1],
    bgColor2: colors[2],
    label,
    extraShapes: `
      <!-- Color accent bar -->
      <rect x="0" y="0" width="${w}" height="4" fill="${colors[0]}"/>
      ${shape}
    `,
  });
}

// ── Page Hero Placeholders (1920x720 wide format) ────────────

function pageHeroPlaceholder({ bgColor1, bgColor2, extraShapes = '' }) {
  const w = 1920, h = 720;
  return premiumPlaceholder({
    w, h,
    bgColor1, bgColor2,
    label: '',
    labelColor: 'rgba(255,255,255,0)',
    brandColor: 'rgba(255,255,255,0.2)',
    accentThickness: 0,
    patternStroke1: 'rgba(255,255,255,0.05)',
    patternStroke2: 'rgba(0,0,0,0.03)',
    extraShapes,
  });
}

function pageHeroKollektionen() {
  const w = 1920;
  // Seven abstract color swatches representing collections
  const allColors = [
    ['#42523F', '#69785C'], // green
    ['#2C5F7C', '#4A8BAD'], // blue
    ['#8B2500', '#C0392B'], // red
    ['#B8860B', '#DAA520'], // golden
    ['#6B5B4B', '#8B7D6B'], // earth-grey
    ['#1B6B6D', '#2E8B8B'], // nerio-oceana
    ['#555555', '#888888'], // basic
  ];
  let swatches = '';
  const swatchW = 160, gap = 24;
  const totalW = allColors.length * swatchW + (allColors.length - 1) * gap;
  const startX = (w - totalW) / 2;
  allColors.forEach((colors, i) => {
    const x = startX + i * (swatchW + gap);
    swatches += `<rect x="${x}" y="220" width="${swatchW}" height="${swatchW}" rx="4" fill="${colors[0]}" opacity="0.35"/>`;
    swatches += `<rect x="${x + 8}" y="228" width="${swatchW - 16}" height="${swatchW - 16}" rx="3" fill="${colors[1]}" opacity="0.2"/>`;
  });
  return pageHeroPlaceholder({
    bgColor1: '#3D3D3D',
    bgColor2: '#2D2D2D',
    extraShapes: swatches,
  });
}

function pageHeroMaterialien() {
  const w = 1920, h = 720;
  // Macro fabric texture with water droplets
  let threads = '';
  for (let y = 100; y < h - 100; y += 12) {
    const opacity = (y % 24 === 0) ? 0.06 : 0.03;
    threads += `<line x1="200" y1="${y}" x2="${w - 200}" y2="${y}" stroke="rgba(255,255,255,${opacity})" stroke-width="0.8"/>`;
  }
  for (let x = 200; x < w - 200; x += 14) {
    const opacity = (x % 28 === 0) ? 0.05 : 0.025;
    threads += `<line x1="${x}" y1="100" x2="${x}" y2="${h - 100}" stroke="rgba(255,255,255,${opacity})" stroke-width="0.6"/>`;
  }
  // Water drops
  const drops = [
    [w * 0.65, 240, 12], [w * 0.72, 320, 9], [w * 0.68, 400, 11],
    [w * 0.75, 280, 7], [w * 0.80, 360, 10], [w * 0.62, 340, 8],
  ];
  let dropShapes = '';
  for (const [x, y, r] of drops) {
    dropShapes += `<circle cx="${x}" cy="${y}" r="${r}" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>`;
    dropShapes += `<circle cx="${x - r * 0.25}" cy="${y - r * 0.25}" r="${r * 0.3}" fill="rgba(255,255,255,0.08)"/>`;
  }
  return pageHeroPlaceholder({
    bgColor1: '#4A4038',
    bgColor2: '#3A3228',
    extraShapes: threads + dropShapes,
  });
}

function pageHeroUeberUns() {
  const w = 1920;
  // Fabric rolls / material planes
  let shapes = '';
  shapes += `<rect x="${w * 0.1}" y="200" width="${w * 0.35}" height="300" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
  shapes += `<rect x="${w * 0.5}" y="180" width="${w * 0.35}" height="320" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
  shapes += `<line x1="${w * 0.1}" y1="350" x2="${w * 0.45}" y2="350" stroke="rgba(255,255,255,0.04)" stroke-width="0.8"/>`;
  shapes += `<line x1="${w * 0.5}" y1="340" x2="${w * 0.85}" y2="340" stroke="rgba(255,255,255,0.04)" stroke-width="0.8"/>`;
  return pageHeroPlaceholder({
    bgColor1: '#3A3D3A',
    bgColor2: '#2D302D',
    extraShapes: shapes,
  });
}

function pageHeroKataloge() {
  const w = 1920;
  // Abstract document / catalog pages
  let shapes = '';
  const docs = [
    [w * 0.3, 180, 200, 280], [w * 0.45, 160, 200, 280],
    [w * 0.6, 190, 200, 280],
  ];
  docs.forEach(([x, y, dw, dh], i) => {
    const opacity = 0.03 + i * 0.01;
    shapes += `<rect x="${x}" y="${y}" width="${dw}" height="${dh}" rx="3" fill="rgba(255,255,255,${opacity})" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>`;
    // Text lines inside
    for (let ly = y + 40; ly < y + dh - 30; ly += 18) {
      const lw = 100 + Math.floor((ly * 7) % 60);
      shapes += `<line x1="${x + 30}" y1="${ly}" x2="${x + 30 + lw}" y2="${ly}" stroke="rgba(255,255,255,0.04)" stroke-width="2"/>`;
    }
  });
  return pageHeroPlaceholder({
    bgColor1: '#4A4540',
    bgColor2: '#383430',
    extraShapes: shapes,
  });
}

function pageHeroNeuigkeiten() {
  const w = 1920;
  // Editorial grid / magazine tiles
  let shapes = '';
  const tiles = [
    [w * 0.15, 180, 280, 180], [w * 0.38, 180, 280, 180],
    [w * 0.61, 180, 280, 180], [w * 0.15, 380, 280, 180],
    [w * 0.38, 380, 280, 180], [w * 0.61, 380, 280, 180],
  ];
  tiles.forEach(([x, y, tw, th], i) => {
    const opacity = 0.025 + (i % 3) * 0.008;
    shapes += `<rect x="${x}" y="${y}" width="${tw}" height="${th}" rx="2" fill="rgba(255,255,255,${opacity})" stroke="rgba(255,255,255,0.05)" stroke-width="0.8"/>`;
  });
  return pageHeroPlaceholder({
    bgColor1: '#42523F',
    bgColor2: '#354535',
    extraShapes: shapes,
  });
}

function pageHeroKontakt() {
  const w = 1920;
  // Subtle location / address lines
  let shapes = '';
  shapes += `<rect x="${w * 0.35}" y="220" width="${w * 0.3}" height="250" rx="4" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>`;
  for (let y = 280; y < 430; y += 28) {
    const lw = 120 + (y * 3) % 80;
    shapes += `<line x1="${w * 0.35 + 40}" y1="${y}" x2="${w * 0.35 + 40 + lw}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-width="2"/>`;
  }
  return pageHeroPlaceholder({
    bgColor1: '#3D3A38',
    bgColor2: '#2D2A28',
    extraShapes: shapes,
  });
}

function pageHeroDefault() {
  return pageHeroPlaceholder({
    bgColor1: '#3D3D3D',
    bgColor2: '#2D2D2D',
    extraShapes: '',
  });
}

// ── File Generation ───────────────────────────────────────────

function writeFile(dir, filename, content) {
  const filePath = path.join(BASE, dir, filename);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  return filePath;
}

let count = 0;

function gen(dir, filename, content) {
  const p = writeFile(dir, filename, content);
  count++;
  console.log(`  [${String(count).padStart(2)}] ${path.relative(BASE, p)}`);
}

// ══════════════════════════════════════════════════════════════
//  GENERATE ALL FILES
// ══════════════════════════════════════════════════════════════

console.log('\n  MOSAROMA SVG Placeholder Generator');
console.log('  ===================================\n');

// ── Hero ──
console.log('  Hero images:');
gen('hero', 'mosaroma-hero-outdoor-living.svg', heroOutdoorLiving());
gen('hero', 'fabric-water-drops.svg', heroWaterDrops());

// ── Categories ──
console.log('\n  Category images:');
const categories = [
  ['dekokissen.svg', 'Dekokissen'],
  ['hochlehner.svg', 'Hochlehner'],
  ['niedriglehner.svg', 'Niedriglehner'],
  ['sitzkissen.svg', 'Sitzkissen'],
  ['sitzpolster.svg', 'Sitzpolster'],
  ['bankauflagen.svg', 'Bankauflagen'],
  ['poufs.svg', 'Poufs'],
  ['tischsets-tischlaeufer.svg', 'Tischsets & Tischläufer'],
  ['decken.svg', 'Decken'],
];
for (const [file, label] of categories) {
  gen('categories', file, categoryPlaceholder(file, label));
}

// ── Collections ──
console.log('\n  Collection images:');
const collectionDefs = [
  ['green', 'green.svg', 'Green Collection'],
  ['blue', 'blue.svg', 'Blue Collection'],
  ['red', 'red.svg', 'Red Collection'],
  ['golden', 'golden.svg', 'Golden Collection'],
  ['earth-grey', 'earth-grey.svg', 'Earth & Grey Collection'],
  ['nerio-oceana', 'nerio-oceana.svg', 'NERIO · Oceana Collection'],
  ['basic', 'basic.svg', 'Basic Collection'],
];
for (const [key, file, label] of collectionDefs) {
  gen('collections', file, collectionPlaceholder(key, label));
}

// ── Materials ──
console.log('\n  Material images:');
gen('materials', 'mackintosh.svg', materialPlaceholder('Mackintosh®', '#6B5B4B', '#4A3C30'));
gen('materials', 'mackintosh-lite.svg', materialPlaceholder('Mackintosh® Lite', '#8B7D6B', '#6B5B4B'));

// Water repellent effect for mackintosh
gen('materials', 'nerio.svg', materialPlaceholder('Nerio', '#1B6B6D', '#2E8B8B'));
gen('materials', 'basic.svg', materialPlaceholder('Basic', '#555555', '#3D3D3D'));
gen('materials', 'solution-dyed-olefin.svg', materialPlaceholder('Solution-Dyed Olefin', '#6B6555', '#4A4538'));
gen('materials', 'fabric-water-repellent.svg', materialPlaceholder('Wasserabweisend', '#2C5F7C', '#4A8BAD', `
  <!-- Water drop symbols -->
  <circle cx="350" cy="170" r="6" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>
  <circle cx="400" cy="185" r="5" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
  <circle cx="450" cy="168" r="7" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" stroke-width="0.5"/>
`));

// ── Downloads ──
console.log('\n  Download images:');
gen('downloads', 'katalog-2027.svg', downloadPlaceholder('Katalog 2027'));
gen('downloads', 'produktmasse.svg', downloadPlaceholder('Produktmaße'));
gen('downloads', 'pflege-garantie.svg', downloadPlaceholder('Pflege & Garantie'));
gen('downloads', 'technische-daten.svg', downloadPlaceholder('Technische Daten'));

// ── News ──
console.log('\n  News images:');
gen('news', 'kollektionen-2027.svg', newsPlaceholder('Kollektionen 2027', '#42523F', '#69785C'));
gen('news', 'mackintosh-technologie.svg', newsPlaceholder('Mackintosh® Technologie', '#6B5B4B', '#4A3C30'));
gen('news', 'nerio-oceana.svg', newsPlaceholder('NERIO · Oceana', '#1B6B6D', '#2E8B8B'));

// ── Detail / Textures ──
console.log('\n  Detail images:');
gen('detail', 'fabric-texture-green.svg', fabricTexture('green'));
gen('detail', 'fabric-texture-blue.svg', fabricTexture('blue'));
gen('detail', 'fabric-texture-red.svg', fabricTexture('red'));
gen('detail', 'fabric-texture-golden.svg', fabricTexture('golden'));
gen('detail', 'fabric-texture-earth-grey.svg', fabricTexture('earth-grey'));
gen('detail', 'outdoor-context-green.svg', outdoorContext('#42523F', '#69785C', 'Green Outdoor'));
gen('detail', 'outdoor-context-neutral.svg', outdoorContext('#8B7D6B', '#A69B8D', 'Neutral Outdoor'));

// ── Products: per-category ──
console.log('\n  Product (category) images:');
const productCategories = [
  ['dekokissen', 'Dekokissen'],
  ['hochlehner', 'Hochlehner'],
  ['niedriglehner', 'Niedriglehner'],
  ['sitzkissen', 'Sitzkissen'],
  ['sitzpolster', 'Sitzpolster'],
  ['bankauflagen', 'Bankauflagen'],
  ['poufs', 'Poufs'],
  ['tischsets-tischlaeufer', 'Tischsets'],
  ['decken', 'Decken'],
];
for (const [name, label] of productCategories) {
  gen('products', `${name}.svg`, productCategoryPlaceholder(name, label));
}

// ── Products: per-collection ──
console.log('\n  Product (collection) images:');
const productCollections = ['green', 'blue', 'red', 'golden', 'earth-grey', 'nerio-oceana', 'basic'];
for (const key of productCollections) {
  gen('products', `product-${key}.svg`, productCollectionPlaceholder(key));
}

// ── Collections: hero images (wide format) ──
console.log('\n  Collection hero images:');
for (const [key, file, label] of collectionDefs) {
  gen('collections/hero', file, collectionHeroPlaceholder(key, label));
}

// ── Subcategory hero images (collection + category) ──
console.log('\n  Subcategory hero images:');
for (const [colKey, colCats] of Object.entries(COLLECTION_CATEGORIES)) {
  for (const catSlug of colCats) {
    const label = `${COLLECTION_NAMES[colKey]} — ${CATEGORY_TITLES[catSlug]}`;
    gen('subcategories/hero', `${colKey}-${catSlug}.svg`, subcategoryHeroPlaceholder(colKey, catSlug, label));
  }
}

// ── Page hero images (1920x720 wide format) ──
console.log('\n  Page hero images:');
gen('page-heroes', 'kollektionen-hero.svg', pageHeroKollektionen());
gen('page-heroes', 'materialien-hero.svg', pageHeroMaterialien());
gen('page-heroes', 'ueber-uns-hero.svg', pageHeroUeberUns());
gen('page-heroes', 'kataloge-hero.svg', pageHeroKataloge());
gen('page-heroes', 'neuigkeiten-hero.svg', pageHeroNeuigkeiten());
gen('page-heroes', 'kontakt-hero.svg', pageHeroKontakt());
gen('page-heroes', 'default-hero.svg', pageHeroDefault());

// ── Summary ──
console.log(`\n  Done! Generated ${count} SVG files.`);
console.log(`  Output: ${BASE}\n`);
