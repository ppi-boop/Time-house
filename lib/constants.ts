/**
 * Single source of truth for everything about the shop itself.
 * Change it here and it updates the header, footer, contact page and all SEO schema.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919876543210";

export const STORE = {
  name: process.env.NEXT_PUBLIC_STORE_NAME ?? "Time House",
  legalName: "Time House Retail",
  tagline: "Watches, bags and accessories, chosen by hand.",
  description:
    "Time House is a family-run boutique for watches, ladies bags and everyday accessories. Browse the collection online, then message us on WhatsApp to buy — no forms, no waiting.",
  // TODO: replace with the real shop details before going live.
  email: process.env.NEXT_PUBLIC_STORE_EMAIL ?? "hello@timehouse.example.com",
  phone: process.env.NEXT_PUBLIC_STORE_PHONE ?? "+919876543210",
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
  // Schema.org openingHoursSpecification form
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "10:30", closes: "21:00" },
    { days: ["Sunday"], opens: "11:00", closes: "19:00" },
  ],
  socials: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
  foundedYear: 2011,
} as const;

export const FULL_ADDRESS = `${STORE.address.street}, ${STORE.address.locality}, ${STORE.address.city}, ${STORE.address.region} ${STORE.address.postalCode}`;

/**
 * The footer's "Shop" column is built from the live categories instead of
 * living here — see components/layout/Footer.tsx. These are the columns that
 * never change.
 */
export const FOOTER_LINKS = [
  {
    title: "The Shop",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/contact", label: "Visit Us" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Your List",
    links: [
      { href: "/enquiry", label: "Enquiry List" },
      { href: "/wishlist", label: "Wishlist" },
    ],
  },
] as const;
