export const VALUE_PROP_KEY_MAP: Record<string, string> = {
  comfort: "value-comfort",
  quality: "value-quality",
  sustainability: "value-sustainability",
  design: "value-design",
};

export const BENEFIT_KEY_MAP: Record<string, string> = {
  sun: "benefit-sun",
  droplet: "benefit-droplet",
  shield: "benefit-shield",
  star: "benefit-star",
};

export const NERIO_PROMISE_KEY_MAP: Record<string, string> = {
  recycle: "nerio-recycle",
  droplet: "nerio-droplet",
  sun: "nerio-sun",
  shield: "nerio-shield",
};

export const SERVICE_KEY_MAP: Record<string, string> = {
  ruler: "service-ruler",
  shield: "service-shield",
  fabric: "service-fabric",
};

export const SERVICE_SECTION_ICON_KEYS = [
  "arrow-right",
  "checkmark",
  "care-wash-30",
  "care-bleach-dilute",
  "care-no-dryer",
  "care-line-dry",
  "care-no-heat",
  "care-print",
  "benefit-sun",
  "benefit-droplet",
  "benefit-shield",
  "benefit-star",
  "benefit-fallback",
  "ui-flip",
  "ui-image-placeholder",
  "ui-close",
  "category-dekokissen",
  "category-hochlehner",
  "category-niedriglehner",
  "category-sitzkissen",
  "category-sitzpolster",
  "category-bankauflagen",
  "category-poufs",
  "category-tischsets",
  "category-decken",
  "category-default",
] as const;

export const CATEGORY_KEY_MAP: Record<string, string> = {
  dekokissen: "category-dekokissen",
  hochlehner: "category-hochlehner",
  niedriglehner: "category-niedriglehner",
  sitzkissen: "category-sitzkissen",
  sitzpolster: "category-sitzpolster",
  bankauflagen: "category-bankauflagen",
  poufs: "category-poufs",
  "tischsets-tischlaeufer": "category-tischsets",
  decken: "category-decken",
};
