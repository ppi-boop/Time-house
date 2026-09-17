import "server-only";
import { unstable_cache } from "next/cache";
import { isDatabaseConfigured } from "@/lib/db/mongo";
import * as db from "@/lib/db/collections";
import type { Category, Product } from "@/types";
import type { FaqDoc, LookbookShotDoc, SettingsDoc, TestimonialDoc } from "@/lib/db/collections";

/**
 * Reads for the public site.
 *
 * Every page goes through here rather than touching Mongo directly, so the
 * results can be cached under one tag and an admin save refreshes the whole
 * site at once.
 *
 * MongoDB is the only source of the catalogue. There used to be JSON seed files
 * behind these reads, but once the shop started editing its own products that
 * copy only ever went stale — an outage would have quietly served a catalogue
 * from the day the site was built. A read that fails now returns nothing and
 * says so in the log, which is honest rather than misleading.
 */

/** One tag for the lot — the site is small and an edit rarely touches one page. */
export const CONTENT_TAG = "shop-content";

const PLACEHOLDER = "/products/placeholder.svg";

function withImages(product: Product): Product {
  return { ...product, images: product.images?.length ? product.images : [PLACEHOLDER] };
}

/** A category added today may not have a card picture yet. */
function withCardImage(category: Category): Category {
  return { ...category, image: category.image || PLACEHOLDER };
}

/** Strips Mongo's _id so the object can cross into a client component. */
function plain<T>(doc: T & { _id?: unknown }): T {
  const copy = { ...(doc as Record<string, unknown>) };
  delete copy._id;
  return copy as T;
}

async function safely<T>(what: string, read: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDatabaseConfigured) return fallback;
  try {
    return await read();
  } catch (error) {
    // A customer should see an empty shelf, not a stack trace.
    console.error(`[content] ${what} could not be read:`, error);
    return fallback;
  }
}

export const getProducts = unstable_cache(
  async (): Promise<Product[]> =>
    safely(
      "products",
      async () => {
        const docs = await (await db.products()).find({}).sort({ order: 1 }).toArray();
        return docs.map((doc) => withImages(plain(doc) as Product));
      },
      [],
    ),
  ["products"],
  { tags: [CONTENT_TAG] },
);

export const getCategories = unstable_cache(
  async (): Promise<Category[]> =>
    safely(
      "categories",
      async () => {
        const docs = await (await db.categories()).find({}).sort({ order: 1 }).toArray();
        return docs.map((doc) => withCardImage(plain(doc) as Category));
      },
      [],
    ),
  ["categories"],
  { tags: [CONTENT_TAG] },
);

export const getTestimonials = unstable_cache(
  async (): Promise<TestimonialDoc[]> =>
    safely(
      "testimonials",
      async () => {
        const docs = await (await db.testimonials()).find({}).sort({ order: 1 }).toArray();
        return docs.map((doc) => plain(doc));
      },
      [],
    ),
  ["testimonials"],
  { tags: [CONTENT_TAG] },
);

export const getFaqs = unstable_cache(
  async (): Promise<FaqDoc[]> =>
    safely(
      "faqs",
      async () => {
        const docs = await (await db.faqs()).find({}).sort({ order: 1 }).toArray();
        return docs.map((doc) => plain(doc));
      },
      [],
    ),
  ["faqs"],
  { tags: [CONTENT_TAG] },
);

export const getLookbook = unstable_cache(
  async (): Promise<LookbookShotDoc[]> =>
    safely(
      "lookbook",
      async () => {
        const docs = await (await db.lookbook()).find({}).sort({ order: 1 }).toArray();
        return docs.map((doc) => plain(doc));
      },
      [1, 2, 3, 4, 5, 6].map((n) => ({
        id: `look-${n}`,
        image: `/products/lookbook-${n}.webp`,
        href: "/products",
        order: n - 1,
      })),
    ),
  ["lookbook"],
  { tags: [CONTENT_TAG] },
);

/**
 * Shop details. The fallback mirrors the values that used to live in
 * lib/constants.ts, so a database outage changes nothing a visitor can see.
 */
export const FALLBACK_SETTINGS: Omit<SettingsDoc, "_id" | "updatedAt"> = {
  name: "Time House",
  legalName: "Time House Retail",
  tagline: "Watches, bags and accessories, chosen by hand.",
  description:
    "Time House is a family-run boutique for watches, ladies bags and everyday accessories. Browse the collection online, then message us on WhatsApp to buy — no forms, no waiting.",
  logo: null,
  email: "hello@timehouse.example.com",
  phone: "+919876543210",
  whatsapp: "919876543210",
  foundedYear: 2011,
  address: {
    street: "Shop 12, Ground Floor, Crystal Plaza",
    locality: "C G Road",
    city: "Ahmedabad",
    region: "Gujarat",
    postalCode: "380009",
    country: "IN",
  },
  geo: { latitude: 23.0225, longitude: 72.5714 },
  hours: [
    { days: "Monday – Saturday", time: "10:30 am – 9:00 pm" },
    { days: "Sunday", time: "11:00 am – 7:00 pm" },
  ],
  socials: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
  announcements: [
    "Browse here, order on WhatsApp",
    "We reply within the hour, shop hours",
    "7-day easy exchange, in store",
    "Free gift box and engraving",
  ],
  trustPoints: [
    {
      title: "Hand-picked & authentic",
      body: "Every piece is selected in store. What you see is what we sell.",
    },
    {
      title: "Personal service on WhatsApp",
      body: "Talk to a real person about fit, colour and availability.",
    },
    { title: "7-day easy exchange", body: "Bring it back with the bill and tags. No questions." },
    { title: "Reserve & collect", body: "We will hold your piece at the counter for 48 hours." },
  ],
  home: {
    heroEyebrow: "Est. 2011 · Ahmedabad",
    heroTitleTop: "Time, worn well.",
    heroTitleBottom: "Carried every day.",
    heroBody:
      "Watches, ladies bags and accessories picked one piece at a time. Browse the whole collection here — then message us on WhatsApp and we will take it from there.",
    storyTitle: "One counter, since 2011",
    storyQuote:
      "We started with a single glass case of watches on C G Road. Fourteen years later the case is longer and the shelves behind it hold bags and accessories, but the way we work has not changed: we buy what we would wear, we say so when something is not right for you, and we would rather you came back than bought twice.",
    storyBody:
      "The website is the catalogue. The conversation still happens the way it always has — with a person, on WhatsApp or across the counter.",
    // Deliberately the placeholder rather than a real photograph: these
    // defaults only appear when the settings document is missing, and a
    // fallback must never quietly publish a picture that carries a licence.
    storyImage: PLACEHOLDER,
    storyWideImage: PLACEHOLDER,
  },
};

export type ShopSettings = typeof FALLBACK_SETTINGS;

export const getSettings = unstable_cache(
  async (): Promise<ShopSettings> =>
    safely(
      "settings",
      async () => {
        const doc = await (await db.settings()).findOne({ _id: "shop" });
        if (!doc) return FALLBACK_SETTINGS;
        const rest = { ...(doc as Record<string, unknown>) };
        delete rest._id;
        delete rest.updatedAt;
        return { ...FALLBACK_SETTINGS, ...(rest as Partial<ShopSettings>) };
      },
      FALLBACK_SETTINGS,
    ),
  ["settings"],
  { tags: [CONTENT_TAG] },
);

/** The one-line address used in the footer, the map and the contact page. */
export function fullAddress(shop: Pick<ShopSettings, "address">): string {
  const { street, locality, city, region, postalCode } = shop.address;
  return [street, locality, city, `${region} ${postalCode}`.trim()].filter(Boolean).join(", ");
}
