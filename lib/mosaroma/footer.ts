export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterData {
  brand: {
    description: string;
  };
  columns: FooterColumn[];
  legal: FooterLink[];
}

export const footerData: FooterData = {
  brand: {
    description:
      "Design trifft Performance. Hochwertige Outdoor-Textilien für langlebige Momente im Freien.",
  },
  columns: [
    {
      title: "Produktkategorien",
      links: [
        { label: "Dekokissen", href: "/produktkategorien/dekokissen" },
        { label: "Hochlehner", href: "/produktkategorien/hochlehner" },
        { label: "Niedriglehner", href: "/produktkategorien/niedriglehner" },
        { label: "Sitzkissen", href: "/produktkategorien/sitzkissen" },
        { label: "Sitzpolster", href: "/produktkategorien/sitzpolster" },
        { label: "Bankauflagen", href: "/produktkategorien/bankauflagen" },
        { label: "Poufs", href: "/produktkategorien/poufs" },
        {
          label: "Tischsets & Tischläufer",
          href: "/produktkategorien/tischsets-tischlaeufer",
        },
        { label: "Decken", href: "/produktkategorien/decken" },
      ],
    },
    {
      title: "Kollektionen",
      links: [
        { label: "Green", href: "/kollektionen/green" },
        { label: "Blue", href: "/kollektionen/blue" },
        { label: "Red", href: "/kollektionen/red" },
        { label: "Golden", href: "/kollektionen/golden" },
        { label: "Earth & Grey", href: "/kollektionen/earth-grey" },
        { label: "NERIO · Oceana", href: "/kollektionen/nerio-oceana" },
        { label: "Basic", href: "/kollektionen/basic" },
      ],
    },
    {
      title: "Service",
      links: [
        { label: "Kataloge", href: "/kataloge" },
        { label: "Produktmaße", href: "/kataloge" },
        { label: "Pflege & Garantie", href: "/kataloge" },
        { label: "Stoff- & technische Daten", href: "/kataloge" },
        { label: "Kontakt", href: "/kontakt" },
      ],
    },
  ],
  legal: [
    { label: "Impressum", href: "#" }, // TODO: finale URL einsetzen
    { label: "Datenschutz", href: "#" }, // TODO: finale URL einsetzen
    { label: "Allgemeine Geschäftsbedingungen", href: "#" }, // TODO: finale URL einsetzen
    { label: "Cookie-Einstellungen", href: "#" }, // TODO: finale URL einsetzen
  ],
};
