import type { MetadataRoute } from "next";
import { getCollectionStaticParams } from "@/lib/cms/collections";
import { getProductStaticParams } from "@/lib/cms/products";
import { getProductGroupStaticParams } from "@/lib/cms/product-groups";
import { getNewsStaticParams } from "@/lib/cms/news";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.mosaroma.de";

const staticDeRoutes = [
  "/",
  "/ueber-uns",
  "/kollektionen",
  "/kollektionen/ambiente",
  "/materialien",
  "/materialien/stoffe-muster",
  "/materialien/technische-daten",
  "/nerio",
  "/kataloge",
  "/kataloge/produktmasse",
  "/kataloge/pflege-garantie",
  "/kataloge/stoff-technische-daten",
  "/kontakt",
  "/produktkategorien",
  "/neuigkeiten",
  "/impressum",
  "/datenschutz",
  "/agb",
];

const staticEnRoutes = [
  "/en",
  "/en/about-us",
  "/en/collections",
  "/en/collections/ambiente",
  "/en/materials",
  "/en/materials/fabrics-samples",
  "/en/materials/technical-data",
  "/en/nerio",
  "/en/catalogues",
  "/en/catalogues/product-dimensions",
  "/en/catalogues/care-warranty",
  "/en/catalogues/fabric-technical-data",
  "/en/contact",
  "/en/product-categories",
  "/en/news",
  "/en/legal-notice",
  "/en/privacy-policy",
  "/en/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, products, productGroups, news] = await Promise.all([
    getCollectionStaticParams(),
    getProductStaticParams(),
    getProductGroupStaticParams(),
    getNewsStaticParams(),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const route of staticDeRoutes) {
    entries.push({ url: `${BASE_URL}${route}`, changeFrequency: "weekly", priority: route === "/" ? 1.0 : 0.8 });
  }

  for (const route of staticEnRoutes) {
    entries.push({ url: `${BASE_URL}${route}`, changeFrequency: "weekly", priority: route === "/en" ? 0.9 : 0.7 });
  }

  for (const { slug } of collections) {
    entries.push({ url: `${BASE_URL}/kollektionen/${slug}`, changeFrequency: "weekly", priority: 0.7 });
    entries.push({ url: `${BASE_URL}/en/collections/${slug}`, changeFrequency: "weekly", priority: 0.6 });
  }

  for (const { slug } of products) {
    entries.push({ url: `${BASE_URL}/produkte/${slug}`, changeFrequency: "weekly", priority: 0.7 });
    entries.push({ url: `${BASE_URL}/en/products/${slug}`, changeFrequency: "weekly", priority: 0.6 });
  }

  for (const { slug } of productGroups) {
    entries.push({ url: `${BASE_URL}/produktkategorien/${slug}`, changeFrequency: "weekly", priority: 0.7 });
    entries.push({ url: `${BASE_URL}/en/product-categories/${slug}`, changeFrequency: "weekly", priority: 0.6 });
  }

  for (const { slug } of news) {
    entries.push({ url: `${BASE_URL}/neuigkeiten/${slug}`, changeFrequency: "monthly", priority: 0.5 });
    entries.push({ url: `${BASE_URL}/en/news/${slug}`, changeFrequency: "monthly", priority: 0.4 });
  }

  return entries;
}
