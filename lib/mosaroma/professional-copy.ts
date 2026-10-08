export interface ProfessionalCopy {
  seo: { title: string; description: string };
  hero: { eyebrow: string; title: string; description: string; buttonLabel: string; buttonHref: string };
  applications: { eyebrow: string; title: string; content: string; items: { title: string }[] };
  materials: { eyebrow: string; title: string; content: string; items: { title: string; description: string }[] };
  service: { eyebrow: string; title: string; content: string; items: { title: string; iconKey: string }[] };
  cta: { eyebrow: string; title: string; subtitle: string; content: string; buttonLabel: string; buttonHref: string };
}

export const professionalCopyDe: ProfessionalCopy = {
  seo: {
    title: "Stoffe für Sonnen- und Regenschutz | Mosaroma",
    description:
      "Solution-Dyed Outdoor-Textilien für Sonnensegel, Markisen und Schirme. Persönliche Beratung, Muster und kleine Mengen von Mosaroma in Oyten.",
  },
  hero: {
    eyebrow: "Mosaroma Professional",
    title: "Stoffe für Sonnen- und Regenschutz",
    description:
      "Solution-Dyed Outdoor-Textilien für professionelle Anwendungen. Beratung und Muster direkt aus Oyten.",
    buttonLabel: "Muster anfragen",
    buttonHref: "/kontakt",
  },
  applications: {
    eyebrow: "Anwendungen",
    title: "Materialien für Ihre Anwendung",
    content: "Für Hersteller, Verarbeiter und Objektausstatter.",
    items: [
      { title: "Sonnensegel" },
      { title: "Markisen & Schirme" },
      { title: "Outdoor-Projekte" },
    ],
  },
  materials: {
    eyebrow: "Materialien",
    title: "Solution-Dyed – Farbe in der Faser",
    content:
      "Bei Solution-Dyed-Garnen wird die Farbe schon vor dem Spinnen in die Faser eingebracht. So bleibt sie auch bei starker Sonneneinstrahlung und Bewitterung stabil.",
    items: [
      {
        title: "SDP | Solution-Dyed Polyester",
        description:
          "Hohe Reißfestigkeit, formstabil und UV-stabil. Geeignet für Sonnensegel und Markisen.",
      },
      {
        title: "Topgun | Solution-Dyed Olefin",
        description:
          "Sehr leicht, farbecht, wasserabweisend und schnell trocknend. Geeignet für Schirme und Möbel.",
      },
    ],
  },
  service: {
    eyebrow: "Service",
    title: "Persönliche Unterstützung aus Deutschland",
    content: "Wir begleiten Sie von der Materialwahl bis zur Bestellung.",
    items: [
      { title: "Materialauswahl & Muster", iconKey: "professional-samples" },
      { title: "Kleine Mengen auf Anfrage", iconKey: "professional-quantity" },
      { title: "Technische Abstimmung", iconKey: "professional-consulting" },
    ],
  },
  cta: {
    eyebrow: "Kontakt",
    title: "Direkt aus Oyten",
    subtitle: "Mosaroma Industries GmbH",
    content:
      "Schildern Sie uns Ihr Vorhaben. Wir beraten Sie zu Material, Mengen und Mustern.",
    buttonLabel: "Projekt besprechen",
    buttonHref: "/kontakt",
  },
};

export const professionalCopyEn: ProfessionalCopy = {
  seo: {
    title: "Fabrics for Sun and Rain Protection | Mosaroma",
    description:
      "Solution-dyed outdoor textiles for shade sails, awnings and parasols. Personal advice, samples and small quantities from Mosaroma in Oyten, Germany.",
  },
  hero: {
    eyebrow: "Mosaroma Professional",
    title: "Fabrics for Sun and Rain Protection",
    description:
      "Solution-dyed outdoor textiles for professional use. Advice and samples straight from Oyten.",
    buttonLabel: "Request samples",
    buttonHref: "/en/contact",
  },
  applications: {
    eyebrow: "Applications",
    title: "Materials for Your Application",
    content: "For manufacturers, fabricators and contract furnishers.",
    items: [
      { title: "Shade sails" },
      { title: "Awnings & parasols" },
      { title: "Outdoor projects" },
    ],
  },
  materials: {
    eyebrow: "Materials",
    title: "Solution-Dyed – Colour in the Fibre",
    content:
      "With solution-dyed yarns, the colour is added before the fibre is spun. It stays stable under strong sunlight and weathering.",
    items: [
      {
        title: "SDP | Solution-Dyed Polyester",
        description:
          "High tear strength, dimensionally stable and UV-resistant. Well suited to shade sails and awnings.",
      },
      {
        title: "Topgun | Solution-Dyed Olefin",
        description:
          "Very light, colourfast, water-repellent and quick-drying. Well suited to parasols and furniture.",
      },
    ],
  },
  service: {
    eyebrow: "Service",
    title: "Personal Support from Germany",
    content: "We help you from choosing a material to placing your order.",
    items: [
      { title: "Material selection & samples", iconKey: "professional-samples" },
      { title: "Small quantities on request", iconKey: "professional-quantity" },
      { title: "Technical consultation", iconKey: "professional-consulting" },
    ],
  },
  cta: {
    eyebrow: "Contact",
    title: "Straight from Oyten",
    subtitle: "Mosaroma Industries GmbH",
    content:
      "Tell us about your project. We will advise you on materials, quantities and samples.",
    buttonLabel: "Discuss your project",
    buttonHref: "/en/contact",
  },
};
