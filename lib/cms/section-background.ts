export const SECTION_BACKGROUNDS = [
  { value: "white", label: "Weiß", className: "bg-white", tone: "light" },
  { value: "cream", label: "Creme", className: "bg-cream", tone: "light" },
  { value: "light-gray", label: "Hellgrau", className: "bg-light-gray", tone: "light" },
  { value: "anthracite", label: "Anthrazit", className: "bg-anthracite", tone: "dark" },
  { value: "pumpkin", label: "Pumpkin", className: "bg-pumpkin", tone: "dark" },
] as const;

export type SectionBackground = (typeof SECTION_BACKGROUNDS)[number]["value"];
export type SectionTone = (typeof SECTION_BACKGROUNDS)[number]["tone"];

export interface ResolvedSectionBackground {
  value: SectionBackground;
  className: string;
  tone: SectionTone;
}

export function resolveSectionBackground(
  value: unknown,
  fallback: SectionBackground,
): ResolvedSectionBackground {
  const match =
    SECTION_BACKGROUNDS.find((b) => b.value === value) ??
    SECTION_BACKGROUNDS.find((b) => b.value === fallback)!;
  return { value: match.value, className: match.className, tone: match.tone };
}
