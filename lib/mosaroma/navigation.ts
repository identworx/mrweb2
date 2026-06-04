export interface NavLink {
  label: string;
  href: string;
}

export const mainNavLinks: NavLink[] = [
  { label: "Produktkategorien", href: "/produktkategorien" },
  { label: "Kollektionen", href: "/kollektionen" },
  { label: "Materialien", href: "/materialien" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kataloge", href: "/kataloge" },
  { label: "Neuigkeiten", href: "/neuigkeiten" },
];
