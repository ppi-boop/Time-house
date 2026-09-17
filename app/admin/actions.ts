"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import * as db from "@/lib/db/collections";
import { CONTENT_TAG } from "@/lib/db/content";
import { requireAdmin } from "@/lib/admin/session";
import type { CategorySlug, Product } from "@/types";

/**
 * Every write the admin panel makes.
 *
 * Each one checks the session itself — a server action is a public endpoint,
 * and the middleware only guards page navigations. After a write they all call
 * refreshContent(), which drops the cached reads so the public site shows the
 * change immediately.
 */

const str = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const num = (form: FormData, key: string) => Number(form.get(key) ?? 0) || 0;
const bool = (form: FormData, key: string) => form.get(key) === "on";
/** Textareas hold one value per line; blank lines are just formatting. */
const lines = (form: FormData, key: string) =>
  str(form, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function published() {
  revalidateTag(CONTENT_TAG);
  // The catalogue shows up on nearly every route, so clear the lot.
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------- products -- */

export async function saveProduct(formData: FormData) {
  await requireAdmin();

  const original = str(formData, "originalSlug");
  const name = str(formData, "name");
  const slug = slugify(str(formData, "slug") || name);
  if (!name || !slug) throw new Error("A product needs a name.");

  const specs: Record<string, string> = {};
  for (const line of lines(formData, "specs")) {
    const [label, ...rest] = line.split(":");
    if (label && rest.length) specs[label.trim()] = rest.join(":").trim();
  }

  const products = await db.products();
  const existing = original ? await products.findOne({ slug: original }) : null;

  const doc: Omit<Product, "images"> & { images: string[]; order: number; updatedAt: Date } = {
    id: existing?.id ?? `p-${Date.now().toString(36)}`,
    slug,
    name,
    category: str(formData, "category") as CategorySlug,
    subCategory: slugify(str(formData, "subCategory")),
    brand: str(formData, "brand"),
    price: num(formData, "price"),
    mrp: num(formData, "mrp") || num(formData, "price"),
    currency: "INR",
    sku: str(formData, "sku"),
    shortDescription: str(formData, "shortDescription"),
    description: str(formData, "description"),
    specs,
    images: lines(formData, "images"),
    colours: lines(formData, "colours"),
    gender: (str(formData, "gender") || "unisex") as Product["gender"],
    inStock: bool(formData, "inStock"),
    isFeatured: bool(formData, "isFeatured"),
    isNewArrival: bool(formData, "isNewArrival"),
    rating: num(formData, "rating"),
    reviewCount: num(formData, "reviewCount"),
    tags: lines(formData, "tags"),
    order: existing?.order ?? (await products.countDocuments()),
    updatedAt: new Date(),
  };

  if (existing) {
    await products.updateOne({ slug: original }, { $set: doc });
  } else {
    const clash = await products.findOne({ slug });
    if (clash) throw new Error(`Another product already uses the web address "${slug}".`);
    await products.insertOne(doc as never);
  }

  published();
  redirect(`/admin/products?saved=${encodeURIComponent(slug)}`);
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const slug = str(formData, "slug");
  await (await db.products()).deleteOne({ slug });
  published();
  redirect("/admin/products?deleted=1");
}

/* ----------------------------------------------------------- categories -- */

export async function saveCategory(formData: FormData) {
  await requireAdmin();

  const original = str(formData, "originalSlug");
  const name = str(formData, "name");
  const slug = slugify(str(formData, "slug") || name);
  const back = original ? `/admin/categories/${original}` : "/admin/categories/new";

  if (!name || !slug) {
    redirect(`${back}?error=` + encodeURIComponent("A category needs a name."));
  }

  const categories = await db.categories();
  const existing = original ? await categories.findOne({ slug: original }) : null;

  if (slug !== original && (await categories.findOne({ slug }))) {
    redirect(
      `${back}?error=` +
        encodeURIComponent(`Another category already uses the web address “${slug}”.`),
    );
  }

  const subCategories = lines(formData, "subCategories").map((line) => {
    const [label, given] = line.split("|").map((part) => part.trim());
    return { name: label, slug: slugify(given || label) };
  });

  const doc = {
    id: existing?.id ?? `c-${Date.now().toString(36)}`,
    slug,
    name,
    tagline: str(formData, "tagline"),
    description: str(formData, "description"),
    image: str(formData, "image"),
    subCategories,
    order: existing?.order ?? (await categories.countDocuments()),
    updatedAt: new Date(),
  };

  if (existing) {
    await categories.updateOne({ slug: original }, { $set: doc });
    // Products record the category by its web address, so a renamed address
    // has to be carried across or every product on that counter is orphaned.
    if (slug !== original) {
      await (await db.products()).updateMany(
        { category: original },
        { $set: { category: slug } },
      );
    }
  } else {
    await categories.insertOne(doc as never);
  }

  published();
  redirect(`/admin/categories?saved=${encodeURIComponent(name)}`);
}

export async function deleteCategory(formData: FormData) {
  await requireAdmin();
  const slug = str(formData, "slug");

  // Removing a counter that still has stock on it would leave those products
  // pointing at a category that no longer exists — they would vanish from the
  // menu and their pages would break. Say so instead.
  const holding = await (await db.products()).countDocuments({ category: slug });
  if (holding > 0) {
    redirect(
      `/admin/categories/${slug}?error=` +
        encodeURIComponent(
          `This category still holds ${holding} product${holding === 1 ? "" : "s"}. ` +
            "Move them to another category first, or delete them.",
        ),
    );
  }

  await (await db.categories()).deleteOne({ slug });
  published();
  redirect("/admin/categories?deleted=1");
}

/* ----------------------------------------------------------- shop info --- */

export async function saveSettings(formData: FormData) {
  await requireAdmin();

  const hours = lines(formData, "hours").map((line) => {
    const [days, time] = line.split("|").map((part) => part.trim());
    return { days, time: time ?? "" };
  });

  await (await db.settings()).updateOne(
    { _id: "shop" },
    {
      $set: {
        name: str(formData, "name"),
        legalName: str(formData, "legalName"),
        tagline: str(formData, "tagline"),
        description: str(formData, "description"),
        logo: str(formData, "logo") || null,
        email: str(formData, "email"),
        phone: str(formData, "phone"),
        whatsapp: str(formData, "whatsapp").replace(/\D/g, ""),
        foundedYear: num(formData, "foundedYear"),
        address: {
          street: str(formData, "street"),
          locality: str(formData, "locality"),
          city: str(formData, "city"),
          region: str(formData, "region"),
          postalCode: str(formData, "postalCode"),
          country: str(formData, "country") || "IN",
        },
        geo: { latitude: num(formData, "latitude"), longitude: num(formData, "longitude") },
        hours,
        socials: {
          instagram: str(formData, "instagram"),
          facebook: str(formData, "facebook"),
          youtube: str(formData, "youtube"),
        },
        announcements: lines(formData, "announcements"),
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  published();
  redirect("/admin/shop?saved=1");
}

/* ------------------------------------------------------------ homepage --- */

export async function saveHomepage(formData: FormData) {
  await requireAdmin();

  const trustPoints = lines(formData, "trustPoints").map((line) => {
    const [title, ...rest] = line.split("|");
    return { title: title.trim(), body: rest.join("|").trim() };
  });

  await (await db.settings()).updateOne(
    { _id: "shop" },
    {
      $set: {
        trustPoints,
        "home.heroEyebrow": str(formData, "heroEyebrow"),
        "home.heroTitleTop": str(formData, "heroTitleTop"),
        "home.heroTitleBottom": str(formData, "heroTitleBottom"),
        "home.heroBody": str(formData, "heroBody"),
        "home.storyTitle": str(formData, "storyTitle"),
        "home.storyQuote": str(formData, "storyQuote"),
        "home.storyBody": str(formData, "storyBody"),
        "home.storyImage": str(formData, "storyImage"),
        "home.storyWideImage": str(formData, "storyWideImage"),
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );

  published();
  redirect("/admin/homepage?saved=1");
}

export async function saveTestimonial(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id") || `t-${Date.now().toString(36)}`;
  const testimonials = await db.testimonials();

  await testimonials.updateOne(
    { id },
    {
      $set: {
        quote: str(formData, "quote"),
        name: str(formData, "name"),
        detail: str(formData, "detail"),
        rating: Math.min(5, Math.max(1, num(formData, "rating") || 5)),
      },
      $setOnInsert: { id, order: await testimonials.countDocuments() },
    },
    { upsert: true },
  );

  published();
  redirect("/admin/homepage?saved=1");
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdmin();
  await (await db.testimonials()).deleteOne({ id: str(formData, "id") });
  published();
  redirect("/admin/homepage?deleted=1");
}

export async function saveLookbook(formData: FormData) {
  await requireAdmin();
  const lookbook = await db.lookbook();
  const images = lines(formData, "images");

  await lookbook.deleteMany({});
  if (images.length) {
    await lookbook.insertMany(
      images.map((image, index) => ({
        id: `look-${index + 1}`,
        image,
        href: "/products",
        order: index,
      })),
    );
  }

  published();
  redirect("/admin/homepage?saved=1");
}

/* ----------------------------------------------------------------- faq --- */

export async function saveFaq(formData: FormData) {
  await requireAdmin();
  const id = str(formData, "id") || `faq-${Date.now().toString(36)}`;
  const faqs = await db.faqs();

  await faqs.updateOne(
    { id },
    {
      $set: { question: str(formData, "question"), answer: str(formData, "answer") },
      $setOnInsert: { id, order: await faqs.countDocuments() },
    },
    { upsert: true },
  );

  published();
  redirect("/admin/faq?saved=1");
}

export async function deleteFaq(formData: FormData) {
  await requireAdmin();
  await (await db.faqs()).deleteOne({ id: str(formData, "id") });
  published();
  redirect("/admin/faq?deleted=1");
}
