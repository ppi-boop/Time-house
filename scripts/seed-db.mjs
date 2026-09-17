/**
 * Fills a fresh database with the shop's supporting content — the customer
 * quotes, the FAQ and the shop's own details — so the admin panel and the site
 * have something to show before anything has been typed in.
 *
 *   npm run db:seed          # fills anything missing, leaves existing docs alone
 *   npm run db:seed -- --force   # wipes those collections and reloads
 *
 * Safe to re-run: without --force it only inserts documents that are not there.
 *
 * Products and categories are deliberately not seeded. They are the shop's own
 * work, edited in the admin panel, and MongoDB is the only copy — a second copy
 * in this repository would go stale the first time a price changed.
 */
import { MongoClient } from "mongodb";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");

/* .env.local is not loaded for a bare node script, so read it here. */
function env(name) {
  if (process.env[name]) return process.env[name];
  const file = join(root, ".env.local");
  if (!existsSync(file)) return undefined;
  const match = readFileSync(file, "utf8").match(new RegExp(`^${name}=(.+)$`, "m"));
  return match?.[1].trim();
}

const uri = env("MONGODB_URI");
if (!uri) {
  console.error("MONGODB_URI is not set — add it to .env.local.");
  process.exit(1);
}

const TESTIMONIALS = [
  {
    id: "priya-m",
    quote:
      "I messaged at 9pm about a watch for my father, had photos of three options by 9:20 and picked it up the next morning. That is the whole reason I keep going back.",
    name: "Priya M.",
    detail: "Bought the Meridian Heritage 38",
    rating: 5,
  },
  {
    id: "ankit-s",
    quote:
      "They talked me out of the more expensive bag because the one I wanted would not fit my laptop. Who does that? I have sent four friends since.",
    name: "Ankit S.",
    detail: "Bought a Marigold Lane satchel",
    rating: 5,
  },
  {
    id: "reema-jay",
    quote:
      "Got the couple set engraved for our anniversary, same day, no extra charge. The box it came in was nicer than anything I would have wrapped it in.",
    name: "Reema & Jay",
    detail: "Bought the Aurelius couple set",
    rating: 5,
  },
];

const FAQS = [
  {
    question: "How do I actually buy something?",
    answer:
      "Tap “Buy on WhatsApp” on any product. WhatsApp opens with that piece already written into the message — the name, SKU, colour, quantity and a link back to the page. Send it and we reply with availability, the final price and how you would like it delivered or collected.",
  },
  {
    question: "Why is there no checkout or payment on the website?",
    answer:
      "Because most of what people want to know before buying — how a strap sits, whether the colour is true, whether we can engrave it by Friday — a checkout page cannot answer. We would rather have a two-minute conversation than take a payment and get a return. Payment is arranged in the chat, by UPI, bank transfer or at the counter.",
  },
  {
    question: "What is the enquiry list?",
    answer:
      "It works like a cart, except it never checks out. Add a few pieces as you browse, then send the whole list to us as one WhatsApp message instead of messaging about each one separately. It is stored on your device only.",
  },
  {
    question: "Do you deliver?",
    answer:
      "Within Ahmedabad we deliver ourselves, usually the same day for anything in stock. Elsewhere in India we send by courier once payment is confirmed, and we share the tracking number in the chat.",
  },
  {
    question: "Can I exchange something?",
    answer:
      "Yes — within 7 days, in store, with the bill and the tags still on. We do not do refunds, but we will find you something you are happier with.",
  },
  {
    question: "Is there a warranty?",
    answer:
      "Every watch carries a warranty card. The length depends on the piece — it is listed in the specifications on each product page, and we will confirm it before you buy.",
  },
];

const SETTINGS = {
  _id: "shop",
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
    storyImage: "/products/placeholder.svg",
    storyWideImage: "/products/placeholder.svg",
  },
};

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15_000 });
await client.connect();
const db = client.db();
console.log(`Connected to ${db.databaseName}`);

/** Inserts only what is missing, unless --force was passed. */
async function seed(name, docs, key) {
  const col = db.collection(name);
  if (force) await col.deleteMany({});

  let added = 0;
  for (const doc of docs) {
    const filter = { [key]: doc[key] };
    const result = await col.updateOne(filter, { $setOnInsert: doc }, { upsert: true });
    if (result.upsertedCount) added += 1;
  }
  console.log(`${name.padEnd(14)} ${added} added, ${await col.countDocuments()} total`);
}

const now = new Date();

await seed("testimonials", TESTIMONIALS.map((t, i) => ({ ...t, order: i })), "id");
await seed(
  "faqs",
  FAQS.map((f, i) => ({ id: `faq-${i + 1}`, ...f, order: i })),
  "id",
);

const settingsCol = db.collection("settings");
if (force) await settingsCol.deleteMany({});
await settingsCol.updateOne(
  { _id: "shop" },
  { $setOnInsert: { ...SETTINGS, updatedAt: now } },
  { upsert: true },
);
console.log("settings       1 document");

/* Lookups the site does on every request. */
await db.collection("products").createIndex({ slug: 1 }, { unique: true });
await db.collection("products").createIndex({ category: 1, order: 1 });
await db.collection("categories").createIndex({ slug: 1 }, { unique: true });
console.log("indexes ready");

await client.close();
console.log("\nSeed complete.");
