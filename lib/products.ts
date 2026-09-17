import "server-only";
import { productFamilies, sortFamilies } from "@/lib/colours";
import { filterProducts, sortProducts } from "@/lib/catalogue";
import { getCategories as readCategories, getProducts as readProducts } from "@/lib/db/content";
import type {
  CatalogueIndex,
  Category,
  CategorySlug,
  Product,
  ProductFilters,
} from "@/types";

/**
 * The data layer.
 *
 * Everything reads products through these async functions. They now sit on top
 * of MongoDB (lib/db/content.ts), which caches each read and falls back to the
 * JSON seed if the database cannot be reached — so no page or component has to
 * know where the catalogue actually lives.
 */

export async function getCategories(): Promise<Category[]> {
  return readCategories();
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  return (await readCategories()).find((c) => c.slug === slug);
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<Product[]> {
  return sortProducts(filterProducts(await readProducts(), filters), filters.sort);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  return (await readProducts()).find((p) => p.slug === slug);
}


/**
 * Three pieces for the home banner, one per category, so the composition shows
 * the range of the shop rather than three variations on a watch.
 */
export async function getShowcase(limit = 3): Promise<Product[]> {
  // Taken from the categories themselves rather than a list written here, so a
  // category added in the admin panel can appear in the banner too.
  const preferred = (await readCategories()).map((category) => category.slug);
  const products = await readProducts();
  const picks: Product[] = [];

  for (const slug of preferred) {
    if (picks.length >= limit) break;
    const pick =
      products.find((p) => p.category === slug && p.isFeatured && p.inStock) ??
      products.find((p) => p.category === slug && p.inStock);
    if (pick) picks.push(pick);
  }

  return picks.slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return (await readProducts()).filter((p) => p.isNewArrival).slice(0, limit);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  return (await readProducts())
    .filter((p) => p.tags.includes("bestseller"))
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
}

/** Same sub-category first, then anything else from the category. */
export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const pool = (await readProducts()).filter(
    (p) => p.id !== product.id && p.category === product.category,
  );
  const ranked = [
    ...pool.filter((p) => p.subCategory === product.subCategory),
    ...pool.filter((p) => p.subCategory !== product.subCategory),
  ];
  return ranked.slice(0, limit);
}

/** Facet values for the filter panel, scoped to a category when given. */
export async function getFilterFacets(category?: CategorySlug) {
  const all = await readProducts();
  const pool = category ? all.filter((p) => p.category === category) : all;
  const prices = pool.map((p) => p.price);
  return {
    brands: [...new Set(pool.map((p) => p.brand))].sort(),
    // Families, kept in palette order rather than alphabetical.
    colours: sortFamilies([
      ...new Set(pool.flatMap((p) => productFamilies(p.colours))),
    ]),
    subCategories: [...new Set(pool.map((p) => p.subCategory))].sort(),
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
  };
}

export async function getAllProductSlugs(): Promise<string[]> {
  return (await readProducts()).map((p) => p.slug);
}

/**
 * Just enough of each product to re-render a saved enquiry line: name, price,
 * SKU and the current photo. The enquiry list keeps its own snapshot in
 * localStorage, which goes stale the moment a price or a photograph changes,
 * so the page hands this over and the stored copy is only a fallback for
 * pieces that have since left the catalogue.
 */
export async function getCatalogueIndex(): Promise<CatalogueIndex> {
  return Object.fromEntries(
    (await readProducts()).map((p) => [
      p.slug,
      { name: p.name, sku: p.sku, price: p.price, image: p.images[0], inStock: p.inStock },
    ]),
  );
}

export { filterProducts, sortProducts } from "@/lib/catalogue";
