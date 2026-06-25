import type { Locale } from "./config";

const dictionaries = {
  de: {
    nav: {
      collections: "Kollektionen",
      materials: "Materialien",
      aboutUs: "Über uns",
      catalogues: "Kataloge",
      news: "Neuigkeiten",
      contact: "Kontakt",
    },
    header: {
      skipToContent: "Zum Inhalt springen",
      home: "Startseite",
      closeMenu: "Menü schließen",
      openMenu: "Menü öffnen",
      contactCta: "Kontakt",
    },
    footer: {
      ctaEyebrow: "Beratung & Muster",
      ctaTitle: "Unsicher bei Farbe, Material oder Format?",
      ctaText:
        "Fordern Sie ein Musterset an oder lassen Sie sich persönlich zu Kollektionen, Materialien und Sondermaßen beraten.",
      ctaPrimary: "Muster anfordern",
      ctaSecondary: "Kataloge ansehen",
      contactTitle: "Kontakt",
      contactButton: "Kontakt aufnehmen",
      legalNotice: "Impressum",
      privacyPolicy: "Datenschutz",
      terms: "AGB",
      copyright: "Alle Rechte vorbehalten.",
    },
    contact: {
      formTitle: "Kontaktformular",
      firstName: "Vorname",
      lastName: "Nachname",
      email: "E-Mail",
      phone: "Telefon",
      company: "Unternehmen",
      interest: "Interesse",
      interestPlaceholder: "Bitte wählen",
      interestOptions: {
        muster: "Muster anfordern",
        beratung: "Beratung",
        fachhandel: "Fachhändler werden",
        hospitality: "Hospitality-Projekt",
        sonstiges: "Sonstiges",
      },
      message: "Nachricht",
      consent:
        "Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.",
      submit: "Nachricht senden",
      sending: "Wird gesendet…",
      successTitle: "Vielen Dank!",
      successText:
        "Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze.",
      errorGeneral:
        "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
      required: "Pflichtfeld",
      invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      selectRequired: "Bitte wählen Sie eine Option.",
      consentRequired: "Bitte stimmen Sie der Datenschutzerklärung zu.",
    },
    notFound: {
      title: "Seite nicht gefunden",
      description:
        "Die angeforderte Seite existiert nicht oder wurde verschoben.",
      suggestion:
        "Vielleicht finden Sie, was Sie suchen, auf einer dieser Seiten:",
      backHome: "Zur Startseite",
    },
    common: {
      learnMore: "Mehr erfahren",
      viewAll: "Alle ansehen",
      backToOverview: "Zurück zur Übersicht",
      requestSamples: "Muster anfordern",
      viewCatalogues: "Kataloge ansehen",
      discoverCollections: "Kollektionen entdecken",
      discoverMaterials: "Materialien entdecken",
      readMore: "Weiterlesen",
      country: "Deutschland",
    },
    legal: {
      translationDisclaimer: "",
    },
    fabricLibrary: {
      emptyState: "Noch keine Stoffe in der Bibliothek vorhanden.",
      all: "Alle",
      searchPlaceholder: "Stoff suchen (Name, Artikelnummer…)",
      searchAriaLabel: "Stoffe durchsuchen",
      filterByProductType: "Nach Produktart filtern",
      allProductTypes: "Alle Produktarten",
      gridView: "Kachelansicht",
      matrixView: "Matrixansicht",
      nerioLink: "Mehr zur NERIO Materialstory",
      fabricSingular: "Stoff",
      fabricPlural: "Stoffe",
      shown: "angezeigt",
      resetFilters: "Filter zurücksetzen",
      noFabricsFound: "Keine Stoffe gefunden.",
      showMore: "Mehr anzeigen...",
    },
  },
  en: {
    nav: {
      collections: "Collections",
      materials: "Materials",
      aboutUs: "About Us",
      catalogues: "Catalogues",
      news: "News",
      contact: "Contact",
    },
    header: {
      skipToContent: "Skip to content",
      home: "Home",
      closeMenu: "Close menu",
      openMenu: "Open menu",
      contactCta: "Contact",
    },
    footer: {
      ctaEyebrow: "Advice & Samples",
      ctaTitle: "Unsure about colour, material or size?",
      ctaText:
        "Request a sample set or get personal advice on collections, materials and custom dimensions.",
      ctaPrimary: "Request samples",
      ctaSecondary: "View catalogues",
      contactTitle: "Contact",
      contactButton: "Get in touch",
      legalNotice: "Legal Notice",
      privacyPolicy: "Privacy Policy",
      terms: "Terms & Conditions",
      copyright: "All rights reserved.",
    },
    contact: {
      formTitle: "Contact Form",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      interest: "Interest",
      interestPlaceholder: "Please select",
      interestOptions: {
        muster: "Request samples",
        beratung: "Consultation",
        fachhandel: "Become a retailer",
        hospitality: "Hospitality project",
        sonstiges: "Other",
      },
      message: "Message",
      consent:
        "I consent to the processing of my data in accordance with the privacy policy.",
      submit: "Send message",
      sending: "Sending…",
      successTitle: "Thank you!",
      successText:
        "Your message has been sent successfully. We will be in touch shortly.",
      errorGeneral:
        "An error occurred while sending. Please try again.",
      required: "Required field",
      invalidEmail: "Please enter a valid email address.",
      selectRequired: "Please select an option.",
      consentRequired: "Please accept the privacy policy.",
    },
    notFound: {
      title: "Page Not Found",
      description:
        "The requested page does not exist or has been moved.",
      suggestion:
        "You may find what you are looking for on one of these pages:",
      backHome: "Back to home",
    },
    common: {
      learnMore: "Learn more",
      viewAll: "View all",
      backToOverview: "Back to overview",
      requestSamples: "Request samples",
      viewCatalogues: "View catalogues",
      discoverCollections: "Discover collections",
      discoverMaterials: "Discover materials",
      readMore: "Read more",
      country: "Germany",
    },
    legal: {
      translationDisclaimer:
        "This English translation is provided for convenience only. The German version is legally binding.",
    },
    fabricLibrary: {
      emptyState: "No fabrics in the library yet.",
      all: "All",
      searchPlaceholder: "Search fabrics (name, article number…)",
      searchAriaLabel: "Search fabrics",
      filterByProductType: "Filter by product type",
      allProductTypes: "All product types",
      gridView: "Grid view",
      matrixView: "Matrix view",
      nerioLink: "More about the NERIO material story",
      fabricSingular: "fabric",
      fabricPlural: "fabrics",
      shown: "shown",
      resetFilters: "Reset filters",
      noFabricsFound: "No fabrics found.",
      showMore: "Show more...",
    },
  },
} as const;

export type Dictionary = (typeof dictionaries)["de"];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] as Dictionary;
}
