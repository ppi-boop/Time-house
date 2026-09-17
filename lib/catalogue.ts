import { productFamilies } from "@/lib/colours";
import type { Product, ProductFilters, SortKey } from "@/types";

/**
 * Filtering and sorting, with no data access anywhere near it.
 *
 * The listing page runs these in the browser as the visitor moves the filters,
 * so this module has to stay importable from a client component — which means
 * it must never pull in lib/db.
 */
export function filterProducts(
  input: Product[],
  filters: ProductFilters,
): Product[] {
  const search = filters.search?.trim().toLowerCase();

  return input.filter((p) => {
    if (filters.category && p.category !== filters.category) return false;
    if (filters.subCategory && p.subCategory !== filters.subCategory)
      return false;
    if (filters.gender && p.gender !== filters.gender) return false;
    if (filters.inStockOnly && !p.inStock) return false;
    if (filters.minPrice !== undefined && p.price < filters.minPrice)
      return false;
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice)
      return false;
    if (filters.brands?.length && !filters.brands.includes(p.brand))
      return false;
    if (filters.colours?.length) {
      const families = productFamilies(p.colours);
      if (!families.some((f) => filters.colours!.includes(f))) return false;
    }

    if (search) {
      const haystack = [
        p.name,
        p.brand,
        p.shortDescription,
        p.subCategory,
        p.category,
        ...p.tags,
        ...p.colours,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    return true;
  });
}

export function sortProducts(input: Product[], sort: SortKey = "newest") {
  const sorted = [...input];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      // The catalogue arrives in the order the shop arranged it, and Array#sort
      // is stable, so flagging new arrivals to the front is the only work left.
      return sorted.sort((a, b) => Number(b.isNewArrival) - Number(a.isNewArrival));
  }
}
