export const LINK_TYPES = [
  { value: "PAGE", label: "CMS-Seite" },
  { value: "SYSTEM_ROUTE", label: "Systemroute" },
  { value: "CUSTOM_URL", label: "Freie URL" },
] as const;

export const SYSTEM_ROUTES = [
  { path: "/", label: "Startseite" },
  { path: "/kollektionen", label: "Kollektionen" },
  { path: "/materialien", label: "Materialien" },
  { path: "/ueber-uns", label: "Über uns" },
  { path: "/kataloge", label: "Kataloge" },
  { path: "/kataloge/produktmasse", label: "Produktmaße" },
  { path: "/kataloge/pflege-garantie", label: "Pflege & Garantie" },
  { path: "/kataloge/stoff-technische-daten", label: "Stoff- & technische Daten" },
  { path: "/neuigkeiten", label: "Neuigkeiten" },
  { path: "/kontakt", label: "Kontakt" },
  { path: "/produktkategorien", label: "Produktkategorien" },
] as const;

export type LinkType = "PAGE" | "SYSTEM_ROUTE" | "CUSTOM_URL";
