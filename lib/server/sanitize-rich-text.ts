import "server-only";
import sanitize from "sanitize-html";

const ALLOWED_TAGS = [
  "p",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "br",
  "a",
  "h3",
  "h4",
];

const SANITIZE_OPTIONS: sanitize.IOptions = {
  allowedTags: ALLOWED_TAGS,
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: "noopener noreferrer",
      },
    }),
  },
  disallowedTagsMode: "discard",
};

export function sanitizeRichText(input: string): string {
  if (!input || typeof input !== "string") return "";
  return sanitize(input, SANITIZE_OPTIONS).trim();
}

export function isRichTextEmpty(input: string): boolean {
  if (!input) return true;
  const stripped = input
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
  return stripped.length === 0;
}
