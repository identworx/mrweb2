/**
 * Backfill ContentTranslation records from dictionary, product-type
 * translations and hardcoded EN page content.
 *
 * Idempotent: upserts on (entityType, entityId, fieldName, locale).
 * - New entries are created with status PUBLISHED.
 * - Existing entries: sourceText is updated if the German original changed
 *   (status set to STALE); translatedText is NOT overwritten if non-empty.
 *
 * Usage:
 *   npx tsx scripts/backfill-content-translations.ts          # dry-run
 *   npx tsx scripts/backfill-content-translations.ts --apply   # write to DB
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const raw = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: raw });
const prisma = new PrismaClient({ adapter });

const apply = process.argv.includes("--apply");
const dryRun = !apply;

interface TranslationEntry {
  entityType: string;
  entityId: string;
  fieldName: string;
  sourceText: string;
  translatedText: string;
}

const entries: TranslationEntry[] = [];

function add(
  entityType: string,
  entityId: string,
  fieldName: string,
  sourceText: string,
  translatedText: string,
) {
  if (!translatedText) return;
  entries.push({ entityType, entityId, fieldName, sourceText, translatedText });
}

/* ------------------------------------------------------------------ */
/*  1. Dictionary: nav                                                */
/* ------------------------------------------------------------------ */

add("dictionary", "nav", "collections", "Kollektionen", "Collections");
add("dictionary", "nav", "materials", "Materialien", "Materials");
add("dictionary", "nav", "aboutUs", "Über uns", "About Us");
add("dictionary", "nav", "catalogues", "Kataloge", "Catalogues");
add("dictionary", "nav", "news", "Neuigkeiten", "News");
add("dictionary", "nav", "contact", "Kontakt", "Contact");

/* ------------------------------------------------------------------ */
/*  2. Dictionary: header                                             */
/* ------------------------------------------------------------------ */

add("dictionary", "header", "skipToContent", "Zum Inhalt springen", "Skip to content");
add("dictionary", "header", "home", "Startseite", "Home");
add("dictionary", "header", "closeMenu", "Menü schließen", "Close menu");
add("dictionary", "header", "openMenu", "Menü öffnen", "Open menu");
add("dictionary", "header", "contactCta", "Kontakt", "Contact");

/* ------------------------------------------------------------------ */
/*  3. Dictionary: footer                                             */
/* ------------------------------------------------------------------ */

add("dictionary", "footer", "ctaEyebrow", "Beratung & Muster", "Advice & Samples");
add("dictionary", "footer", "ctaTitle", "Unsicher bei Farbe, Material oder Format?", "Unsure about colour, material or size?");
add("dictionary", "footer", "ctaText", "Fordern Sie ein Musterset an oder lassen Sie sich persönlich zu Kollektionen, Materialien und Sondermaßen beraten.", "Request a sample set or get personal advice on collections, materials and custom dimensions.");
add("dictionary", "footer", "ctaPrimary", "Muster anfordern", "Request samples");
add("dictionary", "footer", "ctaSecondary", "Kataloge ansehen", "View catalogues");
add("dictionary", "footer", "contactTitle", "Kontakt", "Contact");
add("dictionary", "footer", "contactButton", "Kontakt aufnehmen", "Get in touch");
add("dictionary", "footer", "legalNotice", "Impressum", "Legal Notice");
add("dictionary", "footer", "privacyPolicy", "Datenschutz", "Privacy Policy");
add("dictionary", "footer", "terms", "AGB", "Terms & Conditions");
add("dictionary", "footer", "copyright", "Alle Rechte vorbehalten.", "All rights reserved.");

/* ------------------------------------------------------------------ */
/*  4. Dictionary: contact form                                       */
/* ------------------------------------------------------------------ */

add("dictionary", "contact", "formTitle", "Kontaktformular", "Contact Form");
add("dictionary", "contact", "firstName", "Vorname", "First Name");
add("dictionary", "contact", "lastName", "Nachname", "Last Name");
add("dictionary", "contact", "email", "E-Mail", "Email");
add("dictionary", "contact", "phone", "Telefon", "Phone");
add("dictionary", "contact", "company", "Unternehmen", "Company");
add("dictionary", "contact", "interest", "Interesse", "Interest");
add("dictionary", "contact", "interestPlaceholder", "Bitte wählen", "Please select");
add("dictionary", "contact", "interest.muster", "Muster anfordern", "Request samples");
add("dictionary", "contact", "interest.beratung", "Beratung", "Consultation");
add("dictionary", "contact", "interest.fachhandel", "Fachhändler werden", "Become a retailer");
add("dictionary", "contact", "interest.hospitality", "Hospitality-Projekt", "Hospitality project");
add("dictionary", "contact", "interest.sonstiges", "Sonstiges", "Other");
add("dictionary", "contact", "message", "Nachricht", "Message");
add("dictionary", "contact", "consent", "Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu.", "I consent to the processing of my data in accordance with the privacy policy.");
add("dictionary", "contact", "submit", "Nachricht senden", "Send message");
add("dictionary", "contact", "sending", "Wird gesendet…", "Sending…");
add("dictionary", "contact", "successTitle", "Vielen Dank!", "Thank you!");
add("dictionary", "contact", "successText", "Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze.", "Your message has been sent successfully. We will be in touch shortly.");
add("dictionary", "contact", "errorGeneral", "Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.", "An error occurred while sending. Please try again.");
add("dictionary", "contact", "required", "Pflichtfeld", "Required field");
add("dictionary", "contact", "invalidEmail", "Bitte geben Sie eine gültige E-Mail-Adresse ein.", "Please enter a valid email address.");
add("dictionary", "contact", "selectRequired", "Bitte wählen Sie eine Option.", "Please select an option.");
add("dictionary", "contact", "consentRequired", "Bitte stimmen Sie der Datenschutzerklärung zu.", "Please accept the privacy policy.");

/* ------------------------------------------------------------------ */
/*  5. Dictionary: 404 page                                          */
/* ------------------------------------------------------------------ */

add("dictionary", "notFound", "title", "Seite nicht gefunden", "Page Not Found");
add("dictionary", "notFound", "description", "Die angeforderte Seite existiert nicht oder wurde verschoben.", "The requested page does not exist or has been moved.");
add("dictionary", "notFound", "suggestion", "Vielleicht finden Sie, was Sie suchen, auf einer dieser Seiten:", "You may find what you are looking for on one of these pages:");
add("dictionary", "notFound", "backHome", "Zur Startseite", "Back to home");

/* ------------------------------------------------------------------ */
/*  6. Dictionary: common UI                                          */
/* ------------------------------------------------------------------ */

add("dictionary", "common", "learnMore", "Mehr erfahren", "Learn more");
add("dictionary", "common", "viewAll", "Alle ansehen", "View all");
add("dictionary", "common", "backToOverview", "Zurück zur Übersicht", "Back to overview");
add("dictionary", "common", "requestSamples", "Muster anfordern", "Request samples");
add("dictionary", "common", "viewCatalogues", "Kataloge ansehen", "View catalogues");
add("dictionary", "common", "discoverCollections", "Kollektionen entdecken", "Discover collections");
add("dictionary", "common", "discoverMaterials", "Materialien entdecken", "Discover materials");
add("dictionary", "common", "readMore", "Weiterlesen", "Read more");
add("dictionary", "common", "country", "Deutschland", "Germany");

/* ------------------------------------------------------------------ */
/*  7. Dictionary: legal disclaimer                                   */
/* ------------------------------------------------------------------ */

add("dictionary", "legal", "translationDisclaimer", "", "This English translation is provided for convenience only. The German version is legally binding.");

/* ------------------------------------------------------------------ */
/*  8. Product type translations                                      */
/* ------------------------------------------------------------------ */

add("productType", "", "Hochlehner", "Hochlehner", "High-back Cushion");
add("productType", "", "Niedriglehner", "Niedriglehner", "Low-back Cushion");
add("productType", "", "Sitzkissen", "Sitzkissen", "Seat Cushion");
add("productType", "", "Bankauflage", "Bankauflage", "Bench Cushion");
add("productType", "", "Dekokissen", "Dekokissen", "Decorative Cushion");
add("productType", "", "Tischset", "Tischset", "Placemat");
add("productType", "", "Tischläufer", "Tischläufer", "Table Runner");
add("productType", "", "Decke", "Decke", "Blanket");
add("productType", "", "Pouf", "Pouf", "Pouf");

/* ------------------------------------------------------------------ */
/*  9. Homepage sections                                              */
/* ------------------------------------------------------------------ */

add("homepage", "hero", "eyebrow", "Hochwertige Outdoor-Textilien", "Premium Outdoor Textiles");
add("homepage", "hero", "title", "Design trifft\nPerformance.", "Design Meets\nPerformance.");
add("homepage", "hero", "content", "Mosaroma verbindet anspruchsvolles Design, langlebige Materialien und zuverlässige Outdoor-Performance für Garten, Terrasse, Hospitality und Fachhandel.", "Mosaroma combines sophisticated design, durable materials and reliable outdoor performance for garden, terrace, hospitality and trade.");
add("homepage", "hero", "subheadline", "Hochwertige Outdoor-Textilien für Räume und Momente, die bleiben.", "Premium outdoor textiles for spaces and moments that last.");
add("homepage", "hero", "buttonLabel", "Kollektionen entdecken", "Discover collections");
add("homepage", "hero", "secondaryLabel", "Katalog ansehen", "View catalogue");

add("homepage", "value-props", "eyebrow", "Warum Mosaroma", "Why Mosaroma");
add("homepage", "value-props", "title", "Was uns ausmacht.", "What Sets Us Apart.");
add("homepage", "value-props", "buttonLabel", "Mehr über Mosaroma", "More about Mosaroma");
add("homepage", "value-props", "card.comfort.title", "Komfort", "Comfort");
add("homepage", "value-props", "card.comfort.text", "Formstabile Polsterung und ergonomische Passformen für entspannte Stunden im Freien.", "Dimensionally stable padding and ergonomic fits for relaxed hours outdoors.");
add("homepage", "value-props", "card.quality.title", "Qualität", "Quality");
add("homepage", "value-props", "card.quality.text", "Spinndüsengefärbte Fasern, UV-beständig und farbecht — für Jahre, nicht Saisons.", "Solution-dyed fibres, UV-resistant and colourfast — built for years, not seasons.");
add("homepage", "value-props", "card.sustainability.title", "Verantwortung", "Responsibility");
add("homepage", "value-props", "card.sustainability.text", "Ressourcenschonende Fertigung mit 42 % weniger Wasser und 71 % Solarstrom.", "Resource-efficient production with 42% less water and 71% solar power.");
add("homepage", "value-props", "card.design.title", "Design", "Design");
add("homepage", "value-props", "card.design.text", "Sieben kuratierte Farbwelten und zeitlose Formen, die jedes Outdoor-Konzept veredeln.", "Seven curated colour worlds and timeless forms that elevate any outdoor concept.");

add("homepage", "technology", "eyebrow", "Material & Technologie", "Material & Technology");
add("homepage", "technology", "title", "Mackintosh® Technology.", "Mackintosh® Technology.");
add("homepage", "technology", "content", "Unsere Mackintosh®-Stoffe basieren auf spinndüsengefärbtem Olefin — die Farbe wird bereits bei der Faserherstellung eingebracht. Das Ergebnis: außergewöhnliche Lichtechtheit, UV-Beständigkeit und eine niedrige CO₂-Bilanz.", "Our Mackintosh® fabrics are based on solution-dyed olefin — the colour is introduced during fibre production itself. The result: exceptional lightfastness, UV resistance and a low carbon footprint.");
add("homepage", "technology", "buttonLabel", "Materialien entdecken", "Discover materials");
add("homepage", "technology", "bullet.1", "Solution-Dyed Olefin — Farbe in der Faser", "Solution-Dyed Olefin — colour in the fibre");
add("homepage", "technology", "bullet.2", "Wasserabweisend & schnelltrocknend", "Water-repellent & quick-drying");
add("homepage", "technology", "bullet.3", "100 % outdoor-tauglich", "100% outdoor-suitable");
add("homepage", "technology", "bullet.4", "Langlebig & pflegeleicht", "Durable & easy to maintain");
add("homepage", "technology", "bullet.5", "Nachhaltig in der Herstellung", "Sustainably manufactured");

add("homepage", "collections", "eyebrow", "Farbwelten", "Colour Worlds");
add("homepage", "collections", "title", "Kollektionen.", "Collections.");
add("homepage", "collections", "content", "Sieben kuratierte Farbwelten für die Saison 2027 — von frischem Grün bis zur nachhaltigen NERIO Oceana Linie.", "Seven curated colour worlds for the 2027 season — from fresh greens to the sustainable NERIO Oceana line.");
add("homepage", "collections", "buttonLabel", "Alle Kollektionen ansehen", "View all collections");

add("homepage", "sustainability", "eyebrow", "Nachhaltigkeit", "Sustainability");
add("homepage", "sustainability", "title", "Grün gewebt. Vom Tropfen an.", "Green by Design. From the First Thread.");
add("homepage", "sustainability", "content", "Spinndüsengefärbtes Polypropylen spart im Vergleich zu konventionell gefärbten Fasern erheblich Wasser, Energie und CO₂.", "Solution-dyed polypropylene saves significant amounts of water, energy and CO₂ compared to conventionally dyed fibres.");
add("homepage", "sustainability", "buttonLabel", "Mehr zur Verantwortung", "More on responsibility");
add("homepage", "sustainability", "stat.water.label", "weniger Wasser", "less water");
add("homepage", "sustainability", "stat.water.detail", "im Färbeprozess gegenüber konventionellen Verfahren", "in the dyeing process compared to conventional methods");
add("homepage", "sustainability", "stat.chemicals.label", "weniger Chemie", "fewer chemicals");
add("homepage", "sustainability", "stat.chemicals.detail", "durch spinndüsengefärbte Fasern ohne Nachbehandlung", "through solution-dyed fibres without post-treatment");
add("homepage", "sustainability", "stat.solar.label", "Solarstrom", "solar power");
add("homepage", "sustainability", "stat.solar.detail", "unserer Fertigung läuft mit Photovoltaik-Energie", "of our production runs on photovoltaic energy");

add("homepage", "downloads", "eyebrow", "Downloads", "Downloads");
add("homepage", "downloads", "title", "Kataloge & Dokumente.", "Catalogues & Documents.");
add("homepage", "downloads", "content", "Alle wichtigen Unterlagen zum Download — Produktkatalog, Maße und Pflegehinweise.", "All essential documents available for download — product catalogue, dimensions and care instructions.");
add("homepage", "downloads", "buttonLabel", "Alle Downloads ansehen", "View all downloads");

add("homepage", "news", "eyebrow", "Neuigkeiten", "News");
add("homepage", "news", "title", "Aktuelles.", "Latest News.");
add("homepage", "news", "content", "Neues aus der Welt von Mosaroma — Kollektionen, Materialien und mehr.", "Updates from the world of Mosaroma — collections, materials and more.");

add("homepage", "cta", "title", "Bereit für Ihre Outdoor-Saison?", "Ready for Your Outdoor Space?");
add("homepage", "cta", "description", "Fordern Sie ein Musterset an oder lassen Sie sich persönlich zu Kollektionen, Materialien und Sondermaßen beraten.", "Request a sample set or get personal advice on collections, materials and custom dimensions.");
add("homepage", "cta", "primaryLabel", "Muster anfordern", "Request samples");
add("homepage", "cta", "secondaryLabel", "Kataloge ansehen", "View catalogues");

/* ------------------------------------------------------------------ */
/*  10. About page                                                    */
/* ------------------------------------------------------------------ */

add("page", "about-us", "seoTitle", "Über uns | Mosaroma", "About Us | Mosaroma");
add("page", "about-us", "seoDescription", "Seit Generationen entwickeln und produzieren wir hochwertige Outdoor-Textilien. Design, Leistungsfähigkeit und verantwortungsvolles Handeln — das ist MOSAROMA.", "For generations, we have been developing and producing premium outdoor textiles. Design, performance and responsible practice — that is MOSAROMA.");
add("page", "about-us", "introText.1", "Seit Generationen entwickeln und produzieren wir hochwertige Outdoor-Textilien und Produkte. Wir verbinden anspruchsvolles Design, hohe Leistungsfähigkeit und verantwortungsvolles Handeln.", "For generations, we have been developing and producing premium outdoor textiles and products. We combine ambitious design, high performance and responsible practice.");
add("page", "about-us", "introText.2", "Wir sind überzeugt, dass Outdoor-Textilien weit mehr leisten müssen als reine Funktionalität. Sie sollen Behaglichkeit, Entspannung und Wohlbefinden schaffen.", "We are convinced that outdoor textiles must deliver far more than mere functionality. They should create comfort, relaxation and well-being.");
add("page", "about-us", "sectionTitle.promises", "Was uns antreibt.", "What Drives Us.");
add("page", "about-us", "promise.comfort.title", "Komfort", "Comfort");
add("page", "about-us", "promise.comfort.text", "Weiche Haptik, langlebige Qualität und zeitloses Design für entspannte Momente im Freien.", "Soft touch, durable quality and timeless design for relaxed moments outdoors.");
add("page", "about-us", "promise.quality.title", "Qualität", "Quality");
add("page", "about-us", "promise.quality.text", "Hochwertige Materialien und die Mackintosh® Inside Technology sorgen für dauerhaften Schutz vor Sonne, Regen und Schmutz.", "Premium materials and Mackintosh® Inside Technology provide lasting protection against sun, rain and dirt.");
add("page", "about-us", "promise.responsibility.title", "Verantwortung", "Responsibility");
add("page", "about-us", "promise.responsibility.text", "Wir entwickeln langlebige Produkte mit einem bewussten Umgang mit Ressourcen.", "We develop long-lasting products with a conscious approach to resources.");
add("page", "about-us", "promise.design.title", "Design", "Design");
add("page", "about-us", "promise.design.text", "Klare Formen und eine zeitlose Ästhetik schaffen Produkte, die sich harmonisch in jede Umgebung einfügen.", "Clean forms and timeless aesthetics create products that blend harmoniously into any setting.");
add("page", "about-us", "sectionTitle.sustainability", "Grün gewebt. Vom Tropfen an.", "Green by Design. From the First Thread.");
add("page", "about-us", "sustainability.text", "Spinndüsengefärbtes Polypropylen (PP) spart im Vergleich zu konventionell gefärbten Fasern erheblich Wasser, Energie und CO₂.", "Solution-dyed polypropylene (PP) saves significant water, energy and CO₂ compared to conventionally dyed fibres.");
add("page", "about-us", "stat.water", "weniger Wasser", "less water");
add("page", "about-us", "stat.chemicals", "weniger Chemie", "fewer chemicals");
add("page", "about-us", "stat.solar", "Solarstrom", "solar power");
add("page", "about-us", "sectionTitle.warranty", "3 Jahre Garantie.", "3-Year Warranty.");
add("page", "about-us", "warranty.text", "Wir bieten eine 3-jährige Garantie auf alle Mosaroma Bezugsstoffe — Schutz gegen Festigkeits- oder Farbverlust, Pilling und Abrieb bei normalem Gebrauch und Witterung.", "We offer a 3-year warranty on all Mosaroma cover fabrics — protection against loss of strength or colour, pilling and abrasion from normal use and weather conditions.");
add("page", "about-us", "cta.title", "Bereit für Ihr nächstes Projekt?", "Ready for Your Next Project?");
add("page", "about-us", "cta.description", "Ob Fachhandel, Hospitality oder Gastronomie — wir beraten Sie persönlich zu Kollektionen, Materialien und individuellen Lösungen.", "Whether retail, hospitality or gastronomy — we advise you personally on collections, materials and individual solutions.");
add("page", "about-us", "cta.primaryLabel", "Kontakt aufnehmen", "Get in touch");
add("page", "about-us", "cta.secondaryLabel", "Kollektionen entdecken", "Discover collections");

/* ------------------------------------------------------------------ */
/*  11. SEO metadata for public pages                                 */
/* ------------------------------------------------------------------ */

add("page", "home", "seoTitle", "Mosaroma | Design trifft Performance", "Mosaroma | Design Meets Performance");
add("page", "home", "seoDescription", "Hochwertige Outdoor-Textilien, Sitzauflagen, Kissen, Poufs und Kollektionen für Garten, Terrasse, Hospitality und Fachhandel.", "Premium outdoor textiles, seat cushions, decorative cushions, poufs and collections for garden, terrace, hospitality and trade.");

add("page", "collections", "seoTitle", "Kollektionen | Mosaroma", "Collections | Mosaroma");
add("page", "collections", "seoDescription", "Entdecken Sie alle Mosaroma Farbwelten.", "Discover all Mosaroma colour worlds.");

add("page", "materials", "seoTitle", "Materialien | Mosaroma", "Materials | Mosaroma");
add("page", "materials", "seoDescription", "Alles über Mosaroma Materialien und Technologien.", "Everything about Mosaroma materials and technologies.");

add("page", "fabrics-samples", "seoTitle", "Stoffe & Muster | Mosaroma", "Fabrics & Samples | Mosaroma");
add("page", "fabrics-samples", "seoDescription", "Alle Mosaroma Stoffe und Muster. Filtern nach Stoffqualität, Produktart oder Artikelnummer.", "Discover all Mosaroma fabrics and samples. Filter by material family, product type or article number.");

add("page", "technical-data", "seoTitle", "Technische Daten | Mosaroma", "Technical Data | Mosaroma");
add("page", "technical-data", "seoDescription", "Technische Materialeigenschaften, Prüfwerte und Outdoor-Performance der Mosaroma Stoffqualitäten im Vergleich.", "Technical material properties, test values and outdoor performance of Mosaroma fabric qualities compared.");

add("page", "nerio", "seoTitle", "NERIO | Mosaroma", "NERIO | Mosaroma");
add("page", "nerio", "seoDescription", "NERIO — die nachhaltige Outdoor-Stofflinie aus recyceltem Ozean-Polypropylen.", "NERIO — the sustainable outdoor fabric line from recycled ocean polypropylene.");

add("page", "catalogues", "seoTitle", "Kataloge | Mosaroma", "Catalogues | Mosaroma");
add("page", "catalogues", "seoDescription", "Produktkatalog, Pflegehinweise und Maßübersicht zum Download.", "Product catalogue, care instructions and dimension overview for download.");

add("page", "product-dimensions", "seoTitle", "Produktmaße | Mosaroma", "Product Dimensions | Mosaroma");
add("page", "care-warranty", "seoTitle", "Pflege & Garantie | Mosaroma", "Care & Warranty | Mosaroma");
add("page", "fabric-technical-data", "seoTitle", "Stoff- & technische Daten | Mosaroma", "Fabric & Technical Data | Mosaroma");

add("page", "contact", "seoTitle", "Kontakt | Mosaroma", "Contact | Mosaroma");
add("page", "contact", "seoDescription", "Nehmen Sie Kontakt mit uns auf.", "Get in touch with us.");

add("page", "news", "seoTitle", "Neuigkeiten | Mosaroma", "News | Mosaroma");
add("page", "news", "seoDescription", "Aktuelle Nachrichten von Mosaroma.", "Latest news from Mosaroma.");

add("page", "product-categories", "seoTitle", "Produktkategorien | Mosaroma Outdoor-Textilien", "Product Categories | Mosaroma Outdoor Textiles");
add("page", "product-categories", "seoDescription", "Entdecken Sie Dekokissen, Hochlehner, Niedriglehner, Sitzkissen, Bankauflagen, Poufs, Tischsets und Decken von Mosaroma.", "Discover decorative cushions, high-back cushions, low-back cushions, seat cushions, bench cushions, poufs, placemats and blankets from Mosaroma.");

add("page", "ambiente", "seoTitle", "Ambiente Galerie | Mosaroma", "Ambiente Gallery | Mosaroma");
add("page", "ambiente", "seoDescription", "Mosaroma in echten Räumen — von mediterranen Innenhöfen bis Terrassen am Meer.", "Mosaroma in real spaces — from Mediterranean courtyards to seaside terraces.");

add("page", "legal-notice", "seoTitle", "Impressum | Mosaroma", "Legal Notice | Mosaroma");
add("page", "privacy-policy", "seoTitle", "Datenschutz | Mosaroma", "Privacy Policy | Mosaroma");
add("page", "terms", "seoTitle", "AGB | Mosaroma", "Terms & Conditions | Mosaroma");

/* ------------------------------------------------------------------ */
/*  12. Technical data page                                           */
/* ------------------------------------------------------------------ */

add("page", "technical-data", "sectionLabel.fabricQualities", "Stoffqualitäten", "Fabric Qualities");
add("page", "technical-data", "sectionTitle.materialWeight", "Material & Gewicht", "Material & Weight");
add("page", "technical-data", "sectionTitle.propertiesComparison", "Eigenschaften im Vergleich", "Properties Comparison");
add("page", "technical-data", "sectionTitle.mackintoshDetail", "Mackintosh® im Detail", "Mackintosh® in Detail");
add("page", "technical-data", "linkLabel.discoverMaterials", "Alle Materialien entdecken", "Discover all materials");
add("page", "technical-data", "cta.title", "Fragen zu Stoffen oder technischen Daten?", "Questions about fabrics or technical data?");
add("page", "technical-data", "cta.description", "Wir beraten Sie gerne zu Materialien, Prüfwerten und Stoffqualitäten.", "We are happy to advise you on materials, test values and fabric qualities.");

/* ------------------------------------------------------------------ */
/*  13. Technical data table labels                                   */
/* ------------------------------------------------------------------ */

add("technicalData", "table", "col.property", "Eigenschaft", "Property");
add("technicalData", "table", "col.standard", "Prüfnorm", "Test Standard");
add("technicalData", "table", "row.lightfastness", "Lichtechtheit", "Lightfastness");
add("technicalData", "table", "row.rubbingFastness", "Reibechtheit", "Rubbing Fastness");
add("technicalData", "table", "row.washFastness", "Waschechtheit", "Wash Fastness");
add("technicalData", "table", "row.seawaterFastness", "Meerwasserechtheit", "Seawater Fastness");
add("technicalData", "table", "row.flammability", "Entflammbarkeit", "Flammability");
add("technicalData", "table", "row.mouldResistance", "Schimmelbeständigkeit", "Mould Resistance");
add("technicalData", "table", "row.waterRepellency", "Wasserabweisung", "Water Repellency");
add("technicalData", "table", "row.pillingResistance", "Pillingbeständigkeit", "Pilling Resistance");
add("technicalData", "table", "row.abrasionResistance", "Abriebfestigkeit", "Abrasion Resistance");
add("technicalData", "table", "row.pfas", "Gesamtfluor / PFAS", "Total Fluorine / PFAS");
add("technicalData", "table", "row.production", "Produktion / Nachhaltigkeit", "Production / Sustainability");
add("technicalData", "table", "row.handFeel", "Haptik", "Hand Feel");

/* ------------------------------------------------------------------ */
/*  14. Technical data values                                         */
/* ------------------------------------------------------------------ */

add("technicalData", "values", "dryWet", "Trocken/Nass: 4–5", "Dry/Wet: 4–5");
add("technicalData", "values", "passed", "Bestanden", "Pass");
add("technicalData", "values", "notDetected", "Nicht nachgewiesen", "Not detected");
add("technicalData", "values", "lowerEnergy", "Geringerer Energieverbrauch in der Produktion", "Lower energy consumption in production");
add("technicalData", "values", "verySoft", "Sehr weich, textilähnlich", "Very soft, textile-like");
add("technicalData", "values", "afterCycles", "nach 5.000 Zyklen", "after 5,000 cycles");

/* ------------------------------------------------------------------ */
/*  15. Fabric quality labels                                         */
/* ------------------------------------------------------------------ */

add("fabricQuality", "labels", "material", "Material", "Material");
add("fabricQuality", "labels", "weight", "Gewicht", "Weight");
add("fabricQuality", "labels", "dyeing", "Färbung", "Dyeing");
add("fabricQuality", "labels", "comfort", "Komfort", "Comfort");
add("fabricQuality", "labels", "cushionThickness", "Auflagenstärke", "Cushion");

add("fabricQuality", "mackintosh", "weight", "ab 260 g/m²", "from 260 g/m²");
add("fabricQuality", "mackintosh", "dyeing", "spinndüsengefärbt", "solution-dyed");
add("fabricQuality", "mackintosh", "comfort", "hoher Sitzkomfort", "high seating comfort");
add("fabricQuality", "mackintosh", "cushionThickness", "5–6 cm starke Auflagen", "5–6 cm thick cushions");

add("fabricQuality", "mackintosh-lite", "weight", "ca. 170–300 g/m²", "approx. 170–300 g/m²");
add("fabricQuality", "mackintosh-lite", "dyeing", "spinndüsengefärbt", "solution-dyed");
add("fabricQuality", "mackintosh-lite", "comfort", "hoher Sitzkomfort", "high seating comfort");
add("fabricQuality", "mackintosh-lite", "cushionThickness", "5–6 cm Auflagen", "5–6 cm cushions");
add("fabricQuality", "mackintosh-lite", "description", "etwas leichterer Stoff", "slightly lighter fabric");

add("fabricQuality", "nerio", "material", "100 % Olefin (50 % recycelt)", "100% Olefin (50% recycled)");
add("fabricQuality", "nerio", "weight", "ca. 200–230 g/m²", "approx. 200–230 g/m²");
add("fabricQuality", "nerio", "dyeing", "spinndüsengefärbt", "solution-dyed");
add("fabricQuality", "nerio", "comfort", "hoher Sitzkomfort", "high seating comfort");
add("fabricQuality", "nerio", "cushionThickness", "5–6 cm Auflagen", "5–6 cm cushions");
add("fabricQuality", "nerio", "subtitle", "Aus dem Ozean geboren. Für die Zukunft gemacht.", "Born from the ocean. Made for the future.");

add("fabricQuality", "basic", "weight", "ca. 280 g/m²", "approx. 280 g/m²");
add("fabricQuality", "basic", "dyeing", "stückgefärbt", "piece-dyed");
add("fabricQuality", "basic", "comfort", "bequemer Sitzkomfort", "comfortable seating");
add("fabricQuality", "basic", "description", "weiche Haptik", "soft hand feel");

/* ------------------------------------------------------------------ */
/*  16. Mackintosh highlights                                         */
/* ------------------------------------------------------------------ */

add("fabricQuality", "mackintosh-highlights", "highlight.1", "Höchste Lichtechtheit (7–8)", "Highest lightfastness (7–8)");
add("fabricQuality", "mackintosh-highlights", "highlight.2", "UV-Beständigkeit 5/5", "UV resistance 5/5");
add("fabricQuality", "mackintosh-highlights", "highlight.3", "Wasseraufnahme < 0,1 %", "Water uptake < 0.1%");
add("fabricQuality", "mackintosh-highlights", "highlight.4", "Bleichfest", "Bleach-resistant");
add("fabricQuality", "mackintosh-highlights", "highlight.5", "Schimmelfest", "Mould-resistant");
add("fabricQuality", "mackintosh-highlights", "highlight.6", "PFAS-frei", "PFAS-free");

/* ------------------------------------------------------------------ */
/*  17. Table footnotes                                               */
/* ------------------------------------------------------------------ */

add("technicalData", "footnotes", "footnote.1", "Die Bewertung erfolgt auf einer Skala von 1–8, wobei 1 die schlechteste und 8 die beste Bewertung darstellt.", "Ratings are on a scale of 1–8, where 1 is the poorest and 8 the best rating.");
add("technicalData", "footnotes", "footnote.2", "Die Bewertung der Waschechtheit und der Reibungsfestigkeit erfolgt auf einer Skala von 1–5, wobei 1 die schlechteste und 5 die beste Bewertung ist.", "Wash fastness and rubbing fastness are rated on a scale of 1–5, where 1 is the poorest and 5 the best rating.");

/* ------------------------------------------------------------------ */
/*  18. Ambiente page                                                 */
/* ------------------------------------------------------------------ */

add("page", "ambiente", "cta.eyebrow", "Inspiration gefunden?", "Found your inspiration?");
add("page", "ambiente", "cta.title", "Diese Stimmung für Ihren Außenbereich?", "This mood for your outdoor space?");
add("page", "ambiente", "cta.description", "Wir stellen passende Stoffmuster für Ihr Projekt zusammen.", "We put together matching fabric samples for your project.");
add("page", "ambiente", "cta.primaryLabel", "Musterset anfordern", "Request sample set");

/* ------------------------------------------------------------------ */
/*  19. Collections page                                              */
/* ------------------------------------------------------------------ */

add("page", "collections", "browseText", "Entdecken Sie die Mosaroma Farbwelten oder wählen Sie eine Kollektion.", "Browse the Mosaroma colour worlds or select a collection below.");
add("page", "collections", "cta.title", "Ihr Farbkonzept steht?", "Your colour concept is ready?");
add("page", "collections", "cta.description", "Wir beraten persönlich und senden Ihnen ein Stoffmuster-Set.", "We provide personal advice and send you a fabric sample set.");
add("page", "collections", "cta.primaryLabel", "Muster anfordern", "Request samples");

/* ------------------------------------------------------------------ */
/*  20. Product categories page                                       */
/* ------------------------------------------------------------------ */

add("page", "product-categories", "emptyText", "Keine Produktkategorien derzeit verfügbar. Bitte schauen Sie später noch einmal vorbei.", "No product categories are currently available. Please check back later.");
add("page", "product-categories", "browseText", "Suchen Sie eine bestimmte Farbe oder Kollektion? Entdecken Sie unsere Kollektionen.", "Looking for a specific colour or collection? Discover our collections.");
add("page", "product-categories", "viewCollections", "Kollektionen ansehen", "View Collections");

/* ------------------------------------------------------------------ */
/*  21. Materials fabrics page                                        */
/* ------------------------------------------------------------------ */

add("page", "fabrics-samples", "cta.title", "Auf der Suche nach dem richtigen Stoff?", "Looking for the right fabric?");
add("page", "fabrics-samples", "cta.description", "Wir beraten Sie gerne und senden Ihnen ein Musterset.", "We are happy to advise you and send you a sample set.");

/* ------------------------------------------------------------------ */
/*  22. Catalogues page                                               */
/* ------------------------------------------------------------------ */

add("page", "catalogues", "cta.title", "Brauchen Sie persönliche Beratung?", "Need personal advice?");
add("page", "catalogues", "cta.description", "Wir helfen Ihnen gerne bei Fragen zu Materialien, Maßen und Pflege.", "We are happy to help with questions about materials, dimensions and care.");

/* ------------------------------------------------------------------ */
/*  23. Contact page                                                  */
/* ------------------------------------------------------------------ */

add("page", "contact", "cta.title", "Lieber per E-Mail oder Telefon?", "Prefer email or phone?");

/* ------------------------------------------------------------------ */
/*  24. News page                                                     */
/* ------------------------------------------------------------------ */

add("page", "news", "emptyText", "Derzeit keine Neuigkeiten vorhanden.", "No news articles available at the moment.");

/* ------------------------------------------------------------------ */
/*  25. Glossary terms (technical vocabulary)                         */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  26. Page Hero translations (moved from pageHeroesEn)              */
/* ------------------------------------------------------------------ */

add("pageHero", "kollektionen", "eyebrow", "Saison 2027 · Outdoor Living", "Season 2027 · Outdoor Living");
add("pageHero", "kollektionen", "title", "Sieben Farbwelten.", "Seven Colour Worlds.");
add("pageHero", "kollektionen", "description", "Jede Kollektion erzählt ihre eigene Geschichte aus Farbe, Material und Stimmung. Wählen Sie die Welt, die zu Ihrem Außenbereich passt.", "Each collection tells its own story of colour, material and mood. Choose the world that suits your outdoor space.");
add("pageHero", "kollektionen", "alt", "Mosaroma Kollektionen Hero Platzhalter mit Stoffstruktur und Farbfeldern", "Mosaroma Collections Hero with fabric texture and colour fields");

add("pageHero", "materialien", "eyebrow", "Material & Technologie", "Material & Technology");
add("pageHero", "materialien", "title", "Materialien, die draußen bestehen.", "Materials built for the outdoors.");
add("pageHero", "materialien", "description", "Outdoor-Textilien, entwickelt für Komfort, Beständigkeit und zuverlässige Performance im Freien.", "Outdoor textiles designed for comfort, durability and reliable performance in the open air.");
add("pageHero", "materialien", "alt", "Mosaroma Materialien Hero Platzhalter mit gewebter Stoffstruktur", "Mosaroma Materials Hero with woven fabric texture");

add("pageHero", "ueberUns", "eyebrow", "Über Mosaroma", "About Mosaroma");
add("pageHero", "ueberUns", "title", "Das sind wir.", "This is who we are.");
add("pageHero", "ueberUns", "description", "Design, Performance und verantwortungsvolles Handeln für langlebige Outdoor-Textilien.", "Design, performance and responsible practice for long-lasting outdoor textiles.");
add("pageHero", "ueberUns", "alt", "Mosaroma Über uns Hero Platzhalter im hochwertigen Outdoor-Stil", "Mosaroma About Us Hero in premium outdoor style");

add("pageHero", "kataloge", "eyebrow", "Downloads", "Downloads");
add("pageHero", "kataloge", "title", "Kataloge & Downloads", "Catalogues & Downloads");
add("pageHero", "kataloge", "description", "Dokumente rund um Produkte, Stoffe, Kollektionen, Pflege und technische Daten.", "Documents on products, fabrics, collections, care and technical data.");
add("pageHero", "kataloge", "alt", "Mosaroma Kataloge und Downloads Hero Platzhalter", "Mosaroma Catalogues and Downloads Hero");

add("pageHero", "neuigkeiten", "eyebrow", "Aktuelles", "Latest");
add("pageHero", "neuigkeiten", "title", "Neuigkeiten", "News");
add("pageHero", "neuigkeiten", "description", "Aktuelle Themen rund um Kollektionen, Materialien und Outdoor-Textilien.", "Current topics on collections, materials and outdoor textiles.");
add("pageHero", "neuigkeiten", "alt", "Mosaroma Neuigkeiten Hero Platzhalter", "Mosaroma News Hero");

add("pageHero", "kontakt", "eyebrow", "Kontakt", "Contact");
add("pageHero", "kontakt", "title", "Sprechen Sie uns an.", "Get in touch.");
add("pageHero", "kontakt", "description", "Wir unterstützen Sie bei Fragen zu Kollektionen, Materialien, Katalogen und Produkten.", "We are happy to help with questions about collections, materials, catalogues and products.");
add("pageHero", "kontakt", "alt", "Mosaroma Kontakt Hero Platzhalter", "Mosaroma Contact Hero");

add("pageHero", "produktmasse", "eyebrow", "Übersicht · Bemaßung am Produkt", "Overview · Product Dimensions");
add("pageHero", "produktmasse", "title", "Produktmaße", "Product Dimensions");
add("pageHero", "produktmasse", "description", "Alle relevanten Maße und Abmessungen der Mosaroma Produktformen auf einen Blick.", "All key dimensions of Mosaroma product types at a glance.");
add("pageHero", "produktmasse", "alt", "Mosaroma Produktmaße Hero Platzhalter mit technischen Linien und Maßangaben", "Mosaroma Product Dimensions Hero with technical lines and measurements");

add("pageHero", "pflegeGarantie", "eyebrow", "Service", "Service");
add("pageHero", "pflegeGarantie", "title", "Pflege & Garantie", "Care & Warranty");
add("pageHero", "pflegeGarantie", "description", "Hinweise zur Reinigung, Lagerung und Garantie von Mosaroma Outdoor-Produkten.", "Instructions on cleaning, storage and warranty for Mosaroma outdoor products.");
add("pageHero", "pflegeGarantie", "alt", "Mosaroma Pflege und Garantie Hero Platzhalter", "Mosaroma Care and Warranty Hero");

add("pageHero", "stoffeMuster", "eyebrow", "Stoffbibliothek", "Fabric Library");
add("pageHero", "stoffeMuster", "title", "Stoffe & Muster", "Fabrics & Samples");
add("pageHero", "stoffeMuster", "description", "Filtern Sie nach Materialfamilie, Produktart oder suchen Sie gezielt nach Stoffname und Artikelnummer.", "Filter by material family, product type or search by fabric name and article number.");
add("pageHero", "stoffeMuster", "alt", "Mosaroma Stoffe und Muster Hero Platzhalter", "Mosaroma Fabrics and Samples Hero");

add("pageHero", "technischeDaten", "eyebrow", "Materialvergleich", "Material Comparison");
add("pageHero", "technischeDaten", "title", "Technische Daten", "Technical Data");
add("pageHero", "technischeDaten", "description", "Materialeigenschaften, Prüfwerte und Outdoor-Performance unserer Stoffqualitäten im Vergleich.", "Material properties, test values and outdoor performance of our fabric qualities compared.");
add("pageHero", "technischeDaten", "alt", "Mosaroma Technische Daten Hero Platzhalter", "Mosaroma Technical Data Hero");

add("pageHero", "stoffTechnischeDaten", "eyebrow", "Service", "Service");
add("pageHero", "stoffTechnischeDaten", "title", "Stoff- & technische Daten", "Fabric & Technical Data");
add("pageHero", "stoffTechnischeDaten", "description", "Technische Informationen zu Stoffqualitäten, Materialaufbau und Prüfwerten.", "Technical information on fabric qualities, material composition and test values.");
add("pageHero", "stoffTechnischeDaten", "alt", "Mosaroma Stoff und technische Daten Hero Platzhalter", "Mosaroma Fabric and Technical Data Hero");

add("pageHero", "nerio", "eyebrow", "Nachhaltigkeit · OceanCycle®", "Sustainability · OceanCycle®");
add("pageHero", "nerio", "title", "NERIO — Aus dem Ozean geboren.", "NERIO — Born from the Ocean.");
add("pageHero", "nerio", "description", "Performance-Stoffe aus recyceltem Ozean-Polypropylen. OceanCycle® zertifiziert, PFAS-frei und spinndüsengefärbt.", "Performance fabrics made from recycled ocean polypropylene. OceanCycle® certified, PFAS-free and solution-dyed.");
add("pageHero", "nerio", "alt", "Mosaroma NERIO Nachhaltigkeits-Kollektion Hero", "Mosaroma NERIO Sustainability Collection Hero");

/* ------------------------------------------------------------------ */
/*  27. Footer CMS field translations                                 */
/* ------------------------------------------------------------------ */

add("footer", "", "description", "Design trifft Performance. Hochwertige Outdoor-Textilien für Räume und Momente, die bleiben.", "Design meets performance. Premium outdoor textiles for lasting moments in the open air.");
add("footer", "", "ctaEyebrow", "Beratung & Muster", "Advice & Samples");
add("footer", "", "ctaTitle", "Unsicher bei Farbe, Material oder Format?", "Unsure about colour, material or size?");
add("footer", "", "ctaText", "Fordern Sie ein Musterset an oder lassen Sie sich persönlich zu Kollektionen, Materialien und Sondermaßen beraten.", "Request a sample set or get personal advice on collections, materials and custom dimensions.");
add("footer", "", "ctaPrimaryLabel", "Muster anfordern", "Request samples");
add("footer", "", "ctaSecondaryLabel", "Kataloge ansehen", "View catalogues");
add("footer", "", "contactTitle", "Kontakt", "Contact");
add("footer", "", "contactButtonLabel", "Kontakt aufnehmen", "Get in touch");
add("footer", "", "country", "Deutschland", "Germany");

/* ------------------------------------------------------------------ */
/*  28. Collection translations                                       */
/* ------------------------------------------------------------------ */

add("collection", "green", "eyebrow", "Kollektion 01", "Collection 01");
add("collection", "green", "shortDescription", "Frische Naturtöne für ein lebendiges Outdoor-Gefühl.", "Fresh natural tones for a vibrant outdoor feel.");
add("collection", "green", "longDescription", "Die Green Collection vereint frische Naturtöne und lebendige Grünnuancen — von hellem Jade bis zu sattem Tannengrün. Alle Stoffe in Mackintosh® Technology: spinndüsengefärbtes Olefin, UV-beständig, wasserabweisend, langlebig.", "The Green Collection brings together fresh natural tones and vibrant green shades — from pale jade to rich pine. All fabrics in Mackintosh® Technology: solution-dyed olefin, UV-resistant, water-repellent, durable.");

add("collection", "blue", "eyebrow", "Kollektion 02", "Collection 02");
add("collection", "blue", "shortDescription", "Ruhige Blautöne und maritime Akzente.", "Calm blues and maritime accents.");
add("collection", "blue", "longDescription", "Die Blue Collection bringt ruhige Blautöne und maritime Akzente in den Außenbereich — von zartem Taubenblau bis tiefem Navy. Gefertigt in Mackintosh® Technology für höchste Outdoor-Performance.", "The Blue Collection brings calm blues and maritime accents to your outdoor space — from soft pigeon blue to deep navy. Made in Mackintosh® Technology for highest outdoor performance.");

add("collection", "red", "eyebrow", "Kollektion 03", "Collection 03");
add("collection", "red", "shortDescription", "Warme Rottöne und kraftvolle Akzente.", "Warm reds and bold accents.");
add("collection", "red", "longDescription", "Die Red Collection setzt auf warme Rottöne und kraftvolle Akzente — von erdigem Terrakotta bis leuchtendem Karmin. Alle Stoffe in Mackintosh® Technology.", "The Red Collection features warm reds and bold accents — from earthy terracotta to glowing carmine. All fabrics in Mackintosh® Technology.");

add("collection", "yellow", "eyebrow", "Kollektion 04", "Collection 04");
add("collection", "yellow", "shortDescription", "Sonnige Töne und warme Goldakzente.", "Sunny tones and warm gold accents.");

add("collection", "earth-grey", "eyebrow", "Kollektion 05", "Collection 05");
add("collection", "earth-grey", "shortDescription", "Erdige Naturtöne und ruhige Graunuancen für zeitlose Outdoor-Konzepte.", "Earthy natural tones and calm shades of grey for timeless outdoor concepts.");

add("collection", "natural", "eyebrow", "Kollektion 06", "Collection 06");
add("collection", "natural", "shortDescription", "Natürliche Erdtöne und organische Wärme.", "Natural earth tones and organic warmth.");

add("collection", "nerio-oceana", "eyebrow", "Kollektion 07", "Collection 07");
add("collection", "nerio-oceana", "shortDescription", "Nachhaltige Performance-Stoffe aus recyceltem Ozean-Polypropylen.", "Sustainable performance fabrics from recycled ocean polypropylene.");

add("collection", "basic", "fabric", "Basic (100 % Polyester, ca. 280 g/m², stückgefärbt)", "Basic (100% Polyester, approx. 280 g/m², piece-dyed)");
add("collection", "basic", "shortDescription", "Unkomplizierte Outdoor-Textilien für starke Saisonflächen.", "Simple outdoor textiles for high-volume seasonal areas.");
add("collection", "basic", "longDescription", "Leichte Polyesterqualitäten, vielseitig kombinierbar und angenehm pflegeleicht im Alltag.", "Lightweight polyester qualities, versatile to combine and pleasantly easy to maintain in everyday use.");

/* ------------------------------------------------------------------ */
/*  29. Fabric Library UI labels (dictionary)                         */
/* ------------------------------------------------------------------ */

add("dictionary", "fabricLibrary", "emptyState", "Noch keine Stoffe in der Bibliothek vorhanden.", "No fabrics in the library yet.");
add("dictionary", "fabricLibrary", "all", "Alle", "All");
add("dictionary", "fabricLibrary", "searchPlaceholder", "Stoff suchen (Name, Artikelnummer…)", "Search fabrics (name, article number…)");
add("dictionary", "fabricLibrary", "searchAriaLabel", "Stoffe durchsuchen", "Search fabrics");
add("dictionary", "fabricLibrary", "filterByProductType", "Nach Produktart filtern", "Filter by product type");
add("dictionary", "fabricLibrary", "allProductTypes", "Alle Produktarten", "All product types");
add("dictionary", "fabricLibrary", "gridView", "Kachelansicht", "Grid view");
add("dictionary", "fabricLibrary", "matrixView", "Matrixansicht", "Matrix view");
add("dictionary", "fabricLibrary", "nerioLink", "Mehr zur NERIO Materialstory", "More about the NERIO material story");
add("dictionary", "fabricLibrary", "fabricSingular", "Stoff", "fabric");
add("dictionary", "fabricLibrary", "fabricPlural", "Stoffe", "fabrics");
add("dictionary", "fabricLibrary", "shown", "angezeigt", "shown");
add("dictionary", "fabricLibrary", "resetFilters", "Filter zurücksetzen", "Reset filters");
add("dictionary", "fabricLibrary", "noFabricsFound", "Keine Stoffe gefunden.", "No fabrics found.");
add("dictionary", "fabricLibrary", "showMore", "Mehr anzeigen...", "Show more...");

/* ------------------------------------------------------------------ */
/*  30. Materials page section translations                           */
/* ------------------------------------------------------------------ */

add("material", "mackintosh-technology", "title", "Mackintosh® Technology.", "Mackintosh® Technology.");
add("material", "mackintosh-technology", "description.1", "Unsere Mackintosh®-Stoffe basieren auf 100 % spinndüsengefärbtem Polypropylen (PP/Olefin). Die Farbe wird bereits bei der Faserherstellung in die Schmelze eingebracht — das Ergebnis ist eine besonders tiefe, gleichmäßige und dauerhafte Einfärbung.", "Our Mackintosh® fabrics are based on 100% solution-dyed polypropylene (PP/olefin). The colour is introduced into the melt during fibre production — the result is a particularly deep, uniform and permanent colouration.");
add("material", "mackintosh-technology", "description.2", "Im Vergleich zu konventionellen Färbeverfahren bietet dieses Verfahren außergewöhnliche Lichtechtheit, UV-Beständigkeit und eine deutlich niedrigere CO₂-Bilanz.", "Compared to conventional dyeing processes, this method offers exceptional lightfastness, UV resistance and a significantly lower carbon footprint.");
add("material", "mackintosh-technology", "step.1.title", "Schmelze einfärben", "Colour the Melt");
add("material", "mackintosh-technology", "step.1.description", "Farbpigmente werden direkt in die PP-Schmelze eingebracht, bevor die Faser entsteht.", "Colour pigments are introduced directly into the PP melt before the fibre is formed.");
add("material", "mackintosh-technology", "step.2.title", "Faser spinnen", "Spin the Fibre");
add("material", "mackintosh-technology", "step.2.description", "Die eingefärbte Schmelze wird zu feinen Endlosfasern gesponnen — die Farbe sitzt im Kern.", "The coloured melt is spun into fine continuous fibres — the colour sits in the core.");
add("material", "mackintosh-technology", "step.3.title", "Gewebe fertigen", "Produce the Fabric");
add("material", "mackintosh-technology", "step.3.description", "Die Fasern werden zu einem robusten, farbechten Gewebe verarbeitet — bereit für den Outdoor-Einsatz.", "The fibres are processed into a robust, colourfast fabric — ready for outdoor use.");
add("material", "mackintosh-technology", "benefit.1", "Höchste Lichtechtheit (7–8 auf der Blauskala)", "Highest lightfastness (7–8 on the blue scale)");
add("material", "mackintosh-technology", "benefit.2", "UV-Beständigkeit 5/5", "UV resistance 5/5");
add("material", "mackintosh-technology", "benefit.3", "Wasseraufnahme < 0,1 %", "Water uptake < 0.1%");
add("material", "mackintosh-technology", "benefit.4", "Bleichfest und schimmelfest", "Bleach-resistant and mould-resistant");
add("material", "mackintosh-technology", "benefit.5", "PFAS-frei", "PFAS-free");
add("material", "mackintosh-technology", "benefit.6", "Geringerer Energieverbrauch in der Herstellung", "Lower energy consumption in production");

add("material", "olefin-benefits", "tag.1", "Wasserabweisend", "Water-repellent");
add("material", "olefin-benefits", "tag.2", "UV-beständig", "UV-resistant");
add("material", "olefin-benefits", "tag.3", "Farbecht", "Colourfast");
add("material", "olefin-benefits", "tag.4", "Pflegeleicht", "Easy to maintain");
add("material", "olefin-benefits", "tag.5", "Bleichfest", "Bleach-resistant");
add("material", "olefin-benefits", "tag.6", "PFAS-frei", "PFAS-free");
add("material", "olefin-benefits", "paragraph.1", "Polypropylen (PP/Olefin) ist eine der leichtesten und chemisch widerstandsfähigsten Kunstfasern überhaupt. Sie nimmt kaum Feuchtigkeit auf (< 0,1 %), trocknet extrem schnell und ist von Natur aus resistent gegen Schimmel, Bakterien und viele Chemikalien.", "Polypropylene (PP/olefin) is one of the lightest and most chemically resistant synthetic fibres available. It absorbs almost no moisture (< 0.1%), dries extremely quickly and is naturally resistant to mould, bacteria and many chemicals.");
add("material", "olefin-benefits", "paragraph.2", "In Kombination mit dem Spinndüsenfärbeverfahren (Solution-Dye) bietet Olefin eine außergewöhnliche Farbbeständigkeit — auch bei starker Sonneneinstrahlung, Regen oder Kontakt mit Chlor und Salzwasser.", "Combined with the solution-dye process, olefin offers exceptional colour retention — even under strong sunlight, rain or contact with chlorine and saltwater.");
add("material", "olefin-benefits", "paragraph.3", "Diese Eigenschaften machen Olefin zum idealen Rohstoff für hochwertige Outdoor-Textilien, die dauerhaft schön, funktional und pflegeleicht bleiben.", "These properties make olefin the ideal raw material for premium outdoor textiles that remain beautiful, functional and easy to care for.");

add("material", "ocean-cycle", "title", "OceanCycle® Prozess", "OceanCycle® Process");
add("material", "ocean-cycle", "description", "Vom Ozean zum Outdoor-Stoff — wie aus gesammeltem Meereskunststoff ein hochwertiges Garn für unsere NERIO Kollektion entsteht.", "From ocean to outdoor fabric — how collected marine plastic becomes a premium yarn for our NERIO collection.");
add("material", "ocean-cycle", "step.1.title", "Sammlung", "Collection");
add("material", "ocean-cycle", "step.1.description", "Fischer und Küsteninitiativen sammeln Kunststoffabfälle aus Meeren und Küstenregionen weltweit.", "Fishermen and coastal initiatives collect plastic waste from seas and coastal regions worldwide.");
add("material", "ocean-cycle", "step.2.title", "Sortierung", "Sorting");
add("material", "ocean-cycle", "step.2.description", "Das gesammelte Material wird gereinigt, nach Kunststoffart sortiert und für das Recycling aufbereitet.", "The collected material is cleaned, sorted by plastic type and prepared for recycling.");
add("material", "ocean-cycle", "step.3.title", "Recycling", "Recycling");
add("material", "ocean-cycle", "step.3.description", "Der sortierte Kunststoff wird eingeschmolzen und zu neuem, hochwertigem Polypropylen-Granulat verarbeitet.", "The sorted plastic is melted down and processed into new, high-quality polypropylene granulate.");
add("material", "ocean-cycle", "step.4.title", "Produktion", "Production");
add("material", "ocean-cycle", "step.4.description", "Aus dem Recycling-Granulat entstehen spinndüsengefärbte Fasern für die NERIO Kollektion.", "The recycled granulate is used to produce solution-dyed fibres for the NERIO collection.");
add("material", "ocean-cycle", "highlight.1", "OceanCycle® zertifiziert", "OceanCycle® certified");
add("material", "ocean-cycle", "highlight.2", "50 % recyceltes Ozean-Polypropylen", "50% recycled ocean polypropylene");
add("material", "ocean-cycle", "highlight.3", "PFAS-frei", "PFAS-free");
add("material", "ocean-cycle", "highlight.4", "Spinndüsengefärbt für höchste Farbechtheit", "Solution-dyed for highest colour fastness");

/* ------------------------------------------------------------------ */
/*  31. NERIO page section translations                               */
/* ------------------------------------------------------------------ */

add("material", "nerio-story", "eyebrow", "Die Geschichte", "The Story");
add("material", "nerio-story", "title", "Vom Ozean in Ihren Garten.", "From the Ocean to Your Garden.");
add("material", "nerio-story", "paragraph.1", "NERIO ist mehr als ein Stoff — es ist ein Versprechen. Unsere NERIO-Linie verwendet Garn aus recyceltem Ozean-Polypropylen und verbindet höchste Outdoor-Performance mit Verantwortung für die Umwelt.", "NERIO is more than a fabric — it is a promise. Our NERIO line uses yarn from recycled ocean polypropylene and combines the highest outdoor performance with environmental responsibility.");
add("material", "nerio-story", "paragraph.2", "Jede NERIO-Faser erzählt die Geschichte einer Transformation: von gesammeltem Meereskunststoff zu einem hochwertigen, spinndüsengefärbten Outdoor-Stoff, der über Jahre hinweg Farbe, Form und Funktion behält.", "Every NERIO fibre tells a story of transformation: from collected marine plastic to a premium, solution-dyed outdoor fabric that retains its colour, shape and function for years.");
add("material", "nerio-story", "paragraph.3", "Dabei setzen wir bewusst auf OceanCycle®-zertifizierte Lieferketten und verzichten konsequent auf PFAS — für Produkte, die nicht nur draußen bestehen, sondern auch einen Beitrag leisten.", "We deliberately rely on OceanCycle® certified supply chains and consistently avoid PFAS — for products that don't just perform outdoors, but also make a contribution.");

add("material", "nerio-promise", "eyebrow", "Unser Versprechen", "Our Promise");
add("material", "nerio-promise", "title", "Nachhaltigkeit ohne Kompromisse", "Sustainability Without Compromise");
add("material", "nerio-promise", "item.1.title", "OceanCycle® zertifiziert", "OceanCycle® Certified");
add("material", "nerio-promise", "item.1.text", "Geprüfte Lieferkette für recyceltes Ozean-Polypropylen.", "Verified supply chain for recycled ocean polypropylene.");
add("material", "nerio-promise", "item.2.title", "PFAS-frei", "PFAS-free");
add("material", "nerio-promise", "item.2.text", "Keine per- und polyfluorierten Alkylsubstanzen.", "No per- and polyfluorinated alkyl substances.");
add("material", "nerio-promise", "item.3.title", "Spinndüsengefärbt", "Solution-dyed");
add("material", "nerio-promise", "item.3.text", "Farbe in der Faser — maximale Lichtechtheit.", "Colour in the fibre — maximum lightfastness.");
add("material", "nerio-promise", "item.4.title", "Langlebig", "Durable");
add("material", "nerio-promise", "item.4.text", "Designed für Jahre, nicht Saisons.", "Designed for years, not seasons.");

/* ------------------------------------------------------------------ */
/*  32. Materials page CTA translations                               */
/* ------------------------------------------------------------------ */

add("page", "materials", "cta.title", "Alle Details im Katalog", "All Details in the Catalogue");
add("page", "materials", "cta.description", "Entdecken Sie alle Stoffqualitäten, Farben und technischen Daten in unserem aktuellen Katalog.", "Discover all fabric qualities, colours and technical data in our current catalogue.");

/* ------------------------------------------------------------------ */
/*  33. NERIO page — highlights, technical facts, ocean cycle           */
/* ------------------------------------------------------------------ */

add("material", "nerio-highlights", "eyebrow", "Auf einen Blick", "At a Glance");
add("material", "nerio-highlights", "title", "NERIO Highlights", "NERIO Highlights");
add("material", "nerio-highlights", "stat.1.label", "recyceltes Ozean-PP", "recycled ocean PP");
add("material", "nerio-highlights", "stat.1.detail", "OceanCycle® zertifiziert", "OceanCycle® certified");
add("material", "nerio-highlights", "stat.2.label", "PFAS", "PFAS");
add("material", "nerio-highlights", "stat.2.detail", "Komplett fluorfreie Produktion", "Completely fluorine-free production");
add("material", "nerio-highlights", "stat.3.label", "Lichtechtheit", "Lightfastness");
add("material", "nerio-highlights", "stat.3.detail", "Höchste Stufe der Bewertungsskala", "Highest level on the rating scale");
add("material", "nerio-highlights", "stat.4.label", "Wasseraufnahme", "Water uptake");
add("material", "nerio-highlights", "stat.4.detail", "Praktisch wasserabweisend", "Practically water-repellent");

add("material", "nerio-technical-facts", "eyebrow", "Technische Daten", "Technical Data");
add("material", "nerio-technical-facts", "title", "NERIO im Detail", "NERIO in Detail");
add("material", "nerio-technical-facts", "fact.1.label", "Material", "Material");
add("material", "nerio-technical-facts", "fact.1.value", "100 % Olefin (50 % recycelt)", "100% Olefin (50% recycled)");
add("material", "nerio-technical-facts", "fact.2.label", "Gewicht", "Weight");
add("material", "nerio-technical-facts", "fact.2.value", "ca. 200–230 g/m²", "approx. 200–230 g/m²");
add("material", "nerio-technical-facts", "fact.3.label", "Färbung", "Dyeing");
add("material", "nerio-technical-facts", "fact.3.value", "spinndüsengefärbt", "solution-dyed");
add("material", "nerio-technical-facts", "fact.4.label", "Zertifizierung", "Certification");
add("material", "nerio-technical-facts", "fact.4.value", "OceanCycle®", "OceanCycle®");
add("material", "nerio-technical-facts", "fact.5.label", "Lichtechtheit", "Lightfastness");
add("material", "nerio-technical-facts", "fact.5.value", "7–8 (BS EN ISO 105-B02)", "7–8 (BS EN ISO 105-B02)");
add("material", "nerio-technical-facts", "fact.6.label", "UV-Beständigkeit", "UV resistance");
add("material", "nerio-technical-facts", "fact.6.value", "5/5", "5/5");
add("material", "nerio-technical-facts", "fact.7.label", "PFAS", "PFAS");
add("material", "nerio-technical-facts", "fact.7.value", "Nicht nachgewiesen", "Not detected");
add("material", "nerio-technical-facts", "fact.8.label", "Schimmelbeständigkeit", "Mould resistance");
add("material", "nerio-technical-facts", "fact.8.value", "Bestanden (AATCC 147)", "Passed (AATCC 147)");

add("material", "nerio-ocean-cycle", "title", "OceanCycle Kreislauf", "OceanCycle Process");
add("material", "nerio-ocean-cycle", "description", "Ozeangebundenes Plastik wird im Umkreis von 50 km der Küsten oder an größeren Wasserwegen gesammelt, die in die Ozeane münden. Durch ein zertifiziertes Verfahren wird es zu hochwertigem Material für unsere NERIO-Stoffe.", "Ocean-bound plastic is collected within 50 km of coastlines or at major waterways leading to the oceans. Through a certified process, it becomes high-quality material for our NERIO fabrics.");
add("material", "nerio-ocean-cycle", "step.1.title", "Sammlung", "Collection");
add("material", "nerio-ocean-cycle", "step.1.description", "Ozeangebundenes Plastik wird in Küstennähe und an Wasserwegen eingesammelt, bevor es die Meere erreicht.", "Ocean-bound plastic is collected near coastlines and waterways before it reaches the seas.");
add("material", "nerio-ocean-cycle", "step.2.title", "Sortierung", "Sorting");
add("material", "nerio-ocean-cycle", "step.2.description", "Die gesammelten Materialien werden nach Polymertyp und Qualität getrennt und für die Weiterverarbeitung vorbereitet.", "The collected materials are separated by polymer type and quality and prepared for further processing.");
add("material", "nerio-ocean-cycle", "step.3.title", "Reinigung", "Cleaning");
add("material", "nerio-ocean-cycle", "step.3.description", "Gründliche Reinigung und Aufbereitung des Materials zur Entfernung von Verunreinigungen und Fremdstoffen.", "Thorough cleaning and processing of the material to remove contaminants and foreign matter.");
add("material", "nerio-ocean-cycle", "step.4.title", "Recycling", "Recycling");
add("material", "nerio-ocean-cycle", "step.4.description", "Verarbeitung zu hochwertigem recyceltem Polypropylen (rPP), das als Basis für NERIO-Garne dient.", "Processing into high-quality recycled polypropylene (rPP) that serves as the basis for NERIO yarns.");
add("material", "nerio-ocean-cycle", "highlight.1", "Min. 50 % OceanCycle recyceltem Polypropylen", "Min. 50% OceanCycle recycled polypropylene");
add("material", "nerio-ocean-cycle", "highlight.2", "PFAS-frei — sicherer für Mensch und Planet", "PFAS-free — safer for people and planet");
add("material", "nerio-ocean-cycle", "highlight.3", "Solution-Dyed für exzellente Farbechtheit", "Solution-dyed for excellent colour fastness");
add("material", "nerio-ocean-cycle", "highlight.4", "Auf Langlebigkeit und lange Produktlebensdauer ausgelegt", "Designed for durability and long product life");
add("material", "nerio-ocean-cycle", "highlight.5", "Reduziert ozeangebundene Plastikverschmutzung", "Reduces ocean-bound plastic pollution");

/* ------------------------------------------------------------------ */
/*  34. NERIO page — videos, products, CTA                             */
/* ------------------------------------------------------------------ */

add("material", "nerio-videos", "eyebrow", "Prozesse & Kreisläufe", "Processes & Cycles");
add("material", "nerio-videos", "title", "Wie Verantwortung zu neuem Material wird", "How responsibility becomes new material");
add("material", "nerio-videos", "intro", "Die NERIO-Materialgeschichte wird greifbarer, wenn man die einzelnen Schritte sieht: vom gesammelten Rohstoff über Verarbeitung und Recycling bis zur neuen Anwendung im Textilbereich.", "The NERIO material story becomes more tangible when you see the individual steps: from collected raw material through processing and recycling to new applications in the textile sector.");
add("material", "nerio-videos", "video.1.title", "Vom Fischernetz zum neuen Rohstoff", "From fishing net to new raw material");
add("material", "nerio-videos", "video.1.description", "Dieser Film zeigt, wie recycelte Fischernetze zu Kunststoffgranulat verarbeitet werden.", "This film shows how recycled fishing nets are processed into plastic granulate.");
add("material", "nerio-videos", "video.1.label", "Prozessvideo", "Process video");
add("material", "nerio-videos", "video.2.title", "Textilkreisläufe neu gedacht", "Textile cycles reimagined");
add("material", "nerio-videos", "video.2.description", "Ein Einblick in neue Recyclingverfahren, bei denen textile Materialien effizienter aufbereitet werden.", "An insight into new recycling processes where textile materials are more efficiently reprocessed.");
add("material", "nerio-videos", "video.2.label", "Recycling", "Recycling");
add("material", "nerio-videos", "video.3.title", "Ein Material. Ein klarerer Kreislauf.", "One material. One clearer cycle.");
add("material", "nerio-videos", "video.3.description", "Dieses Video zeigt den Ansatz eines Mono-Material-Systems aus Polypropylen.", "This video shows the approach of a mono-material polypropylene system.");
add("material", "nerio-videos", "video.3.label", "Materialkreislauf", "Material cycle");

add("material", "nerio-products", "eyebrow", "Produkte & Stoffe", "Products & Fabrics");
add("material", "nerio-products", "title", "NERIO-Stoffe entdecken", "Discover NERIO Fabrics");
add("material", "nerio-products", "description", "Alle NERIO-Stoffe aus recyceltem Ozean-Polypropylen auf einen Blick — erhältlich als Kissen, Polster und Accessoires.", "All NERIO fabrics made from recycled ocean polypropylene at a glance — available as cushions, pads and accessories.");
add("material", "nerio-products", "card.dekokissen.title", "Deko-Kissen", "Scatter Cushions");
add("material", "nerio-products", "card.hochlehner.title", "Hochlehner", "High-back Cushions");
add("material", "nerio-products", "card.niedriglehner.title", "Niedriglehner", "Low-back Cushions");
add("material", "nerio-products", "card.sitzkissen.title", "Sitzkissen", "Seat Cushions");
add("material", "nerio-products", "card.bankauflagen.title", "Bankauflagen", "Bench Cushions");
add("material", "nerio-products", "fabricsHeading", "Aktuelle NERIO-Stoffe", "Current NERIO Fabrics");
add("material", "nerio-products", "fabricsButton", "Alle NERIO-Stoffe ansehen", "View all NERIO fabrics");
add("material", "nerio-products", "heroButton.primary", "Kollektion ansehen", "View collection");
add("material", "nerio-products", "heroButton.secondary", "Stoffe ansehen", "View fabrics");

add("material", "nerio-cta", "title", "NERIO erleben", "Experience NERIO");
add("material", "nerio-cta", "content", "Entdecken Sie die komplette NERIO-Kollektion und fordern Sie Ihr persönliches Musterset an.", "Discover the complete NERIO collection and request your personal sample set.");
add("material", "nerio-cta", "buttonLabel", "Musterset anfordern", "Request sample set");
add("material", "nerio-cta", "card.fabrics.title", "NERIO-Stoffe", "NERIO Fabrics");
add("material", "nerio-cta", "card.fabrics.description", "Entdecken Sie alle Stoffe, Muster und Farben der NERIO-Linie.", "Discover all fabrics, samples and colours of the NERIO line.");
add("material", "nerio-cta", "card.fabrics.button", "Stoffe ansehen", "View fabrics");
add("material", "nerio-cta", "card.collection.title", "NERIO-Kollektion", "NERIO Collection");
add("material", "nerio-cta", "card.collection.description", "Die NERIO-Oceana-Kollektion mit allen Produkten.", "The NERIO Oceana collection with all products.");
add("material", "nerio-cta", "card.collection.button", "Kollektion ansehen", "View collection");

add("material", "nerio-story", "quote", "50 % recyceltes Ozean-Polypropylen — kein Kompromiss bei der Leistung.", "50% recycled ocean polypropylene — no compromise on performance.");

/* ------------------------------------------------------------------ */
/*  35. About Us page translations                                     */
/* ------------------------------------------------------------------ */

add("page", "about-us", "breadcrumb", "Über uns", "About Us");
add("page", "about-us", "seoTitle", "Über uns | Mosaroma", "About Us | Mosaroma");
add("page", "about-us", "seoDescription", "Seit Generationen entwickeln und produzieren wir hochwertige Outdoor-Textilien.", "For generations, we have been developing and producing premium outdoor textiles.");
add("page", "about-us", "intro.p1", "Seit Generationen entwickeln und produzieren wir hochwertige Outdoor-Textilien und -Produkte. Wir verbinden anspruchsvolles Design, hohe Leistungsfähigkeit und verantwortungsvolles Handeln. Langlebige Materialien, innovative Produktionsverfahren und der konsequente Blick auf nachhaltige Kreisläufe bestimmen unsere Arbeit. Das Wohl von Mensch und Natur steht dabei immer im Mittelpunkt.", "For generations, we have been developing and producing premium outdoor textiles and products. We combine ambitious design, high performance and responsible practice. Durable materials, innovative production processes and a consistent focus on sustainable cycles define our work. The well-being of people and nature is always at the heart of everything we do.");
add("page", "about-us", "intro.p2", "Wir sind überzeugt, dass Outdoor-Textilien weit mehr bieten müssen als reine Funktionalität. Sie sollen Komfort, Entspannung und Wohlbefinden schaffen.", "We are convinced that outdoor textiles must deliver far more than mere functionality. They should create comfort, relaxation and well-being.");
add("page", "about-us", "promisesTitle", "Was uns antreibt.", "What Drives Us.");
add("page", "about-us", "promises.1.title", "Komfort", "Comfort");
add("page", "about-us", "promises.1.description", "Weiche Haptik, langlebige Qualität und zeitloses Design für entspannte Momente im Freien.", "Soft touch, durable quality and timeless design for relaxed moments outdoors.");
add("page", "about-us", "promises.2.title", "Qualität", "Quality");
add("page", "about-us", "promises.2.description", "Hochwertige Materialien und die Mackintosh® Inside Technology sorgen für dauerhaften Schutz vor Sonne, Regen und Schmutz.", "Premium materials and Mackintosh® Inside Technology provide lasting protection against sun, rain and dirt.");
add("page", "about-us", "promises.3.title", "Verantwortung", "Responsibility");
add("page", "about-us", "promises.3.description", "Wir entwickeln langlebige Produkte mit einem bewussten Umgang mit Ressourcen.", "We develop long-lasting products with a conscious approach to resources.");
add("page", "about-us", "promises.4.title", "Design", "Design");
add("page", "about-us", "promises.4.description", "Klare Formen und eine zeitlose Ästhetik schaffen Produkte, die sich harmonisch in jede Umgebung einfügen.", "Clean forms and timeless aesthetics create products that blend harmoniously into any setting.");
add("page", "about-us", "sustainabilityTitle", "Green by Design. Vom ersten Faden an.", "Green by Design. From the First Thread.");
add("page", "about-us", "sustainabilityDescription", "Spinndüsengefärbtes Polypropylen (PP) spart im Vergleich zu konventionell gefärbten Fasern erheblich Wasser, Energie und CO₂. Die Farbe wird bereits bei der Faserherstellung eingebracht — nachträgliches Färben und Waschen entfallen komplett.", "Solution-dyed polypropylene (PP) saves significant water, energy and CO₂ compared to conventionally dyed fibres. The colour is added during fibre production — subsequent dyeing and washing are eliminated entirely.");
add("page", "about-us", "stats.1.label", "weniger Wasser", "less water");
add("page", "about-us", "stats.2.label", "weniger Chemie", "fewer chemicals");
add("page", "about-us", "stats.3.label", "Solarstrom", "solar power");
add("page", "about-us", "sustainabilityNote", "Im Vergleich zu konventionell stückgefärbtem Polyester. Werte basierend auf internen Berechnungen und Branchendaten.", "Compared to conventionally piece-dyed polyester. Values based on internal calculations and industry data.");
add("page", "about-us", "locationTitle", "Oyten bei Bremen", "Oyten near Bremen");
add("page", "about-us", "location.area.label", "Fläche", "Area");
add("page", "about-us", "location.since.value", "seit 2021", "since 2021");
add("page", "about-us", "location.delivery.value", "2–4 Tage", "2–4 days");
add("page", "about-us", "location.since.label", "am Standort", "at the location");
add("page", "about-us", "location.delivery.label", "Lieferung DACH", "Delivery DACH");
add("page", "about-us", "location.region.label", "Liefergebiet", "Delivery area");
add("page", "about-us", "locationButton", "Kontakt aufnehmen", "Get in touch");
add("page", "about-us", "warrantyTitle", "3 Jahre Garantie.", "3-Year Warranty.");
add("page", "about-us", "warrantyDescription", "Wir bieten eine 3-Jahres-Garantie auf alle Mosaroma-Bezugsstoffe — Schutz vor Festigkeits- oder Farbverlust, Pilling und Abrieb bei normaler Nutzung und Witterungsbedingungen.", "We offer a 3-year warranty on all Mosaroma cover fabrics — protection against loss of strength or colour, pilling and abrasion from normal use and weather conditions.");
add("page", "about-us", "cta.title", "Bereit für Ihr nächstes Projekt?", "Ready for Your Next Project?");
add("page", "about-us", "cta.description", "Ob Einzelhandel, Hotellerie oder Gastronomie — wir beraten Sie persönlich zu Kollektionen, Materialien und individuellen Lösungen.", "Whether retail, hospitality or gastronomy — we advise you personally on collections, materials and individual solutions.");
add("page", "about-us", "cta.primaryLabel", "Kontakt aufnehmen", "Get in touch");
add("page", "about-us", "cta.secondaryLabel", "Kollektionen entdecken", "Discover collections");

/* ------------------------------------------------------------------ */
/*  36. Contact page translations                                      */
/* ------------------------------------------------------------------ */

add("page", "contact", "breadcrumb", "Kontakt", "Contact");
add("page", "contact", "seoTitle", "Kontakt | Mosaroma", "Contact | Mosaroma");
add("page", "contact", "seoDescription", "Kontaktieren Sie MOSAROMA — Mosaroma Industries GmbH in Oyten bei Bremen.", "Contact MOSAROMA — Mosaroma Industries GmbH in Oyten near Bremen.");
add("page", "contact", "contactDetails", "Kontaktdaten", "Contact Details");
add("page", "contact", "writeToUs", "Schreiben Sie uns", "Write to Us");
add("page", "contact", "businessHours", "Mo–Fr · 9:00–17:00 Uhr", "Mon–Fri · 9 am–5 pm");
add("page", "contact", "formUnavailable", "Das Kontaktformular ist derzeit nicht verfügbar. Bitte kontaktieren Sie uns per E-Mail.", "The contact form is currently unavailable. Please contact us by email.");
add("page", "contact", "form.submitLabel", "Nachricht senden", "Send message");
add("page", "contact", "form.successMessage", "Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze.", "Thank you for your message. We will be in touch shortly.");
add("page", "contact", "form.errorMessage", "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.", "An error occurred. Please try again.");
add("page", "contact", "form.name.label", "Name", "Name");
add("page", "contact", "form.name.placeholder", "Ihr Name", "Your name");
add("page", "contact", "form.company.label", "Unternehmen", "Company");
add("page", "contact", "form.company.placeholder", "Ihr Unternehmen", "Your company");
add("page", "contact", "form.email.label", "E-Mail", "Email");
add("page", "contact", "form.email.placeholder", "Ihre E-Mail-Adresse", "Your email address");
add("page", "contact", "form.phone.label", "Telefon", "Phone");
add("page", "contact", "form.phone.placeholder", "Ihre Telefonnummer", "Your phone number");
add("page", "contact", "form.subject.label", "Betreff", "Subject");
add("page", "contact", "form.subject.placeholder", "Betreff Ihrer Anfrage", "Subject of your enquiry");
add("page", "contact", "form.message.label", "Nachricht", "Message");
add("page", "contact", "form.message.placeholder", "Ihre Nachricht", "Your message");

/* ------------------------------------------------------------------ */
/*  37. Product Dimensions page translations                           */
/* ------------------------------------------------------------------ */

add("page", "product-dimensions", "seoTitle", "Produktmaße | Mosaroma", "Product Dimensions | Mosaroma");
add("page", "product-dimensions", "seoDescription", "Übersicht der wichtigsten Mosaroma-Produktmaße für Kissen, Auflagen, Rückenkissen, Bankauflagen, Poufs, Tischsets und Tischläufer.", "Overview of key Mosaroma product dimensions for cushions, pads, back cushions, bench cushions, poufs, placemats and table runners.");
add("page", "product-dimensions", "notice", "Alle Maße sind Richtwerte und sollten vor der Bestellung auf Passgenauigkeit geprüft werden.", "All dimensions are approximate and should be checked for fit before ordering.");
add("page", "product-dimensions", "customNote", "Sondermaße auf Anfrage.", "Custom sizes available on request.");
add("page", "product-dimensions", "kissenTitle", "Kissen & Auflagen", "Cushions & Pads");
add("page", "product-dimensions", "lehnerTitle", "Hoch- & Niedriglehner", "High-Back & Low-Back Cushions");
add("page", "product-dimensions", "bankTitle", "Bankauflagen", "Bench Cushions");
add("page", "product-dimensions", "poufsTitle", "Poufs", "Poufs");
add("page", "product-dimensions", "tischTitle", "Tischsets & Tischläufer", "Placemats & Table Runners");
add("page", "product-dimensions", "breadcrumb.catalogues", "Kataloge", "Catalogues");
add("page", "product-dimensions", "breadcrumb.self", "Produktmaße", "Product Dimensions");
add("page", "product-dimensions", "cta.title", "Fragen zu Produktmaßen?", "Questions about product dimensions?");
add("page", "product-dimensions", "cta.description", "Kontaktieren Sie uns — wir beraten Sie gern zu Maßen, Sondermaßen und Verfügbarkeit.", "Get in touch — we are happy to advise on dimensions, custom sizes and availability.");
add("page", "product-dimensions", "cta.primaryLabel", "Kontakt aufnehmen", "Contact us");
add("page", "product-dimensions", "cta.secondaryLabel", "Zurück zu Kataloge", "Back to Catalogues");

/* ------------------------------------------------------------------ */
/*  38. Care & Warranty page translations                              */
/* ------------------------------------------------------------------ */

add("page", "care-warranty", "seoTitle", "Pflege & Garantie | Mosaroma", "Care & Warranty | Mosaroma");
add("page", "care-warranty", "seoDescription", "Waschanleitungen, Pflegetipps und Garantiebedingungen für Mosaroma-Outdoor-Textilien aus MACKINTOSH® Solution-Dyed Olefin.", "Washing instructions, care advice and warranty terms for Mosaroma outdoor textiles made from MACKINTOSH® Solution-Dyed Olefin.");
add("page", "care-warranty", "breadcrumb.catalogues", "Kataloge", "Catalogues");
add("page", "care-warranty", "breadcrumb.self", "Pflege & Garantie", "Care & Warranty");
add("page", "care-warranty", "introTitle1", "Einmal kaufen.", "Buy once.");
add("page", "care-warranty", "introTitle2", "Jahrelang behalten.", "Keep for years.");
add("page", "care-warranty", "introText", "MACKINTOSH® Solution-Dyed Olefin ist für den langfristigen Outdoor-Einsatz konzipiert. Unsere Stoffe machen die Kissen zudem feuchtigkeitsbeständig. Verschmutzungen möglichst bald entfernen und die Bezüge mit Wasser und einem Schwamm reinigen. Regelmäßige Pflege verlängert die Lebensdauer Ihrer Kissen und Polster und hält sie wie neu.", "MACKINTOSH® Solution-Dyed Olefin is designed for long-term outdoor use. Our fabrics also make the cushions moisture-resistant. Remove soiling as soon as possible and clean the covers with water and a sponge. Regular care will extend the lifespan of your cushions and pads and keep them looking like new.");
add("page", "care-warranty", "storageTitle", "Aufbewahrung", "Storage");
add("page", "care-warranty", "storageText", "Feuchten Bezug flach oder hängend an der Luft trocknen — nicht in den Trockner, nicht in die direkte Sonne. Bezug noch leicht feucht wieder über die Füllung ziehen, um Faltenbildung zu vermeiden.", "Dry the damp cover flat or hanging in the open air — do not tumble dry, do not place in direct sunlight. Pull the cover back over the filling while still damp to avoid creasing.");
add("page", "care-warranty", "sealingTitle", "Versiegelung", "Sealing");
add("page", "care-warranty", "sealingText", "Die Stoffe sind wasser- und schmutzabweisend — keine zusätzliche Versiegelung erforderlich. Sollte eine Spezialbehandlung nötig sein, kontaktieren Sie uns.", "The fabrics are water- and soil-repellent — no additional sealing required. Should a special treatment ever be needed, please get in touch.");
add("page", "care-warranty", "washEyebrow", "Waschanleitung", "Washing Instructions");
add("page", "care-warranty", "washTitle", "In drei Schritten sauber.", "Clean in three steps.");
add("page", "care-warranty", "wash.1.title", "Waschen", "Washing");
add("page", "care-warranty", "wash.1.text", "Füllung aus dem Bezug nehmen. Bezug von Hand oder in der Maschine waschen. **Schonwaschgang bei max. 30 °C** wählen und ein mildes Waschmittel verwenden.", "Remove the filling from the cover. Wash the cover by hand or in the machine. Select the **delicate cycle at max. 30 °C** and use a mild detergent.");
add("page", "care-warranty", "wash.2.title", "Fleckenbehandlung", "Treating Stains");
add("page", "care-warranty", "wash.2.text", "Hartnäckige Flecken mit einer Lösung aus **15 ml mildem Waschmittel + 50 ml Haushaltsbleiche** in 1 Liter warmem Wasser (max. 30 °C) behandeln. Fleck vorsichtig abtupfen oder mit einer weichen Bürste lösen, dann wie in Schritt 1 waschen.", "Remove stubborn stains with a solution of **15 ml mild detergent + 50 ml household bleach** in 1 litre of warm water (max. 30 °C). Gently dab the stain or loosen with a soft brush, then wash as in step 1.");
add("page", "care-warranty", "wash.3.title", "Trocknen", "Drying");
add("page", "care-warranty", "wash.3.text", "**Feuchten Bezug flach oder hängend an der Luft trocknen** — nicht in den Trockner, nicht in die direkte Sonne. Bezug noch leicht feucht wieder über die Füllung ziehen, um Faltenbildung zu vermeiden.", "**Dry the damp cover flat or hanging in the open air** — do not tumble dry, do not place in direct sunlight. Pull the cover back over the filling while still damp to avoid creasing.");
add("page", "care-warranty", "careTitle", "Pflege auf einen Blick", "Care at a Glance");
add("page", "care-warranty", "care.1.label", "Schonwaschgang, kein Weichspüler", "Delicate wash, no fabric softener");
add("page", "care-warranty", "care.2.label", "Verdünnte Bleiche erlaubt", "Diluted bleach permitted");
add("page", "care-warranty", "care.3.label", "Nicht in den Trockner", "Do not tumble dry");
add("page", "care-warranty", "care.4.label", "An der Luft trocknen", "Air dry");
add("page", "care-warranty", "care.5.label", "Von Wärmequellen fernhalten, trocken lagern", "Keep away from heat, store dry");
add("page", "care-warranty", "warrantyYears", "Jahre auf Mosaroma.", "Years on Mosaroma.");
add("page", "care-warranty", "warrantyText1", "Wir wissen, wie wichtig Qualität und Zuverlässigkeit sind. Deshalb stehen wir hinter allen Mosaroma-Stoffen mit umfassenden Garantien.", "We know how important quality and reliability are. That is why we stand behind all Mosaroma fabrics with comprehensive warranties.");
add("page", "care-warranty", "warrantyText2", "Unsere Bezugsstoffe sind durch eine beschränkte 3-Jahres-Garantie abgedeckt, die Schutz vor Festigkeits- oder Farbverlust, Pilling und Abrieb bei normaler Nutzung und Witterung bietet.", "Our upholstery fabrics are covered by a limited 3-year warranty that provides protection against loss of strength or colour, pilling and abrasion from normal use and weathering.");
add("page", "care-warranty", "cta.title", "Mehr über unsere Materialien", "More about our materials");
add("page", "care-warranty", "cta.description", "Detaillierte Informationen zu Stoffqualitäten, Prüfwerten und Pflegeeigenschaften finden Sie auf unserer Materialien-Seite.", "Detailed information on fabric qualities, test values and care properties can be found on our materials page.");
add("page", "care-warranty", "cta.primaryLabel", "Materialien entdecken", "Discover materials");
add("page", "care-warranty", "cta.secondaryLabel", "Kontakt aufnehmen", "Contact us");

/* ------------------------------------------------------------------ */
/*  39. Fabric Technical Data page translations                        */
/* ------------------------------------------------------------------ */

add("page", "fabric-technical-data", "seoTitle", "Stoff- & technische Daten | Mosaroma", "Fabric Technical Data | Mosaroma");
add("page", "fabric-technical-data", "seoDescription", "Technische Informationen zu Mosaroma-Stoffqualitäten, Materialien, Gewichten und Prüfwerten.", "Technical information on Mosaroma fabric qualities, materials, weights and test values.");
add("page", "fabric-technical-data", "breadcrumb.catalogues", "Kataloge", "Catalogues");
add("page", "fabric-technical-data", "breadcrumb.self", "Stoff- & technische Daten", "Fabric Technical Data");
add("page", "fabric-technical-data", "qualitiesEyebrow", "Stoffqualitäten", "Fabric Qualities");
add("page", "fabric-technical-data", "qualitiesTitle", "Material & Gewicht", "Material & Weight");
add("page", "fabric-technical-data", "comparisonTitle", "Eigenschaftsvergleich", "Properties Comparison");
add("page", "fabric-technical-data", "table.property", "Eigenschaft", "Property");
add("page", "fabric-technical-data", "table.standard", "Prüfnorm", "Test Standard");
add("page", "fabric-technical-data", "table.olefin", "Solution Dyed Olefin", "Solution Dyed Olefin");
add("page", "fabric-technical-data", "table.polyester", "Stückgefärbter Polyester", "Piece Dyed Polyester");
add("page", "fabric-technical-data", "mackintoshTitle", "Mackintosh® im Detail", "Mackintosh® in Detail");
add("page", "fabric-technical-data", "discoverLink", "Alle Materialien entdecken", "Discover all materials");
add("page", "fabric-technical-data", "cta.title", "Fragen zu Stoffen oder technischen Daten?", "Questions about fabrics or technical data?");
add("page", "fabric-technical-data", "cta.description", "Wir beraten Sie gern zu Materialien, Prüfwerten und Stoffqualitäten.", "We are happy to advise on materials, test values and fabric qualities.");
add("page", "fabric-technical-data", "cta.primaryLabel", "Kontakt aufnehmen", "Contact us");
add("page", "fabric-technical-data", "cta.secondaryLabel", "Zurück zu Kataloge", "Back to Catalogues");

/* ------------------------------------------------------------------ */
/*  40. Materials page — additional UI string translations             */
/* ------------------------------------------------------------------ */

add("material", "mackintosh-technology", "eyebrow", "Technologie", "Technology");
add("material", "mackintosh-technology", "benefitsTitle", "Vorteile der Mackintosh® Technologie", "Benefits of Mackintosh® Technology");
add("material", "mackintosh-technology", "step.1.label", "100 % PP", "100% PP");
add("material", "mackintosh-technology", "step.2.label", "Additiv wasserabweisend", "Additive water-repellent");
add("material", "mackintosh-technology", "step.3.label", "Spinndüsengefärbte UV-Pigmente", "Solution-dyed UV pigments");

add("material", "olefin-benefits", "title", "Warum Olefin?", "Why Olefin?");

add("material", "ocean-cycle", "eyebrow", "Nachhaltigkeit", "Sustainability");

add("page", "materials", "breadcrumb", "Materialien", "Materials");
add("page", "materials", "qualitiesLabel", "Qualitäten", "Qualities");
add("page", "materials", "familiesTitle", "Unsere Stofffamilien", "Our Fabric Families");
add("page", "materials", "familiesDescription", "4 Stofffamilien, entwickelt für verschiedene Outdoor-Anforderungen — von Premium-Olefin bis recyceltem Ozean-Polypropylen.", "4 fabric families, developed for different outdoor requirements — from premium olefin to recycled ocean polypropylene.");
add("page", "materials", "label.material", "Material", "Material");
add("page", "materials", "label.weight", "Gewicht", "Weight");
add("page", "materials", "label.dyeing", "Färbung", "Dyeing");
add("page", "materials", "viewFabrics", "Stoffe ansehen", "View fabrics");
add("page", "materials", "fabricsTitle", "Stoffe & Muster entdecken", "Discover Fabrics & Samples");
add("page", "materials", "fabricsDescription", "Durchsuchen Sie unsere komplette Stoffbibliothek — filtern Sie nach Stofffamilie, Produkttyp oder suchen Sie nach Stoffname und Artikelnummer.", "Browse our complete fabric library — filter by fabric family, product type or search by fabric name and article number.");
add("page", "materials", "cta.primaryLabel", "Katalog ansehen", "View catalogue");

/* ------------------------------------------------------------------ */
/*  41. Technical data page — field name alignment                     */
/* ------------------------------------------------------------------ */

add("page", "technical-data", "breadcrumb.materials", "Materialien", "Materials");
add("page", "technical-data", "breadcrumb.self", "Technische Daten", "Technical Data");
add("page", "technical-data", "qualitiesEyebrow", "Stoffqualitäten", "Fabric Qualities");
add("page", "technical-data", "qualitiesTitle", "Material & Gewicht", "Material & Weight");
add("page", "technical-data", "comparisonTitle", "Eigenschaftsvergleich", "Properties Comparison");
add("page", "technical-data", "mackintoshTitle", "Mackintosh® im Detail", "Mackintosh® in Detail");
add("page", "technical-data", "discoverLink", "Alle Materialien entdecken", "Discover all materials");
add("page", "technical-data", "label.material", "Material", "Material");
add("page", "technical-data", "label.weight", "Gewicht", "Weight");
add("page", "technical-data", "label.dyeing", "Färbung", "Dyeing");
add("page", "technical-data", "label.comfort", "Komfort", "Comfort");
add("page", "technical-data", "label.cushion", "Kissen", "Cushion");
add("page", "technical-data", "cta.primaryLabel", "Kontakt aufnehmen", "Contact us");
add("page", "technical-data", "cta.secondaryLabel", "Katalog ansehen", "View catalogue");

add("page", "technical-data", "fabric.mackintosh.material", "100 % Olefin", "100% Olefin");
add("page", "technical-data", "fabric.mackintosh.weight", "ab 260 g/m²", "from 260 g/m²");
add("page", "technical-data", "fabric.mackintosh.dyeing", "spinndüsengefärbt", "solution-dyed");
add("page", "technical-data", "fabric.mackintosh.comfort", "hoher Sitzkomfort", "high seating comfort");
add("page", "technical-data", "fabric.mackintosh.cushionThickness", "5–6 cm starke Kissen", "5–6 cm thick cushions");

add("page", "technical-data", "fabric.mackintosh-lite.material", "100 % Olefin", "100% Olefin");
add("page", "technical-data", "fabric.mackintosh-lite.weight", "ca. 170–300 g/m²", "approx. 170–300 g/m²");
add("page", "technical-data", "fabric.mackintosh-lite.dyeing", "spinndüsengefärbt", "solution-dyed");
add("page", "technical-data", "fabric.mackintosh-lite.comfort", "hoher Sitzkomfort", "high seating comfort");
add("page", "technical-data", "fabric.mackintosh-lite.cushionThickness", "5–6 cm Kissen", "5–6 cm cushions");
add("page", "technical-data", "fabric.mackintosh-lite.description", "etwas leichteres Gewebe", "slightly lighter fabric");

add("page", "technical-data", "fabric.nerio.material", "100 % Olefin (50 % recycelt)", "100% Olefin (50% recycled)");
add("page", "technical-data", "fabric.nerio.weight", "ca. 200–230 g/m²", "approx. 200–230 g/m²");
add("page", "technical-data", "fabric.nerio.dyeing", "spinndüsengefärbt", "solution-dyed");
add("page", "technical-data", "fabric.nerio.comfort", "hoher Sitzkomfort", "high seating comfort");
add("page", "technical-data", "fabric.nerio.cushionThickness", "5–6 cm Kissen", "5–6 cm cushions");
add("page", "technical-data", "fabric.nerio.subtitle", "Aus dem Ozean geboren. Für die Zukunft gemacht.", "Born from the ocean. Made for the future.");

add("page", "technical-data", "fabric.basic.material", "100 % Polyester", "100% Polyester");
add("page", "technical-data", "fabric.basic.weight", "ca. 280 g/m²", "approx. 280 g/m²");
add("page", "technical-data", "fabric.basic.dyeing", "stückgefärbt", "piece-dyed");
add("page", "technical-data", "fabric.basic.comfort", "angenehmer Sitzkomfort", "comfortable seating comfort");
add("page", "technical-data", "fabric.basic.description", "weiche Haptik", "soft hand feel");

add("page", "technical-data", "highlight.1", "Höchste Lichtechtheit (7–8)", "Highest lightfastness (7–8)");
add("page", "technical-data", "highlight.2", "UV-Beständigkeit 5/5", "UV resistance 5/5");
add("page", "technical-data", "highlight.3", "Wasseraufnahme < 0,1 %", "Water uptake < 0.1%");
add("page", "technical-data", "highlight.4", "Bleichfest", "Bleach-resistant");
add("page", "technical-data", "highlight.5", "Schimmelfest", "Mould-resistant");
add("page", "technical-data", "highlight.6", "PFAS-frei", "PFAS-free");

/* ------------------------------------------------------------------ */
/*  42. News article translations                                      */
/* ------------------------------------------------------------------ */

add("newsArticle", "neue-kollektionen-2027", "title", "Neue Kollektionen Saison 2027", "New Collections Season 2027");
add("newsArticle", "neue-kollektionen-2027", "tag", "Kollektionen", "Collections");
add("newsArticle", "neue-kollektionen-2027", "description", "Sieben neue Farbwelten für die Saison 2027: Von frischen Grüntönen über kühles Blau und warmes Rot bis zu sonnigem Gelb, erdigen Naturtönen, der nachhaltigen NERIO Oceana Linie und unkomplizierter Basic-Qualität.", "Seven new colour worlds for the 2027 season: from fresh greens through cool blues and warm reds to sunny yellows, earthy natural tones, the sustainable NERIO Oceana line and simple Basic quality.");

add("newsArticle", "mackintosh-technologie", "title", "Mackintosh® Technologie erklärt", "Mackintosh® Technology Explained");
add("newsArticle", "mackintosh-technologie", "tag", "Materialien", "Materials");
add("newsArticle", "mackintosh-technologie", "description", "Spinndüsengefärbtes Olefin bildet die Grundlage unserer Mackintosh®-Stoffe. Die Farbe wird bereits bei der Faserherstellung eingebracht — für außergewöhnliche Lichtechtheit, UV-Beständigkeit und eine niedrige CO₂-Bilanz.", "Solution-dyed olefin forms the basis of our Mackintosh® fabrics. The colour is introduced during fibre production — for exceptional lightfastness, UV resistance and a low carbon footprint.");

add("newsArticle", "nerio-oceana", "tag", "Nachhaltigkeit", "Sustainability");
add("newsArticle", "nerio-oceana", "description", "Performance-Outdoorstoffe auf Basis von OceanCycle recyceltem Polypropylen. Solution-dyed, PFAS-frei und entwickelt für hohe Anforderungen im Außenbereich — aus dem Ozean geboren, für die Zukunft gemacht.", "Performance outdoor fabrics based on OceanCycle recycled polypropylene. Solution-dyed, PFAS-free and developed for demanding outdoor use — born from the ocean, made for the future.");

add("newsArticle", "pflegehinweise", "title", "Pflegehinweise für Outdoor-Textilien", "Care Instructions for Outdoor Textiles");
add("newsArticle", "pflegehinweise", "tag", "Service", "Service");
add("newsArticle", "pflegehinweise", "description", "Richtige Pflege verlängert die Lebensdauer Ihrer Outdoor-Textilien erheblich. Unsere Empfehlungen zu Reinigung, Lagerung und Fleckenentfernung für alle MOSAROMA-Stoffqualitäten.", "Proper care significantly extends the life of your outdoor textiles. Our recommendations on cleaning, storage and stain removal for all MOSAROMA fabric qualities.");

/* ------------------------------------------------------------------ */
/*  43. Download translations                                          */
/* ------------------------------------------------------------------ */

add("download", "cmq6hi25z007uyd7d905ahqdm", "title", "Mosaroma Katalog 2027 Deutsch", "Mosaroma Catalogue 2027 German");
add("download", "cmq6hi25z007uyd7d905ahqdm", "description", "Vollständiger Produktkatalog mit allen Kollektionen, Maßen und Stoffqualitäten der Saison 2027.", "Complete product catalogue with all collections, dimensions and fabric qualities for the 2027 season.");

/* ------------------------------------------------------------------ */
/*  43. Fabric family hub translations (materials page cards)          */
/* ------------------------------------------------------------------ */

add("fabricFamily", "mackintosh", "dyeing", "spinndüsengefärbt", "solution-dyed");
add("fabricFamily", "mackintosh", "comfort", "hoher Sitzkomfort", "high seating comfort");
add("fabricFamily", "mackintosh", "cushionThickness", "5–6 cm starke Auflagen", "5–6 cm thick cushions");
add("fabricFamily", "mackintosh", "highlight.1", "Höchste Lichtechtheit (7–8)", "Highest lightfastness (7–8)");
add("fabricFamily", "mackintosh", "highlight.2", "UV-Beständigkeit 5/5", "UV resistance 5/5");
add("fabricFamily", "mackintosh", "highlight.3", "Wasseraufnahme < 0,1 %", "Water absorption < 0.1%");
add("fabricFamily", "mackintosh", "highlight.4", "Bleichfest", "Bleach resistant");
add("fabricFamily", "mackintosh", "highlight.5", "Schimmelfest", "Mould resistant");
add("fabricFamily", "mackintosh", "highlight.6", "PFAS-frei", "PFAS-free");

add("fabricFamily", "mackintosh-lite", "dyeing", "spinndüsengefärbt", "solution-dyed");
add("fabricFamily", "mackintosh-lite", "comfort", "hoher Sitzkomfort", "high seating comfort");
add("fabricFamily", "mackintosh-lite", "cushionThickness", "5–6 cm Auflagen", "5–6 cm cushions");

add("fabricFamily", "basic", "dyeing", "konventionell gefärbt", "conventionally dyed");
add("fabricFamily", "basic", "comfort", "guter Sitzkomfort", "comfortable seating");
add("fabricFamily", "basic", "cushionThickness", "4–5 cm Auflagen", "4–5 cm cushions");

add("fabricFamily", "nerio", "dyeing", "spinndüsengefärbt", "solution-dyed");
add("fabricFamily", "nerio", "subtitle", "Aus dem Ozean geboren. Für die Zukunft gemacht.", "Born from the ocean. Made for the future.");
add("fabricFamily", "nerio", "comfort", "hoher Sitzkomfort", "high seating comfort");
add("fabricFamily", "nerio", "cushionThickness", "5–6 cm Auflagen", "5–6 cm cushions");

add("glossary", "", "spinndüsengefärbt", "spinndüsengefärbt", "solution-dyed");
add("glossary", "", "wasserabweisend", "wasserabweisend", "water-repellent");
add("glossary", "", "farbecht", "farbecht", "colourfast");
add("glossary", "", "lichtecht", "lichtecht", "lightfast");
add("glossary", "", "schimmelfest", "schimmelfest", "mould-resistant");
add("glossary", "", "bleichfest", "bleichfest", "bleach-resistant");
add("glossary", "", "stückgefärbt", "stückgefärbt", "piece-dyed");
add("glossary", "", "Olefin", "Olefin", "olefin");
add("glossary", "", "Polypropylen", "Polypropylen", "polypropylene");

/* ================================================================== */
/*  EXECUTION                                                         */
/* ================================================================== */

async function main() {
  console.log(`\n📋 Content Translation Backfill`);
  console.log(`   Mode: ${dryRun ? "DRY-RUN (use --apply to write)" : "APPLY"}`);
  console.log(`   Entries to process: ${entries.length}\n`);

  let created = 0;
  let skipped = 0;
  let sourceUpdated = 0;

  for (const entry of entries) {
    const where = {
      entityType: entry.entityType,
      entityId: entry.entityId,
      fieldName: entry.fieldName,
      locale: "en",
    };

    const existing = await prisma.contentTranslation.findFirst({ where });

    if (existing) {
      if (existing.sourceText !== entry.sourceText && entry.sourceText) {
        if (dryRun) {
          console.log(`  ↻ UPDATE sourceText  ${entry.entityType}/${entry.entityId}/${entry.fieldName} → STALE`);
        } else {
          await prisma.contentTranslation.update({
            where: { id: existing.id },
            data: {
              sourceText: entry.sourceText,
              status: existing.status === "PUBLISHED" ? "STALE" : existing.status,
            },
          });
        }
        sourceUpdated++;
      } else {
        skipped++;
      }
    } else {
      if (dryRun) {
        console.log(`  + CREATE  ${entry.entityType}/${entry.entityId}/${entry.fieldName}`);
      } else {
        await prisma.contentTranslation.create({
          data: {
            entityType: entry.entityType,
            entityId: entry.entityId,
            fieldName: entry.fieldName,
            locale: "en",
            sourceText: entry.sourceText,
            translatedText: entry.translatedText,
            status: "PUBLISHED",
          },
        });
      }
      created++;
    }
  }

  console.log(`\n✅ Done.`);
  console.log(`   Created: ${created}`);
  console.log(`   Skipped (already exist): ${skipped}`);
  console.log(`   Source updated (→ STALE): ${sourceUpdated}`);

  if (dryRun) {
    console.log(`\n   Run with --apply to write to the database.\n`);
  }

  const total = await prisma.contentTranslation.count();
  console.log(`   Total ContentTranslation records: ${total}\n`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
