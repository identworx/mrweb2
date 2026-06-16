export interface NavLink {
  label: string;
  href: string;
}

export const mainNavLinks: NavLink[] = [
  { label: "Kollektionen", href: "/kollektionen" },
  { label: "NERIO", href: "/nerio" },
  { label: "Materialien", href: "/materialien" },
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Kataloge", href: "/kataloge" },
  { label: "Neuigkeiten", href: "/neuigkeiten" },
  { label: "Kontakt", href: "/kontakt" },
];
