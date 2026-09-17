/**
 * A category's web address.
 *
 * This was a union of the four categories the shop opened with, which meant a
 * category could only ever be added by editing this file. Categories now live
 * in the database and the shop adds its own, so the slug is whatever they
 * chose — the alias stays because it reads better than `string` at the call
 * sites and marks which strings are category addresses.
 */
export type CategorySlug = string;

export type Gender = "men" | "women" | "unisex";

export interface SubCategory {
  slug: string;
  name: string;
}

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  image: string;
  subCategories: SubCategory[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  subCategory: string;
  brand: string;
  price: number;
  mrp: number;
  currency: "INR";
  sku: string;
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
  images: string[];
  colours: string[];
  gender: Gender;
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

/** A product plus the choices the customer made before messaging us. */
export interface EnquiryItem {
  productId: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  image: string;
  category: CategorySlug;
  colour?: string;
  quantity: number;
}

/** Slug -> the live fields an enquiry line needs to stay accurate. */
export type CatalogueIndex = Record<
  string,
  { name: string; sku: string; price: number; image: string; inStock: boolean }
>;

export type SortKey = "newest" | "price-asc" | "price-desc" | "name-asc";

export interface ProductFilters {
  category?: CategorySlug;
  subCategory?: string;
  brands?: string[];
  colours?: string[];
  gender?: Gender;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  search?: string;
  sort?: SortKey;
}
