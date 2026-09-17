/**
 * Products carry descriptive colour names ("Rose Gold / Tan", "Midnight Black").
 * Shoppers filter by family, so those names are mapped down to a short list with
 * a swatch each. Compound names split on "/" and belong to every family they touch.
 *
 * Order matters — the first keyword that matches wins, so "rose gold" is checked
 * before "gold" and "rose".
 */
export const COLOUR_FAMILIES = [
  { name: "Black", swatch: "#1A1A1A", keywords: ["black", "onyx", "midnight"] },
  { name: "Grey", swatch: "#8D8D8D", keywords: ["grey", "gray", "charcoal", "gunmetal", "steel", "stone"] },
  { name: "White", swatch: "#F4F2EC", keywords: ["white", "ivory", "bone", "cream", "ecru", "pearl"] },
  { name: "Beige", swatch: "#D8C7A3", keywords: ["beige", "champagne", "sand", "natural", "nude"] },
  { name: "Rose Gold", swatch: "#B76E79", keywords: ["rose gold"] },
  { name: "Gold", swatch: "#C9A227", keywords: ["gold", "brass", "two-tone"] },
  { name: "Silver", swatch: "#C3C6CB", keywords: ["silver", "rhodium", "chrome"] },
  { name: "Brown", swatch: "#6B4A2F", keywords: ["brown", "tan", "cognac", "camel", "chocolate", "coffee", "rust"] },
  { name: "Tortoise", swatch: "#7A4A1E", keywords: ["tortoise"] },
  { name: "Green", swatch: "#2E6B4F", keywords: ["green", "olive", "sage", "emerald", "forest"] },
  { name: "Blue", swatch: "#2B4C7E", keywords: ["blue", "navy", "teal"] },
  { name: "Pink", swatch: "#E3A69C", keywords: ["pink", "rose", "blush", "coral"] },
  { name: "Red", swatch: "#7B2D3B", keywords: ["red", "wine", "burgundy", "maroon"] },
] as const;

export type ColourFamily = (typeof COLOUR_FAMILIES)[number]["name"];

const ORDER = new Map(COLOUR_FAMILIES.map((f, i) => [f.name as string, i]));

export const swatchFor = (family: string) =>
  COLOUR_FAMILIES.find((f) => f.name === family)?.swatch ?? "#999999";

/** Every family a single colour name belongs to. "Gold / Green" → ["Gold", "Green"]. */
export function coloursToFamilies(colourName: string): ColourFamily[] {
  const families = new Set<ColourFamily>();

  for (const token of colourName.split("/")) {
    const text = token.trim().toLowerCase();
    if (!text) continue;

    const match = COLOUR_FAMILIES.find((family) =>
      family.keywords.some((keyword) => text.includes(keyword)),
    );
    if (match) families.add(match.name);
  }

  return [...families];
}

/** Sorts any list of family names into palette order. */
export function sortFamilies<T extends string>(families: T[]): T[] {
  return [...families].sort((a, b) => (ORDER.get(a) ?? 0) - (ORDER.get(b) ?? 0));
}

/** All families across a product's colourways, in palette order. */
export function productFamilies(colours: string[]): ColourFamily[] {
  const families = new Set<ColourFamily>();
  colours.forEach((c) => coloursToFamilies(c).forEach((f) => families.add(f)));
  return sortFamilies([...families]);
}
