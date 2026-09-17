# Build Prompt — "Time House" Catalogue & WhatsApp-Order Website

## Role
You are a senior full-stack engineer and UI designer. Build a complete, production-ready,
SEO-optimised e-commerce **catalogue** website using **Next.js (App Router)**.

## The business
Time House is a retail shop selling:
- **Watches** (men's, women's, couple sets, smart watches)
- **Ladies Bags** (handbags, slings, clutches, totes, wallets)
- **Accessories** (gents & ladies) — belts, wallets, sunglasses, jewellery, caps, cufflinks

## The single most important behaviour
There is **no online checkout and no payment gateway**. The buying flow is:

> Product page / card → **"Buy on WhatsApp"** button → opens WhatsApp with a
> pre-filled message containing the product details → customer talks to the shop and orders there.

Everything else about the site should *feel* like a real e-commerce store (cart, wishlist,
filters, quantities, product detail pages) — but the final action is always WhatsApp.

### WhatsApp deep-link spec
- Use `https://wa.me/<PHONE>?text=<encodeURIComponent(message)>` (works on mobile + WhatsApp Web).
- Phone number comes from `NEXT_PUBLIC_WHATSAPP_NUMBER` env var (format: country code + number, no `+`, no spaces).
- Open in a new tab (`target="_blank" rel="noopener noreferrer"`).
- Build the message from a single shared helper, e.g. `lib/whatsapp.ts`:
  - **Single product message:**
    ```
    Hello Time House! 👋
    I'm interested in this product:

    *<Product Name>*
    Category: <Category>
    SKU: <SKU>
    Price: ₹<Price>
    Quantity: <Qty>
    Link: <absolute product URL>

    Please share availability and details.
    ```
  - **Cart / enquiry-list message:** same header, then a numbered list of every item
    (name, SKU, qty, price), then an estimated total line.
- Add a **floating WhatsApp FAB** (bottom-right, above the fold on scroll) with a generic
  "Hi, I'd like to know more about your products" message.
- Every place a normal store would say "Add to Cart" / "Buy Now", this store says
  **"Add to Enquiry"** (local cart) and **"Buy on WhatsApp"** (direct deep link).

## Tech stack (use exactly this unless something is impossible)
- **Next.js 15+ (App Router)** with **TypeScript** — Server Components by default,
  `"use client"` only where interactivity is required.
- **Tailwind CSS** + **shadcn/ui** for primitives, **lucide-react** for icons.
- **Framer Motion** for tasteful entrance/hover animations (respect `prefers-reduced-motion`).
- **next/image** for every image, **next/font** for fonts.
- **Zustand** (persisted to `localStorage`) for the enquiry cart + wishlist.
- Product data layer: a typed `lib/products.ts` reading from local JSON/TS seed data,
  written behind an async interface (`getProducts()`, `getProductBySlug()`, `getCategories()`)
  so it can be swapped for a CMS (Sanity/Strapi) or database later **without touching components**.
- No payment gateway, no auth, no backend orders table.

## Design direction — modern luxury, Rolex-inspired palette
Aim for a **premium, high-contrast, editorial** feel: generous whitespace, large hero
imagery, restrained motion, sharp typography. Think a luxury watch boutique, not a
discount marketplace. Avoid template/bootstrap-looking layouts.

**Colour tokens (define as CSS variables in `globals.css` + extend Tailwind theme):**
| Token | Hex | Use |
|---|---|---|
| `--rolex-green` | `#006039` | Primary brand, buttons, header accents |
| `--rolex-green-deep` | `#00341F` | Dark sections, footer, overlays |
| `--rolex-gold` | `#A37E2C` | Secondary accent, borders, small caps labels |
| `--rolex-gold-light` | `#D4AF37` | Hover states, highlights, ratings |
| `--champagne` | `#F5F1E8` | Section backgrounds, cards |
| `--ink` | `#111111` | Body text |
| `--white` | `#FFFFFF` | Base surface |

Rules: green is the dominant brand colour, gold is an **accent only** (thin rules, small
caps eyebrow text, icon strokes, hover underlines) — never large gold fills. Use subtle
gold gradient only on key CTAs or the logo mark.

**Typography:** a high-contrast serif for headings (e.g. `Playfair Display` or `Cormorant Garamond`)
paired with a clean geometric sans for body/UI (e.g. `Inter` or `DM Sans`). Wide letter-spacing
+ uppercase for small eyebrow labels.

**Details that sell the premium feel:** 1px gold hairline dividers, hover image zoom on
product cards with a slow ease, sticky translucent header with backdrop blur that turns
solid on scroll, skeleton loaders, dark green footer, and a subtle grain/noise texture is fine.

Fully responsive, mobile-first. Must look excellent at 375px, 768px, 1440px.
Implement **dark mode** with the same palette (deep green surfaces, champagne text).

## Pages & routes to build
```
/                            Home
/products                    All products (filter + sort + search)
/category/[slug]             Category listing (watches, ladies-bags, accessories, ...)
/product/[slug]              Product detail page
/enquiry                     Enquiry list ("cart") → bulk WhatsApp message
/wishlist                    Saved items
/about                       Our story / the shop
/contact                     Address, map embed, hours, WhatsApp + call buttons
/faq                         How ordering via WhatsApp works, exchange policy, warranty
/not-found, /error           Custom branded 404 & error pages
```

### Home page sections (in order)
1. Full-bleed hero — watch macro image, serif headline, gold eyebrow text, two CTAs
   ("Explore Collection", "Chat on WhatsApp").
2. Category grid — 3–4 large image tiles (Watches / Ladies Bags / Gents Accessories / Ladies Accessories).
3. Featured / New Arrivals carousel.
4. "Best Sellers" grid.
5. Brand-story strip on deep green with gold rule and a shop photo.
6. Trust bar — Authentic Products · Personal Service on WhatsApp · Easy Exchange · Store Pickup.
7. Testimonials (3 cards).
8. Instagram / lookbook strip.
9. Newsletter or "Visit our store" CTA + map.
10. Footer — sitemap links, categories, contact, socials, WhatsApp.

### Product listing features
- Filter sidebar (drawer on mobile): category, sub-category, price range slider,
  brand, colour, gender, availability.
- Sort: newest, price low→high, price high→low, name A→Z.
- Client-side search with debounce.
- Grid/list toggle, responsive 2/3/4-column grid, pagination or infinite scroll.
- Empty state and loading skeletons.

### Product detail page
- Image gallery with thumbnails, zoom on hover, swipe on mobile.
- Name, SKU, price (+ strike-through MRP & discount badge), short description,
  variant selectors (colour/strap/size) that update the WhatsApp message, quantity stepper.
- Primary CTA **"Buy on WhatsApp"**, secondary **"Add to Enquiry"**, icon button **wishlist**.
- Accordion: Specifications table, Description, Delivery & Exchange.
- Share buttons (WhatsApp, copy link).
- "Related products" rail.
- Breadcrumbs.

## SEO requirements (this is a core goal, not an afterthought)
- Use the **Metadata API**: per-page `title`, `description`, `openGraph`, `twitter`,
  `alternates.canonical`; a `metadataBase` and title template in the root layout.
- `generateStaticParams` for all product & category routes → **SSG**, with ISR
  (`export const revalidate = 3600`).
- **JSON-LD structured data** via `<script type="application/ld+json">`:
  - `Product` + `Offer` (price, currency INR, availability) on product pages
  - `BreadcrumbList` on product/category pages
  - `ItemList` on category pages
  - `LocalBusiness` / `Store` (name, address, geo, openingHours, telephone) on home & contact
  - `Organization` + `WebSite` with `SearchAction` in the root layout
  - `FAQPage` on /faq
- `app/sitemap.ts` (dynamic, includes every product & category) and `app/robots.ts`.
- `opengraph-image.tsx` generated per product with `next/og`.
- Semantic HTML: one `<h1>` per page, correct heading order, `<nav>`, `<main>`, `<article>`.
- Descriptive `alt` text on every image; clean, lowercase, hyphenated slugs.
- Target **Lighthouse ≥ 95** on Performance, SEO, Best Practices and Accessibility:
  priority/`sizes` on images, AVIF/WebP, font `display: swap`, minimal client JS,
  no layout shift.

## Accessibility
WCAG 2.1 AA: visible focus rings (gold), keyboard-operable menus/drawers/carousels,
ARIA labels on icon buttons, colour contrast checked against the green/gold palette,
`aria-live` on cart updates, skip-to-content link.

## Project structure
```
app/            routes, layouts, sitemap.ts, robots.ts
components/     ui/ (shadcn), layout/ (Header, Footer, MobileNav),
                product/ (ProductCard, Gallery, Filters, WhatsAppButton),
                home/ (Hero, CategoryGrid, ...)
lib/            products.ts, whatsapp.ts, utils.ts, seo.ts, constants.ts
store/          useEnquiryCart.ts, useWishlist.ts
data/           products.json, categories.json
types/          index.ts
public/         images, favicon, og defaults
```

## Config / env
```
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_SITE_URL=https://timehouse.example.com
NEXT_PUBLIC_STORE_NAME=Time House
NEXT_PUBLIC_STORE_ADDRESS=...
NEXT_PUBLIC_STORE_EMAIL=...
```
Put store name, address, hours, social links and nav items in `lib/constants.ts` so they
are edited in one place. Include a `.env.example`.

## Seed data
Generate **at least 40 realistic products** spread across all categories, each with:
`id, slug, name, category, subCategory, brand, price, mrp, currency: "INR", sku,
shortDescription, description, specs {}, images[] (4 each), colours[], gender,
inStock, isFeatured, isNewArrival, rating, reviewCount, tags[]`.
Use Unsplash/placeholder image URLs (configure `next.config.js` `images.remotePatterns`).

## Deliverables
1. Complete, runnable project — `npm install && npm run dev` works with zero errors.
2. Fully typed, no `any`, passes `next build` and `next lint`.
3. Reusable, well-named components; no copy-pasted markup.
4. `README.md` covering setup, env vars, how to change the WhatsApp number,
   how to add/edit products, and how to swap the data layer for a CMS.
5. Deployment-ready for Vercel.

## Build order
1. Scaffold + Tailwind theme, fonts, design tokens, dark mode.
2. Types, seed data, data layer, `lib/whatsapp.ts`.
3. Layout: Header, MobileNav, Footer, floating WhatsApp FAB.
4. Home page sections.
5. Product card → listing + filters → product detail page.
6. Enquiry list & wishlist with persistence.
7. About / Contact / FAQ / 404.
8. SEO: metadata, JSON-LD, sitemap, robots, OG images.
9. Accessibility + performance polish.

Ask me for any missing business details (real phone number, address, actual product photos)
but use sensible, clearly-marked placeholders and keep building rather than stopping.
