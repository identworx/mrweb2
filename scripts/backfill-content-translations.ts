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
