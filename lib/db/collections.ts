import type { Collection } from "mongodb";
import { getDb } from "@/lib/db/mongo";
import type { Category, Product } from "@/types";

/**
 * Everything the shop owner can edit lives in one of these. Documents mirror
 * the types the site already used when the content came from JSON, plus an
 * `order` so the panel can arrange things by hand.
 */

export type ProductDoc = Product & { order: number; updatedAt: Date };
export type CategoryDoc = Category & { order: number; updatedAt: Date };

export interface TestimonialDoc {
  id: string;
  quote: string;
  name: string;
  detail: string;
  rating: number;
  order: number;
}

export interface FaqDoc {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface LookbookShotDoc {
  id: string;
  image: string;
  href: string;
  order: number;
}

/** One document, `_id: "shop"`, holding everything that is not a list. */
export interface SettingsDoc {
  _id: "shop";
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  logo: string | null;
  email: string;
  phone: string;
  whatsapp: string;
  foundedYear: number;
  address: {
    street: string;
    locality: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  geo: { latitude: number; longitude: number };
  hours: { days: string; time: string }[];
  socials: { instagram: string; facebook: string; youtube: string };
  announcements: string[];
  /** The four promise cards under the banner. */
  trustPoints: { title: string; body: string }[];
  home: {
    heroEyebrow: string;
    heroTitleTop: string;
    heroTitleBottom: string;
    heroBody: string;
    storyTitle: string;
    storyQuote: string;
    storyBody: string;
    storyImage: string;
    storyWideImage: string;
  };
  updatedAt: Date;
}

export async function products(): Promise<Collection<ProductDoc>> {
  return (await getDb()).collection<ProductDoc>("products");
}

export async function categories(): Promise<Collection<CategoryDoc>> {
  return (await getDb()).collection<CategoryDoc>("categories");
}

export async function testimonials(): Promise<Collection<TestimonialDoc>> {
  return (await getDb()).collection<TestimonialDoc>("testimonials");
}

export async function faqs(): Promise<Collection<FaqDoc>> {
  return (await getDb()).collection<FaqDoc>("faqs");
}

export async function lookbook(): Promise<Collection<LookbookShotDoc>> {
  return (await getDb()).collection<LookbookShotDoc>("lookbook");
}

export async function settings(): Promise<Collection<SettingsDoc>> {
  return (await getDb()).collection<SettingsDoc>("settings");
}
