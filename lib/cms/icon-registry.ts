export interface IconSlotDefinition {
  key: string;
  label: string;
  description: string;
  groupName: string;
  defaultIcon: string;
  sizeHint: "xs" | "sm" | "md" | "lg" | "xl";
}

// ── Navigation ──────────────────────────────────────────────────────────────

const navigation: IconSlotDefinition[] = [
  {
    key: "arrow-right",
    label: "Pfeil rechts",
    description: "CTA- und Link-Pfeil (rechts)",
    groupName: "navigation",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 12h15m0 0l-5.5-5.5m5.5 5.5l-5.5 5.5"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "arrow-left",
    label: "Pfeil links",
    description: "Zurück-Pfeil (links)",
    groupName: "navigation",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.5 12h-15m0 0l5.5 5.5M4.5 12l5.5-5.5"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "chevron-right",
    label: "Chevron rechts",
    description: "Breadcrumb-Trenner und Navigations-Chevron",
    groupName: "navigation",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>`,
    sizeHint: "xs",
  },
  {
    key: "scroll-down",
    label: "Scroll-Indikator",
    description: "Animierter Scroll-Down-Pfeil im Hero",
    groupName: "navigation",
    defaultIcon: `<svg viewBox="0 0 16 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v14m0 0l-5-5m5 5l5-5"/></svg>`,
    sizeHint: "sm",
  },
];

// ── UI ──────────────────────────────────────────────────────────────────────

const ui: IconSlotDefinition[] = [
  {
    key: "checkmark",
    label: "Häkchen",
    description: "Listen-Häkchen für Highlights und Benefits",
    groupName: "ui",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "ui-search",
    label: "Suche",
    description: "Lupen-Icon im Suchfeld",
    groupName: "ui",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "ui-grid",
    label: "Kachelansicht",
    description: "Grid-View-Toggle in der Stoffbibliothek",
    groupName: "ui",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "ui-matrix",
    label: "Matrixansicht",
    description: "Matrix-/Tabellenansicht-Toggle in der Stoffbibliothek",
    groupName: "ui",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/><line x1="8" y1="3" x2="8" y2="21"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "ui-close",
    label: "Schließen",
    description: "Schließen-/X-Icon für Drawers und Modals",
    groupName: "ui",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "ui-flip",
    label: "Karte umdrehen",
    description: "Flip-/Swap-Icon für FabricPatternCard",
    groupName: "ui",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "ui-image-placeholder",
    label: "Bild-Platzhalter",
    description: "Platzhalter wenn kein Bild vorhanden",
    groupName: "ui",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><rect x="3" y="3" width="18" height="18"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "external-link",
    label: "Externer Link",
    description: "Icon für externe Links",
    groupName: "ui",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>`,
    sizeHint: "sm",
  },
];

// ── Homepage ────────────────────────────────────────────────────────────────

const homepage: IconSlotDefinition[] = [
  {
    key: "value-comfort",
    label: "Komfort",
    description: "Sonnen-Icon für Komfort-Wertversprechen",
    groupName: "homepage",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v1m0 16v1m-8-9H3m18 0h-1m-2.636-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"/></svg>`,
    sizeHint: "lg",
  },
  {
    key: "value-quality",
    label: "Qualität",
    description: "Schild-Icon für Qualitäts-Wertversprechen",
    groupName: "homepage",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
    sizeHint: "lg",
  },
  {
    key: "value-sustainability",
    label: "Verantwortung",
    description: "Globus-/Blatt-Icon für Nachhaltigkeit",
    groupName: "homepage",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    sizeHint: "lg",
  },
  {
    key: "value-design",
    label: "Design",
    description: "Palette-Icon für Design-Wertversprechen",
    groupName: "homepage",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125V7.5M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125H12m-5.25 0V7.5m0 0h5.25"/></svg>`,
    sizeHint: "lg",
  },
];

// ── Benefits ────────────────────────────────────────────────────────────────

const benefits: IconSlotDefinition[] = [
  {
    key: "benefit-sun",
    label: "UV-beständig",
    description: "Sonnen-Icon für UV-Beständigkeit",
    groupName: "benefits",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="5.5"/><path d="M16 5v3M16 24v3M5 16h3M24 16h3M8.5 8.5l2 2M21.5 21.5l2 2M8.5 23.5l2-2M21.5 10.5l2-2"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "benefit-droplet",
    label: "Wasserabweisend",
    description: "Tropfen-Icon für Wasserabweisung",
    groupName: "benefits",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 5C16 5 7 14.5 7 20a9 9 0 0018 0C25 14.5 16 5 16 5z"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "benefit-shield",
    label: "Schimmelfest",
    description: "Schild-Icon für Schimmelfestigkeit",
    groupName: "benefits",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3L5 8v7c0 7.5 4.7 14.5 11 17 6.3-2.5 11-9.5 11-17V8L16 3z"/><path d="M11 16l3.5 3.5L21 13"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "benefit-star",
    label: "Garantie",
    description: "Stern-Icon für 3 Jahre Garantie",
    groupName: "benefits",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4l3.2 6.5 7.1.9-5.15 4.9 1.25 7-6.4-3.5-6.4 3.5 1.25-7L5.7 11.4l7.1-.9z"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "benefit-fallback",
    label: "Benefit Fallback",
    description: "Standard-Fallback für unbekannte Benefit-Icons",
    groupName: "benefits",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="10"/><path d="M12 16l3 3 5-5"/></svg>`,
    sizeHint: "md",
  },
];

// ── NERIO ───────────────────────────────────────────────────────────────────

const nerio: IconSlotDefinition[] = [
  {
    key: "nerio-recycle",
    label: "NERIO Recycling",
    description: "Recycling-Pfeile für 50 % recyceltes Material",
    groupName: "nerio",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 7.5l4-4 4 4"/><path d="M11.5 3.5v10"/><path d="M19.4 15l-1.7 3H6.3l-1.7-3"/><path d="M3.5 12l2 3.5"/><path d="M20.5 12l-2 3.5"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "nerio-droplet",
    label: "NERIO PFAS-frei",
    description: "Tropfen-Icon für PFAS-freie Stoffe",
    groupName: "nerio",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "nerio-sun",
    label: "NERIO Spinndüsengefärbt",
    description: "Sonnen-Icon für Spinndüsenfärbung",
    groupName: "nerio",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "nerio-shield",
    label: "NERIO Langlebigkeit",
    description: "Schild-Icon für Langlebigkeit",
    groupName: "nerio",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "nerio-fabric-grid",
    label: "NERIO Stoffe-Karte",
    description: "Stoff-Grid-Icon für CTA-Karte",
    groupName: "nerio",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "nerio-collection-box",
    label: "NERIO Collection-Karte",
    description: "Box-Icon für Collection-CTA-Karte",
    groupName: "nerio",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    sizeHint: "md",
  },
];

// ── Service ─────────────────────────────────────────────────────────────────

const service: IconSlotDefinition[] = [
  {
    key: "service-ruler",
    label: "Produktmaße",
    description: "Lineal-Icon für Produktmaße-Seite",
    groupName: "service",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5.636 18.364L18.364 5.636a1 1 0 011.414 0l0 0a1 1 0 010 1.414L7.05 19.778a1 1 0 01-1.414 0l0 0a1 1 0 010-1.414z"/><path d="M8.464 15.536l2-2M11.293 12.707l2-2M14.121 9.879l2-2"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "service-shield",
    label: "Pflege & Garantie",
    description: "Schild-Icon für Pflege- und Garantie-Seite",
    groupName: "service",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z"/><path d="M9 12l2 2 4-4"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "service-fabric",
    label: "Stoff-technische Daten",
    description: "Dokument-Icon für technische Daten",
    groupName: "service",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 10h16M4 14h10M4 18h6"/><circle cx="18" cy="16" r="3"/></svg>`,
    sizeHint: "md",
  },
];

// ── Social ──────────────────────────────────────────────────────────────────

const social: IconSlotDefinition[] = [
  {
    key: "social-facebook",
    label: "Facebook",
    description: "Facebook-Icon im Footer",
    groupName: "social",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "social-instagram",
    label: "Instagram",
    description: "Instagram-Icon im Footer",
    groupName: "social",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "social-pinterest",
    label: "Pinterest",
    description: "Pinterest-Icon im Footer",
    groupName: "social",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "social-youtube",
    label: "YouTube",
    description: "YouTube-Icon im Footer",
    groupName: "social",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "social-linkedin",
    label: "LinkedIn",
    description: "LinkedIn-Icon im Footer",
    groupName: "social",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
    sizeHint: "sm",
  },
];

// ── Contact ─────────────────────────────────────────────────────────────────

const contact: IconSlotDefinition[] = [
  {
    key: "contact-email",
    label: "E-Mail",
    description: "Briefumschlag-Icon für E-Mail-Kontakt",
    groupName: "contact",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "contact-globe",
    label: "Website",
    description: "Globus-Icon für Website-Link",
    groupName: "contact",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
    sizeHint: "sm",
  },
  {
    key: "contact-clock",
    label: "Geschäftszeiten",
    description: "Uhr-Icon für Geschäftszeiten",
    groupName: "contact",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    sizeHint: "sm",
  },
];

// ── Downloads ───────────────────────────────────────────────────────────────

const downloads: IconSlotDefinition[] = [
  {
    key: "download-pdf",
    label: "PDF-Dokument",
    description: "PDF-/Dokument-Icon für Download-Karten",
    groupName: "downloads",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z"/><path d="M14 4v5h5"/><path d="M9 13h6m-6 3h4"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "download-book",
    label: "Katalog",
    description: "Buch-Icon für Download-Teaser auf Homepage",
    groupName: "downloads",
    defaultIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/></svg>`,
    sizeHint: "md",
  },
];

// ── Care ────────────────────────────────────────────────────────────────────

const care: IconSlotDefinition[] = [
  {
    key: "care-wash-30",
    label: "Waschen 30°",
    description: "Wäschesymbol: 30°C waschen",
    groupName: "care",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h24v18a2 2 0 01-2 2H6a2 2 0 01-2-2V8z"/><path d="M4 8l3-4h18l3 4"/><line x1="4" y1="14" x2="28" y2="14"/><text x="16" y="22" text-anchor="middle" font-size="7" fill="currentColor" stroke="none">30°</text></svg>`,
    sizeHint: "md",
  },
  {
    key: "care-bleach-dilute",
    label: "Bleichen verdünnt",
    description: "Wäschesymbol: nur verdünntes Bleichen",
    groupName: "care",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 26L16 6l12 20H4z"/><line x1="9" y1="18" x2="23" y2="18"/><line x1="11" y1="22" x2="21" y2="22"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "care-no-dryer",
    label: "Kein Trockner",
    description: "Wäschesymbol: nicht in den Trockner",
    groupName: "care",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="24" height="24" rx="2"/><circle cx="16" cy="16" r="8"/><line x1="6" y1="6" x2="26" y2="26"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "care-line-dry",
    label: "Leine trocknen",
    description: "Wäschesymbol: an der Leine trocknen",
    groupName: "care",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="24" height="24" rx="2"/><line x1="16" y1="8" x2="16" y2="24"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "care-no-heat",
    label: "Keine Hitze",
    description: "Wäschesymbol: keine Hitze/Bügeln",
    groupName: "care",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="14" r="6"/><path d="M10 22h12"/><path d="M12 25h8"/><line x1="6" y1="6" x2="26" y2="26"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "care-print",
    label: "Drucken",
    description: "Drucker-Icon für Pflegehinweis-Druck",
    groupName: "care",
    defaultIcon: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6V1h8v5"/><path d="M4 12H2V7h12v5h-2"/><rect x="4" y="10" width="8" height="5"/></svg>`,
    sizeHint: "sm",
  },
];

// ── Categories ──────────────────────────────────────────────────────────────

const categories: IconSlotDefinition[] = [
  {
    key: "category-dekokissen",
    label: "Dekokissen",
    description: "Produktkategorie-Icon: Dekokissen",
    groupName: "categories",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="24" height="12" rx="3"/><path d="M8 14c4 4 12 4 16 0"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "category-hochlehner",
    label: "Hochlehner",
    description: "Produktkategorie-Icon: Hochlehner",
    groupName: "categories",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="3" width="16" height="26" rx="1"/><line x1="8" y1="20" x2="24" y2="20"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "category-niedriglehner",
    label: "Niedriglehner",
    description: "Produktkategorie-Icon: Niedriglehner",
    groupName: "categories",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="8" width="20" height="21" rx="1"/><line x1="6" y1="20" x2="26" y2="20"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "category-sitzkissen",
    label: "Sitzkissen",
    description: "Produktkategorie-Icon: Sitzkissen",
    groupName: "categories",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="14" width="22" height="10" rx="2"/><path d="M7 14c0-2 3-4 9-4s9 2 9 4"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "category-sitzpolster",
    label: "Sitzpolster",
    description: "Produktkategorie-Icon: Sitzpolster",
    groupName: "categories",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="16" width="24" height="8" rx="2"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "category-bankauflagen",
    label: "Bankauflagen",
    description: "Produktkategorie-Icon: Bankauflagen",
    groupName: "categories",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="14" width="28" height="8" rx="1"/><line x1="6" y1="22" x2="6" y2="28"/><line x1="26" y1="22" x2="26" y2="28"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "category-poufs",
    label: "Poufs",
    description: "Produktkategorie-Icon: Poufs",
    groupName: "categories",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="16" cy="20" rx="12" ry="5"/><path d="M4 20c0-6 5.4-14 12-14s12 8 12 14"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "category-tischsets",
    label: "Tischsets & Tischläufer",
    description: "Produktkategorie-Icon: Tischsets und Tischläufer",
    groupName: "categories",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="26" height="16" rx="1"/><line x1="13" y1="8" x2="13" y2="24" stroke-dasharray="2 2"/><line x1="19" y1="8" x2="19" y2="24" stroke-dasharray="2 2"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "category-decken",
    label: "Decken",
    description: "Produktkategorie-Icon: Decken",
    groupName: "categories",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="24" height="24" rx="1"/><path d="M4 4l6 6M28 4l-6 6M4 28l6-6M28 28l-6-6"/></svg>`,
    sizeHint: "md",
  },
  {
    key: "category-default",
    label: "Kategorie Standard",
    description: "Fallback-Icon für unbekannte Kategorien",
    groupName: "categories",
    defaultIcon: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="24" height="24" rx="1"/></svg>`,
    sizeHint: "md",
  },
];

// ── Full Registry ───────────────────────────────────────────────────────────

export const ICON_REGISTRY: IconSlotDefinition[] = [
  ...navigation,
  ...ui,
  ...homepage,
  ...benefits,
  ...nerio,
  ...service,
  ...social,
  ...contact,
  ...downloads,
  ...care,
  ...categories,
];

export const ICON_GROUPS = [
  { key: "navigation", label: "Navigation" },
  { key: "ui", label: "UI-Elemente" },
  { key: "homepage", label: "Homepage" },
  { key: "benefits", label: "Vorteile & Benefits" },
  { key: "nerio", label: "NERIO" },
  { key: "service", label: "Service-Seiten" },
  { key: "social", label: "Social Media" },
  { key: "contact", label: "Kontakt" },
  { key: "downloads", label: "Downloads" },
  { key: "care", label: "Pflege-Symbole" },
  { key: "categories", label: "Produktkategorien" },
] as const;

export function getRegistrySlot(key: string): IconSlotDefinition | undefined {
  return ICON_REGISTRY.find((s) => s.key === key);
}

export function getRegistrySlotsByGroup(groupName: string): IconSlotDefinition[] {
  return ICON_REGISTRY.filter((s) => s.groupName === groupName);
}
