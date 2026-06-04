import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Bitte gültige E-Mail eingeben"),
  password: z.string().min(1, "Passwort erforderlich"),
});

export const pageSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  eyebrow: z.string().optional(),
  headline: z.string().optional(),
  introText: z.string().optional(),
  heroImageId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  type: z.enum([
    "HOME", "STANDARD", "COLLECTION_INDEX", "COLLECTION_DETAIL",
    "MATERIAL_INDEX", "CATALOG_INDEX", "SERVICE", "NEWS_INDEX",
    "CONTACT", "LEGAL",
  ]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  showInNavigation: z.boolean().optional(),
});

export const collectionSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  number: z.number().int().optional(),
  subtitle: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  heroImageId: z.string().optional(),
  cardImageId: z.string().optional(),
  moodColors: z.array(z.string()).optional(),
  fabric: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  order: z.number().int().optional(),
});

export const productSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  collectionId: z.string().min(1),
  productGroupId: z.string().min(1),
  materialId: z.string().optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  code: z.string().optional(),
  size: z.string().optional(),
  colorName: z.string().optional(),
  patternName: z.string().optional(),
  features: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const navigationItemSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  target: z.string().optional(),
  order: z.number().int(),
  isActive: z.boolean().optional(),
  parentId: z.string().optional(),
});

export const mediaSchema = z.object({
  alt: z.string().optional(),
  title: z.string().optional(),
  caption: z.string().optional(),
  folder: z.string().optional(),
});

export const formSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  submitLabel: z.string().optional(),
  successMessage: z.string().optional(),
  errorMessage: z.string().optional(),
  recipientEmail: z.email().optional(),
  privacyText: z.string().optional(),
});

export const formFieldSchema = z.object({
  type: z.enum([
    "TEXT", "EMAIL", "PHONE", "TEXTAREA", "SELECT",
    "CHECKBOX", "RADIO", "FILE", "CONSENT",
  ]),
  label: z.string().min(1),
  placeholder: z.string().optional(),
  name: z.string().min(1),
  helpText: z.string().optional(),
  required: z.boolean().optional(),
  options: z.array(z.string()).optional(),
  order: z.number().int(),
  isActive: z.boolean().optional(),
});
