import { getCategories, getProducts } from "@/lib/products";
import { slugToTitle } from "@/lib/utils";
import type { CategorySlug } from "@/types";

/**
 * Everything the header needs, prepared on the server so the menu and the search
 * palette have data on first paint rather than after a fetch.
 */

export interface MenuProduct {
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
}

export interface MenuSubCategory {
  slug: string;
  name: string;
  href: string;
  count: number;
}

export interface MenuCategory {
  slug: CategorySlug;
  name: string;
  href: string;
  tagline: string;
  image: string;
  count: number;
  subCategories: MenuSubCategory[];
  featured: MenuProduct[];
}

export interface SearchDoc extends MenuProduct {
  category: string;
  categorySlug: CategorySlug;
  subCategory: string;
  keywords: string;
  inStock: boolean;
}

const toMenuProduct = (p: {
  slug: string;
  name: string;
  brand: string;
  price: number;
  images: string[];
}): MenuProduct => ({
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  price: p.price,
  image: p.images[0],
});

export async function getMegaMenu(): Promise<MenuCategory[]> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return categories.map((category) => {
    const inCategory = products.filter((p) => p.category === category.slug);

    // Prefer new arrivals, then anything flagged featured, then whatever is in stock.
    const featured = [
      ...inCategory.filter((p) => p.isNewArrival && p.inStock),
      ...inCategory.filter((p) => p.isFeatured && p.inStock),
      ...inCategory.filter((p) => p.inStock),
    ];
    const unique = [...new Map(featured.map((p) => [p.id, p])).values()].slice(0, 2);

    return {
      slug: category.slug,
      name: category.name,
      href: `/category/${category.slug}`,
      tagline: category.tagline,
      image: category.image,
      count: inCategory.length,
      subCategories: category.subCategories.map((sub) => ({
        slug: sub.slug,
        name: sub.name,
        href: `/category/${category.slug}?type=${sub.slug}`,
        count: inCategory.filter((p) => p.subCategory === sub.slug).length,
      })),
      featured: unique.map(toMenuProduct),
    };
  });
}

export async function getSearchIndex(): Promise<SearchDoc[]> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const names = new Map(categories.map((c) => [c.slug, c.name]));

  return products.map((p) => ({
    ...toMenuProduct(p),
    category: names.get(p.category) ?? slugToTitle(p.category),
    categorySlug: p.category,
    subCategory: slugToTitle(p.subCategory),
    inStock: p.inStock,
    // One lowercase haystack so the palette can match on a single field.
    keywords: [p.name, p.brand, p.shortDescription, p.subCategory, ...p.tags, ...p.colours]
      .join(" ")
      .toLowerCase(),
  }));
}
